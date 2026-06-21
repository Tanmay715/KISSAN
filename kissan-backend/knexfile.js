require('dotenv').config();
const path = require('path');

const db_client = process.env.DB_CLIENT || 'sqlite';

const sqlite_config = {
  client: 'better-sqlite3',
  connection: {
    filename: path.join(__dirname, 'src/db/kissan.sqlite'),
  },
  useNullAsDefault: true,
  migrations: { directory: './src/db/migrations' },
  seeds: { directory: './src/db/seeds' },
};

const mysql_config = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'kissan',
    password: process.env.DB_PASSWORD || 'kissan_secret',
    database: process.env.DB_NAME || 'kissan_db',
  },
  migrations: { directory: './src/db/migrations' },
  seeds: { directory: './src/db/seeds' },
};

module.exports = {
  development: db_client === 'mysql' ? mysql_config : sqlite_config,
};
