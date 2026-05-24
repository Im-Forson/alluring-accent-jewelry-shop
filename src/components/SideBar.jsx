import '../SideBar.css';
import { Link } from "react-router";
import { FiGrid, FiPlusSquare, FiCheckSquare, FiClock, FiBox, FiCamera, FiChevronDown } from 'react-icons/fi';
import { FiSearch, FiBell, FiTag, FiAlertTriangle, FiClipboard, FiArchive } from 'react-icons/fi';
import { BiHomeAlt, BiLogOut } from 'react-icons/bi';
import { MdOutlineDiamond } from 'react-icons/md';

export default function SideBar () {
    return (

         <aside className="sidebar">
                 
        
                <nav className="sidebar-nav " >
                  <a href="#" className="nav-item active">
                    <span className="icon"><BiHomeAlt /></span> Dashboard
                  </a>
                  <a href="#" className="nav-item">
                    <span className="icon"><FiBox /></span> Products
                  </a>
                  <a href="#" className="nav-item">
                    <span className="icon"><FiClipboard /></span> Orders
                  </a>
                  <a href="#" className="nav-item">
                    <span className="icon"><FiTag /></span> Promotions
                  </a>
                  <a href="#" className="nav-item">
                    <span className="icon"><FiArchive /></span> Inventory
                  </a>
                </nav>
        
                <div className="sidebar-bottom">
                  <div className="user-profile">
                    <img src="https://i.pravatar.cc/150?img=47" alt="Admin" className="avatar" />
                    <div className="user-info">
                      <strong>Admin</strong>
                    </div>
                  </div>
                  <button className="ad-logout-btn">
                    Log Out
                  </button>
                </div>
              </aside>


    
    );
}