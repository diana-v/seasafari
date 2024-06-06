import dotenv from 'dotenv'

const isProduction = process.env.NODE_ENV === 'production'
const { parsed } = dotenv.config({path: isProduction ? '.env' : '.env.local'})

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