
import './Header.css';
import { Link } from "react-router-dom";

const Header = () => {
  
  const agentId = '689535559f14247c59fa8a3d';

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__title">
          <h1 className="header__main-title">Anvaya CRM Dashboard</h1>
          <p className="header__subtitle">Manage your leads and sales pipeline</p>
        </div>
        <div className="header__actions">
          <Link to={`/profile/${agentId}`} className="header__user" >
            <div className="header__user-avatar header-custom-color">JD</div>
            <div className="header__user-info">
              <span className="header__user-name">John Doe</span>
              <span className="header__user-role">Sales Manager</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
