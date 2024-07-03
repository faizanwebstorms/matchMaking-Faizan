// eslint-disable-next-line import/no-extraneous-dependencies
const socketIO = require("socket.io");

const users = [];
const socketConnection = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "*",
    },
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
      // users[userId] = socket.id;
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
      // const isOwner = data?.senderId === req?.user?._id;
      // if (!isOwner) {
      //   return socket.emit("error", { error: api.forbidden });
      // }
      const roomMessages = await chatService.remove(data?._id);
      /// sending message to room
      io.to(data?.roomId).emit("room-messages", roomMessages);
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
      console.log("Logged In User ID:", loggedInUser);
      console.log("Second User ID:", secondUser);

      // const secondUserSocketId = users[secondUser];

      console.log("secondUserSocketId11111111", secondUserSocketId);
      if (secondUserSocketId) {
        console.log("secondUserSocketId222222222222", secondUserSocketId);
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

module.exports = {
  socketConnection,
};
