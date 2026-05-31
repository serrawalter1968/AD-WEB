import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL no está definida');
  process.exit(1);
}

async function migrate() {
  const sql = neon(DATABASE_URL);

  console.log('Agregando columna sizes...');
  await sql`ALTER TABLE shoes ADD COLUMN IF NOT EXISTS sizes JSONB NOT NULL DEFAULT '{}'::jsonb`;

  console.log('Migrando datos existentes de quantity a sizes...');
  await sql`
    UPDATE shoes SET sizes = jsonb_build_object('stock', quantity)
    WHERE sizes = '{}'::jsonb AND quantity > 0
  `;

  console.log('Eliminando columna quantity...');
  await sql`ALTER TABLE shoes DROP COLUMN IF EXISTS quantity`;

  console.log('Migración completada!');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Error en migración:', err);
  process.exit(1);
});
