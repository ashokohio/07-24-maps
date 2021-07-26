const path = require('path');

module.exports = {
  target: 'nodemon',
  mode: 'development',
  entry: './server.js',
  resolve: {
    modules: ['server', 'node_modules'],
  },
};