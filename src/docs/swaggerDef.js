const { version } = require('../../package.json');
const config = require('../config/config');

// For Swagger API Documentation

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'MatchMaking API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/hagopj13/node-express-boilerplate/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `http://${config.host}:${config.port}/v1`,
    },
  ],
  tags: [
    { name: 'Auth' },
    { name: 'Users' },
  ],
};

module.exports = swaggerDef;
