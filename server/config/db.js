const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbURL = process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/qr_manager';
const useSsl =
  /sslmode=require/i.test(dbURL) ||
  /neon\.tech/i.test(dbURL);

console.log('Using database connection from DATABASE_URL');

const sequelize = new Sequelize(dbURL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: useSsl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected...');
    await sequelize.sync(); // Sync models to database
    console.log('Database synced...');
  } catch (err) {
    console.error('Failed to connect to PostgreSQL:', err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
