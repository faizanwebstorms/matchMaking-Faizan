// eslint-disable-next-line import/no-extraneous-dependencies
const socketIO = require('socket.io');


const users = [];
const socketConnection = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: '*',
    },
  });
  io.on('connection', async (socket) => {
    socket.on('disconnect', async () => {
      console.log('User disconnected');
    });
  });
  return io;
};


module.exports = {
  socketConnection,
};
