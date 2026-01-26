import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaTags,
  FaQuestionCircle,
  FaUsers,
  FaPhone,
  FaLink,
  FaFileAlt,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from 'react-icons/fa';

import logo from '../assets/Bright_koda_logo.png';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <FaHome /> },
    { path: '/tags', label: 'Tags', icon: <FaTags /> },
    { path: '/questions', label: 'Questions', icon: <FaQuestionCircle /> },
    { path: '/leads', label: 'Leads', icon: <FaUsers /> },
    { path: '/calls', label: 'Calls', icon: <FaPhone /> },
    { path: '/webhooks', label: 'Webhooks', icon: <FaLink /> },
    { path: '/responses', label: 'Responses', icon: <FaFileAlt /> },
  ];

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen
        z-[9999]
        bg-[#2f1e14] text-gray-100
        shadow-xl
        overflow-visible
        transition-all duration-300
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
      `}
    >
      {/* Logo */}
      <div className="flex flex-col items-center py-6 border-b border-[#4b2f1d]">
        <img
          src={logo}
          alt="Logo"
          className={`transition-all duration-300 ${
            collapsed ? 'w-10' : 'w-28'
          }`}
        />
        {!collapsed && (
          <h2 className="mt-3 text-sm tracking-wide text-[#f5e6d3]">
            AI Voice Lead
          </h2>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
          absolute top-6 right-4
          w-8 h-8
          bg-[#814c27]
          rounded-full
          flex items-center justify-center
          text-white
          shadow-lg
          hover:bg-[#9b5b38]
          transition-all duration-200
          z-10
        "
      >
        {collapsed ? (
          <FaAngleDoubleRight className="text-sm" />
        ) : (
          <FaAngleDoubleLeft className="text-sm" />
        )}
      </button>

      {/* Menu */}
      <nav className="mt-6 px-2 space-y-1">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-4
                px-4 py-3
                rounded-lg
                text-sm font-medium
                transition-colors
                ${
                  active
                    ? 'bg-[#5c3f2a] text-[#ffd580]'
                    : 'text-gray-300 hover:bg-[#3e2b21] hover:text-[#ffd580]'
                }
              `}
            >
              <span className="text-lg min-w-[22px]">{item.icon}</span>

              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
