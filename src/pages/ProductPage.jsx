import { useState } from 'react';
import { useLocation } from 'react-router';
import { Heart, ShoppingBag, Search, Menu, UserRound, ChevronLeft, ChevronRight, Star, Plus, Minus, MessageCircle } from 'lucide-react';

import NavBar from '../components/NavBar';
import WhyShopWithUs from '../components/WhyShopWithUs';
import Footer from '../components/Footer';
import { FaWhatsapp } from 'react-icons/fa';

export default function ProductPage() {
  const location = useLocation();
  
  const {  title, description, price, oldPrice, colors, preferedColor, minimumOrder, purchaseQty, images } = location.state || {}

    // 1. Core State Handlers
    const [selectedSize, setSelectedSize] = useState('7');
    const [selectedMaterial, setSelectedMaterial] = useState('Rose Gold');
    const [quantity, setQuantity] = useState(1);
    
    
    const [activeImg, setActiveImg] = useState(images[0]);

    // Quantity modifiers
    const handleIncrement = () => setQuantity(prev => prev + 1);
    const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="">
          <NavBar 
            activePage={'product'} 
            favoriteCount={0}
            cartCount={0}
            favorites={[]}
            setFavorites={[]}
            cart={[]}
            setCart={[]}
            bestSellers={[]}
            setBestSellers={[]} 
          />

          
          <div className="min-h-screen bg-white text-zinc-800 font-sans pt-25 pb-16">
              <div className="px-10 mb-10">
                  <h2 className='text-medium md:text-2xl font-bold'>Product <span className='text-pink-600'>Details</span></h2>
                  {/* <h3 className="hidden md:flex text-sm">Explore our most loved pieces</h3> */}
              </div>
              {/* MAIN CORE HERO GRID */}
              <main className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mt-4 mb-20">
                  
                  {/* LEFT ELEMENT: PRODUCT GALLERY VIEWER */}
                  <div className="space-y-4">
                      {/* Main Focus Frame */}

                      <div className="relative rounded-2xl border-3 overflow-hidden border-zinc-100 flex items-center justify-center aspect-square group ">
                          <img 
                              src={activeImg} 
                              alt="Rose Gold Infinity Ring Main Focus" 
                              className="w-full h-full object-contain p-8 transition-transform duration-300 group-hover:scale-105"
                          />
                          
                      </div>

                      {/* Horizontal Thumbnail Scroll Track Container */}
                      <div className="flex items-center gap-3 relative px-6">
                          {/* <button className="absolute left-0 p-1 bg-white border border-zinc-100 shadow-sm rounded-full cursor-pointer"><ChevronLeft className="h-4 w-4" /></button> */}
                          
                          <div className="flex gap-3 overflow-x-auto no-scrollbar w-full py-1">
                              {images.map((img, index) => (
                                  <button 
                                      key={index}
                                      onClick={() => setActiveImg(img)}
                                      className={`w-[22%] aspect-square  rounded-xl overflow-hidden border-2 shrink-0 p-1.5 transition-all cursor-pointer ${
                                          activeImg === img ? 'border-pink-500 ring-1 ring-pink-500' : 'border-zinc-200 hover:border-zinc-400'
                                      }`}
                                  >
                                      <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                                  </button>
                              ))}
                          </div>

                          {/* <button className="absolute right-0 p-1 bg-white border border-zinc-100 shadow-sm rounded-full cursor-pointer"><ChevronRight className="h-4 w-4" /></button> */}
                      </div>
                  </div>

                  {/* RIGHT ELEMENT: INLINE INFORMATION PURCHASE BOX */}
                  <div className="flex flex-col gap-6">
                      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 font-serif capitalize">{title}</h1>

                      <div className="text-2xl font-black text-pink-600 tracking-wide font-sans">
                          GH₵ {price}
                      </div>

                      <p className="text-xs md:text-sm text-zinc-500 font-serif leading-relaxed max-w-md">{description}</p>

                      {/* COMPONENT FILTER A: ATOMIZED SIZES TRACKER */}
                      <div>
                          {/* <div className="flex justify-between items-baseline mb-2">
                              <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Size</label>
                              <span className="text-[11px] font-semibold text-zinc-400 hover:text-pink-600 underline cursor-pointer">Size Guide</span>
                          </div> */}
                          <div className="grid grid-cols-4 gap-2.5 max-w-sm">
                              {['6', '7', '8', '9'].map((size) => (
                                  <button
                                      key={size}
                                      onClick={() => setSelectedSize(size)}
                                      className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                                          selectedSize === size 
                                              ? 'border-pink-500 text-pink-600 bg-pink-50/20 ring-1 ring-pink-500 font-bold' 
                                              : 'border-zinc-200 text-zinc-700 hover:border-zinc-400'
                                      }`}
                                  >
                                      {size}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* COMPONENT FILTER B: CORE METALLIC MATERIALS TRACKER */}
                      <div>
                          <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-2">Material</label>
                          <div className="grid grid-cols-3 gap-2.5 max-w-md">
                              {['Rose Gold', 'White Gold', 'Yellow Gold'].map((mat) => (
                                  <button
                                      key={mat}
                                      onClick={() => setSelectedMaterial(mat)}
                                      className={`py-2 px-1 text-xs font-semibold rounded-lg border text-center transition-all truncate cursor-pointer ${
                                          selectedMaterial === mat 
                                              ? 'border-pink-500 text-pink-600 bg-pink-50/20 ring-1 ring-pink-500 font-bold' 
                                              : 'border-zinc-200 text-zinc-700 hover:border-zinc-400'
                                      }`}
                                  >
                                      {mat}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* STEPPER COUNTER QUANTITY WIDGET */}
                      <div>
                          <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-2">Quantity</label>
                          <div className="flex items-center border border-zinc-200 rounded-lg w-max bg-[#fafafa]">
                              <button onClick={handleDecrement} className="p-2 text-zinc-500 hover:bg-zinc-100 transition-colors rounded-l-lg cursor-pointer">
                                  <Minus className="h-3.5 w-3.5" />
                              </button>
                              <input 
                                  type="text" 
                                  value={quantity} 
                                  readOnly
                                  className="w-10 text-center text-xs font-bold text-zinc-800 bg-transparent focus:outline-none border-none"
                              />
                              <button onClick={handleIncrement} className="p-2 text-zinc-500 hover:bg-zinc-100 transition-colors rounded-r-lg cursor-pointer">
                                  <Plus className="h-3.5 w-3.5" />
                              </button>
                          </div>
                      </div>

                      {/* TARGET TRANSACTION STRATEGIC BUTTON STACK */}
                      <div className="space-y-3 max-w-md mt-2">
                          {/* Add to Cart CTA */}
                          <button className="w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold py-3.5 rounded-xl uppercase tracking-widest active:scale-[0.99] transition-all shadow-sm cursor-pointer">
                              <ShoppingBag className="h-4 w-4" /> Add To Cart
                          </button>
                          
                          {/* Express Direct Checkout */}
                          <button className="w-full bg-black hover:bg-zinc-900 text-white text-xs font-bold py-3.5 rounded-xl uppercase tracking-widest active:scale-[0.99] transition-all shadow-md cursor-pointer">
                              Buy Now
                          </button>
                          
                          {/* Regional WhatsApp Order Funnel Anchor Link */}
                          <a 
                              href={`https://wa.me{selectedSize},%20Material:%20${selectedMaterial},%20Quantity:%20${quantity}.`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full flex items-center justify-center gap-2 border border-zinc-600 text-zinc-600 hover:bg-pink-50/50 text-xs font-bold py-3.5 rounded-xl uppercase tracking-widest transition-all cursor-pointer"
                          >
                              <FaWhatsapp className="h-4 w-4 text-zinc-500 fill-current" /> Order On WhatsApp
                          </a>
                      </div>

                  </div>
              </main>
              <WhyShopWithUs/>
              <Footer/>
          </div>
        </div>
    );
}
