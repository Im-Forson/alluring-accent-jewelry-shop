import React, { useState } from 'react';
import '../Inventory.css';
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiTag, FiCamera,FiClipboard, FiChevronRight } from 'react-icons/fi';
import { MdOutlineDiamond } from 'react-icons/md';
import { BiHomeAlt, BiLogOut } from 'react-icons/bi';
import { FiAlertTriangle,   FiArchive } from 'react-icons/fi';

function Inventory() {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stockQuantity: ''
  });

  const quickProducts = [
    { id: 1, name: 'Rose Gold Infinity Ring', SKU: 'Stug 3', price: '450.00', stock: '2n Stock', status: 'Edit', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=80&auto=format&fit=crop&q=60' },
    { id: 2, name: 'Diamond Pendant Necklace', SKU: 'Stug 1', price: '750.00', stock: '1n Stock', status: 'Edit', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=80&auto=format&fit=crop&q=60' },
    { id: 3, name: 'Gold Hoop Earrings', SKU: 'Stug 1', price: '750.00', stock: 'In Stock', status: 'Edit', image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=80&auto=format&fit=crop&q=60' },
    { id: 4, name: 'Gold Hoop Earrings', SKU: 'Stug 1', price: '750.00', stock: 'Out of Stock', status: 'Belde', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=80&auto=format&fit=crop&q=60' },
  ];

  return (
    <div className="inventory-view-container">
      {/* Top Header Bar */}
      <header className="inventory-top-navbar">
        <div className="navbar-spacer"></div>
        <div className="navbar-utility-icons">
          <FiSearch className="nav-util-icon" />
          <FiUser className="nav-util-icon" />
          <FiHeart className="nav-util-icon" />
          <div className="nav-bag-wrapper">
            <FiShoppingBag className="nav-util-icon" />
            <span className="nav-bag-count">9</span>
          </div>
        </div>
      </header>

      {/* Top Row Analytic Summary Cards */}
      <section className="inventory-stats-row">
        <div className="stat-summary-card">
          <div className="stat-card-icon-box box-beige">📦</div>
          <div className="stat-card-info">
            <span>Total Products</span>
            <h3>128</h3>
          </div>
        </div>

        <div className="stat-summary-card">
          <div className="stat-card-icon-box box-soft-pink">🛑</div>
          <div className="stat-card-info">
            <span>Out of Stock</span>
            <h3 className="text-danger">5</h3>
          </div>
        </div>

        <div className="stat-summary-card promotion-accent-card">
          <div className="stat-card-icon-box box-translucent">🏷️</div>
          <div className="stat-card-info">
            <span>Active Promotions</span>
            <h3>2</h3>
          </div>
        </div>
      </section>

      {/* Main Dual-Pane Dashboard Split Workspace */}
      <div className="inventory-workspace-split">
        
        {/* LEFT PANE: Add New Product Form Section */}
        <section className="workspace-panel pane-left">
          <h2 className="panel-heading">Add New Product</h2>
          <div className="add-product-card-body">
            
            {/* Image Upload Box Container placeholder */}
            <div className="media-uploader-box">
              <FiCamera className="uploader-camera-icon" />
              <span className="uploader-main-prompt">Upload / Take Photo</span>
            </div>

            {/* Structured Form Input Fields Group */}
            <form className="product-creation-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-input-group">
                <input type="text" placeholder="Product Name" className="form-field-control" />
              </div>

              <div className="form-input-group">
                <input type="text" placeholder="Price (₵)" className="form-field-control" />
              </div>

              <div className="form-input-group">
                <textarea placeholder="Description" className="form-field-control text-area-control" rows="4"></textarea>
              </div>

              <div className="form-input-group select-field-wrapper">
                <select className="form-field-control dropdown-control" defaultValue="">
                  <option value="" disabled>Category</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="earrings">Earrings</option>
                  <option value="rings">Rings</option>
                  <option value="bracelets">Bracelets</option>
                </select>
              </div>

              <div className="form-input-group">
                <input type="text" placeholder="Stock Quantity" className="form-field-control" />
              </div>

              {/* Form Action Submit Cluster Buttons */}
              <div className="form-action-row-buttons">
                <button type="button" className="btn-form-action btn-action-save">Save Product</button>
                <button type="submit" className="btn-form-action btn-action-publish">Publish</button>
              </div>
            </form>

          </div>
        </section>

        {/* RIGHT PANE: Inventory Monitoring and Overview Ledger Panel */}
        <section className="pane-right-workspace-stack">
          
          {/* Top Block View Table Dashboard Card */}
          <div className="workspace-panel sub-panel-card">
            <h2 className="panel-heading">Manage Products</h2>
            <div className="mini-table-container">
              <table className="mini-ledger-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>STATUS</th>
                    <th className="actions-header-cell">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quickProducts.map((prod) => (
                    <tr key={prod.id}>
                      <td>
                        <div className="mini-product-identity">
                          <img src={prod.image} alt={prod.name} className="mini-prod-thumb" />
                          <div className="mini-prod-meta-labels">
                            <span className="mini-prod-title-name">{prod.name}</span>
                            <span className="mini-prod-sku-subtitle">{prod.SKU}</span>
                          </div>
                        </div>
                      </td>
                      <td className="mini-prod-price-label">₵{prod.price}</td>
                      <td className="mini-prod-stock-label">{prod.stock}</td>
                      <td>
                        <span className={`mini-status-tag ${prod.stock === 'Out of Stock' ? 'tag-out-stock' : 'tag-in-stock'}`}>
                          {prod.stock === 'Out of Stock' ? 'Edit' : 'Edit'}
                        </span>
                      </td>
                      <td>
                        <div className="mini-action-row-buttons">
                          <button className="mini-action-btn btn-mini-edit">Edit</button>
                          <button className="mini-action-btn btn-mini-delete">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Center Blocks: Promotions Overview Monitoring Card */}
          <div className="workspace-panel sub-panel-card">
            <h2 className="panel-heading">Current Promotions</h2>
            <div className="promotions-list-wrapper">
              <div className="promotion-row-item-bar">
                <span className="promo-index-num text-pink">1</span>
                <span className="promo-description-details">Spring Sale - 20% Off All Items</span>
                <FiChevronRight className="promo-item-arrow" />
              </div>
              <div className="promotion-row-item-bar">
                <span className="promo-index-num text-pink">2</span>
                <span className="promo-description-details">Flash Deal - 30% Off Rings Today!</span>
                <FiChevronRight className="promo-item-arrow" />
              </div>
              <button className="btn-update-promotions-action">Update Promotions</button>
            </div>
          </div>

          {/* Bottom Alert Panels: Low Stock Monitoring Box Layout */}
          <div className="workspace-panel sub-panel-card">
            <div className="low-stock-header-strip">
              <h2 className="panel-heading header-no-margin">Low Stock Alerts</h2>
              <span className="badge-alert-label-danger">Out of Stock</span>
            </div>
            <div className="alerts-list-stacked-rows">
              <div className="alert-stock-item-row">
                <span className="alert-product-title-text">Tennis Bracelet</span>
                <span className="alert-badge-status-pill">Out of Stock</span>
              </div>
              <div className="alert-stock-item-row">
                <span className="alert-product-title-text">Pearl Drop Earrings</span>
                <span className="alert-badge-status-pill">Out of Stock</span>
              </div>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}

export default Inventory;