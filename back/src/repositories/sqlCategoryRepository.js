import { pool } from "../utils/database.js";

// Get all categories
export async function getCategories() {
  const [result] = await pool.query(`SELECT * FROM categories ORDER BY name`);
  return result;
}

