import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getArticlesByJournalist, removeArticle } from "../services/api.js";

export default function JournalistArticlePage() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchArticles() 
    }, [id]);

    const fetchArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
        const data = await getArticlesByJournalist(id);
        setArticles(data);
    } catch (err) {
        setError("Failed to load articles. Please try again.");
    } finally {
        setIsLoading(false);
    }
    };

    const deleteArticle = async (id) => {
        setIsLoading(true);
        setError("");
        try {
          await removeArticle(id);
          await fetchArticles(); // refresh the list
        } catch (err) {
          setError("Failed to delete article.");
        } finally {
          setIsLoading(false);
        }
      };
    
    const handleView = (id) => navigate(`/articles/${id}`);
    
    const handleEdit = (id) => navigate(`/articles/${id}/edit`);


    return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
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
      <div className="article-author">By {article.journalist_name}</div>

      <div className="article-actions">
        <button className="button-tertiary" onClick={() => onEdit(article.id)}>
          Edit
        </button>
        <button
          className="button-tertiary"
          onClick={() => onDelete(article.id)}
        >
          Delete
        </button>
        <button className="button-secondary" onClick={() => onView(article.id)}>
          View
        </button>
      </div>
    </div>
  );
}
