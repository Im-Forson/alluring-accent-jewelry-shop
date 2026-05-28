import React, { useState, useRef, useEffect } from 'react';
import '../AddProduct.css';
import { FiCamera, FiChevronDown, FiX, FiMenu } from 'react-icons/fi';
import SideBar from '../components/SideBar';
import toast from 'react-hot-toast'; 
import axios from 'axios'; // Linked: Added axios import for backend communication
import { Loader2 } from 'lucide-react';

function AddProduct() {
  const [color, setColor] = useState("");
  const [colors, setColors] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [productsArray, setProductsArray] = useState([]);

  const [selectedPreview, setSelectedPreview] = useState(null);
  const [mainIndex, setMainIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAllowBelowMOQ, setAllowBelowMoq] = useState(false);

  const [isSubmitting, setSubmitting] = useState(false);

  const [availableTags, setAvailableTags] = useState([
    "Best Seller", "New", "Hot", "Popular",
  ]);

  const [availableCategories, setAvailableCategories] = useState([
    "Rings", "Necklaces", "Earrings", "Bracelets", "Anklets", "Brooches", "Cufflinks","Body Jewelry", "Watches"
  ]);

  const [tagInput, setTagInput] = useState("");
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const tagDropdownRef = useRef(null);

  const [categoryInput, setCategoryInput] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const filteredTags = availableTags.filter((tag) =>
    tag.toLowerCase().includes(tagInput.toLowerCase())
  );

  const filteredCategories = availableCategories.filter((cat) =>
    cat.toLowerCase().includes(categoryInput.toLowerCase())
  );

  const tagExactExists = availableTags.some(t => t.toLowerCase() === tagInput.trim().toLowerCase());
  const categoryExactExists = availableCategories.some(c => c.toLowerCase() === categoryInput.trim().toLowerCase());

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

  const handleAddCategory = async () => {
    setSubmitting(true);
    const categoryLoadId = toast.loading("Creating category...");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/category/create`, 
        {category: categoryInput.trim()},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
            // "Content-Type": ""
          }
        }
      );

      if (res.status === 201) {
        toast.dismiss(categoryLoadId);
        toast.error("Category created", {duration: 2000});
        setSubmitting(false);
      }
    } catch (error) {
      toast.dismiss(categoryLoadId);
      toast.error("Category failed to create", {duration: 2000});
      setSubmitting(false);
    }
    setAvailableCategories([...availableCategories, categoryInput.trim()]);
    setIsCategoryDropdownOpen(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    const loadId = toast.loading("Processing and uploading product...");

    try {

      if (!categoryInput.trim()) {
        toast.dismiss(loadId);
        toast.error("Product category is required", {duration: 2000});
        setSubmitting(false);
        return;
      }

      if (mediaFiles.length === 0) {
        toast.dismiss(loadId);
        toast.error("Image upload is required", {duration: 2000});
        setSubmitting(false);
        return;
      }

      if (tagInput.trim() && !tagExactExists) {
        setAvailableTags(prev => [...prev, tagInput.trim()]);
      }

      if (categoryInput.trim() && !categoryExactExists) {
        setAvailableCategories(prev => [...prev, categoryInput.trim()]);
      }

      const form = e.target;
      const formData = new FormData(form);

      if (isAllowBelowMOQ) {
        const productPrice = parseFloat(formData.get('price'));
        const belowMoqPrice = parseFloat(formData.get('belowMOQPrice'));
        if (belowMoqPrice < productPrice) {
          toast.dismiss(loadId);
          toast.error('Below MOQ price cannot be less than actual price!', {duration: 3000});
          setSubmitting(false);
          return;
        }
      }

      if (colors.length === 0) {
        toast.dismiss(loadId);
        toast.error('Color is required!', {duration: 3000});
        setSubmitting(false);
        return;
      }

      formData.set("isAllowBelowMOQ", isAllowBelowMOQ);

      colors.forEach(color => {
        formData.append("colors", color);
      });

      mediaFiles.forEach((file) => {
        formData.append("images", file);
      });

      if (tagInput.trim() === "") {
        formData.set("tag", "null")
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/product/create`, 
        formData,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
            "Content-Type": "multipart/form-data",
          }
        }
      );

      if (response.status === 201) {
        toast.dismiss(loadId);
        toast.success('Product Publised!', {duration: 2000});

        setColors([]);
        setColor('');
        setMediaFiles([]);
        setProductsArray([]);
        setProductsArray(null);
        setMainIndex(0);
        setSidebarOpen(false);
        setAllowBelowMoq(false);
        setTagInput('');
        setCategoryInput('');
        setSubmitting(false);
        form.reset()
      }

    } catch (error) {
      toast.dismiss(loadId);
      toast.error("Pubish Unsuccessful!", {duration: 2000});
      setSubmitting(false);
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
      toast.error("Camera permissions were denied or are currently unavailable.");
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
                    onClick={handleAddCategory}
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
                multiple
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

          <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input type="number" min="1" name="minimumOrder" placeholder="Enter Minimum Order Quantity (MOQ)" className="form-input" required />
            
            {
              isAllowBelowMOQ && (
                <input type="number" min="1" name="belowMOQPrice" placeholder="Enter Below (MOQ) Price" className="form-input" required />
              )
            }
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 6px' }}>
              <input 
                type="checkbox" 
                name="isAllowBelowMOQ"
                id="allowBelowMoq" 
                checked={isAllowBelowMOQ}
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
            {
              isSubmitting ? (
                <div className="btn-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <button type="submit" className="btn-primary">Publish Product</button>
              )
            }
          </div>
        </form>
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