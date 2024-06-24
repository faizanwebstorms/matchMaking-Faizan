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
    socket.on("join-room", async () => {
      console.log(" User Joined Room Successfully ");
      return socket.emit("error", {
        error: "roomId and userId will not be epmty",
      });
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
