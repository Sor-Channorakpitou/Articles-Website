import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getArticles, getCategories, removeArticle } from "../services/api";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [selectedCategories]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      setError("Failed to load categories.");
    }
  };

  const fetchArticles = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = selectedCategories.length > 0 ? await getArticles({ categories: selectedCategories }): await getArticles();
      setArticles(data);
    } catch {
      setError("Failed to load articles.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (id) => {
    setSelectedCategories((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id] );
  };

  const deleteArticle = async (id) => {
    try {
      await removeArticle(id);
      fetchArticles();
    } catch {
      setError("Failed to delete article.");
    }
  };

  const handleView = (id) => navigate(`/articles/${id}`);
  const handleEdit = (id) => navigate(`/articles/${id}/edit`);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="filter-section">
        <h4>Filter by categories</h4>

        <div className="fitler-options">
          {categories.map((cat) => (
          <label key={cat.id}>
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat.id)}
              onChange={() => toggleCategory(cat.id)}
            />
            {cat.name}
          </label>
        ))}
        </div>
      </div>

      <div className="article-list">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={deleteArticle}
          />
        ))}
      </div>
    </>
  );
}

function ArticleCard({ article, onView, onEdit, onDelete }) {
  return (
    <div className="article-card">
      <div className="article-title">{article.title}</div>

      <div className="article-author">
        By <Link to={`/journalists/${article.journalist_id}/articles`}>{article.journalist_name}</Link>
      </div>

      <div className="article-categories">
        {article.categories?.map((c) => (
          <span key={c.id} className="category-btn">
            {c.name}
          </span>
        ))}
      </div>

      <div className="article-snippet">{article.snippet}</div>


      <div className="article-actions">
        <button className="button-tertiary" onClick={() => onEdit(article.id)}>
          Edit
        </button>
        <button className="button-tertiary" onClick={() => onDelete(article.id)}>
          Delete
        </button>
        <button className="button-secondary" onClick={() => onView(article.id)}>
          View
        </button>
      </div>
    </div>
  );
}