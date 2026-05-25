import '../SideBar.css';
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiBox,
  FiClipboard,
  FiTag,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { BiHomeAlt } from 'react-icons/bi';
import { useState } from "react";
import toast from "react-hot-toast";

export default function SideBar() {

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");

    toast.success("Logged out successfully");

    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>

      {/* Mobile Topbar */}
      <div className="mobile-topbar">

        <h2 className="mobile-logo">
          Admin Panel
        </h2>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMenu}
        ></div>
      )}

      <aside className={`sidebar ${menuOpen ? "show-sidebar" : ""}`}>

        <nav className="sidebar-nav">

          <NavLink
            to="/dashboard"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span className="icon"><BiHomeAlt /></span>
            Dashboard
          </NavLink>

          <NavLink
            to="/addproduct"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span className="icon"><FiBox /></span>
            Add Products
          </NavLink>

          <NavLink
            to="/order"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span className="icon"><FiClipboard /></span>
            Orders
          </NavLink>

          <NavLink
            to="/manageproduct"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span className="icon"><FiClipboard /></span>
            Manage Products
          </NavLink>

          <NavLink
            to="/promotion"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span className="icon"><FiTag /></span>
            Promotions
          </NavLink>

           {/* <NavLink
            to="/inventory"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span className="icon"><FiTag /></span>
            Inventory
          </NavLink> */}

        </nav>

        <div className="sidebar-bottom">

          <div className="user-profile">

            <img
              src="https://i.pravatar.cc/150?img=47"
              alt="Admin"
              className="avatar"
            />

            <div className="user-info">
              <strong>Admin</strong>
            </div>

          </div>

          <button
            className="ad-logout-btn"
            onClick={handleLogout}
          >
            Log Out
          </button>

        </div>

      </aside>

    </>
  );
}