import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-serverless';

import * as schema from './schema';

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

const pool = new Pool({ connectionString });

export const db = drizzle(pool, { schema });
