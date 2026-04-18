import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' });

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
    dbCredentials: { connectionString },
    driver: 'pg',
    schema: './src/server/db/schema.ts',
};