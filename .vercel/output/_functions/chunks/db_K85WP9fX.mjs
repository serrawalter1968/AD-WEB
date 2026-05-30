import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
async function getShoes() {
  return sql`SELECT * FROM shoes ORDER BY created_at DESC`;
}
async function getShoe(id) {
  const result = await sql`SELECT * FROM shoes WHERE id = ${id}`;
  return result.length ? result[0] : null;
}
async function createShoe(shoe) {
  const result = await sql`
    INSERT INTO shoes (name, description, category, price, quantity, image_url)
    VALUES (${shoe.name}, ${shoe.description || ""}, ${shoe.category || ""}, ${shoe.price || 0}, ${shoe.quantity}, ${shoe.image_url || ""})
    RETURNING *
  `;
  return result[0];
}
async function updateShoe(id, shoe) {
  const fields = [];
  const values = [];
  let idx = 1;
  if (shoe.name !== void 0) {
    fields.push(`name = $${idx++}`);
    values.push(shoe.name);
  }
  if (shoe.description !== void 0) {
    fields.push(`description = $${idx++}`);
    values.push(shoe.description);
  }
  if (shoe.category !== void 0) {
    fields.push(`category = $${idx++}`);
    values.push(shoe.category);
  }
  if (shoe.price !== void 0) {
    fields.push(`price = $${idx++}`);
    values.push(shoe.price);
  }
  if (shoe.quantity !== void 0) {
    fields.push(`quantity = $${idx++}`);
    values.push(shoe.quantity);
  }
  if (shoe.image_url !== void 0) {
    fields.push(`image_url = $${idx++}`);
    values.push(shoe.image_url);
  }
  if (fields.length === 0) return getShoe(id);
  fields.push(`updated_at = NOW()`);
  values.push(id);
  const result = await sql(
    `UPDATE shoes SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
    ...values
  );
  return result.length ? result[0] : null;
}
async function deleteShoe(id) {
  const result = await sql`DELETE FROM shoes WHERE id = ${id} RETURNING id`;
  return result.length > 0;
}
async function getUserByEmail(email) {
  const result = await sql`SELECT * FROM users WHERE email = ${email}`;
  return result.length ? result[0] : null;
}
async function createUser(email, passwordHash) {
  const result = await sql`
    INSERT INTO users (email, password_hash) VALUES (${email}, ${passwordHash}) RETURNING *
  `;
  return result[0];
}

export { createUser as a, getShoes as b, createShoe as c, deleteShoe as d, getUserByEmail as e, getShoe as g, updateShoe as u };
