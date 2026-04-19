import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-serverless';

import * as schema from './schema';

const isProduction = process.env.NODE_ENV === 'production';
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

const pool = new Pool({ connectionString });

console.log('🔥 DB INIT ENV CHECK');
console.log('PGHOST', process.env.PGHOST);
console.log('PGUSER', process.env.PGUSER);
console.log('PGDATABASE', process.env.PGDATABASE);
console.log('PGPASSWORD length', process.env.PGPASSWORD?.length);

export const db = drizzle(pool, { schema });
