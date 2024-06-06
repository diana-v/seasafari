const connectionString = [
  'postgresql://',
  process.env.PGUSER,
  ':',
  process.env.PGPASSWORD,
  '@',
  process.env.PGHOST,
  '/',
  process.env.PGDATABASE,
  '?sslmode=require',
].join('');

export default {
  schema:'./src/server/db/schema.ts',
  driver:'pg',
  dbCredentials: { connectionString },
};