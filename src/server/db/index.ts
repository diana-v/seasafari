import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import dotenv from 'dotenv';

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

export const db = drizzle(pool, { schema });
