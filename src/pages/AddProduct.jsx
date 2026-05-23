import React, { useState } from 'react';
import '../AddProduct.css';
import { FiGrid, FiPlusSquare, FiCheckSquare, FiClock, FiBox, FiCamera, FiChevronDown } from 'react-icons/fi';
import { BiHomeAlt, BiLogOut } from 'react-icons/bi';
import { FiTag, FiAlertTriangle, FiClipboard, FiArchive } from 'react-icons/fi';
import SideBar from '../components/SideBar';
function AddProduct() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [promoType, setPromoType] = useState('None'); // Options: 'None', 'Discount', 'Promo'
  const [color, setColor] = useState("");
  const [colors, setColors] = useState([]);

  const handleAddColor = () => {
    if (color.trim() === "") return;

    setColors([...colors, color]);
    setColor("");
  };

  const handleRemoveColor = (indexToRemove) => {
    setColors(colors.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="admin-layout">

      <SideBar />

      {/* Main Form Content */}
      <main className="form-content-area">
        <header className="content-header">
          <h1>Add New Product</h1>
        </header>

        <form className="product-form" onSubmit={(e) => e.preventDefault()}>

          {/* Image Upload Box */}
          <div className="image-upload-dashed">
            <div className="upload-trigger">
              <FiCamera className="camera-icon" />
              <p>Take Photo or Upload Image</p>
            </div>
          </div>

          {/* Form Text Inputs */}
          <div className="input-group" required>
            <input type="text" placeholder="Product Name" className="form-input" required />
          </div>

          <div className="input-group" required>
            <input type="text" placeholder="Enter product description..." className="form-input" required />
          </div>

          <div className="input-group">
            <input type="text" placeholder="Price (₵)" className="form-input" required />
          </div>

          <div className="input-group select-wrapper">
            <select className="form-input form-select" defaultValue="" required>
              <option value="" disabled hidden>Category</option>
              <option value="rings">Rings</option>
              <option value="necklaces">Necklaces</option>
              <option value="earrings">Earrings</option>
              <option value="bracelets">Bracelets</option>
            </select>
            <FiChevronDown className="select-arrow" />
          </div>

          <div className="input-group">

            <div className="color-input-wrapper">
              <input
                type="text"
                placeholder="Color"
                className="form-input"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />

              <button
                type="button"
                className="add-color-btn"
                onClick={handleAddColor}
              >
                Add
              </button>
            </div>

            <div className="color-list">
              {colors.map((item, index) => (
                <div key={index} className="color-item">

                  <span>{item}</span>

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleRemoveColor(index)}
                  >
                    ×
                  </button>

                </div>
              ))}
            </div>

          </div>

          <div className="input-group">
            <input type="number" placeholder="Enter MOQ" className="form-input" required />
          </div>

          <div className="input-group" >
            <input type="number" placeholder="Stock Quantity" className="form-input" required />
          </div>

          <div className="input-group">
            <input type="text" placeholder="Enter Tag  (Optional)" className="form-input"  />
          </div>


          {/* Action Buttons */}
          <div className="form-actions-row">
            <button type="button" className="btn-secondary">Save Product</button>
            <button type="submit" className="btn-primary">Publish</button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddProduct;
