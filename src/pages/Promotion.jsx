import React, { useState, useEffect, useRef } from 'react';
import '../Promotion.css';
import { 
  FiSearch, FiChevronDown, FiCalendar, FiX, FiClock, FiPercent, FiDollarSign 
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
  
  // Multi-Select & Search States for Targets
  const [selectedTargets, setSelectedTargets] = useState([]); 
  const [targetSearchQuery, setTargetSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // DOM Reference boundary node for click-outside detection
  const dropdownRef = useRef(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [displayBanner, setDisplayBanner] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Dynamic States for Live Database Syncing
  const [dbCategories, setDbCategories] = useState([]);
  const [dbProducts, setDbProducts] = useState([]);
  const [isLoadingDatabase, setIsLoadingDatabase] = useState(true);

  // Flash Sale Setup Panel State
  const [isFlashSaleModalOpen, setIsFlashSaleModalOpen] = useState(false);
  const [flashDiscount, setFlashDiscount] = useState("50");
  const [flashDuration, setFlashDuration] = useState("3"); 
  const [flashCategory, setFlashCategory] = useState("all");

  // ==========================================
  // CLICK-OUTSIDE EVENT LISTENER TRIGGER
  // ==========================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setTargetSearchQuery(""); 
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ==========================================
  // ASYNC BACKEND DATABASE SYNCHRONIZATION
  // ==========================================
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoadingDatabase(true);
      try {
        const promosResponse = await fetch('/api/promotions');
        const categoriesResponse = await fetch('/api/categories');
        const productsResponse = await fetch('/api/products');

        if (promosResponse.ok) {
          const promosData = await promosResponse.json();
          setPromos(promosData);
        }
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setDbCategories(categoriesData);
        }
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setDbProducts(productsData);
        }
      } catch (error) {
        console.error("Backend Sync Error:", error);
        toast.error("Failed to connect to the backend database.", { duration: 2000 });
        setDbCategories([{ id: "rings", name: "Rings" }, { id: "necklaces", name: "Necklaces" }]);
      } finally {
        setIsLoadingDatabase(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ==========================================
  // COMPUTE UNIFIED SEARCHABLE OPTIONS LIST
  // ==========================================
  const searchableOptions = [
    { id: "all", name: "All Jewelry Inventory", type: "global" },
    ...dbCategories.map(cat => ({
      id: `cat:${cat.id || cat._id || cat.name.toLowerCase()}`,
      name: `${cat.name} (Entire Collection)`,
      type: "category"
    })),
    ...dbProducts.map(prod => ({
      id: `prod:${prod.id || prod._id}`,
      name: `${prod.name || prod.title} (Single Product)`,
      type: "product"
    }))
  ];

  const activeCount = promos.filter(p => p.status === 'active').length;
  const upcomingCount = promos.filter(p => p.status === 'upcoming').length;
  const expiredCount = promos.filter(p => p.status === 'expired').length;

  // ==========================================
  // MULTI-SELECT HANDLER ENGINES
  // ==========================================
  const handleToggleTarget = (targetId) => {
    if (targetId === "all") {
      setSelectedTargets(["all"]);
      return;
    }

    setSelectedTargets(prev => {
      const cleanPrev = prev.filter(t => t !== "all");
      if (cleanPrev.includes(targetId)) {
        return cleanPrev.filter(t => t !== targetId);
      } else {
        return [...cleanPrev, targetId];
      }
    });
  };

  const handleRemoveTargetBadge = (targetId) => {
    setSelectedTargets(prev => prev.filter(t => t !== targetId));
  };

  // ==========================================
  // CORE PROMOTION ADMINISTRATIVE ENGINES
  // ==========================================
  const handleSavePromotion = async (e) => {
    e.preventDefault();
    if (!promoTitle || !discountValue || selectedTargets.length === 0) {
      toast.error("Please fill out all fields and select target assets.");
      return;
    }

    const targetLabels = selectedTargets.map(id => {
      return searchableOptions.find(o => o.id === id)?.name || id;
    }).join(", ");

    const formattedSubtitle = discountType === 'percentage' 
      ? `${discountValue}% Off on: [${targetLabels}]`
      : `GHC ${discountValue} Off on: [${targetLabels}]`;

    const payload = {
      title: promoTitle,
      subtitle: formattedSubtitle,
      type: discountType,
      value: discountValue,
      targets: selectedTargets, 
      start: startDate || new Date().toISOString().split('T')[0],
      end: endDate || new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      banner: displayBanner,
      status: 'active',
      price: '0.00',
      stock: 'In Stock'
    };

    try {
      if (editingId) {
        const response = await fetch(`/api/promotions/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const updatedResult = await response.json();
          setPromos(promos.map(p => p.id === editingId || p._id === editingId ? updatedResult : p));
          setEditingId(null);
          toast.success("Campaign updated successfully in database!");
        }
      } else {
        const response = await fetch('/api/promotions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const newPromoData = await response.json();
          setPromos([newPromoData, ...promos]);
          toast.success("New promotional campaign launched onto live servers!");
        }
      }
      clearFormFields();
    } catch (err) {
      console.error(err);
      toast.error("Failed to commit promotion payload parameters to database.");
    }
  };

  const handleEditClick = (promo) => {
    setEditingId(promo.id || promo._id);
    setPromoTitle(promo.title);
    setDiscountType(promo.type);
    setDiscountValue(promo.value);
    setSelectedTargets(promo.targets || [promo.category]); 
    setStartDate(promo.start ? promo.start.split('T')[0] : "");
    setEndDate(promo.end ? promo.end.split('T')[0] : "");
    setDisplayBanner(promo.banner);
    toast.loading("Editing campaign instance data...", { id: "edit-load", duration: 1000 });
  };

  const handleTogglePause = async (promoInstance) => {
    const id = promoInstance.id || promoInstance._id;
    const nextStatus = promoInstance.status === 'active' ? 'expired' : 'active';
    
    try {
      const response = await fetch(`/api/promotions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });

      if (response.ok) {
        setPromos(promos.map(p => (p.id === id || p._id === id) ? { ...p, status: nextStatus } : p));
        nextStatus === 'active' ? toast.success("Campaign live!") : toast.error("Campaign paused.");
      }
    } catch (err) {
      toast.error("Could not modify live status configuration.");
    }
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Permanently delete this promotion code from your database?")) return;
    try {
      const response = await fetch(`/api/promotions/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setPromos(promos.filter(p => p.id !== id && p._id !== id));
        toast.success("Promotion deleted.");
      }
    } catch (err) {
      toast.error("Database deletion operation failed.");
    }
  };

  const handleLaunchFlashSale = async () => {
    const flashTitle = `⚡ EMERGENCY FLASH SALE ⚡`;
    const flashSubtitle = `${flashDiscount}% OFF ALL ${flashCategory.toUpperCase()} ITEMS!`;
    
    const flashPayload = {
      title: flashTitle,
      subtitle: flashSubtitle,
      price: '⚡ PROMO ⚡',
      stock: 'Limited Time',
      status: 'active',
      type: 'percentage',
      value: flashDiscount,
      targets: [flashCategory === 'all' ? 'all' : `cat:${flashCategory}`],
      start: new Date().toISOString(),
      end: new Date(Date.now() + parseInt(flashDuration) * 60 * 60 * 1000).toISOString(),
      banner: true
    };

    try {
      const response = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flashPayload)
      });

      if (response.ok) {
        const deployedFlash = await response.json();
        setPromos([deployedFlash, ...promos]);
        setIsFlashSaleModalOpen(false);
        toast.success("Emergency flash sale deployed down to store nodes!", { icon: '⚡' });
      }
    } catch (err) {
      toast.error("Failed to deploy flash markdown parameters.");
    }
  };

  const clearFormFields = () => {
    setPromoTitle("");
    setDiscountValue("");
    setSelectedTargets([]);
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
                      No promotional campaigns currently logged in database nodes.
                    </td>
                  </tr>
                ) : (
                  promos.map((promo) => (
                    <tr key={promo.id || promo._id} style={{ opacity: promo.status === 'expired' ? 0.6 : 1 }}>
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
                            onClick={() => handleTogglePause(promo)}
                          >
                            {promo.status === 'expired' ? 'Activate' : 'Pause'}
                          </button>
                          <button className="action-btn delete-btn" onClick={() => handleDeleteClick(promo.id || promo._id)}>Delete</button>
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
                    <span className="custom-radio" ></span>
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

              {/* DYNAMIC COMBINED SEARCHABLE MULTI-SELECT DROPDOWN MENU */}
              <div className="form-field searchable-select-container" ref={dropdownRef}>
                <div 
                  className="searchable-select-trigger" 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span style={{ color: selectedTargets.length === 0 ? 'var(--text-muted)' : 'var(--text-main)' }}>
                    {selectedTargets.length === 0 
                      ? "Search database categories or items..." 
                      : `Selected Targets (${selectedTargets.length})`}
                  </span>
                  <FiChevronDown className={`field-select-arrow ${isDropdownOpen ? 'rotated' : ''}`} />
                </div>

                {isDropdownOpen && (
                  <div className="searchable-dropdown-menu">
                    <div className="search-input-wrapper">
                      <FiSearch className="search-menu-icon" />
                      <input 
                        type="text"
                        placeholder="Type catalog title or collection..."
                        className="menu-search-field"
                        value={targetSearchQuery}
                        onChange={(e) => setTargetSearchQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                      {targetSearchQuery && (
                        <FiX className="clear-search-icon" onClick={() => setTargetSearchQuery("")} />
                      )}
                    </div>

                    <ul className="options-list">
                      {searchableOptions.filter(opt => 
                        opt.name.toLowerCase().includes(targetSearchQuery.toLowerCase())
                      ).length === 0 ? (
                        <li className="no-options-found">No database matches found</li>
                      ) : (
                        searchableOptions
                          .filter(opt => opt.name.toLowerCase().includes(targetSearchQuery.toLowerCase()))
                          .map((opt, idx, filteredArray) => {
                            const showHeader = idx === 0 || filteredArray[idx - 1].type !== opt.type;
                            const isChecked = selectedTargets.includes(opt.id);

                            return (
                              <React.Fragment key={opt.id}>
                                {showHeader && (
                                  <li className="dropdown-section-header">
                                    {opt.type === "global" && "Global Targets"}
                                    {opt.type === "category" && "Live Inventory Collections"}
                                    {opt.type === "product" && "Store Products"}
                                  </li>
                                )}
                                <li 
                                  className={`option-item multi-option-item ${isChecked ? 'selected-item' : ''}`}
                                  onClick={() => handleToggleTarget(opt.id)}
                                >
                                  <input 
                                    type="checkbox" 
                                    className="dropdown-checkbox"
                                    checked={isChecked}
                                    readOnly 
                                  />
                                  <span>{opt.name}</span>
                                </li>
                              </React.Fragment>
                            );
                          })
                      )}
                    </ul>

                    {/* ACTION FOOTER BAR WITH DONE BUTTON */}
                    <div className="dropdown-footer-actions-bar">
                      <span className="selection-summary-text">
                        {selectedTargets.length} selected
                      </span>
                      <button 
                        type="button" 
                        className="dropdown-done-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDropdownOpen(false);
                          setTargetSearchQuery("");
                        }}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Target Multi-Select Badge Box Footer */}
              {selectedTargets.length > 0 && (
                <div className="target-badge-panel-row">
                  {selectedTargets.map(targetId => {
                    const foundObj = searchableOptions.find(o => o.id === targetId);
                    return (
                      <div key={targetId} className="target-pill-badge">
                        <span>{foundObj ? foundObj.name : targetId}</span>
                        <FiX className="remove-badge-icon" onClick={() => handleRemoveTargetBadge(targetId)} />
                      </div>
                    );
                  })}
                </div>
              )}

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
                  <strong>Configured Targets:</strong> {selectedTargets.length} items<br/>
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
                <button type="submit" className="btn-save-promo" disabled={isLoadingDatabase}>
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

      {/* FLASH SALE OVERLAY DRAWER */}
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
                  {dbCategories.map(c => (
                    <option key={c.id || c._id} value={c.id || c._id}>{c.name} Stock Only</option>
                  ))}
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