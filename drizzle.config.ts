import dotenv from 'dotenv'

const { parsed } = dotenv.config({ path: '.env' });

const connectionString = [
  'postgresql://',
  parsed?.PGUSER,
  ':',
  parsed?.PGPASSWORD,
  '@',
  parsed?.PGHOST,
  '/',
  parsed?.PGDATABASE,
  '?sslmode=require',
].join('');

export default {
  schema:'./src/server/db/schema.ts',
  driver:'pg',
  dbCredentials: { connectionString },
};