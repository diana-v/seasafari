import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

import * as schema from './schema';

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

const pool = new Pool({ connectionString });

export const db = drizzle(pool, { schema });
