import React, { useState } from 'react';
import '../Promotion.css';
import { FiGrid, FiPlusSquare, FiCheckSquare, FiClock, FiBox, FiSearch, FiTag,  FiShoppingBag,FiClipboard, FiChevronDown, FiCalendar } from 'react-icons/fi';
import { MdOutlineDiamond } from 'react-icons/md';
import { BiHomeAlt, BiLogOut } from 'react-icons/bi';
import {FiAlertTriangle,FiArchive } from 'react-icons/fi';
import SideBar from '../components/SideBar';
function Promotion() {
  const [discountType, setDiscountType] = useState('percentage');
  const [displayBanner, setDisplayBanner] = useState(false);

  const activePromos = [
    { id: 1, title: 'Spring Sale', subtitle: '20% Off All Items', price: '346.00', stock: '2n Stock', status: 'active' },
    { id: 2, title: 'Flash Deal', subtitle: '30% Off Rings Today!', price: '750.00', stock: '1n Stock', status: 'active' },
    { id: 3, title: 'Holiday Clearance', subtitle: 'Selected Items Only', price: '726.00', stock: 'Out of Stock', status: 'out' },
  ];

  return (
    <div className="admin-layout">

         <SideBar/>

      {/* Main Content Area */}
      <main className="main-content-area">
        {/* Top Metric Cards */}
        <section className="promo-metrics">
          <div className="promo-card active-card">
            <div className="promo-icon-box pink-bg">🛍️</div>
            <div className="promo-card-data">
              <span>Active Promotions</span>
              <h3>2</h3>
            </div>
          </div>

          <div className="promo-card">
            <div className="promo-icon-box blue-bg">📅</div>
            <div className="promo-card-data">
              <span>Upcoming Promotions</span>
              <h3>1</h3>
            </div>
          </div>

          <div className="promo-card">
            <div className="promo-icon-box gray-bg">🕒</div>
            <div className="promo-card-data">
              <span>Expired Promotions</span>
              <h3>3</h3>
            </div>
          </div>

          <div className="header-search-icons">
            <FiSearch className="top-action-icon" />
            <div className="top-bag-wrapper">
              <FiShoppingBag className="top-action-icon" />
              <span className="bag-badge">1</span>
            </div>
          </div>
        </section>

        {/* Current Promotions Panel */}
        <section className="content-panel">
          <h3 className="panel-title">Current Promotions</h3>
          
          <div className="promo-table-wrapper">
            <table className="promo-table">
              <thead>
                <tr>
                  <th>Product / Campaign</th>
                  <th>Value/Price</th>
                  <th>Stock Status</th>
                  <th className="actions-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activePromos.map((promo) => (
                  <tr key={promo.id}>
                    <td>
                      <div className="promo-info-cell">
                        <strong>{promo.title}</strong>
                        <span>{promo.subtitle}</span>
                      </div>
                    </td>
                    <td className="price-bold">GHC {promo.price}</td>
                    <td>
                      <span className={`stock-pill ${promo.status === 'out' ? 'out-pill' : ''}`}>
                        {promo.stock}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button className="action-btn edit-btn">Edit</button>
                        <button className="action-btn pause-btn">Pause</button>
                        <button className="action-btn delete-btn">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Create New Promotion Panel */}
        <section className="content-panel form-panel">
          <h3 className="panel-title">Create New Promotion</h3>
          
          <form className="create-promo-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-left-col">
              <div className="form-field">
                <input type="text" placeholder="Promotion Title" className="panel-input" />
              </div>

              <div className="form-field radio-row">
                <label className="radio-label">Discount Type</label>
                <div className="radio-options">
                  <label className="radio-container">
                    <input 
                      type="radio" 
                      name="discountType" 
                      checked={discountType === 'percentage'} 
                      onChange={() => setDiscountType('percentage')} 
                    />
                    <span className="custom-radio"></span>
                    Percentage %
                  </label>
                  <label className="radio-container">
                    <input 
                      type="radio" 
                      name="discountType" 
                      checked={discountType === 'fixed'} 
                      onChange={() => setDiscountType('fixed')} 
                    />
                    <span className="custom-radio"></span>
                    Fixed Amount (₵)
                  </label>
                </div>
              </div>

              <div className="form-field">
                <input type="text" placeholder="Discount Value" className="panel-input" />
              </div>

              <div className="form-field select-field">
                <select className="panel-input panel-select" defaultValue="">
                  <option value="" disabled hidden>Select Products or Categories</option>
                  <option value="all">All Jewelry</option>
                  <option value="rings">Rings Only</option>
                  <option value="necklaces">Necklaces Only</option>
                </select>
                <FiChevronDown className="field-select-arrow" />
              </div>

              <div className="form-field date-range-row">
                <div className="date-input-wrapper">
                  <FiCalendar className="date-icon" />
                  <input type="text" placeholder="April 20, 2026" className="panel-input date-input" />
                </div>
                <div className="date-input-wrapper">
                  <FiCalendar className="date-icon" />
                  <input type="text" placeholder="April 25, 2026" className="panel-input date-input" />
                </div>
              </div>
            </div>

            <div className="form-right-col">
              <div className="date-picker-block">
                <label>Start Date</label>
                <div className="picker-box">
                  <span>Set Date</span>
                  <FiChevronDown />
                </div>
              </div>

              <div className="date-picker-block">
                <label>End Date</label>
                <div className="picker-box">
                  <span>End Dates</span>
                  <FiChevronDown />
                </div>
              </div>
            </div>

            <div className="form-footer-actions">
              <div className="banner-toggle" onClick={() => setDisplayBanner(!displayBanner)}>
                <div className={`switch-pill ${displayBanner ? 'active-pink' : ''}`}>
                  <div className="switch-circle"></div>
                </div>
                <span className="toggle-text">Display Promo Banner on Store</span>
              </div>

              <div className="submit-buttons">
                <button type="submit" className="btn-save-promo">Save Promotion</button>
                <button type="button" className="btn-flash-sale">Start Flash Sale</button>
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Promotion;
