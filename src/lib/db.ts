import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export type Shoe = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  image_url: string;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
};

export async function getShoes(): Promise<Shoe[]> {
  return sql`SELECT * FROM shoes ORDER BY created_at DESC`;
}

export async function getShoe(id: number): Promise<Shoe | null> {
  const result = await sql`SELECT * FROM shoes WHERE id = ${id}`;
  return result.length ? result[0] as Shoe : null;
}

export async function createShoe(shoe: {
  name: string;
  description?: string;
  category?: string;
  price?: number;
  quantity: number;
  image_url?: string;
}): Promise<Shoe> {
  const result = await sql`
    INSERT INTO shoes (name, description, category, price, quantity, image_url)
    VALUES (${shoe.name}, ${shoe.description || ''}, ${shoe.category || ''}, ${shoe.price || 0}, ${shoe.quantity}, ${shoe.image_url || ''})
    RETURNING *
  `;
  return result[0] as Shoe;
}

export async function updateShoe(id: number, shoe: Partial<{
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  image_url: string;
}>): Promise<Shoe | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (shoe.name !== undefined) { fields.push(`name = $${idx++}`); values.push(shoe.name); }
  if (shoe.description !== undefined) { fields.push(`description = $${idx++}`); values.push(shoe.description); }
  if (shoe.category !== undefined) { fields.push(`category = $${idx++}`); values.push(shoe.category); }
  if (shoe.price !== undefined) { fields.push(`price = $${idx++}`); values.push(shoe.price); }
  if (shoe.quantity !== undefined) { fields.push(`quantity = $${idx++}`); values.push(shoe.quantity); }
  if (shoe.image_url !== undefined) { fields.push(`image_url = $${idx++}`); values.push(shoe.image_url); }

  if (fields.length === 0) return getShoe(id);

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const result = await sql.query(
    `UPDATE shoes SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return result.length ? result[0] as Shoe : null;
}

export async function deleteShoe(id: number): Promise<boolean> {
  const result = await sql`DELETE FROM shoes WHERE id = ${id} RETURNING id`;
  return result.length > 0;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await sql`SELECT * FROM users WHERE email = ${email}`;
  return result.length ? result[0] as User : null;
}

export async function createUser(email: string, passwordHash: string): Promise<User> {
  const result = await sql`
    INSERT INTO users (email, password_hash) VALUES (${email}, ${passwordHash}) RETURNING *
  `;
  return result[0] as User;
}
