const socketMiddleware = (io) => {
  return (req, res, next) => {
    req.socket.io = io;
    next();
  };
};

module.exports = socketMiddleware;