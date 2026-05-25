import React, { useState, useRef, useEffect } from 'react';
import '../AddProduct.css';
import { FiCamera, FiChevronDown, FiX, FiMenu } from 'react-icons/fi';
import SideBar from '../components/SideBar';

function AddProduct() {
  const [color, setColor] = useState("");
  const [colors, setColors] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [productsArray, setProductsArray] = useState([]);

  const [selectedPreview, setSelectedPreview] = useState(null);
  const [mainIndex, setMainIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- New state for sub-MOQ permission checkbox ---
  const [allowBelowMoq, setAllowBelowMoq] = useState(false);

  // --- Dynamic Option Catalogs ---
  const [availableTags, setAvailableTags] = useState([
    "Best Seller", "New", "Hot", "Popular", "Trending",
    "Sale", "Featured", "Coming Soon", "Limited Offer", "Pre Order",
    "Classic", "Wedding", "Mother's Day"
  ]);

  const [availableCategories, setAvailableCategories] = useState([
    "Rings", "Necklaces", "Earrings", "Bracelets", "Anklets", "Pendants"
  ]);

  // --- Searchable Input States ---
  const [tagInput, setTagInput] = useState("");
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const tagDropdownRef = useRef(null);

  const [categoryInput, setCategoryInput] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  // Live Camera Refs & State
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Filter Logic matching live keywords
  const filteredTags = availableTags.filter((tag) =>
    tag.toLowerCase().includes(tagInput.toLowerCase())
  );

  const filteredCategories = availableCategories.filter((cat) =>
    cat.toLowerCase().includes(categoryInput.toLowerCase())
  );

  // Detect if the exact typed phrase exists anywhere in the collections
  const tagExactExists = availableTags.some(t => t.toLowerCase() === tagInput.trim().toLowerCase());
  const categoryExactExists = availableCategories.some(c => c.toLowerCase() === categoryInput.trim().toLowerCase());

  // Handle closing searchable options if clicking outside target boundaries
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target)) {
        setIsTagDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRemoveMedia = (indexToRemove) => {
    setMediaFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    if (mainIndex >= mediaFiles.length - 1) {
      setMainIndex(0);
    }
  };

  const handleAddColor = () => {
    if (color.trim() === "") return;
    setColors([...colors, color.trim()]);
    setColor("");
  };

  const handleRemoveColor = (indexToRemove) => {
    setColors(colors.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryInput.trim()) {
      alert("Please choose or type a product category designation.");
      return;
    }

    if (mediaFiles.length === 0) {
      alert("Please upload or capture at least one image or video.");
      return;
    }

    const formData = new FormData(e.target);

    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    try {
      const base64MediaStrings = await Promise.all(
        mediaFiles.map((file) => convertToBase64(file))
      );

      if (tagInput.trim() && !tagExactExists) {
        setAvailableTags(prev => [...prev, tagInput.trim()]);
      }
      if (categoryInput.trim() && !categoryExactExists) {
        setAvailableCategories(prev => [...prev, categoryInput.trim()]);
      }

      const newProduct = {
        id: `prod_${Date.now()}`,
        name: formData.get("productName"),
        description: formData.get("description"),
        price: formData.get("price"),
        category: categoryInput.trim(),
        moq: formData.get("moq"),
        allowBelowMoq: allowBelowMoq, // <-- Saved cleanly here to your db file
        stock: formData.get("stock"),
        tag: tagInput.trim(),
        colors: [...colors],
        mainIndex: mainIndex,
        media: base64MediaStrings,
      };

      const existingProducts = JSON.parse(localStorage.getItem("inventoryProducts")) || [];
      const updatedInventory = [...existingProducts, newProduct];
      localStorage.setItem("inventoryProducts", JSON.stringify(updatedInventory));

      alert("Product published successfully!");

      setProductsArray(prev => [...prev, { ...newProduct, media: mediaFiles }]);
      setMediaFiles([]);
      setColors([]);
      setTagInput("");
      setCategoryInput("");
      setMainIndex(0);
      setAllowBelowMoq(false); // Reset checkout condition toggle

      if (e.target && typeof e.target.reset === 'function') {
        e.target.reset();
      }

    } catch (error) {
      console.error("Error processing media strings:", error);
      alert("An error occurred while saving product media.");
    }
  };

  const startCamera = async (mode = facingMode) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode },
        audio: false,
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Camera permissions were denied or are currently unavailable.");
    }
  };

  const switchCamera = async () => {
    const newMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newMode);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    await startCamera(newMode);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], `camera_${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      setMediaFiles((prev) => [...prev, file]);
    }, "image/jpeg");
  };

  const openGallery = () => {
    const input = document.getElementById("productMedia");
    if (input) input.click();
  };

  return (
    <div className={`admin-layout ${sidebarOpen ? 'sidebar-active' : ''}`}>
      <SideBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <main className="form-content-area">
        <header className="content-header">
          <div className="mobile-header-bar">
            <button 
              type="button" 
              className="hamburger-menu-btn" 
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu />
            </button>
            <h1>Add New Product</h1>
          </div>
        </header>

        <form className="product-form" onSubmit={handleSubmit}>

          <div className="media-upload-card">
            <div className="media-upload-header">
              <h3>Product Media</h3>
              <span className="media-count">{mediaFiles.length} file(s) uploaded</span>
            </div>

            <div className="media-upload-body" onClick={() => startCamera(facingMode)}>
              <div className="media-icon-circle">
                <FiCamera />
              </div>
              <h4>Capture or Upload Media</h4>
              <p>Images & videos supported</p>

              <button
                type="button"
                className="upload-secondary-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openGallery();
                }}
              >
                Choose from device
              </button>
            </div>

            <div className="media-upload-actions">
              <button type="button" onClick={() => startCamera(facingMode)}>📷 Camera</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); openGallery(); }}>📁 Gallery</button>
            </div>
          </div>

          {isCameraOpen && (
            <div className="camera-overlay">
              <div className="camera-frame-wrapper">
                <video ref={videoRef} autoPlay playsInline className="camera-preview" />
              </div>
              <div className="camera-controls">
                <button type="button" onClick={switchCamera}>Switch Device</button>
                <button type="button" className="action-capture" onClick={capturePhoto}>Capture Photo</button>
                <button
                  type="button"
                  className="close-cam-btn"
                  onClick={() => {
                    stream?.getTracks().forEach((t) => t.stop());
                    setIsCameraOpen(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <input
            type="file"
            name="image"
            id="productMedia"
            hidden
            multiple
            accept="image/*,video/*"
            onChange={(e) => {
              if (e.target.files) {
                setMediaFiles((prev) => [...prev, ...Array.from(e.target.files)]);
              }
            }}
          />

          {mediaFiles.length > 0 && (
            <div className="media-preview-grid">
              {mediaFiles.map((file, index) => {
                const previewUrl = URL.createObjectURL(file);
                const isImage = file.type.startsWith("image");

                return (
                  <div key={index} className="media-preview-item">
                    {mainIndex === index && <div className="main-badge">Main</div>}

                    {isImage ? (
                      <img
                        src={previewUrl}
                        alt="Upload preview"
                        className="preview-media"
                        onClick={() => setSelectedPreview({ url: previewUrl, type: 'image' })}
                      />
                    ) : (
                      <video
                        src={previewUrl}
                        className="preview-media"
                        onClick={() => setSelectedPreview({ url: previewUrl, type: 'video' })}
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => setMainIndex(index)}
                      className={`main-btn ${mainIndex === index ? 'active' : ''}`}
                    >
                      ★
                    </button>

                    <button
                      type="button"
                      className="delete-media-btn"
                      onClick={() => handleRemoveMedia(index)}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="input-group">
            <input type="text" name="name" placeholder="Product Name" className="form-input" required />
          </div>

          <div className="input-group">
            <input type="text" name="description" placeholder="Enter product description..." className="form-input" required />
          </div>

          <div className="input-group">
            <input type="number" name="price" placeholder="Price (₵)" className="form-input" required />
          </div>

          {/* --- CATEGORY COMBOBOX --- */}
          <div className="input-group select-wrapper" ref={categoryDropdownRef}>
            <input
              type="text"
              name="category"
              placeholder="Select category or type to create a new one..."
              className="form-input"
              value={categoryInput}
              onChange={(e) => {
                setCategoryInput(e.target.value);
                setIsCategoryDropdownOpen(true);
              }}
              onFocus={() => setIsCategoryDropdownOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && categoryInput.trim()) {
                  e.preventDefault();
                  if (!categoryExactExists) {
                    setAvailableCategories([...availableCategories, categoryInput.trim()]);
                  }
                  setIsCategoryDropdownOpen(false);
                }
              }}
            />
            <FiChevronDown className="select-arrow" onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)} />

            {isCategoryDropdownOpen && (
              <ul className="tag-dropdown">
                {filteredCategories.map((catItem, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setCategoryInput(catItem);
                      setIsCategoryDropdownOpen(false);
                    }}
                  >
                    {catItem}
                  </li>
                ))}
                {categoryInput.trim() !== "" && !categoryExactExists && (
                  <li 
                    className="add-new-option-row"
                    onClick={() => {
                      setAvailableCategories([...availableCategories, categoryInput.trim()]);
                      setIsCategoryDropdownOpen(false);
                    }}
                  >
                    + Add New Category: "{categoryInput.trim()}"
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className="input-group">
            <div className="color-input-wrapper">
              <input
                type="text"
                name="colors"
                placeholder="Color Options (e.g. Gold, Rose Gold)"
                className="form-input"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <button type="button" className="add-color-btn" onClick={handleAddColor}>Add</button>
            </div>

            <div className="color-list">
              {colors.map((item, index) => (
                <div key={index} className="color-item">
                  <span>{item}</span>
                  <button type="button" className="remove-btn" onClick={() => handleRemoveColor(index)}>×</button>
                </div>
              ))}
            </div>
          </div>

          {/* MOQ INPUT GROUP EXTENDED WITH INLINE STYLED OVERRIDE CHECKBOX BELOW */}
          <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input type="number" name="minimumOrder" min="1" name="moq" placeholder="Enter Minimum Order Quantity (MOQ)" className="form-input" required />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 6px' }}>
              <input 
                type="checkbox" 
                name="isUseMOQ"
                id="allowBelowMoq" 
                checked={allowBelowMoq}
                onChange={(e) => setAllowBelowMoq(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#e11d48', margin: 0 }} 
              />
              <label htmlFor="allowBelowMoq" style={{ fontSize: '13px', color: '#64748b', cursor: 'pointer', userSelect: 'none', fontWeight: '500' }}>
                Allow orders below minimum quantity threshold
              </label>
            </div>
          </div>

          <div className="input-group">
            <input type="number" name="stock" placeholder="Stock Quantity" className="form-input" required />
          </div>

          {/* --- TAG COMBOBOX --- */}
          <div className="input-group tag-wrapper" ref={tagDropdownRef}>
            <input
              type="text"
              placeholder="Type to create or select a tag..."
              name="tag"
              className="form-input"
              value={tagInput}
              onChange={(e) => {
                setTagInput(e.target.value);
                setIsTagDropdownOpen(true);
              }}
              onFocus={() => setIsTagDropdownOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tagInput.trim()) {
                  e.preventDefault();
                  if (!tagExactExists) {
                    setAvailableTags([...availableTags, tagInput.trim()]);
                  }
                  setIsTagDropdownOpen(false);
                }
              }}
            />
            <FiChevronDown className="select-arrow" onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)} />

            {isTagDropdownOpen && (
              <ul className="tag-dropdown">
                {filteredTags.map((tagItem, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setTagInput(tagItem);
                      setIsTagDropdownOpen(false);
                    }}
                  >
                    {tagItem}
                  </li>
                ))}
                {tagInput.trim() !== "" && !tagExactExists && (
                  <li 
                    className="add-new-option-row"
                    onClick={() => {
                      setAvailableTags([...availableTags, tagInput.trim()]);
                      setIsTagDropdownOpen(false);
                    }}
                  >
                    + Add New Tag: "{tagInput.trim()}"
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className="form-actions-row">
            <button type="submit" className="btn-primary">Publish Product</button>
          </div>
        </form>

        <div className="submitted-products">
          {productsArray.length > 0 && <h2 className="section-title">Published Inventory Array</h2>}
          <div className="products-grid-layout">
            {productsArray.map((product, index) => (
              <div key={index} className="product-output-card">
                {product.media && product.media.length > 0 && (
                  <div className="product-media-preview-grid">
                    {product.media.map((file, i) => {
                      const displayUrl = URL.createObjectURL(file);
                      const isImage = file.type.startsWith("image");
                      const isMainItem = product.mainIndex === i;

                      return (
                        <div key={i} className={`product-card-media-item ${isMainItem ? 'hero' : ''}`}>
                          {isMainItem && <div className="card-main-badge">Main</div>}
                          {isImage ? (
                            <img src={displayUrl} alt="Inventory state" className="product-preview" />
                          ) : (
                            <video src={displayUrl} controls className="product-preview" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <h2>{product.name}</h2>
                <p className="product-card-desc">{product.description}</p>
                <p className="product-card-price">₵ {product.price}</p>
                <p className="meta-info"><strong>Category:</strong> {product.category}</p>

                {product.colors.length > 0 && (
                  <p className="meta-info"><strong>Colors:</strong> {product.colors.join(", ")}</p>
                )}

                <p className="meta-info">
                  <strong>MOQ:</strong> {product.moq} {product.allowBelowMoq ? "(Flexible)" : "(Strict)"} | <strong>Stock:</strong> {product.stock}
                </p>
                {product.tag && <p className="product-card-tag"><strong>Tag:</strong> {product.tag}</p>}
              </div>
            ))}
          </div>
        </div>
      </main>

      {selectedPreview && (
        <div className="modal-overlay" onClick={() => setSelectedPreview(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {selectedPreview.type === 'video' ? (
              <video src={selectedPreview.url} controls autoPlay />
            ) : (
              <img src={selectedPreview.url} alt="Fullscreen visual" />
            )}
            <button className="modal-close" onClick={() => setSelectedPreview(null)}><FiX /></button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddProduct;