import Sidebar from "./Sidebar";
import Header from "./Header";
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <div className="layout__body">
        <Sidebar />
        <main className="layout__main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;