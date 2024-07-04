const { ObjectId } = require("mongodb");
// const httpStatus = require('http-status');
const { Chat } = require("../models");

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
};
