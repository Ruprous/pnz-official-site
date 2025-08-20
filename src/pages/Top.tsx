import React, { useEffect, useState } from "react";
import memberListRaw from '../data/team-member-list.json';
import styles from "./Top.module.css";
import layoutStyles from "../layouts/Layout.module.css";
import AOS from "aos";
import "aos/dist/aos.css";

// Topページ本体
const Top: React.FC = () => {
  // NEXTボタンのスクロール挙動（ヘッダー分だけ余白を残す）
  const handleNextClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("greeting");
    if (target) {
      const header = document.querySelector("header");
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  // OWNER以外のメンバーのみ抽出
  // OWNER以外のメンバーをランダム順でuseStateに格納
  function shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  type Member = {
    name_jp: string;
    name_en: string;
    role: string;
    description: string;
    icon: string;
  };
  const [memberList, setMemberList] = useState<Member[]>([]);
  const [memberIndex, setMemberIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // NEWS自動表示用
  const [newsList, setNewsList] = useState<any[]>([]);

  // 初回のみランダム順でセット
  useEffect(() => {
    setMemberList(shuffle(memberListRaw.filter(m => m.role !== "OWNER")));
  }, []);

  // 6秒ごとに次のメンバーへ（フェードアニメーション）
  useEffect(() => {
    if (memberList.length === 0) return;
    const timer = setInterval(() => {
      setFade(false); // フェードアウト
      setTimeout(() => {
        setMemberIndex((prev) => (prev + 1) % memberList.length);
        setFade(true); // フェードイン
      }, 500); // 0.5秒で切り替え
    }, 6000);
    return () => clearInterval(timer);
  }, [memberList]);

  const member = memberList[memberIndex] || {};

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
      // 日付降順でソート
      newsArray.sort((a, b) => {
        const dateA = new Date(a.date.replace(/\//g, '-'));
        const dateB = new Date(b.date.replace(/\//g, '-'));
        return dateB.getTime() - dateA.getTime();
      });
      setNewsList(newsArray.slice(0, 2)); // 最新2件のみ
    };
    loadNews();
  }, []);

  const [sloganAnim, setSloganAnim] = useState(false);
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 120,
      easing: 'ease-out-cubic',
    });
    // スローガンアニメーション（初回のみ）
    setTimeout(() => setSloganAnim(true), 300);
  }, []);

  return (
    <>
      {/* メインビジュアル＋NEXTボタン重ね表示 */}
      <section className={styles.mainVisual}>
        <div className={styles.mainVisualImgWrap}>
          <img
            src="/mainimage.png"
            alt="TEAM PNZ メインビジュアル"
            className={styles.mainVisualImg}
          />
          <div className={styles.sloganOverlay}>
            <h1
              className={styles.sloganTitle}
              style={{
                opacity: sloganAnim ? 1 : 0,
                letterSpacing: sloganAnim ? '0.08em' : '0.3em',
                transition: 'opacity 1.2s cubic-bezier(0.77,0,0.175,1), letter-spacing 1.2s cubic-bezier(0.77,0,0.175,1)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              Do All Kind of Things for Fun.
            </h1>
            <p
              className={styles.sloganSub}
              style={{
                opacity: sloganAnim ? 1 : 0,
                letterSpacing: sloganAnim ? '0.08em' : '0.3em',
                transition: 'opacity 1.2s cubic-bezier(0.77,0,0.175,1), letter-spacing 1.2s cubic-bezier(0.77,0,0.175,1)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              色んな事を楽しくやる。
            </p>
          </div>
          <div className={styles.nextBtnOverlay}>
            <a
              href="#greeting"
              className={`${layoutStyles.btn}`}
              onClick={handleNextClick}
              data-aos="fade-up"
              data-aos-offset="120"
              data-aos-duration="800"
              data-aos-easing="ease-out-cubic"
            >
              SCROLL DOWN
              <span className={layoutStyles.btn__label}>TEAM PNZ</span>
            </a>
          </div>
        </div>
      </section>

      {/* オーナーからの挨拶（固定） */}
      <section id="greeting" className={styles.greetingSection}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
          <h2
              style={{ textAlign: 'center', color: '#e53935', fontSize: '2rem', fontWeight: 'normal', letterSpacing: '0.08em', marginBottom: '2rem', fontFamily: 'Tomorrow, Barlow, Share Tech Mono, Consolas, monospace'}}
              data-aos="fade-up"
              data-aos-offset="400" // 判定をさらに遅らせる（デフォルト120→400）
              data-aos-duration="800"
              data-aos-easing="ease-out-cubic"
          >
            MEMBERS
          </h2>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '2rem' }}>
              <div className={styles.greetingBox} data-aos="fade-right" data-aos-offset="400" data-aos-duration="800" data-aos-easing="ease-out-cubic">
              <div className={styles.greetingText}>
                <div style={{ fontSize: "1.1rem", fontWeight: "normal", color: '#e53935', marginBottom: '0.5rem', fontFamily: 'Tomorrow, Barlow, Share Tech Mono, Consolas, monospace' }}>
                  OWNER
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: '0.2rem' }}>
                  ぶんた
                </div>
                <div style={{ fontSize: "1rem", fontWeight: "normal", color: '#fff', marginBottom: '0.7rem', opacity: 0.7, fontFamily: 'Tomorrow, Barlow, Share Tech Mono, Consolas, monospace' }}>
                  Bunta
                </div>
                <div style={{ margin: '6px 0', fontSize: '1.05rem', color: '#fff' }}>
                  バズ動画を量産し続ける時代を作る天才オーナー。<br />
                  メンバーに飯を奢り金欠だが本人曰く経済を回してるとのこと。
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                <img
                  src="/profile_images/icon_bunta.jpg"
                  alt="オーナーアイコン"
                  className={styles.greetingIcon}
                />
              </div>
            </div>
              <div className={styles.greetingBox} style={{ flexDirection: 'row' }} data-aos="fade-left" data-aos-offset="400" data-aos-duration="800" data-aos-easing="ease-out-cubic">
              <div
                style={{ transition: 'opacity 0.5s', opacity: fade ? 1 : 0, display: 'flex', flexDirection: 'row', width: '100%' }}
              >
                <div className={styles.greetingText}>
                  <div style={{ fontSize: "1.1rem", fontWeight: "normal", color: '#e53935', marginBottom: '0.5rem', fontFamily: 'Tomorrow, Barlow, Share Tech Mono, Consolas, monospace' }}>
                    {member.role}
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: '0.2rem' }}>
                    {member.name_jp}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: "normal", color: '#fff', marginBottom: '0.7rem', opacity: 0.7, fontFamily: 'Tomorrow, Barlow, Share Tech Mono, Consolas, monospace' }}>
                    {member.name_en}
                  </div>
                  <div style={{ margin: '6px 0', fontSize: '1.05rem', color: '#fff' }}>
                    {member.description}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                  <img
                    src={`/${member.icon}`}
                    alt={`${member.name_jp}アイコン`}
                    className={styles.greetingIcon}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* SHOW ALL MEMBERSボタンを枠群の下・中央に配置 */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
            <a href="/member" className={`${layoutStyles.btn}`} data-aos="fade-down" data-aos-offset="120" data-aos-duration="800" data-aos-easing="ease-out-cubic">
              SHOW ALL MEMBERS
              <span className={layoutStyles.btn__label}>TEAM PNZ</span>
            </a>
          </div>
        </div>
      </section>

      {/* ニュース*/}
      <section className={styles.newsSection} style={{
        backgroundImage: 'url(/subimage.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        <h2 className={styles.newsTitle}>NEWS</h2>
        <div className={styles.newsList}>
          {newsList.map((news) => (
            <div
              className={styles.newsCard}
              key={news.fileName}
              style={{ width: '420px', minHeight: '340px' }}
              data-aos="fade-up"
              data-aos-offset="120"
              data-aos-duration="800"
              data-aos-easing="ease-out-cubic"
            >
              <div className={styles.newsCardThumbnail}>
                <img
                  src={news.thumbnail && news.thumbnail !== '' ? news.thumbnail : '/mainimage.png'}
                  alt={news.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <h3 className={styles.newsCardTitle}>{news.title}</h3>
              <p className={styles.newsCardDate}>{news.date}</p>
              <a
                href={`/newsdetail?news=${news.fileName}`}
                className={styles.newsCardLink}
              >
                詳細を見る
              </a>
            </div>
          ))}
        </div>
        <div className={styles.newsMoreWrap}>
          <a href="/newslist" className={`${layoutStyles.btn}`} data-aos="fade-up" data-aos-offset="120" data-aos-duration="800" data-aos-easing="ease-out-cubic">
            AND MORE
            <span className={layoutStyles.btn__label}>TEAM PNZ</span>
          </a>
        </div>
      </section>

            {/* チーム公式SNSリストセクション */}
      <section style={{ margin: '3rem 0', textAlign: 'center' }}>
        <h2 style={{ color: '#e53935', fontSize: '1.7rem', fontWeight: 'normal', letterSpacing: '0.08em', marginBottom: '1.5rem', fontFamily: 'Tomorrow, Barlow, Share Tech Mono, Consolas, monospace' }}>
          SOCIAL MEDIAS
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
          <a href="https://x.com/PNZ_official" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#e53935', fontWeight: 'normal', fontSize: '1.1rem' }}>
            <svg className={styles.snsIconRed} width="32" height="32" viewBox="0 0 50 50">
              <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"/>
            </svg>
            <span className={`${layoutStyles.btn}`} style={{ marginTop: 8 }}>
              X
              <span className={layoutStyles.btn__label}>TEAM PNZ</span>
            </span>
          </a>
          <a href="https://www.youtube.com/@TEAMPNZ" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#e53935', fontWeight: 'normal', fontSize: '1.1rem' }}>
            <svg className={styles.snsIconRed} width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 8 }}>
              <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.413 3.5 12 3.5 12 3.5s-7.413 0-9.386.574A2.994 2.994 0 0 0 .502 6.186C0 8.159 0 12 0 12s0 3.841.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.587 20.5 12 20.5 12 20.5s7.413 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 15.841 24 12 24 12s0-3.841-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className={`${layoutStyles.btn}`} style={{ marginTop: 8 }}>
              YouTube
              <span className={layoutStyles.btn__label}>TEAM PNZ</span>
            </span>
          </a>
          <a href="https://www.tiktok.com/@pnz.official" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#e53935', fontWeight: 'normal', fontSize: '1.1rem' }}>
            <svg className={styles.snsIconRed} width="32" height="32" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 8 }}>
              <path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z"/>
            </svg>
            <span className={`${layoutStyles.btn}`} style={{ marginTop: 8 }}>
              TikTok
              <span className={layoutStyles.btn__label}>TEAM PNZ</span>
            </span>
          </a>
        </div>
      </section>

    </>
  );
};

export default Top;
