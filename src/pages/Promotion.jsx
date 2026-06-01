import React, { useState, useEffect } from 'react';
import '../Promotion.css';
import { 
  FiSearch, FiShoppingBag, FiChevronDown, FiEdit3, FiSliders, FiLock 
} from 'react-icons/fi';
import SideBar from '../components/SideBar';
import { useAdminBackButton } from '../hooks/useAdminBackButton.jsx';
import toast from 'react-hot-toast';
import axios from 'axios'; 

function Promotion() {
  // ==========================================
  // STATE MANAGEMENT & INITIALIZATION
  // ==========================================
  const [promos, setPromos] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  useAdminBackButton();
  
  // Create New Promotion Form States
  const [promoTitle, setPromoTitle] = useState("");
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState(""); 
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");     
  const [editingId, setEditingId] = useState(null);

  // DATA BACKEND MANAGEMENT STATES
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  
  // SEPARATE DROPDOWN CONTROL INTERFACES (NATIVE OBJECT ARRAYS)
  // Structure: [{ type: 'all', id: 'all', name: 'All Jewelry' }] 
  // or [{ type: 'category', id: 'Rings', name: 'Rings' }]
  const [selectedTargets, setSelectedTargets] = useState([]); 
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  // GLOBAL STOREFRONT HEADER BANNER STATES
  const [isDisplay, setIsDisplay] = useState(false); 
  const [bannerText, setBannerText] = useState("");
  const [isBannerSaving, setIsBannerSaving] = useState(false);

  // Sync state data on mounting
  useEffect(() => {
    const storedPromos = JSON.parse(localStorage.getItem("storePromotions")) || [
      { id: 1, title: 'Spring Sale', subtitle: '20% Off All Items', price: '346.00', stock: '21 in Stock', status: 'scheduled', type: 'percentage', value: '20', targets: [{ type: 'all', id: 'all', name: 'All Jewelry' }], start: '2026-04-20', startTime: '00:00', end: '2026-04-25', endTime: '23:59' },
      { id: 2, title: 'Flash Deal', subtitle: '30% Off Rings Today!', price: '750.00', stock: '12 in Stock', status: 'scheduled', type: 'percentage', value: '30', targets: [{ type: 'category', id: 'Rings', name: 'Rings' }], start: '2026-05-24', startTime: '08:00', end: '2026-05-25', endTime: '22:00' },
      { id: 3, title: 'Holiday Clearance', subtitle: 'Selected Items Only', price: '726.00', stock: 'Out of Stock', status: 'paused', type: 'fixed', value: '100', targets: [{ type: 'category', id: 'Necklaces', name: 'Necklaces' }], start: '2026-05-01', startTime: '12:00', end: '2026-05-10', endTime: '18:00' }
    ];
    setPromos(storedPromos);
    localStorage.setItem("storePromotions", JSON.stringify(storedPromos));

    const fetchGlobalBanner = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/announcement/active`);
        if (response.data) {
          setBannerText(response.data.message || "");
          setIsDisplay(response.data.isDisplay || false); 
        }
      } catch (error) {
        console.error("Error fetching announcement banner:", error);
        const globalBannerConfig = JSON.parse(localStorage.getItem("storefrontBannerConfig")) || {
          text: "✨AWAIT UPCOMING PROMOTIONS!✨",
          isActive: false
        };
        setBannerText(globalBannerConfig.text);
        setIsDisplay(globalBannerConfig.isActive); 
      }
    };

    const fetchTargetingData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          axios.get('https://alluring-accent-backend.onrender.com/api/category/all'),
          axios.get('https://alluring-accent-backend.onrender.com/api/product/all')
        ]);
        if (categoriesRes.data) setAvailableCategories(categoriesRes.data);
        if (productsRes.data) setAvailableProducts(productsRes.data);
      } catch (error) {
        console.error("Error parsing setup payload channels:", error);
      }
    };

    fetchGlobalBanner();
    fetchTargetingData();

    const closeDropdownOutside = (e) => {
      if (!e.target.closest('.category-dropdown-container')) setIsCategoryOpen(false);
      if (!e.target.closest('.product-dropdown-container')) setIsProductOpen(false);
    };
    document.addEventListener('click', closeDropdownOutside);

    const timerInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); 

    return () => {
      document.removeEventListener('click', closeDropdownOutside);
      clearInterval(timerInterval);
    };
  }, []);

  // ==========================================
  // METRIC COMPUTING INFRASTRUCTURES
  // ==========================================
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
  // OBJECT SELECTION ENGINE & LOCKOUT MECHANISMS
  // ==========================================
  const hasCategoriesSelected = selectedTargets.some(t => t.type === 'category');
  const hasProductsSelected = selectedTargets.some(t => t.type === 'product');

  const handleToggleTarget = (targetType, targetId, targetName) => {
    if (targetType === 'all') {
      setSelectedTargets([{ type: 'all', id: 'all', name: 'All Jewelry' }]);
      return;
    }

    // Filter out 'all' automatically when specific scope items are clicked
    let updated = selectedTargets.filter(item => item.type !== 'all');

    // Deep check if the object selection already exists inside state
    const targetExists = updated.some(item => item.type === targetType && item.id === targetId);

    if (targetExists) {
      updated = updated.filter(item => !(item.type === targetType && item.id === targetId));
    } else {
      updated.push({ type: targetType, id: targetId, name: targetName });
    }

    setSelectedTargets(updated);
  };

  const handleSetAllJewelry = () => {
    setSelectedTargets([{ type: 'all', id: 'all', name: 'All Jewelry' }]);
    toast.success("Targeting applied to full jewelry collection storewide.");
  };

  const isTargetChecked = (targetType, targetId) => {
    return selectedTargets.some(item => item.type === targetType && item.id === targetId);
  };

  // ==========================================
  // CORE FORM SUBMISSION LOGIC
  // ==========================================
  const handleSavePromotion = (e) => {
    e.preventDefault();
    if (!promoTitle || !discountValue || selectedTargets.length === 0) {
      toast.error("Please provide a title, numerical value, and an active targeting element scope.");
      return;
    }

    console.log("=== API Payload Check ===");
  console.log("Data Type of targets:", typeof selectedTargets);
  console.log("Is it an Array?", Array.isArray(selectedTargets));
  console.log("Actual Targets Array Contents:", selectedTargets);

    let updatedPromos;
    const readableNames = selectedTargets.map(t => t.name);
    const formattedSubtitle = discountType === 'percentage' 
      ? `${discountValue}% Off ${readableNames.join(', ')}`
      : `GHC ${discountValue} Off [${readableNames.join(', ')}]`;

    if (editingId) {
      updatedPromos = promos.map(p => {
        if (p.id === editingId) {
          return {
            ...p,
            title: promoTitle,
            subtitle: formattedSubtitle,
            type: discountType,
            value: discountValue,
            targets: selectedTargets, // Saving clean programmatic objects array directly
            start: startDate || p.start,
            startTime: startTime || p.startTime || "00:00",
            end: endDate || p.end,
            endTime: endTime || p.endTime || "23:59",
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
        status: 'scheduled', 
        type: discountType,
        value: discountValue,
        targets: selectedTargets,
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
    
    // Fallback normalizer in case legacy flat-string campaigns still reside in storage
    if (promo.targets && typeof promo.targets[0] === 'object') {
      setSelectedTargets(promo.targets);
    } else if (promo.category) {
      setSelectedTargets(promo.category === 'all' 
        ? [{ type: 'all', id: 'all', name: 'All Jewelry' }]
        : [{ type: 'category', id: promo.category, name: promo.category }]
      );
    } else {
      setSelectedTargets([]);
    }
    
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
      toast.error("Campaign paused successfully.");
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
    setSelectedTargets([]);
    setCategorySearch("");
    setProductSearch("");
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
    setEditingId(null);
  };

  const handleSaveGlobalBanner = async (e) => {
    e.preventDefault();
    if (isDisplay && !bannerText.trim()) {
      toast.error("Please enter a custom banner statement before enabling it.");
      return;
    }
    const token = localStorage.getItem("ACCESS_TOKEN") || localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      setIsBannerSaving(true);
      await axios.post(
        'https://alluring-accent-backend.onrender.com/api/announcement/create',
        { message: bannerText, isDisplay },
        { headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' } }
      );
      localStorage.setItem("storefrontBannerConfig", JSON.stringify({ text: bannerText, isActive: isDisplay }));
      toast.success(isDisplay ? "Storefront global banner live on backend!" : "Storefront header banner deactivated.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update banner configuration settings on cloud storage.");
    } finally {
      setIsBannerSaving(false);
    }
  };

  const handleToggleSwitch = (e) => {
    e.stopPropagation(); 
    if (!isBannerSaving) setIsDisplay(prev => !prev);
  };

  return (
    <div className="admin-layout">
      <SideBar />

      <main className="main-content-area">
        
        {/* Metric Cards Banner */}
        <section className="promo-metrics">
          <div className="promo-card active-card">
            <div className="promo-icon-box pink-bg">🛍️</div>
            <div className="promo-card-data"><span>Active Promotions</span><h3>{activeCount}</h3></div>
          </div>
          <div className="promo-card">
            <div className="promo-icon-box blue-bg">📅</div>
            <div className="promo-card-data"><span>Upcoming Promotions</span><h3>{upcomingCount}</h3></div>
          </div>
          <div className="promo-card">
            <div className="promo-icon-box gray-bg">🕒</div>
            <div className="promo-card-data"><span>Expired Promotions</span><h3>{expiredCount}</h3></div>
          </div>
        </section>

        {/* Current Promotions Data View */}
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
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>No promotions logged.</td></tr>
                ) : (
                  promos.map((promo) => {
                    const { startObj, endObj } = getPromoTimestamps(promo);
                    const isPaused = promo.status === 'paused';
                    const isUpcoming = currentTime < startObj;
                    const isExpired = currentTime > endObj;
                    let statusLabel = "Live & Active";
                    let pillClass = "";

                    if (isPaused) { statusLabel = "Paused"; pillClass = "out-pill"; }
                    else if (isUpcoming) { statusLabel = "Upcoming"; pillClass = "upcoming-pill"; }
                    else if (isExpired) { statusLabel = "Expired"; pillClass = "out-pill"; }

                    return (
                      <tr key={promo.id} style={{ opacity: (isExpired || isPaused) ? 0.6 : 1 }}>
                        <td><div className="promo-info-cell"><strong>{promo.title}</strong><span>{promo.subtitle}</span></div></td>
                        <td className="price-bold">GHC {promo.value} ({promo.type === 'percentage' ? '%' : '₵'})</td>
                        <td><span className={`stock-pill ${pillClass}`}>{statusLabel}</span></td>
                        <td>
                          <div className="action-buttons-group">
                            <button className="action-btn edit-btn" onClick={() => handleEditClick(promo)}>Edit</button>
                            <button className="action-btn pause-btn" style={{ backgroundColor: isPaused ? '#10b981' : '#f59e0b' }} onClick={() => handleTogglePause(promo.id)}>{isPaused ? 'Resume' : 'Pause'}</button>
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

        {/* Input Configuration Workstation */}
        <section className="content-panel form-panel">
          <h3 className="panel-title">{editingId ? 'Modify Configured Campaign' : 'Create New Promotion'}</h3>
          
          <form className="create-promo-form" onSubmit={handleSavePromotion}>
            <div className="form-left-col">
              
              <div className="form-field">
                <input type="text" placeholder="Promotion Title (e.g., Akwaaba Discount)" className="panel-input" value={promoTitle} onChange={(e) => setPromoTitle(e.target.value)} />
              </div>

              <div className="form-field radio-row">
                <label className="radio-label">Discount Type</label>
                <div className="radio-options">
                  <label className="radio-container">
                    <input type="radio" name="discountType" checked={discountType === 'percentage'} onChange={() => setDiscountType('percentage')} />
                    <span className="custom-radio"></span>Percentage %
                  </label>
                  <label className="radio-container">
                    <input type="radio" name="discountType" checked={discountType === 'fixed'} onChange={() => setDiscountType('fixed')} />
                    <span className="custom-radio"></span>Fixed Amount (₵)
                  </label>
                </div>
              </div>

              <div className="form-field">
                <input type="number" placeholder={discountType === 'percentage' ? "Discount Value (%) e.g. 25" : "Discount Value (GHC) e.g. 150"} className="panel-input" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} />
              </div>

              {/* MASTER FALLBACK BUTTON */}
              <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  type="button"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    border: '1px solid #be185d',
                    backgroundColor: selectedTargets.some(t => t.type === 'all') ? '#be185d' : '#ffffff',
                    color: selectedTargets.some(t => t.type === 'all') ? '#ffffff' : '#be185d',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={handleSetAllJewelry}
                >
                  ✨ Apply to All Jewelry (Storewide Default)
                </button>
                {selectedTargets.some(t => t.type === 'all') && (
                  <span style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                    Currently targeting entire storefront item registry.
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                
                {/* 1. SEPARATED CATEGORIES DROPDOWN */}
                <div className="category-dropdown-container" style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
                    Filter by Categories
                  </label>
                  <div
                    className="panel-input"
                    style={{
                      minHeight: '44px', height: 'auto', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center',
                      cursor: hasProductsSelected ? 'not-allowed' : 'pointer', padding: '6px 30px 6px 12px',
                      background: hasProductsSelected ? '#f1f5f9' : '#fff', border: '1px solid #cbd5e1', borderRadius: '6px',
                      opacity: hasProductsSelected ? 0.6 : 1
                    }}
                    onClick={() => !hasProductsSelected && setIsCategoryOpen(!isCategoryOpen)}
                  >
                    {hasProductsSelected && <FiLock style={{ color: '#94a3b8', marginRight: '4px' }} />}
                    {selectedTargets.filter(t => t.type === 'category').length === 0 ? (
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                        {hasProductsSelected ? 'Disabled (Products active)' : 'Select categories...'}
                      </span>
                    ) : (
                      selectedTargets.filter(t => t.type === 'category').map(target => (
                        <span 
                          key={target.id} 
                          style={{ backgroundColor: '#fbcfe8', color: '#be185d', fontSize: '12px', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          onClick={(e) => { e.stopPropagation(); handleToggleTarget('category', target.id, target.name); }}
                        >
                          {target.name}
                          <b style={{ color: '#9d174d' }}>×</b>
                        </span>
                      ))
                    )}
                    <FiChevronDown style={{ position: 'absolute', right: '12px', top: '38px', color: '#64748b', transform: `rotate(${isCategoryOpen ? '180deg' : '0deg'})`, transition: 'transform 0.2s' }} />
                  </div>

                  {isCategoryOpen && (
                    <div style={{ position: 'absolute', top: '102%', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 10px 20px rgba(0,0,0,0.08)', zIndex: 99, padding: '10px', maxHeight: '250px', overflowY: 'auto' }}>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ position: 'relative', flex: 1 }}>
                          <FiSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                          <input type="text" placeholder="Search categories..." className="panel-input" style={{ paddingLeft: '32px', height: '34px', fontSize: '13px', marginBottom: 0 }} value={categorySearch} onChange={e => setCategorySearch(e.target.value)} />
                        </div>
                        <button type="button" style={{ height: '34px', padding: '0 12px', backgroundColor: '#be185d', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }} onClick={() => setIsCategoryOpen(false)}>Done</button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {availableCategories
                          .filter(cat => cat.name?.toLowerCase().includes(categorySearch.toLowerCase()))
                          .map(cat => {
                            const catId = cat.name; // Using name as identifier matching logic
                            const isChecked = isTargetChecked('category', catId);
                            return (
                              <div key={cat._id || cat.id} style={{ padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', backgroundColor: isChecked ? '#fbcfe8' : 'transparent', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }} onClick={() => handleToggleTarget('category', catId, cat.name)}>
                                <span>📦 {cat.name}</span>
                                {isChecked && <span style={{ color: '#be185d', fontWeight: 'bold' }}>✓</span>}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. SEPARATED PRODUCTS DROPDOWN */}
                <div className="product-dropdown-container" style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
                    Filter by Individual Products
                  </label>
                  <div
                    className="panel-input"
                    style={{
                      minHeight: '44px', height: 'auto', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center',
                      cursor: hasCategoriesSelected ? 'not-allowed' : 'pointer', padding: '6px 30px 6px 12px',
                      background: hasCategoriesSelected ? '#f1f5f9' : '#fff', border: '1px solid #cbd5e1', borderRadius: '6px',
                      opacity: hasCategoriesSelected ? 0.6 : 1
                    }}
                    onClick={() => !hasCategoriesSelected && setIsProductOpen(!isProductOpen)}
                  >
                    {hasCategoriesSelected && <FiLock style={{ color: '#94a3b8', marginRight: '4px' }} />}
                    {selectedTargets.filter(t => t.type === 'product').length === 0 ? (
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                        {hasCategoriesSelected ? 'Disabled (Categories active)' : 'Select products...'}
                      </span>
                    ) : (
                      selectedTargets.filter(t => t.type === 'product').map(target => (
                        <span 
                          key={target.id} 
                          style={{ backgroundColor: '#e0e7ff', color: '#4338ca', fontSize: '12px', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          onClick={(e) => { e.stopPropagation(); handleToggleTarget('product', target.id, target.name); }}
                        >
                          {target.name}
                          <b style={{ color: '#3730a3' }}>×</b>
                        </span>
                      ))
                    )}
                    <FiChevronDown style={{ position: 'absolute', right: '12px', top: '38px', color: '#64748b', transform: `rotate(${isProductOpen ? '180deg' : '0deg'})`, transition: 'transform 0.2s' }} />
                  </div>

                  {isProductOpen && (
                    <div style={{ position: 'absolute', top: '102%', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 10px 20px rgba(0,0,0,0.08)', zIndex: 99, padding: '10px', maxHeight: '250px', overflowY: 'auto' }}>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ position: 'relative', flex: 1 }}>
                          <FiSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                          <input type="text" placeholder="Search products..." className="panel-input" style={{ paddingLeft: '32px', height: '34px', fontSize: '13px', marginBottom: 0 }} value={productSearch} onChange={e => setProductSearch(e.target.value)} />
                        </div>
                        <button type="button" style={{ height: '34px', padding: '0 12px', backgroundColor: '#be185d', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }} onClick={() => setIsProductOpen(false)}>Done</button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {availableProducts
                          .filter(prod => prod.name?.toLowerCase().includes(productSearch.toLowerCase()))
                          .map(prod => {
                            const prodId = prod._id || prod.id;
                            const isChecked = isTargetChecked('product', prodId);
                            return (
                              <div key={prodId} style={{ padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', backgroundColor: isChecked ? '#e0e7ff' : 'transparent', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }} onClick={() => handleToggleTarget('product', prodId, prod.name)}>
                                <span>💎 {prod.name}</span>
                                {isChecked && <span style={{ color: '#4338ca', fontWeight: 'bold' }}>✓</span>}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Dynamic Timeline Component Setup */}
              <div className="form-field campaign-schedule-grid">
                <div className="schedule-group">
                  <div className="schedule-field"><label className="field-top-label">Start Date</label><input type="date" className="panel-input date-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
                  <div className="schedule-field"><label className="field-top-label">Start Time</label><input type="time" className="panel-input time-input" value={startTime} onChange={(e) => setStartTime(e.target.value)} /></div>
                </div>
                <div className="schedule-group">
                  <div className="schedule-field"><label className="field-top-label">End Date</label><input type="date" className="panel-input date-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
                  <div className="schedule-field"><label className="field-top-label">End Time</label><input type="time" className="panel-input time-input" value={endTime} onChange={(e) => setEndTime(e.target.value)} /></div>
                </div>
              </div>

            </div>

            <div className="form-right-col">
              <div className="date-picker-block">
                <label>Campaign Settings Preview</label>
                <div className="preview-card-box">
                  <strong>Type:</strong> {discountType.toUpperCase()}<br/>
                  <strong>Scope Targets:</strong> {selectedTargets.length > 0 ? selectedTargets.map(t => t.name).join(', ') : 'None chosen yet'}<br/>
                  <strong>Status:</strong> {editingId ? '⚠️ Editing' : '✨ New Entry'}
                </div>
              </div>
            </div>

            <div className="form-footer-actions">
              <div className="submit-buttons" style={{ marginLeft: 'auto' }}>
                {editingId && <button type="button" className="btn-save-promo cancel-btn" onClick={clearFormFields}>Cancel</button>}
                <button type="submit" className="btn-save-promo">{editingId ? 'Update Campaign' : 'Save Promotion'}</button>
              </div>
            </div>
          </form>
        </section>

        {/* CLOUD GLOBAL STOREFRONT HEADER BANNER CONTROLLER */}
        <section className="content-panel form-panel" style={{ marginTop: '24px' }}>
          <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiSliders size={18} /> Customer Storefront Banner</h3>
          <form className="create-promo-form" onSubmit={handleSaveGlobalBanner}>
            <div className="form-left-col" style={{ width: '100%', flex: 'none' }}>
              <div className="form-field banner-statement-block">
                <label className="field-top-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#be185d' }}><FiEdit3 size={14} /> Storefront Announcement Text</label>
                <textarea rows="2" className="panel-input" placeholder="Enter custom text to stream across the storefront's master header..." style={{ resize: 'none', minHeight: '65px', paddingTop: '10px' }} disabled={isBannerSaving} value={bannerText} onChange={(e) => setBannerText(e.target.value)} />
              </div>
              <div className="form-footer-actions" style={{ marginTop: '16px', padding: 0, border: 'none' }}>
                <div className="banner-toggle" onClick={handleToggleSwitch}>
                  <div className={`switch-pill ${isDisplay ? 'active-pink' : ''}`}><div className="switch-circle"></div></div>
                  <span className="toggle-text">{isDisplay ? '✅ Global Header Banner is LIVE' : '❌ Global Header Banner is DISABLED'}</span>
                </div>
                <div className="submit-buttons" style={{ marginLeft: 'auto' }}>
                  <button type="submit" className="btn-save-promo" style={{ backgroundColor: '#1e293b', opacity: isBannerSaving ? 0.7 : 1, cursor: isBannerSaving ? 'not-allowed' : 'pointer' }} disabled={isBannerSaving}>
                    {isBannerSaving ? "Saving Config..." : "Save Banner!"}
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