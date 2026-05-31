import React, { useState, useEffect, useRef } from 'react';
import '../ManageProduct.css';
import { 
  FiSearch, FiBell, FiChevronDown, FiFilter, FiDownload, 
  FiChevronLeft, FiChevronRight, FiShoppingBag, FiX,
  FiCopy, FiCheck, FiPlus
} from 'react-icons/fi';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserShield } from "@fortawesome/free-solid-svg-icons";
import SideBar from '../components/SideBar';
import { useNavigate } from "react-router";
import toast from 'react-hot-toast'; 
import axios from 'axios';
import { useAdminBackButton } from '../hooks/useAdminBackButton.jsx';

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return windowSize;
}



function ManageProduct() {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Prevent unauthorized navigation and warn on browser back/forward
  useAdminBackButton();

  // Interactive UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [selectedEditPreview, setSelectedEditPreview] = useState(null);
  
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
  const itemsPerPage = 25; 

  const dropdownRef = useRef(null);
  const filterRef = useRef(null);

  // Load backend database and handle outside click triggers
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

  // --- LIVE BACKEND REFRESH ENGINE ---
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/product/all`);
      
      // Adapt based on incoming database array wrapper safely
      const storedItems = response.data || [];
      
      // Compute alerts dynamically from database snapshot
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

      // Map MongoDB document parameters seamlessly to your UI components
      const dynamicProducts = storedItems.map((item, idx) => {
        let resolvedThumb = "https://via.placeholder.com/100?text=No+Media";
        if (item.images && item.images.length > 0) {
          resolvedThumb = item.images[0];
        } else if (item.media && item.media.length > 0) {
          resolvedThumb = item.media[item.mainIndex || 0];
        }
        
        return {
          id: item.id || item.id || `product-${idx}`,
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
          media: item.images || item.media || []
        };
      });
      
      setProductList(dynamicProducts);
    } catch (error) {
      console.error("Database connection failure:", error);
      toast.error("Failed to synchronize inventory database.");
    } finally {
      setLoading(false);
    }
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
      toast.error("No data available to export.");
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
    toast.success("Inventory exported successfully!");
  };

  // --- DELETE DATABASE CONTROLLER ---
  const handleDeleteProduct = async (id) => {
    setActiveDropdownId(null);
    
    const confirmed = window.confirm("Are you sure you want to permanently remove this product?");
    if (!confirmed) return;

    const loadId = toast.loading("Purging product records...");
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/product/delete/${id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`
        }
      });
      
      toast.dismiss(loadId);
      toast.success("Product successfully removed from live database.");
      
      // Update local state arrays cleanly without loading full cycles
      setProductList(prev => prev.filter(item => item.id !== id));
      
      // Re-trigger alert evaluations
      setNotifMetrics(prev => {
        const remainingLow = prev.lowStockItems.filter(item => item._id !== id && item.id !== id);
        const remainingOut = prev.outOfStockItems.filter(item => item._id !== id && item.id !== id);
        return {
          lowStockItems: remainingLow,
          outOfStockItems: remainingOut,
          totalAlertsCount: remainingLow.length + remainingOut.length
        };
      });
    } catch (error) {
      toast.dismiss(loadId);
      toast.error(error.response?.data?.message || "Could not completely erase database record.");
    }
  };

  const getUniqueFiles = (files) => {
    const uniqueKeys = new Set();
    return files.filter((file) => {
      const key = `${file.name}-${file.size}-${file.type}`;
      if (uniqueKeys.has(key)) return false;
      uniqueKeys.add(key);
      return true;
    });
  };

  const handleOpenEditModal = (product) => {
    setActiveDropdownId(null);

    const existingImages = [];
    const existingSet = new Set();

    if (product.image && !existingSet.has(product.image)) {
      existingImages.push(product.image);
      existingSet.add(product.image);
    }

    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((url) => {
        if (!existingSet.has(url)) {
          existingImages.push(url);
          existingSet.add(url);
        }
      });
    }

    if (product.media && Array.isArray(product.media)) {
      product.media.forEach((url) => {
        if (!existingSet.has(url)) {
          existingImages.push(url);
          existingSet.add(url);
        }
      });
    }

    setEditingProduct({
      ...product,
      media: [],
      existingImages
    });
    setIsModalOpen(true);
    setSelectedEditPreview(null);
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    if (!editingProduct || !editingProduct.existingImages) return;
    const removedUrl = editingProduct.existingImages[indexToRemove];
    const updatedExistingImages = editingProduct.existingImages.filter((_, index) => index !== indexToRemove);
    setEditingProduct({
      ...editingProduct,
      existingImages: updatedExistingImages,
      image: removedUrl === editingProduct.image ? updatedExistingImages[0] || '' : editingProduct.image
    });
  };

  const handleRemoveEditMedia = (indexToRemove) => {
    if (!editingProduct || !editingProduct.media) return;
    const updatedMedia = editingProduct.media.filter((_, index) => index !== indexToRemove);
    setEditingProduct({ ...editingProduct, media: updatedMedia });
  };

  // --- UPDATE DATABASE PUT SUBMIT CONTROLLER ---
  const handleUpdateProductSubmit = async (e) => {
    e.preventDefault();
    const loadId = toast.loading("Synchronizing modifications with backend database...");

    try {
      // const payload = {
      //   name: editingProduct.name,
      //   category: editingProduct.category,
      //   price: parseFloat(editingProduct.price),
      //   stock: parseInt(editingProduct.stock),
      //   tag: editingProduct.tag,
      //   description: editingProduct.description || '',
      //   minimumOrder: parseInt(editingProduct.moq || editingProduct.minimumOrder) || undefined,
      //   isAllowBelowMOQ: !!editingProduct.isAllowBelowMOQ,
      //   colors: Array.isArray(editingProduct.colors) ? editingProduct.colors : (editingProduct.colors ? editingProduct.colors.split(',').map(s => s.trim()).filter(Boolean) : []),
      //   // images: editingProduct.media || editingProduct.images || []
      // };

      const form = e.target;
      const formData = new FormData(form);

      formData.append('name', editingProduct.name);
      formData.append('category', editingProduct.category);
      formData.append('price', parseFloat(editingProduct.price));
      formData.append('stock', parseInt(editingProduct.stock));
      formData.append('tag', editingProduct.tag);
      formData.append('description', editingProduct.description || '');
      formData.append('isAllowBelowMOQ', editingProduct.isAllowBelowMOQ || false);
      formData.append('minimumOrder',  parseInt(editingProduct.moq || editingProduct.minimumOrder));

      if (editingProduct.isAllowBelowMOQ && (editingProduct.belowMOQPrice || editingProduct.belowMOQPrice === 0)) {
        formData.append('belowMOQPrice', parseFloat(editingProduct.belowMOQPrice));
      }

      const colors = editingProduct.colors || [];
      colors.forEach((color) => formData.append('colors', color));

      const newFileUploads = editingProduct.media || [];
      let hasNewFiles = false;
      newFileUploads.forEach((file) => {
        if (file instanceof File) {
          formData.append('images', file);
          hasNewFiles = true;
        }
      });

      if (hasNewFiles) {
        formData.append('appendImages', 'true');
      }

      if (editingProduct.existingImages && editingProduct.existingImages.length > 0) {
        editingProduct.existingImages.forEach((url) => {
          formData.append('existingImages', url);
        });
      }

      // BACKWARDS COMPATIBILITY SAFETY: Fallback checking route variables
      const targetId = editingProduct.id || editingProduct._id;

      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/product/update/${editingProduct.id}`,
        formData,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`
          }
        }
      );

      toast.dismiss(loadId);
      toast.success("Product configurations saved to database successfully.");
      setIsModalOpen(false);
      setEditingProduct(null);
      
      // Refresh current catalog state to display modifications accurately
      loadProducts();
    } catch (error) {
      toast.dismiss(loadId);
      toast.error(error.response?.data?.message || "Failed to commit parameters to database.");
    }
  };

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  // --- STATUS ACTION TOGGLE DATABASE LINK ---
  const toggleProductStatus = async (id) => {
    setActiveDropdownId(null);
    const targetProduct = productList.find(p => p.id === id);
    if (!targetProduct) return;

    const currentStock = parseInt(targetProduct.stock) || 0;
    const targetStock = currentStock === 0 ? 10 : 0;
    
    const loadId = toast.loading("Updating visibility states...");
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/product/update/${id}`,
        { stock: targetStock },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`
          }
        }
      );
      
      toast.dismiss(loadId);
      if (targetStock > 0) {
        toast.success("Product is now Active (Defaulted to 10 units).");
      } else {
        toast.error("Product is now Inactive (Stock set to 0).");
      }
      loadProducts();
    } catch (error) {
      toast.dismiss(loadId);
      toast.error("Failed to alter product status config.");
    }
  };

  const duplicateProduct = async (product) => {
    setActiveDropdownId(null);
    toast.error("Template duplication workspace must be completed via the Add Product page layout.");
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
                        <div key={`notif-out-${item._id || item.id}`} style={notifItemStyle}>
                          <div style={{ ...statusIndicatorStyle, backgroundColor: '#ef4444' }}></div>
                          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                            <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500' }}>{item.name} is empty!</span>
                            <small style={{ fontSize: '11px', color: '#64748b' }}>Stock dropped to absolute 0 units.</small>
                          </div>
                        </div>
                      ))}

                      {notifMetrics.lowStockItems.map(item => (
                        <div key={`notif-low-${item._id || item.id}`} style={notifItemStyle}>
                          <div style={{ ...statusIndicatorStyle, backgroundColor: '#f97316' }}></div>
                          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                            <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500' }}>{item.name} running low</span>
                            <small style={{ fontSize: '11px', color: '#64748b' }}>Critical Level: {item.stock} items left left in store.</small>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="badge-wrapper"></div>
               
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
          {loading ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', background: '#fff', borderRadius: '8px', color: '#64748b' }}>
              <h3>Synchronizing item configurations with live backend database...</h3>
            </div>
          ) : productList.length === 0 ? (
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    style={{ ...inputStyle, minHeight: '80px', resize: 'none'  }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Minimum Order Quantity</label>
                  <input
                    type="number"
                    value={editingProduct.moq || editingProduct.minimumOrder || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, moq: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Allow Below MOQ</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={!!editingProduct.isAllowBelowMOQ}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isAllowBelowMOQ: e.target.checked })}
                    />
                    <small style={{ color: '#64748b' }}>Allow purchases below minimum order</small>
                  </div>
                </div>
              </div>

              {editingProduct.isAllowBelowMOQ && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>Below MOQ Price (GHC)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.belowMOQPrice || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, belowMOQPrice: e.target.value })}
                      style={inputStyle}
                      placeholder="Enter Below (MOQ) Price"
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Colors (comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingProduct.colors) ? editingProduct.colors.join(', ') : (editingProduct.colors || '')}
                    onChange={(e) => setEditingProduct({ ...editingProduct, colors: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Images / Media</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ width: '10px', height: '10px', background: '#e11d48', borderRadius: '2px', display: 'inline-block' }}></span>
                      <small style={{ color: '#475569' }}>Main</small>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ width: '10px', height: '10px', background: '#64748b', borderRadius: '2px', display: 'inline-block' }}></span>
                      <small style={{ color: '#475569' }}>Existing</small>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ width: '10px', height: '10px', background: '#16a34a', borderRadius: '2px', display: 'inline-block' }}></span>
                      <small style={{ color: '#475569' }}>New</small>
                    </div>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        const addedFiles = Array.from(e.target.files);
                        setEditingProduct({
                          ...editingProduct,
                          media: getUniqueFiles([...(editingProduct.media || []), ...addedFiles])
                        });
                      }
                    }}
                    style={inputStyle}
                  />

                  {(editingProduct.existingImages && editingProduct.existingImages.length > 0) && (
                    <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px' }}>
                      {editingProduct.existingImages.map((url, index) => {
                        const isMainImage = url === editingProduct.image;
                        return (
                          <div key={`existing-${index}`} style={{ position: 'relative', width: '100%', paddingBottom: '100%', backgroundColor: '#f1f5f9', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer' }}>
                            {isMainImage ? (
                              <div style={{ position: 'absolute', top: '4px', left: '4px', background: '#e11d48', color: '#fff', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold', zIndex: 2 }}>Main</div>
                            ) : (
                              <div style={{ position: 'absolute', top: '4px', left: '4px', background: '#64748b', color: '#fff', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold', zIndex: 2 }}>Existing</div>
                            )}
                            <img
                              src={url}
                              alt="Existing media preview"
                              onClick={() => setSelectedEditPreview({ url, type: 'image' })}
                              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingImage(index)}
                              style={{ position: 'absolute', top: '2px', right: '2px', width: '20px', height: '20px', padding: 0, background: '#e11d48', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {(editingProduct.media && editingProduct.media.length > 0) && (
                    <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px' }}>
                      {editingProduct.media.map((file, index) => {
                        const previewUrl = URL.createObjectURL(file);
                        const isImage = file.type.startsWith('image');
                        return (
                          <div key={`new-${index}`} style={{ position: 'relative', width: '100%', paddingBottom: '100%', backgroundColor: '#f1f5f9', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer' }}>
                            <div style={{ position: 'absolute', top: '4px', left: '4px', background: '#16a34a', color: '#fff', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold', zIndex: 2 }}>New</div>
                            {isImage ? (
                              <img
                                src={previewUrl}
                                alt="Media preview"
                                onClick={() => setSelectedEditPreview({ url: previewUrl, type: 'image' })}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <video
                                src={previewUrl}
                                onClick={() => setSelectedEditPreview({ url: previewUrl, type: 'video' })}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveEditMedia(index)}
                              style={{ position: 'absolute', top: '2px', right: '2px', width: '20px', height: '20px', padding: 0, background: '#e11d48', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={cancelBtnStyle}>Discard Changes</button>
                <button type="submit" style={saveBtnStyle}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN MEDIA PREVIEW MODAL FOR EDIT */}
      {selectedEditPreview && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }} onClick={() => setSelectedEditPreview(null)}>
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
            {selectedEditPreview.type === 'video' ? (
              <video src={selectedEditPreview.url} controls autoPlay style={{ maxWidth: '100%', maxHeight: '100%' }} />
            ) : (
              <img src={selectedEditPreview.url} alt="Fullscreen view" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            )}
            <button onClick={() => setSelectedEditPreview(null)} style={{ position: 'absolute', top: '20px', right: '20px', width: '40px', height: '40px', padding: 0, background: '#e11d48', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              <FiX />
            </button>
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
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,};
const modalContentStyle = { backgroundColor: '#fff', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', maxHeight: '90vh', overflowY: 'auto' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontSize: '13px', fontWeight: '500', color: '#4a5568' };
const inputStyle = { padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none' };
const cancelBtnStyle = { padding: '10px 16px', background: '#f1f5f9', border: 'none', color: '#475569', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' };
const saveBtnStyle = { padding: '10px 16px', background: '#e11d48', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' };

export default ManageProduct;