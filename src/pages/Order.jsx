import React from 'react';
import '../Order.css';
import { FiGrid, FiBox, FiCheckSquare, FiClock,FiTag,  FiSearch,FiClipboard, FiBell, FiChevronDown, FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdOutlineDiamond } from 'react-icons/md';
import { BiHomeAlt, BiLogOut } from 'react-icons/bi';
import { FiAlertTriangle,   FiArchive } from 'react-icons/fi';
import SideBar from '../components/SideBar';
function Order() {
  const orderLogs = [
    { id: '#ORD-1023', customer: 'Emma White', items: '2 items', total: '450.00', status: 'Completed', date: 'May 22, 2026', avatar: 'https://i.pravatar.cc/150?img=32', mainAction: 'View', altAction: 'Delete' },
    { id: '#ORD-1024', customer: 'Michael Brown', items: '1 item', total: '750.00', status: 'Pending', date: 'May 22, 2026', avatar: 'https://i.pravatar.cc/150?img=12', mainAction: 'View', altAction: 'Cancel' },
    { id: '#ORD-1025', customer: 'Olivia Wilson', items: '3 items', total: '320.00', status: 'Shipped', date: 'May 21, 2026', avatar: 'https://i.pravatar.cc/150?img=43', mainAction: 'View', altAction: 'Track' },
    { id: '#ORD-1026', customer: 'William Davis', items: '2 items', total: '610.00', status: 'Cancelled', date: 'May 20, 2026', avatar: 'https://i.pravatar.cc/150?img=52', mainAction: 'View', altAction: 'Delete' },
    { id: '#ORD-1027', customer: 'Sophia Johnson', items: '1 item', total: '150.00', status: 'Completed', date: 'May 18, 2026', avatar: 'https://i.pravatar.cc/150?img=49', mainAction: 'View', altAction: 'Delete' },
  ];

  return (
    <div className="admin-layout">

      <SideBar/>


      {/* Main Canvas Context */}
      <main className="orders-main-area">
        {/* Top App Header bar */}
        <header className="orders-header-bar">
          <h1>Orders</h1>
          <div className="header-actions">
            <FiSearch className="header-icon" />
            <FiBell className="header-icon" />
            <div className="badge-wrapper">
            </div>
            <img src="https://i.pravatar.cc/150?img=47" alt="Profile" className="top-profile-img" />
          </div>
        </header>

        {/* Uppermost Analytic Counter Cards Grid */}
        <section className="counters-summary-grid">
          <div className="counter-card card-pink">
            <div className="counter-icon-box"><i class="fa-solid fa-cart-shopping"></i></div>
            <div className="counter-data">
              <span>Total Orders</span>
              <h3>240</h3>
            </div>
          </div>

          <div className="counter-card card-yellow">
            <div className="counter-icon-box">🪙</div>
            <div className="counter-data">
              <span>Pending Orders</span>
              <h3>8</h3>
            </div>
          </div>

          <div className="counter-card card-green">
            <div className="counter-icon-box">✓</div>
            <div className="counter-data">
              <span>Completed Orders</span>
              <h3>185</h3>
            </div>
          </div>
        </section>

        {/* Data Searching and Filter Action Strip */}
        <section className="orders-toolbar-strip">
          <div className="toolbar-search-input-wrapper">
            <FiSearch className="search-embedded-icon" />
            <input type="text" placeholder="Search orders..." className="toolbar-search-input" />
          </div>

          <div className="toolbar-select-wrapper">
            <select className="toolbar-dropdown" defaultValue="all">
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <FiChevronDown className="dropdown-arrow-embedded" />
          </div>

          <div className="toolbar-select-wrapper export-wrapper">
            <button className="btn-export-trigger">
              <FiDownload /> Export Orders
            </button>
            <FiChevronDown className="dropdown-arrow-embedded" />
          </div>
        </section>

        {/* Master Data Ledger Panel */}
        <section className="ledger-table-panel">
          <div className="table-responsive-wrapper">
            <table className="orders-dashboard-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total (₵)</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="actions-column-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orderLogs.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id-bold">{order.id}</td>
                    <td>
                      <div className="customer-profile-cell">
                        <img src={order.avatar} alt={order.customer} className="customer-thumb-circle" />
                        <span className="customer-name-text">{order.customer}</span>
                      </div>
                    </td>
                    <td className="item-count-text">{order.items}</td>
                    <td className="total-price-text">GHC {order.total}</td>
                    <td>
                      <span className={`status-badge-pill pill-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="date-cell-text">{order.date}</td>
                    <td>
                      <div className="row-action-buttons-cluster">
                        <button className="btn-row-main">{order.mainAction}</button>
                        <button className={`btn-row-alt alt-${order.altAction.toLowerCase()}`}>{order.altAction}</button>
                        <button className="btn-row-dropdown-trigger"><FiChevronDown /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Data Pagination Controls Footer */}
          <footer className="ledger-pagination-footer">
            <span className="entries-counter-label">Showing 1 to 10 of 45 orders</span>
            <div className="pagination-action-cluster">
              <div className="prev-dropdown-btn-wrapper">
                <button className="btn-prev-page">Previous</button>
                <FiChevronDown className="prev-dropdown-arrow" />
              </div>
              
              <button className="page-index-btn active-idx">1</button>
              <button className="page-index-btn">2</button>
              <button className="page-index-btn">3</button>
              <span className="pagination-gap-ellipsis">...</span>
              <button className="page-index-btn">5</button>

              <div className="next-dropdown-btn-wrapper">
                <button className="btn-next-page">Next</button>
                <FiChevronDown className="next-dropdown-arrow" />
              </div>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default Order;