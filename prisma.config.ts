import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const fallbackDatabaseUrl = 'mongodb://127.0.0.1:27017/scooliq';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node --experimental-strip-types prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? fallbackDatabaseUrl,
  },
});
