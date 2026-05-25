import React, { useState, useEffect, useRef } from 'react';
import '../ManageProduct.css';
import { 
  FiSearch, FiBell, FiChevronDown, FiFilter, FiDownload, 
  FiChevronLeft, FiChevronRight, FiShoppingBag, FiX,
  FiCopy, FiCheck, FiPlus
} from 'react-icons/fi';
import SideBar from '../components/SideBar';
import { useNavigate } from "react-router";

function ManageProduct() {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  
  // Interactive UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // --- NOTIFICATION BELL INTERACTIVE UI STATES ---
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // --- NOTIFICATION STORE STATES ---
  const [notifMetrics, setNotifMetrics] = useState({
    lowStockItems: [],
    outOfStockItems: [],
    totalAlertsCount: 0
  });

  // --- DYNAMIC PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100; 

  const dropdownRef = useRef(null);
  const filterRef = useRef(null);

  // Sync data from localStorage and handle outside clicks
  useEffect(() => {
    loadProducts();
    
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdownId(null);
      }
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setIsFilterDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const loadProducts = () => {
    const storedItems = JSON.parse(localStorage.getItem("inventoryProducts")) || [];
    
    const outOfStock = storedItems.filter(item => (parseInt(item.stock) || 0) === 0);
    const lowStock = storedItems.filter(item => {
      const stockVal = parseInt(item.stock) || 0;
      return stockVal < 50 && stockVal > 0;
    });

    setNotifMetrics({
      lowStockItems: lowStock,
      outOfStockItems: outOfStock,
      totalAlertsCount: outOfStock.length + lowStock.length
    });

    const dynamicProducts = storedItems.map((item) => {
      let resolvedThumb = "https://via.placeholder.com/100?text=No+Media";
      if (item.media && item.media.length > 0) {
        resolvedThumb = item.media[item.mainIndex || 0];
      }
      return {
        id: item.id,
        name: item.name || "Unnamed Product",
        category: item.category || 'General',
        stock: item.stock || '0',
        price: parseFloat(item.price || 0).toFixed(2),
        status: parseInt(item.stock) > 0 ? 'Active' : 'Inactive',
        image: resolvedThumb,
        tag: item.tag || '',
        description: item.description || '',
        moq: item.moq || '1',
        colors: item.colors || [],
        media: item.media || []
      };
    });
    setProductList(dynamicProducts);
  };

  const goToAddProduct = () => navigate("/addproduct");

  const filteredProducts = productList.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tag.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      selectedCategory === "All" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = ["All", ...new Set(productList.map(p => p.category))];

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [searchQuery, selectedCategory, totalPages, currentPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPaginatedProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handleExportToCSV = () => {
    if (filteredProducts.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = ["Product ID", "Name", "Category", "Stock Level", "Price (GHC)", "Status", "Tags"];
    const csvRows = filteredProducts.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.stock,
      p.price,
      p.status,
      `"${p.tag}"`
    ]);

    const csvContent = [headers.join(","), ...csvRows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Inventory_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteProduct = (id) => {
    setActiveDropdownId(null);
    const confirmed = window.confirm("Are you sure you want to permanently remove this product from inventory?");
    if (!confirmed) return;

    const storedItems = JSON.parse(localStorage.getItem("inventoryProducts")) || [];
    const filteredItems = storedItems.filter(item => item.id !== id);
    localStorage.setItem("inventoryProducts", JSON.stringify(filteredItems));
    loadProducts();
  };

  const handleOpenEditModal = (product) => {
    setActiveDropdownId(null);
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleUpdateProductSubmit = (e) => {
    e.preventDefault();
    const storedItems = JSON.parse(localStorage.getItem("inventoryProducts")) || [];
    const updatedItems = storedItems.map(item => {
      if (item.id === editingProduct.id) {
        return {
          ...item,
          name: editingProduct.name,
          category: editingProduct.category,
          price: editingProduct.price,
          stock: editingProduct.stock,
          tag: editingProduct.tag,
        };
      }
      return item;
    });

    localStorage.setItem("inventoryProducts", JSON.stringify(updatedItems));
    setIsModalOpen(false);
    setEditingProduct(null);
    loadProducts();
  };

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  const toggleProductStatus = (id) => {
    setActiveDropdownId(null);
    const storedItems = JSON.parse(localStorage.getItem("inventoryProducts")) || [];
    const updatedItems = storedItems.map(item => {
      if (item.id === id) {
        const currentStock = parseInt(item.stock) || 0;
        const targetStock = currentStock === 0 ? '10' : '0';
        return { ...item, stock: targetStock };
      }
      return item;
    });
    localStorage.setItem("inventoryProducts", JSON.stringify(updatedItems));
    loadProducts();
  };

  const duplicateProduct = (product) => {
    setActiveDropdownId(null);
    const storedItems = JSON.parse(localStorage.getItem("inventoryProducts")) || [];
    const baseItem = storedItems.find(item => item.id === product.id);
    
    if (baseItem) {
      const clone = {
        ...baseItem,
        id: `prod_${Date.now()}`,
        name: `${baseItem.name} (Copy)`,
      };
      localStorage.setItem("inventoryProducts", JSON.stringify([...storedItems, clone]));
      loadProducts();
    }
  };

  const lowStockItems = filteredProducts.filter(p => {
    const s = parseInt(p.stock) || 0;
    return s <= 5 && s > 0;
  });
  const outOfStockItems = filteredProducts.filter(p => (parseInt(p.stock) || 0) === 0);

  return (
    <div className="admin-layout">
      <SideBar />

      <main className="inventory-main">
        {/* Header Section */}
        <header className="inventory-header">
          <h1>Manage Products</h1>
          <div className="header-actions" ref={notifRef}>
            <FiSearch className="header-icon" />
            
            <button 
              className={`icon-btn badge-btn ${isNotifOpen ? 'active-bell' : ''}`}
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              style={{ position: 'relative', cursor: 'pointer', background: 'none', border: 'none', padding: '4px' }}
            >
              <FiBell className="header-icon" style={{ margin: 0 }} /> 
              {notifMetrics.totalAlertsCount > 0 && (
                <span className="badge" style={badgeNotifStyle}>
                  {notifMetrics.totalAlertsCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="notification-dropdown-panel" style={notifPanelStyle}>
                <div style={notifHeaderStyle}>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>Inventory Stock Alerts</span>
                  <button onClick={() => setIsNotifOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}><FiX /></button>
                </div>
                
                <div className="notification-scroll-container" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  {notifMetrics.totalAlertsCount === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>
                      All items have healthy stock configurations.
                    </div>
                  ) : (
                    <>
                      {notifMetrics.outOfStockItems.map(item => (
                        <div key={`notif-out-${item.id}`} style={notifItemStyle}>
                          <div style={{ ...statusIndicatorStyle, backgroundColor: '#ef4444' }}></div>
                          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                            <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500' }}>{item.name} is empty!</span>
                            <small style={{ fontSize: '11px', color: '#64748b' }}>Stock dropped to absolute 0 units.</small>
                          </div>
                        </div>
                      ))}

                      {notifMetrics.lowStockItems.map(item => (
                        <div key={`notif-low-${item.id}`} style={notifItemStyle}>
                          <div style={{ ...statusIndicatorStyle, backgroundColor: '#f97316' }}></div>
                          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                            <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500' }}>{item.name} running low</span>
                            <small style={{ fontSize: '11px', color: '#64748b' }}>Critical Level: {item.stock} items left in store.</small>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="badge-wrapper"></div>
            <img src="https://i.pravatar.cc/150?img=47" alt="Profile" className="top-profile-img" />
          </div>
        </header>

        {/* Toolbar Controls */}
        <section className="inventory-toolbar">
          <button className="add-product-btn" onClick={goToAddProduct}>
            <span className="plus-sign">+</span> Add New Product
          </button>

          <div className="search-bar-wrapper">
            <FiSearch className="input-search-icon" />
            <input 
              type="text" 
              placeholder="Search by name, category, tags..." 
              className="toolbar-search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{ border: 'none', background: 'none', position: 'absolute', right: '45px', cursor: 'pointer', color: '#94a3b8' }}><FiX /></button>
            )}
            <button className="search-trigger-btn"><FiSearch /></button>
          </div>

          <div className="filter-button-container" style={{ position: 'relative' }} ref={filterRef}>
            <button 
              className={`toolbar-action-btn ${selectedCategory !== 'All' ? 'active-filter' : ''}`}
              onClick={() => setTimeout(() => setIsFilterDropdownOpen(!isFilterDropdownOpen), 0)}
            >
              <FiFilter /> Filter: {selectedCategory}
            </button>
            
            {isFilterDropdownOpen && (
              <div className="filter-dropdown-select" style={filterDropdownStyle}>
                <span style={{ fontSize: '11px', padding: '6px 12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Filter By Category</span>
                {uniqueCategories.map((cat, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => { setSelectedCategory(cat); setIsFilterDropdownOpen(false); }}
                    style={{ ...dropdownItemStyle, backgroundColor: selectedCategory === cat ? '#f1f5f9' : 'transparent', fontWeight: selectedCategory === cat ? '600' : '400' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="toolbar-action-btn export-csv-btn" onClick={handleExportToCSV}>
            <FiDownload /> Export CSV
          </button>
        </section>

        {/* Table Panel Grid */}
        <section className="table-panel">
          {productList.length === 0 ? (
            <div className="empty-state-wrapper" style={{ padding: '60px 20px', textAlign: 'center', background: '#fff', borderRadius: '8px' }}>
              <FiShoppingBag style={{ fontSize: '3.5rem', color: '#cbd5e1', marginBottom: '16px' }} />
              <h3 style={{ color: '#334155', marginBottom: '8px', fontSize: '18px' }}>Your Catalog Database is Empty</h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
                You haven't added a product yet. <br /> Add your first Product 
              </p>
              <button 
                className="add-product-btn" 
                onClick={goToAddProduct} 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', margin: '0 auto', padding: '12px 20px' }}
              >
                <FiPlus /> Add Your First Product
              </button>
            </div>
          ) : currentPaginatedProducts.length === 0 ? (
            <div className="empty-state-wrapper" style={{ padding: '60px 20px', textAlign: 'center', background: '#fff', borderRadius: '8px' }}>
              <FiSearch style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '16px' }} />
              <h3 style={{ color: '#334155', marginBottom: '8px' }}>No Products Matching Criteria</h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>Try modifying your spelling or resetting the category filters.</p>
              {(searchQuery || selectedCategory !== "All") && (
                <button className="add-product-btn" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }} style={{ display: 'inline-flex', margin: '0 auto' }}>
                  Clear Active Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px', textAlign: 'center' }}>#</th>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th className="center-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPaginatedProducts.map((product, index) => {
                      const stockValue = parseInt(product.stock) || 0;
                      const isOutOfStock = stockValue === 0;
                      const displayRowNumber = indexOfFirstItem + index + 1;

                      return (
                        <tr key={product.id}>
                          <td style={{ textAlign: 'center', fontWeight: '600', color: '#64748b', fontSize: '13px' }}>
                            {displayRowNumber}.
                          </td>
                          <td>
                            <div className="product-identity-cell">
                              <img src={product.image} alt={product.name} className="product-thumb" />
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span className="product-title-text">{product.name}</span>
                                {product.tag && <span className="meta-hash-tag" style={{ fontSize: '11px', color: '#e11d48', fontWeight: '500' }}>#{product.tag}</span>}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="category-tag">{product.category}</span>
                          </td>
                          <td className="stock-cell-data">
                            <span className={isOutOfStock ? 'danger-text' : ''}>
                              {isOutOfStock ? 'Out of Stock' : `${stockValue} units`}
                            </span>
                          </td>
                          <td className="price-text-bold">GHC {product.price}</td>
                          <td>
                            <span className={`status-pill ${!isOutOfStock ? 'pill-active' : 'pill-inactive'}`}>
                              {isOutOfStock ? 'Inactive' : 'Active'}
                            </span>
                          </td>
                          <td>
                            <div className="action-button-cluster" style={{ position: 'relative' }}>
                              <button className="row-btn edit-row-btn" onClick={() => handleOpenEditModal(product)}>
                                Edit
                              </button>
                              <button className="row-btn delete-row-btn" onClick={() => handleDeleteProduct(product.id)}>
                                Delete
                              </button>
                              
                              <div style={{ display: 'inline-block' }} ref={activeDropdownId === product.id ? dropdownRef : null}>
                                <button className="row-dropdown-toggle" onClick={(e) => toggleDropdown(product.id, e)}>
                                  <FiChevronDown />
                                </button>

                                {activeDropdownId === product.id && (
                                  <div className="custom-dropdown-menu" style={actionDropdownMenuStyle}>
                                    <button onClick={() => toggleProductStatus(product.id)} style={dropdownItemStyle}>
                                      <FiCheck style={{ marginRight: '8px' }} /> Toggle Stock Status
                                    </button>
                                    <button onClick={() => duplicateProduct(product)} style={dropdownItemStyle}>
                                      <FiCopy style={{ marginRight: '8px' }} /> Duplicate Template
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <footer className="table-pagination-footer">
                <span className="entries-count">
                  Showing {totalItems === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
                </span>
                
                <div className="pagination-controls">
                  <button 
                    className="page-arrow-btn"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{ opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                  >
                    <FiChevronLeft />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        className={`page-num-btn ${currentPage === pageNum ? 'active-page' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                        style={{
                          fontWeight: currentPage === pageNum ? 'bold' : 'normal',
                          backgroundColor: currentPage === pageNum ? '#e11d48' : 'transparent',
                          color: currentPage === pageNum ? '#fff' : '#4a5568',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button 
                    className="page-arrow-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{ opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </footer>
            </>
          )}
        </section>

        {/* Bottom Metadata Summary Cards */}
        <section className="summary-boxes-grid">
          <div className="summary-box-card">
            <h4 className="box-card-title"><span className="box-title-icon yellow-dot">ℹ</span> Low Stock Alerts</h4>
            <ul className="box-list-items">
              {lowStockItems.length === 0 && outOfStockItems.length === 0 && (
                <li style={{ color: '#64748b', fontStyle: 'italic' }}>All item stock levels healthy.</li>
              )}
              {lowStockItems.map((p, idx) => (
                <li key={idx}>{p.name} - Only {p.stock} Left!</li>
              ))}
              {outOfStockItems.map((p, idx) => (
                <li key={idx} style={{ color: '#e53e3e' }}>{p.name} - Out of Stock!</li>
              ))}
            </ul>
          </div>

          <div className="summary-box-card prompt-card-relative">
            <h4 className="box-card-title"><span className="box-title-icon orange-dot">ℹ</span> Active Promotions</h4>
            <ul className="box-list-items">
              <li>Spring Sale - 20% Off All Items</li>
              <li>Flash Deal - 20% Off Diamond Rings</li>
            </ul>
            <a href='/promotion'><button className="floating-action-bottom-btn">Manage Promotions</button></a> 
          </div>
        </section>
      </main>

      {/* OVERLAY EDIT MODAL */}
      {isModalOpen && editingProduct && (
        <div className="modal-overlay-backdrop" style={modalOverlayStyle}>
          <div className="modal-content-card" style={modalContentStyle}>
            <div className="modal-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #edf2f7', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#1a202c', margin: 0 }}>Modify Store Item Parameters</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#718096' }}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleUpdateProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Product Identity Title</label>
                <input 
                  type="text" 
                  value={editingProduct.name} 
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  style={inputStyle} required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Category classification</label>
                  <input 
                    type="text" 
                    value={editingProduct.category} 
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    style={inputStyle} required 
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Keywords / Tags</label>
                  <input 
                    type="text" 
                    value={editingProduct.tag} 
                    onChange={(e) => setEditingProduct({ ...editingProduct, tag: e.target.value })}
                    style={inputStyle} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Price (GHC)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={editingProduct.price} 
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    style={inputStyle} required 
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Stock Allocation Units</label>
                  <input 
                    type="number" 
                    value={editingProduct.stock} 
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    style={inputStyle} required 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={cancelBtnStyle}>Discard Changes</button>
                <button type="submit" style={saveBtnStyle}>Save Parameter Modifications</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Base Styles 
const badgeNotifStyle = { position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#e11d48', color: '#fff', fontSize: '10px', fontWeight: 'bold', borderRadius: '50%', minWidth: '16px', height: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2px' };
const notifPanelStyle = { position: 'absolute', right: '40px', top: '45px', backgroundColor: '#ffffff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', borderRadius: '8px', width: '290px', zIndex: 1000, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' };
const notifHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '14px' };
const notifItemStyle = { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 16px', borderBottom: '1px solid #f8fafc', transition: 'background-color 0.2s', lineHeight: '1.3' };
const statusIndicatorStyle = { width: '8px', height: '8px', borderRadius: '50%', marginTop: '4px', flexShrink: 0 };
const dropdownItemStyle = { padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', fontSize: '13px', color: '#4a5568', display: 'flex', alignItems: 'center', transition: 'background 0.2s' };
const filterDropdownStyle = { position: 'absolute', left: 0, top: '45px', backgroundColor: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', borderRadius: '6px', padding: '6px 0', zIndex: 110, minWidth: '180px', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0' };
const actionDropdownMenuStyle = { position: 'absolute', right: 0, top: '35px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '6px', padding: '6px 0', zIndex: 100, minWidth: '160px', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: '#fff', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontSize: '13px', fontWeight: '500', color: '#4a5568' };
const inputStyle = { padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none' };
const cancelBtnStyle = { padding: '10px 16px', background: '#f1f5f9', border: 'none', color: '#475569', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' };
const saveBtnStyle = { padding: '10px 16px', background: '#e11d48', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' };

export default ManageProduct;