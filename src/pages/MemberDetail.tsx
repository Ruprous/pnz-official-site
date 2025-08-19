// import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import memberListRaw from '../data/team-member-list.json';
import styles from "./MemberDetail.module.css";
import layoutStyles from "../layouts/Layout.module.css";

const MemberDetail = () => {
  const { name_en } = useParams();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const backUrl = roleParam ? `/member?role=${roleParam}` : '/member';

  const memberIndex = memberListRaw.findIndex(m => m.name_en === name_en);
  const member = memberListRaw[memberIndex];

  if (!member) {
    return <div style={{ color: '#e53935', textAlign: 'center', marginTop: '4rem' }}>メンバー情報が見つかりません</div>;
  }

  return (
    <div className={styles.memberDetailRoot}>
      <img src="/images/pnz-logo.png" alt="PNZロゴ" className={styles.memberDetailBgLogo} />
      <div className={styles.memberDetailFlex}>
        <img src={`/${member.icon}`} alt={`${member.name_jp}アイコン`} className={styles.memberDetailIcon} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
          <div className={styles.memberDetailRole}>{member.role}</div>
          <h2 className={styles.memberDetailHeader}>{member.name_jp}</h2>
          <div className={styles.memberDetailNameEn}>{member.name_en}</div>
          {member.description && (
            <div className={styles.memberDetailDesc}>
              {member.description.split('\n').map((line, idx) => (
                <span key={idx}>{line}<br/></span>
              ))}
            </div>
          )}
          {/* SNSリスト */}
          {Array.isArray(member.sns) && member.sns.length > 0 && (
            <>
              <div className={styles.memberDetailSns} style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span className={styles.memberDetailSnsLabel}>SNS:</span>
                {member.sns.map((sns, idx) => (
                  <a
                    key={idx}
                    href={sns.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={layoutStyles.btn}
                    style={{ marginTop: '0.5rem', padding: '0.5rem 1.5rem', fontSize: '1rem', fontWeight: 'normal', borderRadius: 0, textDecoration: 'none', minWidth: 100, textAlign: 'center' }}
                  >
                    {sns.type}
                  </a>
                ))}
              </div>
              <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                <a
                  href={backUrl}
                  className={layoutStyles.btn}
                  style={{ padding: '0.7rem 2.2rem', fontSize: '1.1rem', fontWeight: 'normal', borderRadius: 0, textDecoration: 'none', letterSpacing: '0.08em', background: '#e53935', color: '#fff', display: 'inline-block' }}
                >
                  BACK
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
