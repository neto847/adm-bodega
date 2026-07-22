import Sidebar from './sidebar';
import TopBar from './TopBar';
import '../Styles/componentes/Layout.css';

function Layout({ title, subtitle, children }) {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="layout-main">
        <TopBar title={title} subtitle={subtitle} />
        <div className="layout-content">{children}</div>
      </div>
    </div>
  );
}

export default Layout;