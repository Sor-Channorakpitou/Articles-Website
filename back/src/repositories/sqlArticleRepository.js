//
//  This repository shall:
//  - Connect to the database (using the pool provided by the database.js)
// -  Perfrom the SQL querries to implement the bellow API
//
import { pool } from "../utils/database.js";
// Get all articles
export async function getArticles() {
    // TODO
    const [articles] = await pool.query(`
        SELECT
            a.*,
            j.name AS journalist_name
        FROM articles a
        JOIN journalists j
        ON a.journalist_id = j.id`
    );

    const [categoryRows] = await pool.query(`
        SELECT ac.article_id, c.id, c.name
        FROM ArticleCategory ac
        JOIN categories c
        ON ac.category_id = c.id`
    );

    return articles.map((article) => ({
        ...article,
        categories: categoryRows
            .filter((row) => row.article_id === article.id)
            .map((row) => ({ id: row.id, name: row.name })),
    }));
}

// Get one article by ID
export async function getArticleById(id) {
    // TODO
    const [article] = await pool.query(`
        SELECT * FROM articles WHERE id = ?`, [id]);
    return article[0];
}

// Create a new article
export async function createArticle(article) {
    // TODO
    const { title, content, journalist, category } = article;

    const [addedArticle] = await pool.query(
        "INSERT INTO articles (title,content,journalist_id) VALUES (?,?,?)",
        [title, content, journalist]
    );
    await pool.query("INSERT INTO ArticleCategory (article_id,category_id) VALUES (?,?)", [addedArticle.insertId, category]);
    return addedArticle;
}

// Update an article by ID
export async function updateArticle(id, updatedData) {
    // TODO
    const { title, content, journalist, category } = updatedData;
    
    const [result] = await pool.query("UPDATE articles SET title=?, content=?, journalist=?, category=? WHERE id=?", 
        [title, content, journalist, category, id]
    )
    return result;
}

// Delete an article by ID
export async function deleteArticle(id) {
    // TODO
    const [result] = await pool.query("DELETE FROM articles WHERE id=?", [id]);
    return result;
}

// Get all article by journaslist ID
export async function getArticleByJournalistId(id) {
    // TODO
    const [article] = await pool.query(`
        SELECT
            a.*,
            j.name as journalist_name
            FROM articles a
            JOIN journalists j
            ON a.journalist_id = j.id
            WHERE j.id = ?`, [id]);
    return article;
}

// Get article by category
export async function getArticlesByCategories(categoryIds) {
    if (!categoryIds || categoryIds.length === 0) return [];
    const placeholders = categoryIds.map(() => "?").join(",");

    const [articles] = await pool.query(`
        SELECT DISTINCT
        a.*, j.name AS journalist_name
        FROM articles a
        JOIN journalists j
        ON a.journalist_id = j.id
        JOIN ArticleCategory ac
        ON a.id = ac.article_id
        WHERE ac.category_id IN (${placeholders})`, categoryIds);

  return articles;
}