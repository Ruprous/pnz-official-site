import layoutStyles from "../layouts/Layout.module.css";

const Project = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', fontSize: '1.5rem', color: '#e53935', textAlign: 'center' }}>
      <div>
        Currently under construction.<br />Please wait for the release.
      </div>
      <a href="/" className={layoutStyles.btn} style={{ marginTop: '2rem' }}>
        TOPに戻る
        <span className={layoutStyles.btn__label}>TEAM PNZ</span>
      </a>
    </div>
  );
};

export default Project;
