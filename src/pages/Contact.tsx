import React from "react";
import layoutStyles from "../layouts/Layout.module.css";

const Contact: React.FC = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 className={layoutStyles.sloganTitle}>CONTACT</h1>
      <p>お問い合わせ・ご連絡はこちらからどうぞ。</p>
      <a href="mailto:info@pnz-team.com" className={layoutStyles.btn} style={{ marginTop: "2rem" }}>
        メールで問い合わせ
      </a>
    </div>
  );
};

export default Contact;
