import React, { useState } from 'react';
import '../App.css';
import BestSellers from '../components/BestSellers';
 import Footer from '../components/Footer';
 import NavBar from '../components/NavBar';

 import ring from '../assets/ring-2.png'
 import earring from '../assets/earring.png'
import bracelet from '../assets/bracelet.png'
import necklacegold from '../assets/necklace-gold.png'
import necklacesilver from '../assets/silver-necklace.png'
import flowernecklace from '../assets/necklace-flower.png'
import collection1 from '../assets/hero-collection.png'
import collection2 from '../assets/collection-2.png'

const bestSellers = [
    {id: '0', title: 'rose gold ring', status: 'new', image: ring, newPrice: 450, oldPrice: 0, isFavorite: false},
    {id: '2',title: 'classic hoop earrings', status: '-15%',  image: earring, newPrice: 270.00, oldPrice: 330, isFavorite: false},
    {id: '1',title: 'heart necklace', status: 'new', image: flowernecklace, newPrice: 380.00, oldPrice: 0, isFavorite: false},
    {id: '3',title: 'tennie bracelet', status: '',  image: bracelet, newPrice: 520.00, oldPrice: 0, isFavorite: false},
    {id: '4',title: 'rose gold ring', status: 'new',  image: bracelet, newPrice: 450, oldPrice: 0, isFavorite: false},
    {id: '5',title: 'heart necklace', status: '-5%',  image: ring, newPrice: 380, oldPrice: 0, isFavorite: false},
    {id: '6',title: 'tennie bracelet', status: '',  image: flowernecklace, newPrice: 270, oldPrice: 0, isFavorite: false},
];

export default function () {
  // Hardcoded product data right inside the component for easy standalone building
  const product = {
    title: "Rose Gold Infinity Ring",
    reviewsCount: 126,
    price: 450.00,
    currency: "GH₵",
    description: "A symbol of endless love and elegance. Crafted in premium rose gold with sparkling stones.",
    sizes: [6, 7, 8, 9],
    materials: ["Rose Gold", "White Gold", "Yellow Gold"],
    images: ["./assets/ring-2.png",
            './assets/ring-2.png',
            './assets/ring-2.png',
            './assets/ring-2.png',]
      
  };

  // Interactive UI States
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(7);
  const [selectedMaterial, setSelectedMaterial] = useState("Rose Gold");
  const [quantity, setQuantity] = useState(1);


  // Handlers for interactive counter
  const handleQuantityChange = (type) => {
    if (type === 'dec' && quantity > 1) setQuantity(quantity - 1);
    if (type === 'inc') setQuantity(quantity + 1);
  };
   const [favorites, setFavorites] = useState([]);
      const [favoriteCount, setFavoriteCount] = useState(0);
      const [bestSellersCopy, setBestSellersCopy] = useState(bestSellers);
      const [bestSellerFavoriteIndex, setBestSellerFavoriteIndex] = useState();
  
      const [cartCount, setCartCount] = useState(0);
      const [cartList, setCartList] = useState([]);
  

  return (
        <div>
        <NavBar favorites={favorites}
                        setFavorites={setFavorites}
                        favoriteCount={favoriteCount} />

    <div className="store-container">
    

      {/* Main Content Area */}
      <main className="product-layout">
        
        {/* Left Column: Image Media Section */}
        <section className="media-section">
          
          <div className="main-image-wrapper">
            <img src={selectedImage} alt={product.title} className="main-product-image" />
          </div>

          <div className="thumbnail-grid">
            {product.images.map((imgUrl, index) => (
              <div 
                key={index} 
                className={`thumbnail-box ${selectedImage === imgUrl ? 'active-thumb' : ''}`}
                onClick={() => setSelectedImage(imgUrl)}
              >
                <img src={imgUrl} alt="" />
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Custom Option Selectors */}
        <section className="details-section">
          <h1 className="product-title">{product.title}</h1>

          <div className="product-price">
            {product.currency} {product.price.toFixed(2)}
          </div>

          <p className="product-description">{product.description}</p>

          {/* Size Swatches */}
          <div className="selector-group">
            <div className="selector-header">
              <label>SIZE</label>
            </div>
            <div className="options-grid">
              {product.sizes.map(size => (
                <button 
                  key={size}
                  className={`option-btn ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Material Swatches */}
          <div className="selector-group">
            <label>MATERIAL</label>
            <div className="options-grid text-options">
              {product.materials.map(material => (
                <button 
                  key={material}
                  className={`option-btn text-btn ${selectedMaterial === material ? 'selected' : ''}`}
                  onClick={() => setSelectedMaterial(material)}
                >
                  {material}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Counter Box */}
          <div className="selector-group">
            <label>QUANTITY</label>
            <div className="quantity-counter">
              <button onClick={() => handleQuantityChange('dec')}>−</button>
              <input type="text" value={quantity} readOnly />
              <button onClick={() => handleQuantityChange('inc')}>+</button>
            </div>
          </div>

          {/* Action Call-To-Actions (CTAs) */}
          <div className="action-buttons">
            <button className="btn btn-add-cart">ADD TO CART</button>
            <button className="btn btn-buy-now">BUY NOW</button>
            
          </div>
        </section>

      </main>

      
      {/* Mock "You May Also Like" section using Best Sellers itemS from the Home Page */}

        <BestSellers
                        favorites={favorites}
                        setFavorites={setFavorites}
                        favoriteCount={favoriteCount}
                        setFavoriteCount={setFavoriteCount}
                        bestSellersCopy={bestSellersCopy}
                        setBestSellersCopy={setBestSellersCopy}
                        bestSellerFavoriteIndex={bestSellerFavoriteIndex}
                        setBestSellerFavoriteIndex={setBestSellerFavoriteIndex}
                        cartCount={cartCount}
                        setCartCount={setCartCount}
                        cartList={cartList}
                        setCartList={setCartList}
                    />

       {/* Footer */}   

       <Footer /> 



      
      
    </div>
    </div>
  );
}