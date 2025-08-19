import type { ReactNode } from "react";
import styles from "./Layout.module.css";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const HEADER_HEIGHT = 60; // 固定ヘッダー高さ(px)

const Layout = ({ children }: { children: ReactNode }) => {
  // shrink機能は未使用のため削除
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          // shrink機能は未使用のため削除
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // const paddingTop = HEADER_HEIGHT;

  return (
  <div className="layout-root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
  <header className={styles.header} style={{ height: HEADER_HEIGHT }}>
        <div className={styles.logo}>
          <a href="/">
            <img src="/logo_mini.PNG" alt="TEAM PNZ ロゴ" className={styles.logoImg} />
          </a>
        </div>
        <nav className={styles.nav}>
          <a href="/" className={styles.navLink}>TOP</a>
          <a href="/project" className={styles.navLink}>PROJECT</a>
          <a href="/member" className={styles.navLink}>MEMBER</a>
          <a href="/newslist" className={styles.navLink}>NEWS</a>
          <a href="/sponsor" className={styles.navLink}>SPONSOR</a>
    <Link to="/contact" className={styles.navLink}>CONTACT</Link>
    </nav>
      </header>
  <main style={{ flex: 1, padding: '0', paddingTop: 0 }}>{children}</main>
      <footer className={styles.footer}>
        <span className={styles.footerCopyright}>© 2021-2025 PNZ ALL RIGHTS RESERVED</span>
      </footer>
    </div>
  );
};

export default Layout;
