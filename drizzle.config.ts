import dotenv from 'dotenv'

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const { parsed } = dotenv.config({ path: '.env.local' });
const showParsed = !(isProduction || isTest)

const connectionString = [
    'postgresql://',
    showParsed ? parsed?.PGUSER : process.env.PGUSER,
    ':',
    showParsed ? parsed?.PGPASSWORD : process.env.PGPASSWORD,
    '@',
    showParsed ? parsed?.PGHOST : process.env.PGHOST,
    '/',
    showParsed ? parsed?.PGDATABASE : process.env.PGDATABASE,
    '?sslmode=require',
].join('');

export default {
    dbCredentials: { connectionString },
    driver: 'pg',
    schema: './src/server/db/schema.ts',
};