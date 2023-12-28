import dotenv from 'dotenv';
import Path from 'path';
dotenv.config({ path: Path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  // default_password: process.env.DEFAULT_PASS
};
