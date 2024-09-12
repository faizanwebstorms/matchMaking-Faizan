const { ObjectId } = require("mongodb");
// const httpStatus = require('http-status');
const { Chat, User } = require("../models");

const getMessageByRoomId = async (filter, options) => {
  // eslint-disable-next-line no-useless-catch
  try {
    if (!options) {
      options = { limit: 10, page: 1, sort: { createdAt: "desc" } };
    }
    const aggregate = Chat.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $unwind: { path: "$sender" },
      },
      {
        $project: {
          _id: 1,
          messageContent: 1,
          createdAt: 1,
          isEdited: 1,
          roomId: 1,
          messageId: 1,
          "sender._id": 1,
          "sender.username": 1,
          "sender.profileImage": 1,
        },
      },
    ]);
    let chat;
    await Promise.resolve(
      Chat.aggregatePaginate(aggregate, {
        ...options,
      }).then(function (results, err) {
        if (err) throw new Error();
        chat = results;
      })
    );
    const docs = chat.docs.map(async (item) => {
      if (item.messageId) {
        const result = await Chat.findOne({ _id: item?.messageId }).populate(
          "user",
          "username profileImage"
        );
        item.reply = {
          _id: result?._id,
          messageContent: result?.messageContent,
          user: result?.user,
        };
      }
      return item;
    });

    chat.docs = await Promise.all(docs);
    return chat;
  } catch (e) {
    throw e;
  }
};

const getMessageByRoomIdForSocket = async (filter) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const chat = await Chat.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $unwind: { path: "$sender" },
      },
      {
        $project: {
          _id: 1,
          messageContent: 1,
          createdAt: 1,
          isEdited: 1,
          roomId: 1,
          messageId: 1,
          "sender._id": 1,
          "sender.email": 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    const docs = chat?.map(async (item) => {
      if (item.messageId) {
        const result = await Chat.findOne({ _id: item?.messageId }).populate(
          "user",
          "email"
        );
        item.reply = {
          _id: result?._id,
          messageContent: result?.messageContent,
          user: result?.user,
        };
      }

      return item;
    });
    chat.docs = await Promise.all(docs);
    return chat;
  } catch (e) {
    return false;
  }
};

const getOnlineUserForRoom = async (roomId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const crewId = new ObjectId(roomId);
    const aggregate = await User.aggregate([
      {
        $lookup: {
          from: "crewmembers",
          localField: "_id",
          foreignField: "userId",
          as: "members",
        },
      },
      {
        $unwind: "$members",
      },
      {
        $match: {
          isOnline: true,
          "members.userId": { $exists: true },
          "members.crewId": crewId,
          $or: [
            {
              $and: [
                { "members.type": memberType.standard },
                { "members.isRequest": crewRequest.accept },
              ],
            },
            {
              $and: [
                { "members.type": memberType.moderator },
                { "members.isRequest": crewRequest.pending },
              ],
            },
            {
              $and: [
                { "members.type": memberType.moderator },
                { "members.isRequest": crewRequest.accept },
              ],
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          isOnline: 1,
          // firstName: 1,
          // lastName: 1,
          username: 1,
          profileImage: 1,
        },
      },
    ]);

    const admin = await checkAdminOnline(crewId);
    if (admin) {
      aggregate.push(admin);
    }
    return aggregate;
  } catch (e) {
    return false;
  }
};

const store = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const chat = await Chat.create({
      messageContent: data?.messageContent,
      senderId: data?.senderId,
      roomId: data?.roomId,
      messageId: data?.messageId,
      receiverId: data?.receiverId,
    });
    return chat;
  } catch (e) {
    console.log("Error", e);
    throw e;
  }
};

const update = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    let message;
    const isExist = await Chat.findOneAndUpdate(
      { _id: data.messageId },
      { messageContent: data?.messageContent, isEdited: new Date() },
      { new: true }
    );
    if (isExist) {
      message = await getMessageByRoomIdForSocket({ roomId: isExist?.roomId });
    }
    return message;
  } catch (e) {
    return false;
  }
};

const remove = async (messageId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // let message;
    const isExist = await Chat.findOne({ _id: messageId }).select("roomId");
    if (isExist) {
      await Chat.deleteOne({ _id: messageId });
      // message = await getMessageByRoomIdForSocket({ roomId: isExist?.roomId });
    }
    return true;
  } catch (e) {
    throw e;
  }
};

const seenMessage = async (data) => {
  try {
    if (data?.messageId?.length > 0) {
      await Promise.all(
        data?.messageId?.map(async (item) => {
          await Chat.findOneAndUpdate(
            { _id: item },
            {
              $push: {
                seenBy: {
                  userId: data?.userId,
                },
              },
            },
            { new: true }
          );
        })
      );
    }
    return true;
  } catch (e) {
    return e;
  }
};

const getUnseenMessage = async (data, options) => {
  try {
    const filter = {
      roomId: data?.roomId,
      senderId: { $ne: data?.userId },
      seenBy: { $not: { $elemMatch: { userId: data?.userId } } },
    };
    // const sorting = options ?? { sort: { createdAt: 'asc' } };
    const message = await getMessageByRoomId(filter);

    return message;
  } catch (e) {
    return e;
  }
};

const seenAllUnseenMessageWhenRoomJoin = async (data) => {
  try {
    const filter = {
      roomId: data?.roomId.toString(),
      senderId: { $ne: data?.userId },
    };
    const chat = await Chat.updateMany(filter, {
      $currentDate: {
        seenTime: true,
      },
    });
    return chat;
  } catch (e) {
    throw e;
  }
};

const getUnseenMessageCount = async (data) => {
  try {
    const filter = {
      roomId: data?.roomId.toString(),
      senderId: { $ne: data?.userId },
      seenBy: { $not: { $elemMatch: { userId: data?.userId } } },
    };
    const chat = await Chat.count(filter);

    return chat;
  } catch (e) {
    return e;
  }
};

const getUserMessageSeen = async (filter) => {
  try {
    const user = await Chat.aggregate([
      {
        $match: { _id: new ObjectId(filter?.messageId) },
      },
      {
        $unwind: "$seenBy",
      },
      {
        $lookup: {
          from: "users",
          localField: "seenBy.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: { path: "$user" },
      },
      {
        $project: {
          seenTime: "$seenBy.seenTime",
          _id: "$user._id",
          username: "$user.username",
          profileImage: "$user.profileImage",
        },
      },
    ]);

    return user;
  } catch (e) {
    return e;
  }
};

const updateMessageSeenStatus = async (messageId, loginUserId) => {
  try {
    await Chat.findOneAndUpdate(
      { _id: messageId },
      { $push: { seenBy: { userId: item } } },
      { new: true }
    );

    return true;
  } catch (e) {
    return false;
  }
};

async function checkAdminOnline(crewId) {
  try {
    const admin = await Crew.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          _id: crewId,
          "user.isOnline": true,
        },
      },
      {
        $project: {
          _id: "$user._id",
          username: "$user.username",
          profileImage: "$user.profileImage",
          isOnline: "$user.isOnline",
        },
      },
    ]);
    if (admin?.length > 0) {
      return { ...admin[0], isAdmin: true };
    }
    return false;
  } catch (e) {
    return e;
  }
}

const deleteRoomMessages = async (roomId) => {
  try {
    await Chat.deleteMany({ roomId });
    return true;
  } catch (error) {
    throw error;
  }
};

// const tf = require("@tensorflow/tfjs-node");
// const use = require("@tensorflow-models/universal-sentence-encoder");
// const math = require("mathjs");
const { v4: uuidv4 } = require("uuid");
const { QdrantClient } = require("@qdrant/js-client-rest");
const OpenAI = require("openai");
const openai = new OpenAI();
// const axios = require("axios");

const client = new QdrantClient({
  url: "https://804103d3-c981-40ea-9b76-00c9ec1d31d8.europe-west3-0.gcp.cloud.qdrant.io",
  apiKey: "6lBCirQFqlaBLPtXm6n_rInYNIJyoAMxKiv3syab5dWSuW0AKdWfDQ",
});

const collectionName = "questionaaireResponse";
// Function to get embeddings from TensorFlow.js
const createEmbeddings = async (texts) => {
  // const model = await use.load();

  // console.log("model", model);
  // const embeddings = await model.embed(texts);
  // console.log("embeddings", embeddings);

  // let embeddingArray = embeddings.arraySync(); // Convert tensor to regular JavaScript array

  // // Flatten the array of arrays into a single array
  // embeddingArray = embeddingArray.flat();

  // console.log("embeddingArray", embeddingArray);
  // console.log("texts", texts);

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002", // Use a valid embedding model like "text-embedding-ada-002"
    input: texts, // Array of text strings
    encoding_format: "float", // Optional, but if needed
  });
  console.log("objeembeddingResponsect", embeddingResponse);
  // Extract embeddings for each text from the response
  const embeddings = embeddingResponse.data.map((entry) => entry.embedding);

  // Flatten the embeddings into a single array
  const flattenedEmbeddings = embeddings.flat();
  console.log("flattenedEmbeddings.length", flattenedEmbeddings.length);
  console.log("Flattened Embeddings:", flattenedEmbeddings);
  return flattenedEmbeddings;

  // return embeddingArray;
};

const storeEmbeddings = async (texts, userId) => {
  // Get embeddings for the given texts
  console.log("texts", texts);
  const embeddingArray = await createEmbeddings(texts);
  console.log("embeddingArray", embeddingArray.length);
  await storeVectorEmbeddings(embeddingArray, texts, userId);
  // Send response with embeddings and TF-IDF
  return embeddingArray;
};

async function storeVectorEmbeddings(embeddingArray, texts, userId) {
  console.log("client", client);
  const uniqueId = uuidv4();
  // Prepare the data to upsert
  const points = [
    {
      id: uniqueId, // Ensure this is unique or correct for your use case
      vector: embeddingArray, // Ensure vector size matches the collection's dimension
      payload: {
        text: texts, // Optional payload data
        userId: userId,
      },
    },
  ];
  console.log("points", points);
  // Upsert points into the collection
  client
    .upsert(collectionName, { points })
    .then((response) => {
      console.log("Upsert response:", response);
    })
    .catch((error) => {
      console.error("Error upserting points:", error);
    });
  const apikey = "1lh_JNJlAHgzg-an5rkTirDV2w_kgNbZLgu9YO0hFP0k8nzaZ3Gwtg";
  const qdrantUrl =
    "https://e60f9787-9ad8-4177-b5d7-62a11e4fe223.europe-west3-0.gcp.cloud.qdrant.io:6333/collections/questionaaireResponseOpenAi";
  // const collectionConfig = {
  //   vectors: {
  //     size: 9216, // the dimension of your embeddings (e.g., 300 if using a model with 300-dim embeddings)
  //     distance: "Cosine", // distance metric (Cosine, Euclidean, or Dot)
  //   },
  // };
  // try {
  //   const response = await axios.put(qdrantEndpoint, collectionConfig, {
  //     headers: {
  //       Authorization: `Bearer ${apikey}`,
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   console.log("Qdrant collection creation response:", response.data);
  // } catch (error) {
  //   console.error("Error creating collection in Qdrant:", error);
  //   throw error;
  // }
  // Define the collection parameters
  // const collectionParams = {
  //   vectors: {
  //     size: 9216, // Size of the vector
  //     distance: "Cosine", // Distance metric (Cosine, Euclidean, Dot)
  //   },
  // };
  // // Make the PUT request to create the collection
  // axios
  //   .put(qdrantUrl, collectionParams, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${apikey}`, // Replace with your API key
  //     },
  //   })
  //   .then((response) => {
  //     console.log("Collection created successfully:", response.data);
  //   })
  //   .catch((error) => {
  //     console.error(
  //       "Error creating collection:",
  //       error.response ? error.response.data : error.message
  //     );
  //   });
}

// storeVectorEmbeddings();

const getVectorMatchedUsers = async (user) => {
  // const client = new QdrantClient({
  //   url: "https://804103d3-c981-40ea-9b76-00c9ec1d31d8.europe-west3-0.gcp.cloud.qdrant.io",
  //   apiKey: "6lBCirQFqlaBLPtXm6n_rInYNIJyoAMxKiv3syab5dWSuW0AKdWfDQ",
  // });
  console.log("userIdd", user?.id);

  try {
    // Step 1: Retrieve the vector for the current user
    const response = await client.scroll(collectionName, {
      filter: {
        must: [
          {
            key: "userId",
            match: {
              value: user?.id,
            },
          },
        ],
      },
      limit: 1,
      with_payload: true,
      with_vector: true,
    });

    const userVector = response.points[0]?.vector;
    console.log("Embeddings for user:", userVector);

    // Step 2: Perform a similarity search for all users with more than 65% similarity
    const response2 = await client.search(collectionName, {
      vector: userVector,
      top: 1000, // A high number to ensure you get all possible matches
      params: {
        similarity: "cosine",
        threshold: 0.86, // Set the threshold to 0.86 for 86% similarity
      },
      filter: {
        must_not: [
          {
            key: "userId",
            match: {
              value: user?.id, // Exclude records with the current userId
            },
          },
        ],
      },
      with_payload: true,
    });
    // Filter out all results below 86% similarity

    const matchedVectors = response2.filter((result) => result.score >= 0.86);
    const matchedUsers = await Promise.all(
      matchedVectors?.map(async (item) => {
        const user = await User.findOne({ _id: item?.payload?.userId });
        return user;
      })
    );

    console.log("Users with more than 65% similarity:", matchedUsers);
    return matchedUsers;
  } catch (error) {
    console.error("Error retrieving vector embeddings:", error);
  }
};

// Example usage:
const userId = "6640d6074f93fa14043c4210"; // Replace with the specific userId
// getVectorEmbeddingsForUser(userId);

module.exports = {
  store,
  getMessageByRoomId,
  getMessageByRoomIdForSocket,
  update,
  remove,
  getOnlineUserForRoom,
  seenMessage,
  getUnseenMessage,
  getUserMessageSeen,
  getUnseenMessageCount,
  seenAllUnseenMessageWhenRoomJoin,
  updateMessageSeenStatus,
  deleteRoomMessages,
  createEmbeddings,
  storeEmbeddings,
  storeVectorEmbeddings,
  getVectorMatchedUsers,
};
