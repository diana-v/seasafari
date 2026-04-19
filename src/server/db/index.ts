import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

import { getConnectionString } from './connectionString';
import * as schema from './schema';

let instance: null | ReturnType<typeof createDb> = null;

function createDb() {
    const pool = new Pool({
        connectionString: getConnectionString(),
    });

    return drizzle(pool, { schema });
}

export const db = {
    get instance() {
        if (!instance) {
            instance = createDb();
        }

        return instance;
    },
};
