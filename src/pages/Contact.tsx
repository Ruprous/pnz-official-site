import React, { useState } from "react";
import layoutStyles from "../layouts/Layout.module.css";

const Contact: React.FC = () => {
  const [showMail, setShowMail] = useState(false);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 className={layoutStyles.sloganTitle}>CONTACT</h1>
      <p>お問い合わせ・ご連絡は「ぶんた」のX（DM）またはメールのどちらかにどうぞ。</p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          marginTop: "2.5rem",
        }}
      >
        <a
          href="https://x.com/Buntapex"
          target="_blank"
          rel="noopener noreferrer"
          className={layoutStyles.btn}
        >
          X（DM）で問い合わせ
          <span className={layoutStyles.btn__label}>TEAM PNZ</span>
        </a>
        <a
          href="mailto:sns.bunta@gmail.com"
          className={layoutStyles.btn}
          onClick={() => setShowMail(true)}
          style={
            showMail
              ? { fontFamily: "03SmartFontUI, sans-serif", letterSpacing: "0.03em" }
              : undefined
          }
        >
          {showMail ? "sns.bunta@gmail.com" : "メールで問い合わせ"}
          <span className={layoutStyles.btn__label}>TEAM PNZ</span>
        </a>
      </div>
    </div>
  );
};

export default Contact;
