import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import dotenv from 'dotenv';

import * as schema from './schema';

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

const pool = new Pool({ connectionString });

export const db = drizzle(pool, { schema });
