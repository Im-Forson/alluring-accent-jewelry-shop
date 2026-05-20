import { useEffect, useRef, useState } from 'react'
import '../App.css'
import { Settings, MoveRight, Heart, ChevronLeft, ChevronRight, HeartIcon, Phone, Mail, MessageSquare,  } from 'lucide-react'

import NavBar from '../components/NavBar'
import WhyShopWithUs from '../components/WhyShopWithUs'
import Footer from '../components/Footer'

import Hero from '../components/Hero'
import ring from '../assets/ring-2.png'
import earring from '../assets/earring.png'
import bracelet from '../assets/bracelet.png'
import necklacegold from '../assets/necklace-gold.png'
import necklacesilver from '../assets/silver-necklace.png'
import flowernecklace from '../assets/necklace-flower.png'
import collection1 from '../assets/hero-collection.png'
import collection2 from '../assets/collection-2.png'

const categories = [
    {title: 'rings', image: ring},
    {title: 'necklaces', image: flowernecklace},
    {title: 'earrings', image: earring},
    {title: 'bracelets', image: bracelet},
    {title: 'bracelets', image: bracelet},
    {title: 'rings', image: ring},
    {title: 'necklaces', image: flowernecklace},
    {title: 'earrings', image: earring},
    // {title: 'bracelets', image: necklace},
];

const bestSellers = [
    {id: '0', title: 'rose gold ring', status: 'new', image: ring, newPrice: 450, oldPrice: 0, isFavorite: false},
    {id: '2',title: 'classic hoop earrings', status: '-15%',  image: earring, newPrice: 270.00, oldPrice: 330, isFavorite: false},
    {id: '1',title: 'heart necklace', status: 'new', image: flowernecklace, newPrice: 380.00, oldPrice: 0, isFavorite: false},
    {id: '3',title: 'tennie bracelet', status: '',  image: bracelet, newPrice: 520.00, oldPrice: 0, isFavorite: false},
    {id: '4',title: 'rose gold ring', status: 'new',  image: bracelet, newPrice: 450, oldPrice: 0, isFavorite: false},
    {id: '5',title: 'heart necklace', status: '-5%',  image: ring, newPrice: 380, oldPrice: 0, isFavorite: false},
    {id: '6',title: 'tennie bracelet', status: '',  image: flowernecklace, newPrice: 270, oldPrice: 0, isFavorite: false},
];

export default function HomePage() {
    const [favorites, setFavorites] = useState([]);
    const [favoriteCount, setFavoriteCount] = useState(0);
    const [bestSellersCopy, setBestSellersCopy] = useState(bestSellers);
    const [bestSellerFavoriteIndex, setBestSellerFavoriteIndex] = useState();

    const [cartCount, setCartCount] = useState(0);
    const [cartList, setCart] = useState([]);

    const [] = useState(false);

    const scrollContainerRef = useRef(null);

    

    // 2. Navigation handler functions
    const scroll = (direction) => {
        if (scrollContainerRef.current) {
        const scrollAmount = 300; // Adjust this value to scroll more or less per click
        scrollContainerRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
        }
    };

    return (
        <div>
            <section className="mb-5 md:mb-10">
                <NavBar 
                activePage={'home'} 
                favoriteCount={favoriteCount}
                cartCount={cartCount}
                />
                <Hero/>
            </section>
            {/* categories */}
            <section className='px-4 md:px-10 mb-5 md:mb-10'>
                <div className="flex justify-between items-center mb-3 md:mb-4">
                    <div className="">
                        <h2 className='text-medium md:text-2xl font-bold'>Shop <span className='text-pink-600'>Category</span></h2>
                        {/* <h3 className="hidden md:flex text-sm">Explore our most loved pieces</h3> */}
                    </div>
                    <button className="text-[12px] text-pink-500 md:text-black md:text-sm font-bold capitalize cursor-pointer hover:text-pink-500 active:opacity-25">view all</button>
                </div>
                <div className="flex flex-wrap justify-between">
                    {categories.map((category, index) => (
                        <div key={index}  className="w-[24%] mb-5">
                            <div 
                                className="group relative h-[70px] md:h-[200px] w-full rounded-full md:rounded-xl bg-[linear-gradient(90deg,#f7e9ea_0%,#e9d4d2_40%,#d8b1ad_75%,#c7938f_100%)] cursor-pointer overflow-hidden active:opacity-25"
                            >
                                {/* Dark overlay that activates when parent (group) is hovered */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
                            
                                <img src={category.image} alt="img " className='w-full h-full object-cover' />
                                
                                <div className="hidden md:flex flex-col relative left-[10px] bottom-[50px] z-20">
                                    <h1 className='text-[17px] capitalize font-bold'>{category.title}</h1>
                                    <div className='hidden md:flex items-center gap-2 cursor-pointer'>
                                        <p className="capitalize text-[13px] group-hover:text-pink-600 group-hover:font-bold">shop now</p>
                                        <MoveRight className='h-4 group-hover:text-pink-500'/>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex justify-center md:hidden mt-1">
                                <h1 className='text-xs capitalize font-bold'>{category.title}</h1>
                            </div>
                        </div>
                      
                    ))}
                </div>
            </section>
            {/* best sellers */}
            <section className='px-4 md:px-10 mb-5 md:mb-10'>
                <div className="flex justify-between items-center mb-3">
                    <div className="">
                    <h2 className='text-medium md:text-2xl font-bold'>Best <span className='text-pink-600'>Sellers</span></h2>
                        {/* <p className="hidden md:flex text-[11px]">Hanpicked favorites just for you</p> */}
                    </div>
                    <button className="text-[12px] text-pink-500 md:text-black md:text-sm font-bold capitalize cursor-pointer hover:text-pink-500 active:opacity-25">view all</button>
                </div>

                <div className="relative w-full">
                    <div 
                        ref={scrollContainerRef}
                        className="flex gap-2 overflow-x-auto scroll-smooth no-scrollbar select-none pb-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Fallback to hide scrollbar in Firefox/IE
                    >
                        {bestSellersCopy.map((item, index) => (
                        /* 4. Added shrink-0 so items don't squeeze together when overflowing */
                        <div key={index} className="w-[48%] md:w-[24%] border-[1px] border-[rgba(0,0,0,0.2)] rounded-lg shrink-0">
                            <div 
                            className="group relative h-[90px] md:h-[200px] w-full  rounded-tl-lg rounded-tr-lg bg-[linear-gradient(90deg,#f7e9ea_0%,#e9d4d2_40%,#d8b1ad_75%,#c7938f_100%)] overflow-hidden"
                            >
                            {/* Dark overlay that activates when parent (group) is hovered */}
                            {/* <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" /> */}
                            
                                <img src={item.image} alt="img " className='w-full h-full object-cover' />
                                
                                <div className="flex justify-between items-center relative px-[10px] bottom-[85px] md:bottom-[180px] z-20">
                                    <h1 className={`text-[9px] md:text-xs text-[#fff] capitalize font-bold px-[3px] py-[1px] md:py-[3px] rounded-sm uppercase ${item.status===''?'bg-transparent':'bg-pink-500'}`}>{item.status}</h1>
                                    <button className={`${item.isFavorite ? 'bg-white':'bg-transparent'} cursor-pointer active:opacity-25  rounded-full p-[2px]`}

                                    onClick={() => {
                                        const updated = [...bestSellersCopy];
                                    
                                        // toggle favorite
                                        updated[index].isFavorite = !updated[index].isFavorite;
                                    
                                        setBestSellersCopy(updated);
                                    
                                        // update favorites list
                                        if (updated[index].isFavorite) {
                                            setFavorites((prev) => [updated[index], ...prev]);
                                            setFavoriteCount((prev) => prev + 1);
                                        } else {
                                            const newFavorites = favorites.filter(
                                                (item) => item.id !== updated[index].id
                                            );
                                            setFavorites(newFavorites);
                                            setFavoriteCount(newFavorites.length);
                                        }
                                    }}
                                    >
                                        <Heart className={`w-4 h-4 md:w-5 md:h-5 ${item.isFavorite ? 'text-pink-600':'text-black'} transition-colors`}/>
                                    </button>
                                </div>
                            </div>
                            <div className="w-full pt-1 pb-2 md:pb-3 px-2">
                                <h1 className='text-xs md:text-sm text-black capitalize font-bold mb-1'>{item.title}</h1>
                                <div className="flex gap-3 mb-[5px] md:mb-[10px]">
                                    <h1 className={`${item.oldPrice > item.newPrice ? 'flex':'hidden'} text-xs md:text-sm text-[grey] capitalize font-bold line-through`}>Gh₵ {item.oldPrice}</h1>
                                    <h1 className='text-xs md:text-sm capitalize font-bold'>Gh₵ {item.newPrice}</h1>
                                </div>
                                <button className='text-center text-white font-bold uppercase text-[8px] md:text-[10px] px-5 md:px-10 pt-[7px] pb-[5px] rounded bg-black active:opacity-25 cursor-pointer'
                                
                                onClick={() => {
                                    let isItemInCart = false;
                                    for (let i=0; i<cartList.length; i++) {
                                        if(cartList[i].id === item.id) {
                                            isItemInCart = true;
                                        }
                                    }

                                    if (!isItemInCart) {
                                        
                                        setCart([...cartList, item]);
                                        setCartCount(cartCount+1);
                                    }
                                }}
                                >
                                    add to cart
                                </button>
                            </div>
                        </div>
                        ))}
                    </div>

                    {/* Navigation Buttons Container */}
                    <div className="flex justify-end gap-5">
                        <button 
                        onClick={() => scroll('left')} 
                        className="p-1 rounded-full border border-gray-200 bg-white hover:bg-gray-50 active:scale-95 transition-all shadow-sm cursor-pointer"
                        >
                        <ChevronLeft className="w-4 h-4 md:h-5 md:w-5 text-gray-400" />
                        </button>
                        <button 
                        onClick={() => scroll('right')} 
                        className="p-1 rounded-full border border-gray-200 bg-white hover:bg-gray-50 active:scale-95 transition-all shadow-sm cursor-pointer"
                        >
                        <ChevronRight className="w-4 h-4 md:h-5 md:w-5 text-gray-400" />
                        </button>
                    </div>
                </div>
            </section>

            {/* TRACK ORDER */}
            <section className="mb-10 max-w-6xl mx-auto px-4 md:px-8">
            {/* Flex container that breaks into a single column on mobile, and two columns on desktop */}
            <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-pink-300">
                
                {/* LEFT SIDE: INPUT FORM */}
                <div className="w-full md:w-[55%]">
                    <h2 className="text-medium md:text-2xl font-bold mb-2">
                        Track Your <span className="text-pink-600">Order</span>
                    </h2>
                    <p className="text-[11px] md:text-xs text-gray-500 mb-6">
                        Enter your Order ID and phone number to get updates
                    </p>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] text-gray-600 font-semibold tracking-wider">ORDER ID</label>
                            <input
                                type="text"
                                placeholder="LUV12345"
                                className="w-full mt-1 border border-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-[#fafafa]"
                            />                                                                      
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-600 font-semibold tracking-wider">PHONE NUMBER</label>
                            <input
                                type="tel"
                                placeholder="+233..."
                                className="w-full mt-1 border border-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-[#fafafa]"
                            />                      
                        </div>
                        <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-xl font-bold text-[11px] md:text-sm uppercase tracking-wide active:scale-95 transition-all cursor-pointer">
                            Track Order
                        </button>
                    </div>
                </div>

                {/* RIGHT SIDE: QUICK ASSISTANCE / SOCIAL CHANNELS */}
                <div className="w-full md:w-[45%] bg-[#fafafa] border border-gray-100 rounded-2xl p-6 md:p-8 flex flex-col justify-center">
                    <h3 className="text-sm md:text-base font-bold text-gray-800 mb-1">
                        Need Quick Assistance?
                    </h3>
                    <p className="text-[11px] md:text-xs text-gray-500 mb-6">
                        Instantly track your parcel or reach our delivery desk directly.
                    </p>
                    
                    <div className="space-y-3">
                        {/* WhatsApp Option */}
                        <a 
                            href="https://wa.me" 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-4 p-3.5 bg-white border border-gray-200 rounded-xl hover:border-pink-200 active:scale-[0.99] transition-all group shadow-sm cursor-pointer"
                        >
                            <div className="p-2.5 bg-green-50 text-green-500 rounded-lg group-hover:bg-green-100 transition-colors">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-800">Track via WhatsApp</h4>
                                <p className="text-[10px] text-gray-400">Live agent dispatch update</p>
                            </div>
                        </a>

                        {/* Call Option */}
                        <a 
                            href="tel:+233000000000"
                            className="flex items-center gap-4 p-3.5 bg-white border border-gray-200 rounded-xl hover:border-pink-200 active:scale-[0.99] transition-all group shadow-sm cursor-pointer"
                        >
                            <div className="p-2.5 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-100 transition-colors">
                                <Phone className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-800">Call Support Desk</h4>
                                <p className="text-[10px] text-gray-400">Direct helpline confirmation</p>
                            </div>
                        </a>

                        {/* Email Option */}
                        <a 
                            href="mailto:support@yourdomain.com"
                            className="flex items-center gap-4 p-3.5 bg-white border border-gray-200 rounded-xl hover:border-pink-200 active:scale-[0.99] transition-all group shadow-sm cursor-pointer"
                        >
                            <div className="p-2.5 bg-pink-50 text-pink-500 rounded-lg group-hover:bg-pink-100 transition-colors">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-800">Email Query</h4>
                                <p className="text-[10px] text-gray-400">Get tracking logs via inbox</p>
                            </div>
                        </a>
                    </div>
                </div>

            </div>
        </section>
        <WhyShopWithUs/>

        <Footer/>
            
        </div>
    )
}