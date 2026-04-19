export const getConnectionString = () => {
    const required = ['PGUSER', 'PGPASSWORD', 'PGHOST', 'PGDATABASE'] as const;

    for (const key of required) {
        if (!process.env[key]) {
            throw new Error(`Missing env var: ${key}`);
        }
    }

    return (
        `postgresql://${process.env.PGUSER}:` +
        `${process.env.PGPASSWORD}@` +
        `${process.env.PGHOST}/` +
        `${process.env.PGDATABASE}?sslmode=require`
    );
}