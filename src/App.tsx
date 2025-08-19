import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Top from './pages/Top';
import Project from './pages/Project';
import Member from './pages/Member';
import MemberDetail from './pages/MemberDetail';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Sponsor from './pages/Sponsor';
import Contact from './pages/Contact';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/project" element={<Project />} />
        <Route path="/member" element={<Member />} />
        <Route path="/member/:name_en" element={<MemberDetail />} />
        <Route path="/newslist" element={<News />} />
        <Route path="/newsdetail" element={<NewsDetail />} />
        <Route path="/sponsor" element={<Sponsor />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Layout>
  );
}

export default App;
