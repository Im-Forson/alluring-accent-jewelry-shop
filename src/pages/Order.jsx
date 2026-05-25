import React, { useState, useEffect, useRef } from 'react';
import '../Order.css';
import {
  FiSearch, FiBell, FiChevronDown, FiDownload, FiX, FiAlertTriangle, FiMenu
} from 'react-icons/fi';
import SideBar from '../components/SideBar';

function Order() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Interactive Dropdown States
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const bellRef = useRef(null);

  // Modal State for viewing details
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sync data from local database storage on load
  useEffect(() => {
    loadOrders();

    const handleOutsideClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem("customerOrders")) || [
      {
        id: '#ORD-1023',
        customer: 'Emma White',
        items: '2 items',
        total: '450.00',
        status: 'Completed',
        date: 'May 22, 2026',
        avatar: 'https://i.pravatar.cc/150?img=32',
        mainAction: 'View',
        altAction: 'Delete',
        customerDetails: { phone: '+233 24 123 4567', email: 'emma@example.com', address: '12 Anis street, Sowutoum, Accra' },
        paymentMethod: 'Mobile Money (MTN)',
        itemBreakdown: [
          { name: 'Classic Gold Ring', qty: 1, price: '250.00' },
          { name: 'Silver Hoop Earrings', qty: 1, price: '200.00' }
        ]
      },
      {
        id: '#ORD-1024',
        customer: 'Michael Brown',
        items: '1 item',
        total: '750.00',
        status: 'Pending',
        date: 'May 22, 2026',
        avatar: 'https://i.pravatar.cc/150?img=12',
        mainAction: 'View',
        altAction: 'Cancel',
        customerDetails: { phone: '+233 55 987 6543', email: 'mbrown@example.com', address: 'Pokuase Interchange, Near Genius Brain' },
        paymentMethod: 'Visa / Mastercard',
        itemBreakdown: [
          { name: 'Diamond Pendant Necklace', qty: 1, price: '750.00' }
        ]
      },
      {
        id: '#ORD-1025',
        customer: 'Olivia Wilson',
        items: '3 items',
        total: '320.00',
        status: 'Shipped',
        date: 'May 21, 2026',
        avatar: 'https://i.pravatar.cc/150?img=43',
        mainAction: 'View',
        altAction: 'Track',
        customerDetails: { phone: '+233 20 555 0192', email: 'olivia.w@example.com', address: '77 Kwashieman Road, Accra' },
        paymentMethod: 'Mobile Money (Telecel)',
        itemBreakdown: [
          { name: 'Rose Gold Bracelet', qty: 1, price: '120.00' },
          { name: 'Minimalist Band Ring', qty: 2, price: '100.00' }
        ]
      },
      {
        id: '#ORD-1026',
        customer: 'William Davis',
        items: '2 items',
        total: '610.00',
        status: 'Cancelled',
        date: 'May 20, 2026',
        avatar: 'https://i.pravatar.cc/150?img=52',
        mainAction: 'View',
        altAction: 'Delete',
        customerDetails: { phone: '+233 27 444 3322', email: 'wdavis@example.com', address: 'Apenkwa Highway, Lapaz, Accra' },
        paymentMethod: 'Cash on Delivery',
        itemBreakdown: [
          { name: 'Custom Name Anklet', qty: 2, price: '305.00' }
        ]
      },
      {
        id: '#ORD-1027',
        customer: 'Sophia Johnson',
        items: '1 item',
        total: '150.00',
        status: 'Completed',
        date: 'May 18, 2026',
        avatar: 'https://i.pravatar.cc/150?img=49',
        mainAction: 'View',
        altAction: 'Delete',
        customerDetails: { phone: '+233 54 321 0987', email: 'sophia.j@example.com', address: 'Dansoman Estate, Accra' },
        paymentMethod: 'Mobile Money (AT)',
        itemBreakdown: [
          { name: 'Beaded Charm Choker', qty: 1, price: '150.00' }
        ]
      }
    ];
    setOrders(storedOrders);
  };

  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status.toLowerCase() === 'pending').length;
  const completedOrdersCount = orders.filter(o => o.status.toLowerCase() === 'completed').length;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id, newStatus) => {
    const updated = orders.map(order => {
      if (order.id === id) {
        let derivedAltAction = order.altAction;
        if (newStatus === 'Completed' || newStatus === 'Cancelled') {
          derivedAltAction = 'Delete';
        } else if (newStatus === 'Shipped') {
          derivedAltAction = 'Track';
        }

        return {
          ...order,
          status: newStatus,
          altAction: derivedAltAction
        };
      }
      return order;
    });
    localStorage.setItem("customerOrders", JSON.stringify(updated));
    setOrders(updated);

    if (selectedOrder && selectedOrder.id === id) {
      const liveOrder = updated.find(o => o.id === id);
      setSelectedOrder(liveOrder);
    }
  };

  const handleDeleteOrder = (id) => {
    const confirmed = window.confirm(`Permanently remove entry ${id} from ledger?`);
    if (!confirmed) return;

    const updated = orders.filter(order => order.id !== id);
    localStorage.setItem("customerOrders", JSON.stringify(updated));
    setOrders(updated);

    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder(null);
    }
  };

  const handleTrackOrder = (order) => {
    alert(`Tracking Package for ${order.id}\nCourier Status: In Transit\nDestination: ${order.customerDetails.address}`);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `order_ledger_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className={`admin-layout ${sidebarOpen ? 'sidebar-active' : ''}`}>
      <SideBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <main className="orders-main-area">
        <header className="orders-header-bar">
          <div className="header-title-container">
            <button
              type="button"
              className="mobile-hamburger-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu size={24} />
            </button>
            <h1>Orders Overview</h1>
          </div>

          <div className="header-actions">
            <div ref={bellRef} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <FiBell
                className="header-icon"
                style={{ cursor: 'pointer', color: isNotificationOpen ? '#d6336c' : 'inherit' }}
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              />
              {pendingOrdersCount > 0 && (
                <span style={badgeCountStyle}>{pendingOrdersCount}</span>
              )}

              {isNotificationOpen && (
                <div style={dropdownAlertStyle}>
                  <div style={dropdownHeaderStyle}>Awaiting Fulfillment</div>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {pendingOrdersCount === 0 ? (
                      <div style={{ padding: '12px', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>No new actions needed.</div>
                    ) : (
                      orders.filter(o => o.status.toLowerCase() === 'pending').map(o => (
                        <div key={`alert-${o.id}`} style={dropdownItemStyle} onClick={() => { setSelectedOrder(o); setIsNotificationOpen(false); }} className="dropdown-alert-item-clickable">
                          <FiAlertTriangle style={{ color: '#f59e0b', marginRight: '8px', flexShrink: 0 }} />
                          <span><strong>{o.customer}</strong> created {o.id}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <img src="https://i.pravatar.cc/150?img=47" alt="Profile" className="top-profile-img" />
          </div>
        </header>

        {/* Analytic Counter Cards Grid */}
        <section className="counters-summary-grid">
          <div className="counter-card card-pink">
            <div className="counter-icon-box">🛒</div>
            <div className="counter-data">
              <span>Total Orders</span>
              <h3>{totalOrdersCount}</h3>
            </div>
          </div>

          <div className="counter-card card-yellow">
            <div className="counter-icon-box">🪙</div>
            <div className="counter-data">
              <span>Pending Orders</span>
              <h3>{pendingOrdersCount}</h3>
            </div>
          </div>

          <div className="counter-card card-green">
            <div className="counter-icon-box">✓</div>
            <div className="counter-data">
              <span>Completed Orders</span>
              <h3>{completedOrdersCount}</h3>
            </div>
          </div>
        </section>

        {/* Toolbar Strip */}
        <section className="orders-toolbar-strip">
          <div className="toolbar-search-input-wrapper">
            <FiSearch className="search-embedded-icon" />
            <input
              type="text"
              placeholder="Search by ID or customer..."
              className="toolbar-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={clearSearchBtnStyle}><FiX /></button>
            )}
          </div>

          <div className="toolbar-select-wrapper">
            <select
              className="toolbar-dropdown"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <FiChevronDown className="dropdown-arrow-embedded" />
          </div>

          <div className="toolbar-select-wrapper export-wrapper">
            <button className="btn-export-trigger" onClick={handleExportData}>
              <FiDownload /> Export Logs
            </button>
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
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                      No matching order invoice logs found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="order-id-bold">{order.id}</td>
                      <td>
                        <div className="customer-profile-cell">
                          <img src={order.avatar || "https://via.placeholder.com/150"} alt={order.customer} className="customer-thumb-circle" />
                          <span className="customer-name-text">{order.customer}</span>
                        </div>
                      </td>
                      <td className="item-count-text">{order.items}</td>
                      <td className="total-price-text">₵ {order.total}</td>
                      <td>
                        <span className={`status-badge-pill pill-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="date-cell-text">{order.date}</td>
                      <td>
                        <div className="row-action-buttons-cluster">
                          {/* FIXED: Pending orders now get both Approve and View layouts seamlessly */}
                          {order.status === 'Pending' && (
                            <button
                              className="btn-row-main approve-highlight"
                              onClick={() => handleUpdateStatus(order.id, 'Completed')}
                            >
                              Approve
                            </button>
                          )}
                          
                          <button
                            className="btn-row-main view-action-trigger"
                            onClick={() => setSelectedOrder(order)}
                          >
                            View
                          </button>

                          {order.altAction === 'Delete' ? (
                            <button
                              className="btn-row-alt alt-delete"
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              Delete
                            </button>
                          ) : order.altAction === 'Track' ? (
                            <button
                              className="btn-row-alt alt-track"
                              onClick={() => handleTrackOrder(order)}
                            >
                              Track
                            </button>
                          ) : (
                            <button
                              className="btn-row-alt alt-cancel"
                              onClick={() => handleUpdateStatus(order.id, 'Cancelled')}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <footer className="ledger-pagination-footer">
            <span className="entries-counter-label">Showing 1 to {filteredOrders.length} of {orders.length} orders</span>
            <div className="pagination-action-cluster">
              <button className="page-index-btn active-idx">1</button>
            </div>
          </footer>
        </section>
      </main>

      {/* INSPECTION DIALOG OVERLAY (MODAL) - Classes added for global responsive CSS syncing */}
      {selectedOrder && (
        <div className="modal-overlay-container" style={modalOverlayStyle} onClick={() => setSelectedOrder(null)}>
          <div className="modal-content-card" style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Invoice Inspection Details</h2>
                <span style={{ fontSize: '12px', color: '#64748b' }}>System ID: {selectedOrder.id}</span>
              </div>
              <button style={closeModalBtnStyle} onClick={() => setSelectedOrder(null)}><FiX size={18} /></button>
            </div>

            {/* Scrollable Container Area */}
            <div className="modal-scrollable-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={selectedOrder.avatar} alt="" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px' }}>{selectedOrder.customer}</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Logged on {selectedOrder.date}</p>
                  </div>
                </div>
                <span className={`status-badge-pill pill-${selectedOrder.status.toLowerCase()}`}>{selectedOrder.status}</span>
              </div>

              <div>
                <h5 style={panelSectionHeadingStyle}>Customer & Fulfillment Details</h5>
                <div style={panelCardStyle}>
                  <p style={dataRowStyle}><strong>Phone:</strong> <span>{selectedOrder.customerDetails?.phone || 'N/A'}</span></p>
                  <p style={dataRowStyle}><strong>Email:</strong> <span>{selectedOrder.customerDetails?.email || 'N/A'}</span></p>
                  <p style={dataRowStyle} className="address-row">
                    <strong>Fulfillment Address:</strong> 
                    <span style={{ textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>{selectedOrder.customerDetails?.address || 'N/A'}</span>
                  </p>
                </div>
              </div>

              <div>
                <h5 style={panelSectionHeadingStyle}>Payment System Logs</h5>
                <div style={panelCardStyle}>
                  <p style={dataRowStyle}><strong>Gateway Channel:</strong> <span>{selectedOrder.paymentMethod || 'N/A'}</span></p>
                  <p style={dataRowStyle}><strong>Transaction Status:</strong> <span style={{ color: selectedOrder.status === 'Cancelled' ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{selectedOrder.status === 'Pending' ? 'Authorized / Escrow Held' : selectedOrder.status === 'Cancelled' ? 'Voided' : 'Settled Successfully'}</span></p>
                </div>
              </div>

              <div>
                <h5 style={panelSectionHeadingStyle}>Product Itemized Breakdown</h5>
                <div style={{ ...panelCardStyle, padding: '8px 0' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '280px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#64748b', textAlign: 'left' }}>
                          <th style={{ padding: '8px 16px' }}>Product Unit</th>
                          <th style={{ padding: '8px 16px', textAlign: 'center' }}>Qty</th>
                          <th style={{ padding: '8px 16px', textAlign: 'right' }}>Unit Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.itemBreakdown?.map((item, idx) => (
                          <tr key={`item-${idx}`} style={{ borderBottom: idx !== selectedOrder.itemBreakdown.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                            <td style={{ padding: '8px 16px', color: '#334155', fontWeight: '500' }}>{item.name}</td>
                            <td style={{ padding: '8px 16px', textAlign: 'center', color: '#64748b' }}>{item.qty}</td>
                            <td style={{ padding: '8px 16px', textAlign: 'right', color: '#0f172a' }}>₵{item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ borderTop: '2px dashed #e2e8f0', marginTop: '8px', padding: '12px 16px 4px 16px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>
                    <span>Total Bill:</span>
                    <span style={{ color: '#d6336c' }}>₵ {selectedOrder.total}</span>
                  </div>
                </div>
              </div>

              {selectedOrder.status === 'Pending' && (
                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '10px' }}>
                  <button onClick={() => handleUpdateStatus(selectedOrder.id, 'Completed')} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '6px', backgroundColor: '#10b981', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Approve Transaction</button>
                  <button onClick={() => handleUpdateStatus(selectedOrder.id, 'Cancelled')} style={{ padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#fff', color: '#64748b', cursor: 'pointer' }}>Reject</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const badgeCountStyle = { position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#d6336c', color: '#fff', fontSize: '10px', borderRadius: '9999px', padding: '2px 6px', fontWeight: 'bold' };
const dropdownAlertStyle = { position: 'absolute', right: 0, top: '30px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', width: '260px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 100 };
const dropdownHeaderStyle = { padding: '10px 12px', borderBottom: '1px solid #f1f5f9', fontWeight: 'bold', fontSize: '13px', color: '#1e293b' };
const dropdownItemStyle = { display: 'flex', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid #f8fafc', fontSize: '12px', color: '#334155', cursor: 'pointer' };
const clearSearchBtnStyle = { border: 'none', background: 'none', position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center' };

// Fixed overlay initialization values
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'flex-end', zIndex: 1000 };
const modalContentStyle = { width: '100%', maxWidth: '460px', height: '100%', backgroundColor: '#fff', boxShadow: '-4px 0 25px -5px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column' };
const modalHeaderStyle = { padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' };
const closeModalBtnStyle = { border: 'none', background: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '4px' };
const panelSectionHeadingStyle = { margin: '0 0 8px 0', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' };
const panelCardStyle = { border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', backgroundColor: '#f8fafc' };
const dataRowStyle = { display: 'flex', justifyContent: 'space-between', margin: '6px 0', fontSize: '13px', color: '#334155' };

export default Order;