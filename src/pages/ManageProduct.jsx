import React from 'react';
import '../ManageProduct.css';
import { FiGrid, FiPlusSquare, FiCheckSquare, FiClock, FiBox,FiClipboard,FiTag, FiSearch, FiBell, FiChevronDown, FiFilter, FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdOutlineDiamond } from 'react-icons/md';
import { BiHomeAlt, BiLogOut } from 'react-icons/bi';
import {  FiAlertTriangle,  FiArchive } from 'react-icons/fi';
import SideBar from '../components/SideBar';

function ManageProduct() {
  const products = [
    { id: 1, name: 'Elegant Gold Necklace', category: 'Necklaces', stock: '15', price: '120.00', status: 'Active', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&auto=format&fit=crop&q=60' },
    { id: 2, name: 'Diamond Stud Earrings', category: 'Earrings', stock: '8', price: '250.00', status: 'Active', image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=100&auto=format&fit=crop&q=60' },
    { id: 3, name: 'Rose Gold Bracelet', category: 'Bracelets', stock: 'Out of Stock', price: '95.00', status: 'Inactive', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=100&auto=format&fit=crop&q=60' },
    { id: 4, name: 'Silver Charm Ring', category: 'Rings', stock: '5', price: '75.00', status: 'Active', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&auto=format&fit=crop&q=60' },
    { id: 5, name: 'Pearl Drop Earrings', category: 'Earrings', stock: '12', price: '180.00', status: 'Active', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100&auto=format&fit=crop&q=60' },
  ];

  return (
    <div className="admin-layout">
      
      <SideBar/>
      
    
         

      {/* Main Panel Frame */}
      <main className="inventory-main">
        {/* Top Navigation Row */}
        <header className="inventory-header">
          <h1>Manage Products</h1>
          <div className="header-actions">
            <FiSearch className="header-icon" />
            <FiBell className="header-icon" />
            <div className="badge-wrapper">
            </div>
            <img src="https://i.pravatar.cc/150?img=47" alt="Profile" className="top-profile-img" />
          </div>
        </header>

        {/* Toolbar Filter Actions Grid */}
        <section className="inventory-toolbar">
          <button className="add-product-btn"><span className="plus-sign">+</span> Add New Product</button>
          
          <div className="search-bar-wrapper">
            <FiSearch className="input-search-icon" />
            <input type="text" placeholder="Search products..." className="toolbar-search" />
            <button className="search-trigger-btn"><FiSearch /></button>
          </div>

          <button className="toolbar-action-btn"><FiFilter /> Filter</button>
          <button className="toolbar-action-btn"><FiDownload /> Export</button>
        </section>

        {/* Main Database Table Container */}
        <section className="table-panel">
          <div className="table-responsive">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th className="center-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-identity-cell">
                        <img src={product.image} alt={product.name} className="product-thumb" />
                        <span className="product-title-text">{product.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="category-tag">{product.category}</span>
                    </td>
                    <td className="stock-cell-data">
                      <span className={product.stock === 'Out of Stock' ? 'danger-text' : ''}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="price-text-bold">GHC {product.price}</td>
                    <td>
                      <span className={`status-pill ${product.status.toLowerCase() === 'active' ? 'pill-active' : 'pill-inactive'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-button-cluster">
                        <button className="row-btn edit-row-btn">Edit</button>
                        <button className="row-btn delete-row-btn">Delete</button>
                        <button className="row-dropdown-toggle"><FiChevronDown /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Metadata Pagination Row */}
          <footer className="table-pagination-footer">
            <span className="entries-count">Showing 1 to 5 of 25 entries</span>
            <div className="pagination-controls">
              <button className="page-arrow-btn"><FiChevronLeft /></button>
              <button className="page-num-btn active-page">1</button>
              <button className="page-num-btn">2</button>
              <button className="page-num-btn">3</button>
              <span className="pagination-ellipsis">...</span>
              <button className="page-arrow-btn"><FiChevronRight /></button>
            </div>
          </footer>
        </section>

        {/* Bottom Alert Summary Box Panels */}
        <section className="summary-boxes-grid">
          <div className="summary-box-card">
            <h4 className="box-card-title"><span className="box-title-icon yellow-dot">ℹ</span> Low Stock Alerts</h4>
            <ul className="box-list-items">
              <li>Gold Hoop Earrings - Only 3 Left!</li>
              <li>Pearl Pendant Necklace - Almost Sold Out!</li>
            </ul>
          </div>

          <div className="summary-box-card prompt-card-relative">
            <h4 className="box-card-title"><span className="box-title-icon orange-dot">ℹ</span> Active Promotions</h4>
            <ul className="box-list-items">
              <li>Spring Sale - 20% Off All Items</li>
              <li>Flash Deal - 20% Off Diamond Rings</li>
            </ul>
            <button className="floating-action-bottom-btn">Manage Promotions</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ManageProduct;
