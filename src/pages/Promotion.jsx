import React, { useState, useEffect } from 'react';
import '../Promotion.css';
import { 
  FiSearch, FiShoppingBag, FiChevronDown, FiCalendar, FiX, FiClock, FiPercent, FiDollarSign 
} from 'react-icons/fi';
import SideBar from '../components/SideBar';
import { useAdminBackButton } from '../hooks/useAdminBackButton.jsx';
import toast from 'react-hot-toast';

function Promotion() {
  // ==========================================
  // STATE MANAGEMENT & INITIALIZATION
  // ==========================================
  const [promos, setPromos] = useState([]);
  useAdminBackButton();
  
  // Create New Promotion Form States
  const [promoTitle, setPromoTitle] = useState("");
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState("");
  const [targetCategory, setTargetCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [displayBanner, setDisplayBanner] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Flash Sale Setup Panel State
  const [isFlashSaleModalOpen, setIsFlashSaleModalOpen] = useState(false);
  const [flashDiscount, setFlashDiscount] = useState("50");
  const [flashDuration, setFlashDuration] = useState("3"); // in hours
  const [flashCategory, setFlashCategory] = useState("all");

  // Sync data with local engine database on render lifecycle
  useEffect(() => {
    const storedPromos = JSON.parse(localStorage.getItem("storePromotions")) || [
      { id: 1, title: 'Spring Sale', subtitle: '20% Off All Items', price: '346.00', stock: '21 in Stock', status: 'active', type: 'percentage', value: '20', category: 'all', start: '2026-04-20', end: '2026-04-25', banner: true },
      { id: 2, title: 'Flash Deal', subtitle: '30% Off Rings Today!', price: '750.00', stock: '12 in Stock', status: 'active', type: 'percentage', value: '30', category: 'rings', start: '2026-05-24', end: '2026-05-25', banner: true },
      { id: 3, title: 'Holiday Clearance', subtitle: 'Selected Items Only', price: '726.00', stock: 'Out of Stock', status: 'expired', type: 'fixed', value: '100', category: 'necklaces', start: '2026-05-01', end: '2026-05-10', banner: false }
    ];
    setPromos(storedPromos);
    localStorage.setItem("storePromotions", JSON.stringify(storedPromos));
  }, []);

  // ==========================================
  // REAL-TIME METRIC DYNAMIC CALCULATION
  // ==========================================
  const activeCount = promos.filter(p => p.status === 'active').length;
  const upcomingCount = promos.filter(p => p.status === 'upcoming').length;
  const expiredCount = promos.filter(p => p.status === 'expired').length;

  // ==========================================
  // CORE PROMOTION ADMINISTRATIVE ENGINES
  // ==========================================
  
  const handleSavePromotion = (e) => {
    e.preventDefault();
    if (!promoTitle || !discountValue || !targetCategory) {
      toast.error("Please fill out all primary promotion fields.");
      return;
    }

    let updatedPromos;
    const formattedSubtitle = discountType === 'percentage' 
      ? `${discountValue}% Off ${targetCategory === 'all' ? 'All Items' : targetCategory}`
      : `GHC ${discountValue} Off ${targetCategory === 'all' ? 'All Items' : targetCategory}`;

    if (editingId) {
      updatedPromos = promos.map(p => {
        if (p.id === editingId) {
          return {
            ...p,
            title: promoTitle,
            subtitle: formattedSubtitle,
            type: discountType,
            value: discountValue,
            category: targetCategory,
            start: startDate || p.start,
            end: endDate || p.end,
            banner: displayBanner
          };
        }
        return p;
      });
      setEditingId(null);
      toast.success("Campaign updated successfully!");
    } else {
      const newPromo = {
        id: Date.now(),
        title: promoTitle,
        subtitle: formattedSubtitle,
        price: '0.00', 
        stock: 'In Stock',
        status: 'active',
        type: discountType,
        value: discountValue,
        category: targetCategory,
        start: startDate || new Date().toISOString().split('T')[0],
        end: endDate || new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        banner: displayBanner
      };
      updatedPromos = [newPromo, ...promos];
      toast.success("New promotional campaign launched!");
    }

    setPromos(updatedPromos);
    localStorage.setItem("storePromotions", JSON.stringify(updatedPromos));
    clearFormFields();
  };

  const handleEditClick = (promo) => {
    setEditingId(promo.id);
    setPromoTitle(promo.title);
    setDiscountType(promo.type);
    setDiscountValue(promo.value);
    setTargetCategory(promo.category);
    setStartDate(promo.start);
    setEndDate(promo.end);
    setDisplayBanner(promo.banner);
    toast.loading("Editing promotion campaign...", { id: "edit-load", duration: 1000 });
  };

  const handleTogglePause = (id) => {
    let currentStatus = "";
    const updated = promos.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'active' ? 'expired' : 'active';
        currentStatus = nextStatus;
        return { ...p, status: nextStatus };
      }
      return p;
    });

    setPromos(updated);
    localStorage.setItem("storePromotions", JSON.stringify(updated));

    if (currentStatus === 'active') {
      toast.success("Campaign reactivated live!");
    } else {
      toast.error("Campaign paused and set to inactive.");
    }
  };

  const handleDeleteClick = (id) => {
    if(!window.confirm("Permanently delete this promotion code from your client storefront?")) return;
    const updated = promos.filter(p => p.id !== id);
    setPromos(updated);
    localStorage.setItem("storePromotions", JSON.stringify(updated));
    toast.success("Promotion successfully purged.");
  };

  const handleLaunchFlashSale = () => {
    const flashTitle = `⚡ EMERGENCY FLASH SALE ⚡`;
    const flashSubtitle = `${flashDiscount}% OFF ALL ${flashCategory.toUpperCase()} ITEMS!`;
    
    const newFlashPromo = {
      id: Date.now(),
      title: flashTitle,
      subtitle: flashSubtitle,
      price: '⚡ PROMO ⚡',
      stock: 'Limited Time',
      status: 'active',
      type: 'percentage',
      value: flashDiscount,
      category: flashCategory,
      start: new Date().toISOString(),
      end: new Date(Date.now() + parseInt(flashDuration) * 60 * 60 * 1000).toISOString(),
      banner: true
    };

    const updated = [newFlashPromo, ...promos];
    setPromos(updated);
    localStorage.setItem("storePromotions", JSON.stringify(updated));
    localStorage.setItem("activeFlashSaleCampaign", JSON.stringify(newFlashPromo));
    
    setIsFlashSaleModalOpen(false);
    toast.success("Flash sale deployed! Storefront urgency counters active.", {
      icon: '⚡',
      duration: 4000
    });
  };

  const clearFormFields = () => {
    setPromoTitle("");
    setDiscountValue("");
    setTargetCategory("");
    setStartDate("");
    setEndDate("");
    setDisplayBanner(false);
    setEditingId(null);
  };

  return (
    <div className="admin-layout">
      <SideBar />

      <main className="main-content-area">
        
        {/* Top Metric Cards */}
        <section className="promo-metrics">
          <div className="promo-card active-card">
            <div className="promo-icon-box pink-bg">🛍️</div>
            <div className="promo-card-data">
              <span>Active Promotions</span>
              <h3>{activeCount}</h3>
            </div>
          </div>

          <div className="promo-card">
            <div className="promo-icon-box blue-bg">📅</div>
            <div className="promo-card-data">
              <span>Upcoming Promotions</span>
              <h3>{upcomingCount}</h3>
            </div>
          </div>

          <div className="promo-card">
            <div className="promo-icon-box gray-bg">🕒</div>
            <div className="promo-card-data">
              <span>Expired Promotions</span>
              <h3>{expiredCount}</h3>
            </div>
          </div>

          <div className="header-search-icons">
            <FiSearch className="top-action-icon" />
            <div className="top-bag-wrapper">
              <FiShoppingBag className="top-action-icon" />
              <span className="bag-badge">{activeCount}</span>
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
                {promos.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                      No promotional campaigns currently logged.
                    </td>
                  </tr>
                ) : (
                  promos.map((promo) => (
                    <tr key={promo.id} style={{ opacity: promo.status === 'expired' ? 0.6 : 1 }}>
                      <td>
                        <div className="promo-info-cell">
                          <strong style={{ color: promo.title.includes('⚡') ? '#e11d48' : 'inherit' }}>
                            {promo.title}
                          </strong>
                          <span>{promo.subtitle}</span>
                        </div>
                      </td>
                      <td className="price-bold">
                        {promo.price === '⚡ PROMO ⚡' ? '⚡ FLASH' : `GHC ${promo.price}`}
                      </td>
                      <td>
                        <span className={`stock-pill ${promo.status === 'expired' || promo.stock === 'Out of Stock' ? 'out-pill' : ''}`}>
                          {promo.status === 'expired' ? 'Inactive' : promo.stock}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-group">
                          <button className="action-btn edit-btn" onClick={() => handleEditClick(promo)}>Edit</button>
                          <button 
                            className="action-btn pause-btn" 
                            style={{ backgroundColor: promo.status === 'expired' ? '#10b981' : '#f59e0b' }} 
                            onClick={() => handleTogglePause(promo.id)}
                          >
                            {promo.status === 'expired' ? 'Activate' : 'Pause'}
                          </button>
                          <button className="action-btn delete-btn" onClick={() => handleDeleteClick(promo.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Create New Promotion Panel */}
        <section className="content-panel form-panel">
          <h3 className="panel-title">{editingId ? 'Modify Configured Campaign' : 'Create New Promotion'}</h3>
          
          <form className="create-promo-form" onSubmit={handleSavePromotion}>
            <div className="form-left-col">
              <div className="form-field">
                <input 
                  type="text" 
                  placeholder="Promotion Title (e.g., Akwaaba Discount)" 
                  className="panel-input" 
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                />
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
                <input 
                  type="number" 
                  placeholder={discountType === 'percentage' ? "Discount Value (%) e.g. 25" : "Discount Value (GHC) e.g. 150"} 
                  className="panel-input" 
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                />
              </div>

              <div className="form-field select-field">
                <select 
                  className="panel-input panel-select" 
                  value={targetCategory} 
                  onChange={(e) => setTargetCategory(e.target.value)}
                >
                  <option value="" disabled hidden>Select Products or Categories</option>
                  <option value="all">All Jewelry</option>
                  <option value="rings">Rings Only</option>
                  <option value="necklaces">Necklaces Only</option>
                </select>
                <FiChevronDown className="field-select-arrow" />
              </div>

              <div className="form-field date-range-row">
                <div className="date-input-wrapper">
                  <input 
                    type="date" 
                    className="panel-input date-input" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="date-input-wrapper">
                  <input 
                    type="date" 
                    className="panel-input date-input" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-right-col">
              <div className="date-picker-block">
                <label>Campaign Settings Preview</label>
                <div className="preview-card-box">
                  <strong>Type:</strong> {discountType.toUpperCase()}<br/>
                  return <strong>Targeting:</strong> {targetCategory || 'None chosen yet'}<br/>
                  <strong>Status:</strong> {editingId ? '⚠️ Editing' : '✨ New Entry'}
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
                {editingId && (
                  <button type="button" className="btn-save-promo cancel-btn" onClick={clearFormFields}>Cancel</button>
                )}
                <button type="submit" className="btn-save-promo">
                  {editingId ? 'Update Campaign' : 'Save Promotion'}
                </button>
                <button 
                  type="button" 
                  className="btn-flash-sale deploy-trigger-btn" 
                  onClick={() => setIsFlashSaleModalOpen(true)}
                >
                  Start Flash Sale
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>

      {/* ==========================================
          FLASH SALE CONFIGURATION OVERLAY DRAWER
          ========================================== */}
      {isFlashSaleModalOpen && (
        <div className="modal-overlay" onClick={() => setIsFlashSaleModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⚡ Emergency Flash Sale Setup</h3>
              <button className="modal-close-btn" onClick={() => setIsFlashSaleModalOpen(false)}>
                <FiX size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <p className="modal-description">
                This pushes an instant markdown counter to your user store layout. This campaign automatically overrides default jewelry pricing structures.
              </p>

              <div className="modal-field-group">
                <label className="modal-label"><FiPercent /> Markdown Percentage</label>
                <select className="modal-select" value={flashDiscount} onChange={(e) => setFlashDiscount(e.target.value)}>
                  <option value="20">20% Price Cut</option>
                  <option value="30">30% Price Cut</option>
                  <option value="50">50% Deep Discount</option>
                  <option value="70">70% Mega Clearance</option>
                </select>
              </div>

              <div className="modal-field-group">
                <label className="modal-label"><FiClock /> Expiration Duration</label>
                <select className="modal-select" value={flashDuration} onChange={(e) => setFlashDuration(e.target.value)}>
                  <option value="1">1 Hour Only</option>
                  <option value="2">2 Hours Only</option>
                  <option value="3">3 Hours Only</option>
                  <option value="24">24 Hours Limited</option>
                </select>
              </div>

              <div className="modal-field-group">
                <label className="modal-label">Target Segment</label>
                <select className="modal-select" value={flashCategory} onChange={(e) => setFlashCategory(e.target.value)}>
                  <option value="all">Entire Jewelry Inventory</option>
                  <option value="rings">Rings Stock Only</option>
                  <option value="necklaces">Necklaces Stock Only</option>
                </select>
              </div>

              <div className="modal-action-buttons">
                <button onClick={handleLaunchFlashSale} className="modal-submit-btn">
                  Deploy Campaign Live
                </button>
                <button onClick={() => setIsFlashSaleModalOpen(false)} className="modal-cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Promotion;