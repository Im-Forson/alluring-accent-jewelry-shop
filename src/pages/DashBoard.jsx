import React from 'react';
import '../DashBoard.css';

// Import the specific icons we need
import { FiSearch, FiBell, FiTag, FiAlertTriangle, FiBox, FiClipboard, FiArchive } from 'react-icons/fi';
import { BiHomeAlt, BiLogOut, BiSidebar } from 'react-icons/bi';
import { MdOutlineDiamond } from 'react-icons/md';
import SideBar from '../components/SideBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function DashBoard() {
  const recentOrders = [
    { id: 1, name: 'Emma White', amount: '280.00', time: 'Just Now', color: '#fce3b3' },
    { id: 2, name: 'Michael Brown', amount: '750.00', time: 'Today', color: '#fce3b3' },
    { id: 3, name: 'Olivia Wilson', amount: '320.00', time: 'Today', color: '#fce3b3' },
    { id: 4, name: 'William Davis', amount: '610.00', time: 'Yesterday', color: '#f4f4f4' },
    { id: 5, name: 'Sophia Johnson', amount: '450.00', time: '2 Days Ago', color: '#f4f4f4' },
  ];

  return (
    <div className="dashboard-container">


      <SideBar />



      {/* Main Content */}
      <main className="main-content">

        {/* Top Header */}
        <header className="top-header">
          <h1>Welcome back, Admin!</h1>
          <div className="header-actions">
            <button className="icon-btn"><FiSearch /></button>
            <button className="icon-btn badge-btn">
              <FiBell /> <span className="badge">7</span>
            </button>
            <img src="https://i.pravatar.cc/150?img=47" alt="Admin" className="header-avatar" />
          </div>
        </header>

        {/* Top Metric Cards */}
        <section className="metrics-grid">
          <div className="metric-card">
            <div className="icon-wrapper yellow"><FiBox /></div>
            <div className="metric-data">
              <span className="label">Total Products</span>
              <h3>128</h3>
            </div>
          </div>
          <div className="metric-card">
            <div className="icon-wrapper pink"><FiBell /></div>
            <div className="metric-data">
              <span className="label">Out of Stock</span>
              <h3>6</h3>
            </div>
          </div>
          <div className="metric-card">
            <div className="icon-wrapper orange"><FiAlertTriangle /></div>
            <div className="metric-data">
              <span className="label">Low Stock</span>
              <h3>4</h3>
            </div>
          </div>

        </section>

        {/* ... The rest of the App.jsx code for Stats & Orders remains exactly the same ... */}

        {/* Middle Section: Stats & Orders */}

        <section className="dashboard-row">
          <div className="dashboard-card">
            <h3 className="card-title">Today's Stats</h3>
            <div className="stats-list">
              <div className="stat-item">
                <span>Today's Sales</span>
                <strong>GHC 2,450.00</strong>
              </div>
              <div className="stat-item">
                <span>Total Orders</span>
                <strong>32</strong>
              </div>
              <div className="stat-item">
                <span>Pending Orders</span>
                <strong>5</strong>
              </div>
              <div className="stat-item">
                <span>New Customers</span>
                <strong>8</strong>
              </div>
            </div>
          </div>

          <div className="dashboard-card recent-orders">
            <h3 className="card-title">Recent Orders</h3>
            <div className="orders-list">
              {recentOrders.map(order => (
                <div className="order-item" key={order.id}>
                  <i class="fa-solid fa-user"></i>
                  <div className="order-user">
                    <span>{order.name}</span>
                  </div>
                  <strong>GHC {order.amount}</strong>
                  <span className="status-badge" style={{ backgroundColor: order.color }}>
                    {order.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Section: Alerts & Promotions */}
        <section className="dashboard-row">
          <div className="dashboard-card alerts-card">
            <h3 className="card-title">Low Stock Alerts</h3>
            <ul className="simple-list">
              <li><span className="bullet orange"></span> Gold Hoop Earrings - Only 3 Left!</li>
              <li><span className="bullet orange"></span> Pearl Pendant Necklace - Almost Sold Out!</li>
            </ul>
          </div>

          <div className="dashboard-card promos-card">
            <h3 className="card-title">Active Promotions</h3>
            <ul className="simple-list">
              <li><span className="bullet yellow"></span> Spring Sale – 20% Off All Jewelry <span className="arrow">›</span></li>
              <li><span className="bullet yellow"></span> Flash Deal – 30% Off Diamond Rings <span className="arrow">›</span></li>
            </ul>
            <div className="card-action-right">
              <button className="manage-btn">Manage Promotions</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashBoard;
