const { Sequelize } = require('sequelize');

const dbURL = process.env.DATABASE_URL;

if (!dbURL) {
  console.error(
    'DATABASE_URL is not set. Copy .env.example to .env and paste your Neon connection string.'
  );
  process.exit(1);
}

// Hosted Postgres (Neon, Render, Supabase...) needs SSL; a local database usually doesn't.
const isLocal = /@(localhost|127\.0\.0\.1)(:|\/)/.test(dbURL);
const useSsl = !isLocal || /sslmode=require/i.test(dbURL);

const sequelize = new Sequelize(dbURL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: useSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
  pool: { max: 5, idle: 10000 },
});

const connectDB = async () => {
  await sequelize.authenticate();
  console.log('PostgreSQL connected');
  // Creates the table if missing and adds/adjusts columns to match the model.
  await sequelize.sync({ alter: true });
  console.log('Database ready');
};

module.exports = { sequelize, connectDB };
