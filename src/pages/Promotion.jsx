import React, { useState, useEffect } from 'react';
import '../Promotion.css';
import { 
  FiSearch, FiShoppingBag, FiChevronDown, FiEdit3, FiSliders 
} from 'react-icons/fi';
import SideBar from '../components/SideBar';
import { useAdminBackButton } from '../hooks/useAdminBackButton.jsx';
import toast from 'react-hot-toast';

function Promotion() {
  // ==========================================
  // STATE MANAGEMENT & INITIALIZATION
  // ==========================================
  const [promos, setPromos] = useState([]);
  // Internal clock state to drive instant auto-activation
  const [currentTime, setCurrentTime] = useState(new Date());
  useAdminBackButton();
  
  // Create New Promotion Form States
  const [promoTitle, setPromoTitle] = useState("");
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState("");
  const [targetCategory, setTargetCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState(""); 
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");     
  const [editingId, setEditingId] = useState(null);

  // GLOBAL INDEPENDENT BANNER STATES
  const [displayBanner, setDisplayBanner] = useState(false);
  const [bannerText, setBannerText] = useState("");

  // Sync data with local engine database on render lifecycle
  useEffect(() => {
    // 1. Load regular promotions
    const storedPromos = JSON.parse(localStorage.getItem("storePromotions")) || [
      { id: 1, title: 'Spring Sale', subtitle: '20% Off All Items', price: '346.00', stock: '21 in Stock', status: 'scheduled', type: 'percentage', value: '20', category: 'all', start: '2026-04-20', startTime: '00:00', end: '2026-04-25', endTime: '23:59' },
      { id: 2, title: 'Flash Deal', subtitle: '30% Off Rings Today!', price: '750.00', stock: '12 in Stock', status: 'scheduled', type: 'percentage', value: '30', category: 'rings', start: '2026-05-24', startTime: '08:00', end: '2026-05-25', endTime: '22:00' },
      { id: 3, title: 'Holiday Clearance', subtitle: 'Selected Items Only', price: '726.00', stock: 'Out of Stock', status: 'paused', type: 'fixed', value: '100', category: 'necklaces', start: '2026-05-01', startTime: '12:00', end: '2026-05-10', endTime: '18:00' }
    ];
    setPromos(storedPromos);
    localStorage.setItem("storePromotions", JSON.stringify(storedPromos));

    // 2. Load completely independent storefront global banner settings
    const globalBannerConfig = JSON.parse(localStorage.getItem("storefrontBannerConfig")) || {
      text: "✨ Mother’s Day Special: Use code SPRING20 for 20% off all jewelry! Free delivery over GHC 500. ✨",
      isActive: false
    };
    setBannerText(globalBannerConfig.text);
    setDisplayBanner(globalBannerConfig.isActive);

    // 3. Keep page reactive to chronological activation updates
    const timerInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Check and refresh status changes every 60 seconds

    return () => clearInterval(timerInterval);
  }, []);

  // ==========================================
  // METRIC COMPUTING ENGINES (DYNAMIC TIMESTAMPS)
  // ==========================================
  
  // Helper utility to turn saved strings into clean comparison numbers
  const getPromoTimestamps = (promo) => {
    const startObj = new Date(`${promo.start}T${promo.startTime || '00:00'}`);
    const endObj = new Date(`${promo.end}T${promo.endTime || '23:59'}`);
    return { startObj, endObj };
  };

  const activeCount = promos.filter(p => {
    if (p.status === 'paused') return false;
    const { startObj, endObj } = getPromoTimestamps(p);
    return currentTime >= startObj && currentTime <= endObj;
  }).length;

  const upcomingCount = promos.filter(p => {
    if (p.status === 'paused') return false;
    const { startObj } = getPromoTimestamps(p);
    return currentTime < startObj;
  }).length;

  const expiredCount = promos.filter(p => {
    if (p.status === 'paused') return true;
    const { endObj } = getPromoTimestamps(p);
    return currentTime > endObj;
  }).length;

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
            startTime: startTime || p.startTime || "00:00",
            end: endDate || p.end,
            endTime: endTime || p.endTime || "23:59",
            // Reset status to scheduled if edited, unless it was explicitly kept paused
            status: p.status === 'paused' ? 'paused' : 'scheduled'
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
        status: 'scheduled', // Set baseline as scheduled to let timeline auto-handle activation
        type: discountType,
        value: discountValue,
        category: targetCategory,
        start: startDate || new Date().toISOString().split('T')[0],
        startTime: startTime || "00:00",
        end: endDate || new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        endTime: endTime || "23:59"
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
    setStartTime(promo.startTime || "");
    setEndDate(promo.end);
    setEndTime(promo.endTime || "");
    toast.loading("Editing promotion campaign...", { id: "edit-load", duration: 1000 });
  };

  const handleTogglePause = (id) => {
    let targetedStatus = "";
    const updated = promos.map(p => {
      if (p.id === id) {
        // Toggle manual overwrite state explicitly
        const nextStatus = p.status === 'paused' ? 'scheduled' : 'paused';
        targetedStatus = nextStatus;
        return { ...p, status: nextStatus };
      }
      return p;
    });

    setPromos(updated);
    localStorage.setItem("storePromotions", JSON.stringify(updated));

    if (targetedStatus === 'scheduled') {
      toast.success("Campaign added back into dynamic calendar queue!");
    } else {
      toast.error("Campaign fully paused. Auto-activation suspended.");
    }
  };

  const handleDeleteClick = (id) => {
    if(!window.confirm("Permanently delete this promotion code from your client storefront?")) return;
    const updated = promos.filter(p => p.id !== id);
    setPromos(updated);
    localStorage.setItem("storePromotions", JSON.stringify(updated));
    toast.success("Promotion successfully purged.");
  };

  const clearFormFields = () => {
    setPromoTitle("");
    setDiscountValue("");
    setTargetCategory("");
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
    setEditingId(null);
  };

  // ==========================================
  // INDEPENDENT BANNER CONTROLLER SUBMITTER
  // ==========================================
  const handleSaveGlobalBanner = (e) => {
    e.preventDefault();
    if (displayBanner && !bannerText.trim()) {
      toast.error("Please enter a custom banner statement before enabling it.");
      return;
    }

    const newBannerConfig = {
      text: bannerText,
      isActive: displayBanner
    };

    localStorage.setItem("storefrontBannerConfig", JSON.stringify(newBannerConfig));
    toast.success(displayBanner ? "Storefront global banner updated & set live!" : "Storefront header banner turned off.");
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
                  <th>Dynamic Timeline Status</th>
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
                  promos.map((promo) => {
                    const { startObj, endObj } = getPromoTimestamps(promo);
                    const isPaused = promo.status === 'paused';
                    const isUpcoming = currentTime < startObj;
                    const isExpired = currentTime > endObj;

                    // UI Determination based on actual clock engine state
                    let statusLabel = "Live & Active";
                    let pillClass = "";

                    if (isPaused) {
                      statusLabel = "Paused";
                      pillClass = "out-pill";
                    } else if (isUpcoming) {
                      statusLabel = "Upcoming";
                      pillClass = "upcoming-pill"; // Feel free to target .upcoming-pill with blue color in your CSS
                    } else if (isExpired) {
                      statusLabel = "Expired";
                      pillClass = "out-pill";
                    }

                    return (
                      <tr key={promo.id} style={{ opacity: (isExpired || isPaused) ? 0.6 : 1 }}>
                        <td>
                          <div className="promo-info-cell">
                            <strong>{promo.title}</strong>
                            <span>{promo.subtitle}</span>
                          </div>
                        </td>
                        <td className="price-bold">
                          GHC {promo.price}
                        </td>
                        <td>
                          <span className={`stock-pill ${pillClass}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons-group">
                            <button className="action-btn edit-btn" onClick={() => handleEditClick(promo)}>Edit</button>
                            <button 
                              className="action-btn pause-btn" 
                              style={{ backgroundColor: isPaused ? '#10b981' : '#f59e0b' }} 
                              onClick={() => handleTogglePause(promo.id)}
                            >
                              {isPaused ? 'Resume' : 'Pause'}
                            </button>
                            <button className="action-btn delete-btn" onClick={() => handleDeleteClick(promo.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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

              {/* SCHEDULE ENGINE GRID WITH PRECISION 1-MINUTE TIME STEPS */}
              <div className="form-field campaign-schedule-grid">
                
                {/* Start Point Configuration */}
                <div className="schedule-group">
                  <div className="schedule-field">
                    <label className="field-top-label">Start Date</label>
                    <div className="date-input-wrapper">
                      <input 
                        type="date" 
                        className="panel-input date-input" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="schedule-field">
                    <label className="field-top-label">Start Time</label>
                    <div className="date-input-wrapper">
                      <input 
                        type="time" 
                        step="60" // Guarantees precision options tracking from 12:00 AM to 11:59 PM down to the minute
                        className="panel-input time-input" 
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* End Point Configuration */}
                <div className="schedule-group">
                  <div className="schedule-field">
                    <label className="field-top-label">End Date</label>
                    <div className="date-input-wrapper">
                      <input 
                        type="date" 
                        className="panel-input date-input" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="schedule-field">
                    <label className="field-top-label">End Time</label>
                    <div className="date-input-wrapper">
                      <input 
                        type="time" 
                        step="60" // Guarantees precision options tracking from 12:00 AM to 11:59 PM down to the minute
                        className="panel-input time-input" 
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-right-col">
              <div className="date-picker-block">
                <label>Campaign Settings Preview</label>
                <div className="preview-card-box">
                  <strong>Type:</strong> {discountType.toUpperCase()}<br/>
                  <strong>Targeting:</strong> {targetCategory || 'None chosen yet'}<br/>
                  <strong>Status:</strong> {editingId ? '⚠️ Editing' : '✨ New Entry'}
                </div>
              </div>
            </div>

            <div className="form-footer-actions">
              <div className="submit-buttons" style={{ marginLeft: 'auto' }}>
                {editingId && (
                  <button type="button" className="btn-save-promo cancel-btn" onClick={clearFormFields}>Cancel</button>
                )}
                <button type="submit" className="btn-save-promo">
                  {editingId ? 'Update Campaign' : 'Save Promotion'}
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* NEW: ENTIRELY SEPARATE GLOBAL STOREFRONT BANNER ENGINE PANEL */}
        <section className="content-panel form-panel" style={{ marginTop: '24px' }}>
          <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiSliders size={18} /> Global Customer Storefront Banner
          </h3>
          
          <form className="create-promo-form" onSubmit={handleSaveGlobalBanner}>
            <div className="form-left-col" style={{ width: '100%', flex: 'none' }}>
              
              {/* Banner Text Area Box */}
              <div className="form-field banner-statement-block">
                <label className="field-top-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#be185d' }}>
                  <FiEdit3 size={14} /> Storefront Announcement Text
                </label>
                <textarea
                  rows="2"
                  className="panel-input"
                  placeholder="Enter custom text to stream across the storefront's master header... (e.g., Akwaaba! Enjoy free nationwide premium delivery on all order checkouts today.)"
                  style={{ resize: 'none', minHeight: '65px', paddingTop: '10px' }}
                  value={bannerText}
                  onChange={(e) => setBannerText(e.target.value)}
                />
              </div>

              {/* Conditional Row Containing Toggle Controls */}
              <div className="form-footer-actions" style={{ marginTop: '16px', padding: 0, border: 'none' }}>
                {bannerText.trim().length > 0 ? (
                  <div className="banner-toggle" onClick={() => setDisplayBanner(!displayBanner)} style={{ animation: 'fadeIn 0.2s ease-out' }}>
                    <div className={`switch-pill ${displayBanner ? 'active-pink' : ''}`}>
                      <div className="switch-circle"></div>
                    </div>
                    <span className="toggle-text">
                      {displayBanner ? '✅ Global Header Banner is LIVE' : '❌ Global Header Banner is DISABLED'}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    Type an announcement statement above to unlock live storefront visibility toggle switches.
                  </span>
                )}

                <div className="submit-buttons" style={{ marginLeft: 'auto' }}>
                  <button type="submit" className="btn-save-promo" style={{ backgroundColor: '#1e293b' }}>
                    Save Banner Settings
                  </button>
                </div>
              </div>

            </div>
          </form>
        </section>

      </main>
    </div>
  );
}

export default Promotion;