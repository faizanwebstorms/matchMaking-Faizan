// eslint-disable-next-line import/no-extraneous-dependencies
const socketIO = require("socket.io");
const { chatService } = require("../services");
const { api } = require("../config/messages");

const users = {};
const socketConnection = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "*",
    },
    addTrailingSlash: false,
  });
  io.on("connection", async (socket) => {
    // join new room
    socket.on("join-room", async (roomId, userId) => {
      console.log(" User Joined Room Successfully ");
      if (!(roomId && userId)) {
        return socket.emit("error", {
          error: "roomId and userId will not be epmty",
        });
      }
      socket.join(roomId);
      users[userId] = socket.id;
      await chatService.seenAllUnseenMessageWhenRoomJoin({ roomId, userId });
      const roomMessages = await chatService.getMessageByRoomIdForSocket({
        roomId,
      });
      socket.emit("room-messages", roomMessages);
    });

    // create chat
    socket.on("message-room", async (data) => {
      const chat = await chatService.store(data);

      if (!chat) {
        return socket.emit("error", { error: api.internalServerError });
      }
      const roomMessages = await chatService.getMessageByRoomIdForSocket({
        roomId: chat?.roomId,
      });
      /// sending message to room
      io.to(data?.roomId).emit("room-messages", roomMessages);
    });

    // delete message
    socket.on("delete-message", async (data) => {
      const removeMessage = await chatService.remove(data?._id);
      if (removeMessage) {
        const roomMessages = await chatService.getMessageByRoomIdForSocket({
          roomId: data?.roomId,
        });
        /// sending message to room
        io.to(data?.roomId).emit("room-messages", roomMessages);
      }
      /// sending message to room
    });

    // Leave room
    socket.on("leave-room", async (roomId, userId) => {
      if (!roomId) {
        return socket.emit("error", {
          error: "roomId cannot be epmty",
        });
      }
      const leavRoom = await chatService.deleteRoomMessages(roomId);

      const { loggedInUser, secondUser } = getUserIdsFromRoomId(roomId, userId);

      const secondUserSocketId = users[secondUser];

      if (secondUserSocketId) {
        io.to(secondUserSocketId).emit("room-deleted", leavRoom);
      } else {
        console.log(`Second user ${secondUser} is not connected`);
      }
      // socket.emit("room-deleted", leavRoom);
      socket.leave(roomId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (const [userId, socketId] of Object.entries(users)) {
        if (socketId === socket.id) {
          delete users[userId];
          break;
        }
      }
    });
  });
  return io;
};
function getUserIdsFromRoomId(roomId, userId) {
  // Split the roomId by the underscore
  const [userId1, userId2] = roomId.split("_");

  // Check which userId matches the userId from params
  if (userId === userId1) {
    return { loggedInUser: userId1, secondUser: userId2 };
  } else if (userId === userId2) {
    return { loggedInUser: userId2, secondUser: userId1 };
  } else {
    // If neither matches, return an error or handle accordingly
    throw new Error("UserId does not match either of the IDs in roomId");
  }
}
module.exports = {
  socketConnection,
};
