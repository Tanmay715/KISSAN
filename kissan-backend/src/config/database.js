require('dotenv').config();

const knex = require('knex');
const knex_config = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';
const db = knex(knex_config[environment]);

module.exports = db;
