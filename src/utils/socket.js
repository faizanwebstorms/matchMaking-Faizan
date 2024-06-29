// eslint-disable-next-line import/no-extraneous-dependencies
const socketIO = require("socket.io");
const { chatService } = require("../services");
const { api } = require("../config/messages");

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
      const isOwner = data?.senderId === req?.user?._id;
      if (!isOwner) {
        return socket.emit("error", { error: api.forbidden });
      }
      const roomMessages = await chatService.remove(data?._id);
      /// sending message to room
      io.to(data?.roomId).emit("room-messages", roomMessages);
    });

    // Leave room
    socket.on("leave-room", async (roomId) => {
      if (!roomId) {
        return socket.emit("error", {
          error: "roomId cannot be epmty",
        });
      }
      const leavRoom = await chatService.deleteRoomMessages(roomId);
      socket.emit("room-deleted", leavRoom);
      socket.leave(roomId);
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected");
      return socket.emit("User disconnected");
    });
  });
  return io;
};

module.exports = {
  socketConnection,
};
