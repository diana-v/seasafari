import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import dotenv from 'dotenv';

import * as schema from './schema';

const isProduction = process.env.NODE_ENV === 'production';
const { parsed } = dotenv.config({ path: isProduction ? '.env' : '.env.local' });

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

const pool = new Pool({ connectionString });

export const db = drizzle(pool, { schema });
