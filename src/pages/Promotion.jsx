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
    const fetchPromotions = async () => {
      try {
        const token = localStorage.getItem("ACCESS_TOKEN") || localStorage.getItem("adminToken") || localStorage.getItem("token") || localStorage.getItem("accessToken");
        const axiosConfig = {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        };

        // -------------------------------------------------------------------------
        // 🔥 BOLD LABEL: API FOR FETCHING ALL PROMOTIONS (GET)
        // LOCATION: Inside mounting useEffect() block -> fetchPromotions()
        // CURRENT PATH: `${baseUrl}/promotion/all`
        // -------------------------------------------------------------------------
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/promotion/all`,
          axiosConfig
        );

        if (response.data) {
          setPromos(response.data);
          localStorage.setItem("storePromotions", JSON.stringify(response.data));
        }
      } catch (error) {
        console.error("Error fetching live database campaigns:", error);
        const backupPromos = JSON.parse(localStorage.getItem("storePromotions")) || [];
        setPromos(backupPromos);
      }
    };

    const fetchGlobalBanner = async () => {
      try {
        // -------------------------------------------------------------------------
        // 🔥 BOLD LABEL: API FOR FETCHING ANNOUNCEMENT BANNER (GET)
        // LOCATION: Inside mounting useEffect() block -> fetchGlobalBanner()
        // CURRENT PATH: `${baseUrl}/announcement/active`
        // -------------------------------------------------------------------------
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
        // -------------------------------------------------------------------------
        // 🔥 BOLD LABEL: API FOR FETCHING STORES INDIVIDUAL CATEGORIES & PRODUCTS (GET)
        // LOCATION: Inside mounting useEffect() block -> fetchTargetingData()
        // CURRENT PATHS: `${baseUrl}/category/all` AND `${baseUrl}/product/all`
        // -------------------------------------------------------------------------
        const [categoriesRes, productsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/category/all`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/product/all`)
        ]);
        if (categoriesRes.data) setAvailableCategories(categoriesRes.data);
        if (productsRes.data) setAvailableProducts(productsRes.data);
      } catch (error) {
        console.error("Error parsing setup payload channels:", error);
      }
    };

    // Execute the queries
    fetchPromotions();
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
    const startObj = new Date(`${promo.startDate || promo.start}T${promo.startTime || '00:00'}`);
    const endObj = new Date(`${promo.endDate || promo.end}T${promo.endTime || '23:59'}`);
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

    let updated = selectedTargets.filter(item => item.type !== 'all');
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
  // CORE FORM SUBMISSION LOGIC (CREATE & UPDATE)
  // ==========================================
  const handleSavePromotion = async (e) => {
    e.preventDefault();
    if (!promoTitle || !discountValue || selectedTargets.length === 0) {
      toast.error("Please provide a title, numerical value, and an active targeting element scope.");
      return;
    }

    const willCauseNegativePricing = availableProducts.filter(product => {
      if (selectedTargets.some(t => t.type === 'all')) return true;
      if (selectedTargets.some(t => t.type === 'product' && t.id === (product._id || product.id))) return true;
      if (selectedTargets.some(t => t.type === 'category' && t.id === product.category)) return true;
      return false;
    }).some(product => {
      const orig = parseFloat(product.price || 0);
      const disc = parseFloat(discountValue || 0);
      return discountType === 'percentage' ? disc > 100 : (orig - disc) < 0;
    });

    if (willCauseNegativePricing) {
      toast.error("Cannot save! One or more items have dropped into negative pricing structures.");
      return;
    }

    const payload = {
      title: promoTitle,
      discountType: discountType,
      discountValue: discountValue,
      startDate: startDate || new Date().toISOString().split('T')[0],
      startTime: startTime || "00:00",
      endDate: endDate || new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      endTime: endTime || "23:59",
      targets: selectedTargets,
      status: editingId ? "updated" : "active" 
    };

    const token = localStorage.getItem("ACCESS_TOKEN") || localStorage.getItem("adminToken") || localStorage.getItem("token");
    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    };

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      
      if (editingId) {
        // -------------------------------------------------------------------------
        // 🔥 BOLD LABEL: API FOR UPDATING AN EXISTING PROMOTION (POST/PUT)
        // LOCATION: Inside handleSavePromotion() -> if (editingId) block
        // CURRENT PATH: `${baseUrl}/promotion/update/${editingId}`
        // -------------------------------------------------------------------------
        await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/promotion/update/${editingId}`, payload, axiosConfig);
        toast.success("Campaign updated successfully!");
      } else {
        // -------------------------------------------------------------------------
        // 🔥 BOLD LABEL: API FOR CREATING A NEW PROMOTION (POST)
        // LOCATION: Inside handleSavePromotion() -> else block
        // CURRENT PATH: `${baseUrl}/promotion/create`
        // -------------------------------------------------------------------------
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/promotion/create`, payload, axiosConfig);
        toast.success("New promotional campaign launched successfully!");
      }

      // Re-fetch dynamic server state clean-slate
      const refreshResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/promotion/all`, axiosConfig);
      if (refreshResponse.data) {
        setPromos(refreshResponse.data);
        localStorage.setItem("storePromotions", JSON.stringify(refreshResponse.data));
      }
      clearFormFields();
    } catch (error) {
      console.error("Error dispatching promotion parameters:", error);
      toast.error(error.response?.data?.message || "Failed to establish a network pathway to servers.");
    }
  };

  const handleEditClick = (promo) => {
    setEditingId(promo._id || promo.id);
    setPromoTitle(promo.title);
    setDiscountType(promo.discountType || promo.type || 'percentage');
    setDiscountValue(promo.discountValue || promo.value || "");

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

    setStartDate(promo.startDate || promo.start || "");
    setStartTime(promo.startTime || "");
    setEndDate(promo.endDate || promo.end || "");
    setEndTime(promo.endTime || "");
    toast.loading("Editing promotion campaign...", { id: "edit-load", duration: 1000 });
  };

  // ==========================================
  // UPDATED PAUSE / RESUME API HANDLER
  // ==========================================
  const handleTogglePause = async (targetId) => {
    if (!targetId) {
      toast.error("Invalid tracker reference ID.");
      return;
    }

    const token = localStorage.getItem("ACCESS_TOKEN") || localStorage.getItem("adminToken") || localStorage.getItem("token");
    const axiosConfig = { headers: { 'Authorization': token ? `Bearer ${token}` : '' } };
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const currentPromo = promos.find(p => (p._id || p.id) === targetId);
    const isCurrentlyPaused = currentPromo?.status === 'paused';
    
    // Switch action endpoints automatically depending on current live status
    const actionEndpoint = isCurrentlyPaused ? 'resume' : 'pause';

    try {
      // -------------------------------------------------------------------------
      // 🔥 BOLD LABEL: API FOR PAUSING & RESUMING PROMOTIONS (PUT)
      // LOCATION: Inside handleTogglePause() function
      // CURRENT PATHS: `${baseUrl}/promotion/pause/${targetId}` OR `${baseUrl}/promotion/resume/${targetId}`
      // -------------------------------------------------------------------------
      await axios.put(`${baseUrl}/promotion/${actionEndpoint}/${targetId}`, {}, axiosConfig);

      const updated = promos.map(p => {
        if ((p._id || p.id) === targetId) {
          return { ...p, status: isCurrentlyPaused ? 'active' : 'paused' };
        }
        return p;
      });
      
      setPromos(updated);
      localStorage.setItem("storePromotions", JSON.stringify(updated));
      
      if (isCurrentlyPaused) {
        toast.success("Campaign added back into active status!");
      } else {
        toast.error("Campaign paused successfully.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync pause state configuration changes on server.");
    }
  };

  // ==========================================
  // CORE API DETACHMENT / DELETION PIPELINE
  // ==========================================
  const handleDeleteClick = async (id) => {
    if (!id) {
      toast.error("Invalid tracker reference ID. Refresh browser and retry.");
      return;
    }
    if (!window.confirm("Permanently delete this promotion type?")) return;

    const token = localStorage.getItem("ACCESS_TOKEN") || localStorage.getItem("adminToken") || localStorage.getItem("token");
    const axiosConfig = {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    };

    try {
      // -------------------------------------------------------------------------
      // 🔥 BOLD LABEL: API FOR DELETING A PROMOTION (DELETE)
      // LOCATION: Inside handleDeleteClick() function
      // CURRENT PATH: `${baseUrl}/promotion/delete/${id}`
      // -------------------------------------------------------------------------
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/promotion/delete/${id}`,
        axiosConfig
      );
      
      const updated = promos.filter(p => p.id !== id && p._id !== id);
      setPromos(updated);
      localStorage.setItem("storePromotions", JSON.stringify(updated));
      
      toast.success("Promotion successfully purged from cloud servers.");
    } catch (error) {
      console.error("Error purging target promotion asset:", error);
      toast.error(error.response?.data?.message || "Failed to drop promotion from database registry.");
    }
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

      // -------------------------------------------------------------------------
      // 🔥 BOLD LABEL: API FOR CREATING/UPDATING STOREFRONT ANNOUNCEMENT BANNER (POST)
      // LOCATION: Inside handleSaveGlobalBanner() function
      // CURRENT PATH: `${baseUrl}/announcement/create`
      // -------------------------------------------------------------------------
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/announcement/create`,
        { message: bannerText, isDisplay },
        { headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' } }
      );
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
                    const currentPromoId = promo._id || promo.id;
                    const { startObj, endObj } = getPromoTimestamps(promo);
                    const isPaused = promo.status === 'paused';
                    const isUpcoming = currentTime < startObj;
                    const isExpired = currentTime > endObj;
                    let statusLabel = "Live & Active";
                    let pillClass = "";

                    if (isPaused) { statusLabel = "Paused"; pillClass = "out-pill"; }
                    else if (isUpcoming) { statusLabel = "Upcoming"; pillClass = "upcoming-pill"; }
                    else if (isExpired) { statusLabel = "Expired"; pillClass = "out-pill"; }

                    const displayValue = promo.discountValue || promo.value || "0";
                    const displayType = promo.discountType || promo.type || "percentage";

                    return (
                      <tr key={currentPromoId} style={{ opacity: (isExpired || isPaused) ? 0.6 : 1 }}>
                        <td><div className="promo-info-cell"><strong>{promo.title}</strong><span>{promo.subtitle || 'Custom Target Range Campaign'}</span></div></td>
                        <td className="price-bold">GHC {displayValue} ({displayType === 'percentage' ? '%' : '₵'})</td>
                        <td><span className={`stock-pill ${pillClass}`}>{statusLabel}</span></td>
                        <td>
                          <div className="action-buttons-group">
                            <button className="action-btn edit-btn" onClick={() => handleEditClick(promo)}>Edit</button>
                            <button className="action-btn pause-btn" style={{ backgroundColor: isPaused ? '#10b981' : '#f59e0b' }} onClick={() => handleTogglePause(currentPromoId)}>{isPaused ? 'Resume' : 'Pause'}</button>
                            <button className="action-btn delete-btn" onClick={() => handleDeleteClick(currentPromoId)}>Delete</button>
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

              <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  type="button"
                  style={{
                    padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: '1px solid #be185d',
                    backgroundColor: selectedTargets.some(t => t.type === 'all') ? '#be185d' : '#ffffff',
                    color: selectedTargets.some(t => t.type === 'all') ? '#ffffff' : '#be185d', transition: 'all 0.2s ease'
                  }}
                  onClick={handleSetAllJewelry}
                >
                  ✨ Apply to All Jewelry
                </button>
                {selectedTargets.some(t => t.type === 'all') && (
                  <span style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                    Currently targeting entire storefront item registry.
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
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
                            const catId = cat.name;
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
                <div className="preview-card-box" style={{ lineHeight: '1.8', fontSize: '13px' }}>
                  <strong>Type:</strong> <span style={{ color: '#be185d', fontWeight: 'bold' }}>{discountType.toUpperCase()}</span><br/>
                  <strong>Scope Targets:</strong> {selectedTargets.length > 0 ? selectedTargets.map(t => t.name).join(', ') : 'None chosen yet'}<br/>
                  <strong>Status:</strong> {editingId ? '⚠️ Editing' : '✨ New Entry'}
                  
                  <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px dashed #cbd5e1' }} />
                  
                  <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#475569', fontWeight: 'bold' }}>Live Price Preview Mockup:</h4>
                    
                    {selectedTargets.length === 0 ? (
                      <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Select a target asset scope to view pricing adjustments.</span>
                    ) : (() => {
                      const matchedProducts = availableProducts.filter(product => {
                        if (selectedTargets.some(t => t.type === 'all')) return true;
                        if (selectedTargets.some(t => t.type === 'product' && t.id === (product._id || product.id))) return true;
                        if (selectedTargets.some(t => t.type === 'category' && t.id === product.category)) return true;
                        return false;
                      });

                      if (matchedProducts.length === 0) {
                        return <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No products found matching selection.</span>;
                      }

                      const triggersNegativePricing = matchedProducts.some(product => {
                        const originalPrice = parseFloat(product.price || 0);
                        const discountNum = parseFloat(discountValue || 0);
                        if (discountType === 'percentage') {
                          return discountNum > 100;
                        } else {
                          return (originalPrice - discountNum) < 0;
                        }
                      });

                      const groupedProducts = matchedProducts.reduce((groups, product) => {
                        const categoryName = product.category || 'Uncategorized';
                        if (!groups[categoryName]) {
                          groups[categoryName] = [];
                        }
                        groups[categoryName].push(product);
                        return groups;
                      }, {});

                      return (
                        <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {triggersNegativePricing && (
                            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #f87171', color: '#991b1b', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', lineHeight: '1.4' }}>
                              ⚠️ <strong>Critical Pricing Alert:</strong> Your current discount value forces one or more jewelry items into a negative or zero balance! Please adjust your numbers.
                            </div>
                          )}

                          {Object.keys(groupedProducts).map(categoryGroup => (
                            <div key={categoryGroup} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', marginTop: '2px' }}>
                                📦 {categoryGroup}
                              </div>
                              
                              {groupedProducts[categoryGroup].map(product => {
                                const originalPrice = parseFloat(product.price || 0);
                                const discountNum = parseFloat(discountValue || 0);
                                let calculatedNewPrice = originalPrice;

                                if (discountType === 'percentage' && discountNum > 0) {
                                  calculatedNewPrice = originalPrice - (originalPrice * (discountNum / 100));
                                } else if (discountType === 'fixed' && discountNum > 0) {
                                  calculatedNewPrice = originalPrice - discountNum;
                                }

                                const isThisProductNegative = calculatedNewPrice <= 0;

                                return (
                                  <div key={product._id || product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderBottom: '1px solid #f1f5f9', padding: '2px 4px' }}>
                                    <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#334155' }}>
                                      💎 {product.name}
                                    </span>
                                    <span>
                                      <span style={{ textDecoration: 'line-through', color: '#94a3b8', marginRight: '6px' }}>₵{originalPrice.toFixed(2)}</span>
                                      <strong style={{ color: isThisProductNegative ? '#dc2626' : '#10b981' }}>
                                        ₵{calculatedNewPrice.toFixed(2)}
                                      </strong>
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-footer-actions">
              <div className="submit-buttons" style={{ marginLeft: 'auto' }}>
                {editingId && <button type="button" className="btn-save-promo cancel-btn" onClick={clearFormFields}>Cancel</button>}
                <button type="submit" className="btn-save-promo">
                  {editingId ? 'Save Update' : 'Save Promotion'}
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Global Storefront Banner Controller */}
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