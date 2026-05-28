import React, { useState } from 'react';
import '../Category.css';
import SideBar from '../components/SideBar';

function Category() {
  // Starts completely empty as requested - built from scratch
  const [categories, setCategories] = useState([]);

  // Form input states
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');

  // Handle single image selection and render a local preview URL
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  // Submit and save new category entry
  const handleCreateCategory = (e) => {
    e.preventDefault();
    setError('');

    if (!newCategoryName.trim()) {
      setError('Please type a category name.');
      return;
    }

    // Verify uniqueness (case-insensitive) to prevent database collisions
    const duplicateExists = categories.some(
      (cat) => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
    );
    if (duplicateExists) {
      setError('This category already exists.');
      return;
    }

    const newCategory = {
      id: Date.now(), // Unique structural timestamp ID
      name: newCategoryName.trim(),
      image: imagePreview // Local blob path (replace with server response link on full integration)
    };

    setCategories([...categories, newCategory]);
    
    // Reset control fields safely
    setNewCategoryName('');
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Delete handler for any created categories
  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  return (
    <div className="admin-dashboard-wrapper">
      
      <SideBar />


      {/* Main Panel Content Area */}
      <main className="admin-content-container">
        <header className="content-header-bar">
          <h1>Category Workspace</h1>
          <p>Configure structural catalog layouts and assign feature photos for your public website display.</p>
        </header>

        <div className="category-split-grid">
          
          {/* Form Action Engine */}
          <section className="category-card-form">
            <h2>Create Category </h2>
            <form onSubmit={handleCreateCategory} className="modern-form-stack">
              
              {error && <div className="form-error-toast">{error}</div>}

              <div className="form-input-group">
                <label htmlFor="categoryName">Category Label Name</label>
                <input
                  id="categoryName"
                  type="text"
                  placeholder="e.g., Necklaces, Luxury Rings, Custom Bracelets"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>

              <div className="form-input-group">
                <label>Display Banner (Strict Limit: 1 Image)</label>
                <div className="media-uploader-box">
                  <input
                    type="file"
                    id="singleCategoryFileInput"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden-file-input"
                  />
                  <label htmlFor="singleCategoryFileInput" className="uploader-trigger-label">
                    <span className="upload-icon">📸</span>
                    {selectedImage ? 'Change Selected File' : 'Choose Photo from Device Gallery'}
                  </label>
                </div>
              </div>

              {/* Live Preview Display Box */}
              {imagePreview && (
                <div className="single-preview-wrapper">
                  <p>Target Cover Preview:</p>
                  <div className="preview-frame">
                    <img src={imagePreview} alt="Selected Category Preview" />
                    <button 
                      type="button" 
                      className="remove-preview-btn"
                      onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                    >
                      ✕ Remove Photo
                    </button>
                  </div>
                </div>
              )}

              <button type="submit" className="submit-action-btn">
                Add To Active Channels
              </button>
            </form>
          </section>

          {/* Active Live Grid Display */}
          <section className="category-card-display">
            <h2>Active Catalog Channels ({categories.length})</h2>
            
            {categories.length === 0 ? (
              <div className="empty-state-notice">
                <span className="empty-state-icon">📂</span>
                <h3>No categories active yet</h3>
                <p>Use the creation terminal to build your storefront configuration patterns.</p>
              </div>
            ) : (
              <div className="categories-scroller-list">
                {categories.map((category) => (
                  <div key={category.id} className="category-row-item">
                    <div className="row-item-meta">
                      <div className="row-thumbnail-box">
                        {category.image ? (
                          <img src={category.image} alt={category.name} />
                        ) : (
                          <div className="empty-thumbnail-fallback">💎</div>
                        )}
                      </div>
                      <div className="row-text-info">
                        <h3>{category.name}</h3>
                        <span className="badge custom-badge">Live Storefront</span>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      className="delete-category-btn"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

    </div>
  );
}

export default Category;