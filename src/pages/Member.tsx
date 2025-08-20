import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import memberListRaw from '../data/team-member-list.json';
import styles from "./Top.module.css";
import layoutStyles from "../layouts/Layout.module.css";
import { Link, useSearchParams } from "react-router-dom";

const ROLE_GROUPS = [
  { label: "OWNER+STREAMER", roles: ["OWNER", "STREAMER"] },
  { label: "CREATOR+STAFF", roles: ["CREATOR", "STAFF"] },
  { label: "PLAYER", roles: ["PLAYER"] },
];

const Member = () => {
  const [descAnim, setDescAnim] = useState(false);
  const [sloganAnim, setSloganAnim] = useState(false);
  const [btnAnim, setBtnAnim] = useState([false, false, false]);

  useEffect(() => {
    setTimeout(() => setDescAnim(true), 600);
    setTimeout(() => setSloganAnim(true), 300);
    // セレクトボタンのフェードイン（順に遅延）
    ROLE_GROUPS.forEach((_, idx) => {
      setTimeout(() => {
        setBtnAnim(prev => {
          const arr = [...prev];
          arr[idx] = true;
          return arr;
        });
      }, 400 + idx * 180);
    });
  }, []);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialIdx = Number(searchParams.get('role')) || 0;
  const [roleGroupIdx, setRoleGroupIdx] = useState(initialIdx);

  useEffect(() => {
    setSearchParams({ role: String(roleGroupIdx) });
  }, [roleGroupIdx, setSearchParams]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      offset: 120,
      easing: 'ease-out-cubic',
    });
  }, []);

  const currentRoles = ROLE_GROUPS[roleGroupIdx].roles;
  const filteredMembers = memberListRaw.filter(m => currentRoles.includes(m.role));

  return (
  <div>
      <h2
        style={{
          textAlign: 'center',
          color: '#e53935',
          fontSize: '2rem',
          fontWeight: 'normal',
          letterSpacing: sloganAnim ? '0.08em' : '0.3em',
          marginBottom: '0.7rem',
          fontFamily: 'Tomorrow, Barlow, Share Tech Mono, Consolas, monospace',
          opacity: sloganAnim ? 1 : 0,
          transition: 'opacity 0.7s cubic-bezier(0.77,0,0.175,1), letter-spacing 0.7s cubic-bezier(0.77,0,0.175,1)'
        }}
      >
        MEMBERS
      </h2>
      <div
        style={{
          textAlign: 'center',
          color: '#fff',
          fontSize: '1.08rem',
          marginBottom: '2rem',
          fontFamily: '03SmartFontUI',
          opacity: descAnim ? 0.8 : 0,
          transform: descAnim ? 'translateY(0)' : 'translateY(32px)',
          transition: 'opacity 0.7s cubic-bezier(0.77,0,0.175,1), transform 0.7s cubic-bezier(0.77,0,0.175,1)'
        }}
      >
        PNZには様々なメンバーがおり、それぞれのメンバーが個性を爆発させて活動しています <span style={{fontSize:'1.3em'}}>💥</span>
      </div>
      {/* ロール切替ボタン */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
        {ROLE_GROUPS.map((group, idx) => (
          <button
            key={group.label}
            onClick={() => setRoleGroupIdx(idx)}
            className={layoutStyles.btn}
            style={{
              background: roleGroupIdx === idx ? '#e53935' : '#222',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'normal',
              padding: '0.7rem 2.2rem',
              fontSize: '1.1rem',
              borderRadius: 0,
              opacity: btnAnim[idx] ? 1 : 0,
              transform: btnAnim[idx] ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.7s cubic-bezier(0.77,0,0.175,1), transform 0.7s cubic-bezier(0.77,0,0.175,1)',
            }}
          >
            {group.label}
          </button>
        ))}
      </div>
      {/* メンバー一覧表示（TOPページのUI流用） */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2.5rem',
        justifyContent: 'center',
        alignItems: 'stretch',
        margin: '0 auto',
        maxWidth: '1200px',
        minHeight: '800px'
      }}>
        {filteredMembers.map((member) => (
          <Link
            to={`/member/${member.name_en}?role=${roleGroupIdx}`}
            key={member.name_en}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              className={styles.greetingBox}
              style={{ width: 460, height: 200, cursor: 'pointer', marginBottom: '2rem', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', position: 'relative' }}
              data-aos="fade-up"
              data-aos-offset="120"
              data-aos-duration="800"
              data-aos-easing="ease-out-cubic"
              data-aos-delay={(filteredMembers.indexOf(member) % 3) * 120}
            >
              <div className={styles.greetingText} style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontSize: "1.1rem", fontWeight: "normal", color: '#e53935', marginBottom: '0.5rem', fontFamily: 'Tomorrow, Barlow, Share Tech Mono, Consolas, monospace' }}>
                  {member.role}
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: '0.2rem' }}>
                  {member.name_jp}
                </div>
                <div style={{ fontSize: "1rem", fontWeight: "normal", color: '#fff', marginBottom: '1.2rem', opacity: 0.7, fontFamily: 'Tomorrow, Barlow, Share Tech Mono, Consolas, monospace' }}>
                  {member.name_en}
                </div>
                <button
                  className={layoutStyles.btn}
                  style={{ marginTop: '0.5rem', padding: '0.5rem 1.5rem', fontSize: '1rem', fontWeight: 'normal', borderRadius: 0 }}
                  type="button"
                >
                  Learn More
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                <img
                  src={`/${member.icon}`}
                  alt={`${member.name_jp}アイコン`}
                  className={styles.greetingIcon}
                  style={{ width: 180, height: 180, objectFit: 'cover', background: '#222' }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
  </div>
  );
};

export default Member;
