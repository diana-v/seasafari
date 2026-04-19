import { getConnectionString } from '@/server/db/connectionString';

export default {
    dbCredentials: {
        connectionString: getConnectionString(),
    },
    driver: 'pg',
    schema: './src/server/db/schema.ts',
};
