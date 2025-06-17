// knexfile.js
require('dotenv').config(); // Load environment variables

const databaseConfig = {
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'pern_app_dev',
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: './seeds'
  }
}

module.exports = {
  development: databaseConfig,
  database: databaseConfig,  // This matches your package.json script
  production: {
    ...databaseConfig,
    connection: process.env.DATABASE_URL || databaseConfig.connection,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  }
};