import { useEffect, useState } from "react";
import layoutStyles from "../layouts/Layout.module.css";
import { useSearchParams, useNavigate } from "react-router-dom";

const NewsDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const newsFile = searchParams.get("news");
  const [news, setNews] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!newsFile) {
      setLoading(false);
      return;
    }
  fetch(`/news/${newsFile}`)
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(() => {
        setNews(null);
        setLoading(false);
      });
  }, [newsFile]);

  if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Loading...</div>;
  if (!news) return <div style={{ color: '#e53935', padding: '2rem' }}>記事が見つかりません</div>;

  const hasThumbnail = news.thumbnail && news.thumbnail !== '';
  const thumbnailSrc = hasThumbnail ? news.thumbnail : '';

  return (
  <div style={{ maxWidth: 800, margin: "0 auto 0 auto", padding: "2rem 1rem 0 1rem", color: "#fff" }}>
      <h2 style={{ color: "#e53935", fontSize: "2rem", marginBottom: "1.5rem" }}>{news.title}</h2>
      <div style={{ fontSize: "1rem", color: "#e53935", marginBottom: "1.2rem" }}>{news.date}</div>
      <div style={{ marginBottom: "1.5rem" }}>
        {Array.isArray(news.tags) && news.tags.map((t: string) => (
          <span key={t} style={{ display: "inline-block", background: "#e53935", color: "#fff", borderRadius: 0, padding: "2px 8px", marginRight: 6, fontSize: "0.9rem" }}>{t}</span>
        ))}
      </div>
      {hasThumbnail && (
        <img
          src={thumbnailSrc}
          alt="thumbnail"
          style={{
            width: "100%",
            maxWidth: 600,
            height: "auto",
            objectFit: "cover",
            borderRadius: 0,
            marginBottom: "2rem",
            background: "#000",
            boxShadow: "0 0 0 5px #e53935, 0 0 16px #222"
          }}
        />
      )}
      <div style={{ fontSize: "1.1rem", lineHeight: 1.8, whiteSpace: "pre-line", marginBottom: "2rem" }}>{news.body}</div>
      {Array.isArray(news.url) && news.url.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          {news.url.map((u: { type: string; url: string }, i: number) => (
            <a
              key={u.url + i}
              href={u.url}
              target="_blank"
              rel="noopener noreferrer"
              className={layoutStyles.btn}
              style={{ display: "inline-block", marginRight: "1rem", marginBottom: "0.7rem" }}
            >
              {u.type}
              <span className={layoutStyles.btn__label}>外部リンク</span>
            </a>
          ))}
        </div>
      )}
      <div>
        <button onClick={() => navigate(-1)} style={{ marginTop: '0', marginBottom: '3rem', background: '#e53935', color: '#fff', border: 'none', borderRadius: 0, padding: '8px 20px', fontWeight: 'bold', cursor: 'pointer' }}>← BACK</button>
      </div>
    </div>
  );
};

export default NewsDetail;
