import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL no está definida');
  process.exit(1);
}

const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error('Uso: node --env-file .env scripts/change-password.mjs <email> <nueva-clave>');
  process.exit(1);
}

async function changePassword() {
  const sql = neon(DATABASE_URL);

  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length === 0) {
    console.error(`No existe un usuario con email: ${email}`);
    process.exit(1);
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await sql`UPDATE users SET password_hash = ${hash} WHERE email = ${email}`;
  console.log(`Clave actualizada para ${email}`);
}

changePassword().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
