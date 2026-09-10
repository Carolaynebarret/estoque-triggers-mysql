require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'db',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    options: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || '3306',
      dialect: 'mysql',
    },
  },
};
