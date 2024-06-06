import dotenv from 'dotenv'

const isProduction = process.env.NODE_ENV === 'production'
const { parsed } = dotenv.config({ path: '.env.local' });

const connectionString = [
  'postgresql://',
  isProduction ? process.env.PGUSER : parsed?.PGUSER,
  ':',
  isProduction ? process.env.PGPASSWORD : parsed?.PGPASSWORD,
  '@',
  isProduction ? process.env.PGHOST : parsed?.PGHOST,
  '/',
  isProduction ? process.env.PGDATABASE : parsed?.PGDATABASE,
  '?sslmode=require',
].join('');

export default {
  schema:'./src/server/db/schema.ts',
  driver:'pg',
  dbCredentials: { connectionString },
};