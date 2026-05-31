import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL no está definida');
  process.exit(1);
}

async function seed() {
  const sql = neon(DATABASE_URL);

  console.log('Creando tablas...');
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS shoes (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT DEFAULT '',
      category VARCHAR(100) DEFAULT '',
      price DECIMAL(10, 2) DEFAULT 0,
      sizes JSONB NOT NULL DEFAULT '{}'::jsonb,
      image_url TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  const email = process.env.ADMIN_EMAIL || 'admin@adweb.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length === 0) {
    const hash = await bcrypt.hash(password, 10);
    await sql`INSERT INTO users (email, password_hash) VALUES (${email}, ${hash})`;
    console.log(`Usuario admin creado: ${email} / ${password}`);
  } else {
    console.log(`El usuario ${email} ya existe`);
  }

  console.log('Seed completado!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
