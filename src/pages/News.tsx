import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 6;

const News = () => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // クエリ取得
  const page = parseInt(searchParams.get("page") || "1", 10);
  const sort = searchParams.get("sort") || "newer"; // newer/older
  const tag = searchParams.get("tag") || "";

  useEffect(() => {
    // NEWSデータをpublic/news/配下からfetchで取得
    const loadNews = async () => {
      // public/news/配下のjsonファイル名リスト（手動で列挙 or サーバー側でAPI化しない場合はファイル名を固定で列挙）
      const newsFiles = [
        'news-230715-00-.json',
        'news-230719-00-.json',
        'news-230728-00-.json',
        'news-230731-00-.json',
        'news-230803-00-.json',
        'news-231017-00-.json',
        'news-240823-00-.json',
        'news-241224-00-.json',
        'news-250517-00-.json',
        'news-250710-00-.json',
        'news-250720-00-.json',
        'news-250814-00-.json',
      ];
      const newsPromises = newsFiles.map(async (fileName) => {
        try {
          const res = await fetch(`/news/${fileName}`);
          if (!res.ok) return null;
          const data = await res.json();
          // サムネイル画像ファイル名抽出
          let thumbFile = data.thumbnail?.split('/').pop() || '';
          let thumbnailUrl = thumbFile ? `/news_images/${thumbFile}` : '';
          return { ...data, fileName, thumbnail: thumbnailUrl };
        } catch {
          return null;
        }
      });
      const newsArrayRaw = await Promise.all(newsPromises);
      const newsArray = newsArrayRaw.filter(Boolean);
      // タグ抽出（ユニーク）
      const tagSet = new Set<string>();
      newsArray.forEach(news => {
        if (Array.isArray(news.tags)) {
          news.tags.forEach((t: string) => tagSet.add(t));
        }
      });
      setTags(Array.from(tagSet));
      setNewsList(newsArray);
    };
    loadNews();
  }, []);

  // タグ・ソート・ページネーション適用
  let filteredList = [...newsList];
  if (tag) {
    filteredList = filteredList.filter(news => Array.isArray(news.tags) && news.tags.includes(tag));
  }
  filteredList.sort((a, b) => {
    const dateA = a.date ? new Date(a.date.replace(/\//g, '-')) : new Date(0);
    const dateB = b.date ? new Date(b.date.replace(/\//g, '-')) : new Date(0);
    return sort === "newer" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
  });
  const totalPages = Math.max(1, Math.ceil(filteredList.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const pagedList = filteredList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // ページネーションボタン生成
  const getPageButtons = () => {
  const btns: React.ReactElement[] = [];
    if (totalPages <= 1) return btns;
    btns.push(
      <button key="first" disabled={currentPage === 1} onClick={() => setSearchParams({ page: "1", sort, tag })}>{"<<"}</button>
    );
    btns.push(
      <button key="prev" disabled={currentPage === 1} onClick={() => setSearchParams({ page: String(currentPage - 1), sort, tag })}>{"<"}</button>
    );
    for (let i = 1; i <= totalPages; i++) {
      btns.push(
        <button key={i} disabled={i === currentPage} onClick={() => setSearchParams({ page: String(i), sort, tag })}>{i}</button>
      );
    }
    btns.push(
      <button key="next" disabled={currentPage === totalPages} onClick={() => setSearchParams({ page: String(currentPage + 1), sort, tag })}>{">"}</button>
    );
    btns.push(
      <button key="last" disabled={currentPage === totalPages} onClick={() => setSearchParams({ page: String(totalPages), sort, tag })}>{">>"}</button>
    );
    return btns;
  };

  // ソートプルダウン
  const sortSelect = (
    <select
      value={sort}
      onChange={e => setSearchParams({ page: "1", sort: e.target.value, tag })}
      style={{ padding: "4px 12px", fontSize: "1rem", borderRadius: 4 }}
    >
      <option value="newer">NEWER</option>
      <option value="older">OLDER</option>
    </select>
  );

  // タグ検索プルダウン
  const tagSelect = (
    <select
      value={tag}
      onChange={e => setSearchParams({ page: "1", sort, tag: e.target.value })}
      style={{ padding: "4px 12px", fontSize: "1rem", borderRadius: 4 }}
    >
      <option value="">ALL</option>
      {tags.map(t => (
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem" }}>
      <h2 style={{ color: "#e53935", fontSize: "2rem", marginBottom: "2rem" }}>NEWS一覧</h2>
      {/* ソート・タグ検索ボタン */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <div>Sort: {sortSelect}</div>
        <div>Tag: {tagSelect}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
        {pagedList.map((news, idx) => {
          // サムネイル画像が未定義または空の場合は/mainimage.pngを表示
          const thumbnailSrc = news.thumbnail && news.thumbnail !== '' ? news.thumbnail : '/mainimage.png';
          return (
            <div key={idx} style={{ background: "#222", borderRadius: 0, boxShadow: "0 0 0 3px #e53935, 0 0 12px #222", padding: "1.2rem", color: "#fff", transition: "box-shadow 0.2s", position: "relative" }}>
              <div style={{ width: "100%", aspectRatio: "16/9", marginBottom: "1rem", background: "#000", overflow: "hidden", borderRadius: 0, boxShadow: "0 0 0 2px #e53935, 0 0 12px #222" }}>
                <img
                  src={thumbnailSrc}
                  alt="thumbnail"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block"
                  }}
                />
              </div>
              <div style={{ fontSize: "1.15rem", fontWeight: "bold", marginBottom: "0.7rem", letterSpacing: "0.03em" }}>{news.title || "タイトル未設定"}</div>
              <div style={{ fontSize: "1rem", color: "#e53935", marginBottom: "1.2rem" }}>{news.date || "日付未設定"}</div>
              <div style={{ marginBottom: "0.7rem" }}>
                {Array.isArray(news.tags) && news.tags.map((t: string) => (
                  <span key={t} style={{ display: "inline-block", background: "#e53935", color: "#fff", borderRadius: 0, padding: "2px 8px", marginRight: 6, fontSize: "0.9rem" }}>{t}</span>
                ))}
              </div>
              <a href={`/newsdetail?news=${news.fileName}`} style={{ color: "#e53935", textDecoration: "underline", fontWeight: "bold", fontSize: "1rem" }}>詳細を見る</a>
            </div>
          );
        })}
      </div>
      {/* ページネーション */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", margin: "2rem 0" }}>
        {getPageButtons()}
      </div>
    </div>
  );
};

export default News;
