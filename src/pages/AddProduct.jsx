import React, { useState, useRef, useEffect } from 'react';
import '../AddProduct.css';
import { FiCamera, FiChevronDown, FiX, FiMenu } from 'react-icons/fi';
import SideBar from '../components/SideBar';
import { useAdminBackButton } from '../hooks/useAdminBackButton.jsx';
import toast from 'react-hot-toast'; 
import axios from 'axios'; 
import { Loader2 } from 'lucide-react';
import { useShop } from '../../utilities/ShopContext';

function AddProduct() {
  const { categories, loadCategories } = useShop();
  useAdminBackButton();

  const [color, setColor] = useState("");
  const [colors, setColors] = useState([]);
  
  // Separated media structures
  const [images, setImages] = useState([]);
  const [videoFile, setVideoFile] = useState(null);

  const [productsArray, setProductsArray] = useState([]);

  const [selectedPreview, setSelectedPreview] = useState(null);
  const [mainIndex, setMainIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [moq, setMoq] = useState(6);
  const [isModifyingMoq, setIsModifyingMoq] = useState(false);

  const [isSubmitting, setSubmitting] = useState(false);

  const [availableTags, setAvailableTags] = useState([
    "Best Seller", "New", "Hot", "Popular",
  ]);

  const [availableCategories, setAvailableCategories] = useState(categories);

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

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/category/all`);

      if (categoryResponse.status === 200) {
        const allCategories = categoryResponse.data;
        const filteredCategories = allCategories.filter(cat => {
          const catName = cat.name.toLowerCase();
          return catName === 'rings' || catName === 'necklaces' || catName === 'earrings' || catName === 'bracelets';
        });

        loadCategories(allCategories);
        setAvailableCategories(allCategories);
      } else {
        loadCategories(['All Jewellery']);
      }
    };

    if (categories.length === 0) {
      fetchCategories();
    }
  }, []);

  const filteredTags = availableTags.filter((tag) =>
    tag.toLowerCase().includes(tagInput.toLowerCase())
  );

  const tagExactExists = availableTags.some(t => t.toLowerCase() === tagInput.trim().toLowerCase());

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

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    if (mainIndex >= images.length - 1) {
      setMainIndex(0);
    }
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
  };

  const handleAddColor = () => {
    if (color.trim() === "") return;
    setColors([...colors, color.trim()]);
    setColor("");
  };

  const handleRemoveColor = (indexToRemove) => {
    setColors(colors.filter((_, index) => index !== indexToRemove));
  };

  const handleIncrementMOQ = () => {
    setMoq(prev => prev + 1);
  };

  const handleDecrementMOQ = () => {
    setMoq(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleResetMoq = () => {
    setMoq(6);
    setIsModifyingMoq(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const wholesale = parseFloat(formData.get("wholesalePrice")) || 0;
    const retail = parseFloat(formData.get("retailPrice")) || 0;

    if (wholesale <= 0) {
      toast.error("Invalid wholesale price!", {
        duration: 3000,
        position: "top-center"
      });
      return;
    }

    if (retail <= 0) {
      toast.error("Invalid retail price!", {
        duration: 3000,
        position: "top-center"
      });
      return;
    }

    if (wholesale >= retail) {
      toast.error("Wholesale Prices must always be less than Retail Prices!", {
        duration: 4000,
        position: "top-center"
      });
      return;
    }

    setSubmitting(true);
    const loadId = toast.loading("Processing and uploading product...");

    try {
      if (!categoryInput.trim()) {
        toast.dismiss(loadId);
        toast.error("Product category is required", { duration: 2000 });
        setSubmitting(false);
        return;
      }

      if (images.length === 0) {
        toast.dismiss(loadId);
        toast.error("At least one product image is required", { duration: 2000 });
        setSubmitting(false);
        return;
      }

      if (tagInput.trim() && !tagExactExists) {
        setAvailableTags(prev => [...prev, tagInput.trim()]);
      }

      if (colors.length === 0) {
        toast.dismiss(loadId);
        toast.error('Color is required!', { duration: 3000 });
        setSubmitting(false);
        return;
      }

      formData.set("WholesaleMOQ", moq);

      colors.forEach(color => {
        formData.append("colors", color);
      });

      // Clear standard key-entries to avoid duplicate empty submissions from empty file nodes
      formData.delete("images");
      formData.delete("video");

      // Appending images to match backend expectations
      images.forEach((file) => {
        formData.append("images", file);
      });

      // Appending video to match backend expectations
      if (videoFile) {
        formData.append("video", videoFile);
      }

      if (tagInput.trim() === "") {
        formData.delete('tag');
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
        toast.success('Product Published', { duration: 2000 });

        setColors([]);
        setColor('');
        setImages([]);
        setVideoFile(null);
        setProductsArray([]);
        setProductsArray(null);
        setMainIndex(0);
        setSidebarOpen(false);
        setTagInput('');
        setCategoryInput('');
        setMoq(6); 
        setIsModifyingMoq(false);
        setSubmitting(false);
        form.reset();
      }

    } catch (error) {
      toast.dismiss(loadId);
      toast.error("Publish Unsuccessful!", { duration: 2000 });
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
      
      if (images.length >= 4) {
        toast.error("You can only upload a maximum of 4 images.");
        return;
      }
      setImages((prev) => [...prev, file]);
    }, "image/jpeg");
  };

  const openGallery = (type) => {
    const inputId = type === 'video' ? 'productVideo' : 'productImages';
    const input = document.getElementById(inputId);
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
              <span className="media-count">
                {images.length}/4 Image(s) & {videoFile ? 1 : 0}/1 Video uploaded
              </span>
            </div>

            <div className="media-upload-body" onClick={() => startCamera(facingMode)}>
              <div className="media-icon-circle">
                <FiCamera />
              </div>
              <h4>Capture Photo or Upload Media</h4>
              <p>Max 4 images and exactly 1 video container segment supported</p>

              <div className="upload-buttons-wrapper" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="upload-secondary-btn"
                  onClick={() => openGallery('image')}
                  style={{ marginRight: '10px' }}
                >
                  Upload Images (Max 4)
                </button>
                <button
                  type="button"
                  className="upload-secondary-btn"
                  onClick={() => openGallery('video')}
                >
                  Upload Video (Max 1)
                </button>
              </div>
            </div>

            <div className="media-upload-actions">
              <button type="button" onClick={() => startCamera(facingMode)}>📷 Camera</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); openGallery('image'); }}>📁 Upload Images</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); openGallery('video'); }}>🎥 Upload Video</button>
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

          {/* Hidden input field specialized for Images up to 4 elements */}
          <input
            type="file"
            id="productImages"
            name="images"
            hidden
            multiple
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                const incomingFiles = Array.from(e.target.files);
                if (images.length + incomingFiles.length > 4) {
                  toast.error("You can only upload a maximum of 4 images.");
                  return;
                }
                setImages((prev) => [...prev, ...incomingFiles]);
              }
            }}
          />

          {/* Hidden input field specialized for 1 unique Video input item */}
          <input
            type="file"
            id="productVideo"
            name="video"
            hidden
            accept="video/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setVideoFile(e.target.files[0]);
              }
            }}
          />

          {/* Render media layout previews */}
          {(images.length > 0 || videoFile) && (
            <div className="media-preview-grid">
              
              {/* Image Previews */}
              {images.map((file, index) => {
                const previewUrl = URL.createObjectURL(file);
                return (
                  <div key={`img-${index}`} className="media-preview-item">
                    {mainIndex === index && <div className="main-badge">Main</div>}
                    <img
                      src={previewUrl}
                      alt="Upload preview"
                      className="preview-media"
                      onClick={() => setSelectedPreview({ url: previewUrl, type: 'image' })}
                    />
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
                      onClick={() => handleRemoveImage(index)}
                    >
                      ×
                    </button>
                  </div>
                );
              })}

              {/* Video Preview block element */}
              {videoFile && (() => {
                const videoUrl = URL.createObjectURL(videoFile);
                return (
                  <div className="media-preview-item video-preview-item">
                    <div className="main-badge" style={{ backgroundColor: '#0070f3' }}>Video</div>
                    <video
                      src={videoUrl}
                      className="preview-media"
                      onClick={() => setSelectedPreview({ url: videoUrl, type: 'video' })}
                    />
                    <button
                      type="button"
                      className="delete-media-btn"
                      onClick={handleRemoveVideo}
                    >
                      ×
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          <div className="input-group">
            <input type="text" name="name" placeholder="Product Name" className="form-input" required />
          </div>

          <div className="input-group">
            <input type="text" name="description" placeholder="Enter product description..." className="form-input" required />
          </div>

          <div className="input-group">
            <input type="number" name="wholesalePrice" placeholder="Wholesale Price (₵)" className="form-input" required />
          </div>

          <div className="input-group">
            <input type="number" name="retailPrice" placeholder="Retail Price (₵)" className="form-input" required />
          </div>

          <div className="input-group select-wrapper" ref={categoryDropdownRef}>
            <input
              type="text"
              name="category"
              placeholder="Select category"
              className="form-input capitalize"
              value={categoryInput}
              readOnly
              onClick={() => setIsCategoryDropdownOpen(prev => !prev)}
              style={{ cursor: 'pointer' }}
            />
            <FiChevronDown
              className="select-arrow"
              onClick={() => setIsCategoryDropdownOpen(prev => !prev)}
            />

            {isCategoryDropdownOpen && (
              <ul className="tag-dropdown capitalize">
                {availableCategories.length > 0 ? (
                  availableCategories.map((catItem, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setCategoryInput(catItem.name);
                        setIsCategoryDropdownOpen(false);
                      }}
                    >
                      {catItem.name}
                    </li>
                  ))
                ) : (
                  <li className="no-options-row">No categories available</li>
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
            {isSubmitting ? (
              <div className="btn-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <button type="submit" className="btn-primary">Publish Product</button>
            )}
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