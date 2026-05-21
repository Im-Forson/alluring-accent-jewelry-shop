import { useEffect, useRef, useState } from 'react'
import '../App.css'
import { Settings, MoveRight, Heart, ChevronLeft, ChevronRight, HeartIcon, Phone, Mail, MessageSquare,  } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

import NavBar from '../components/NavBar'
import Hero from '../components/Hero'
import BestSellers from '../components/BestSellers'
import WhyShopWithUs from '../components/WhyShopWithUs'
import TrackYourOrder from '../components/TrackYourOrder'
import Footer from '../components/Footer'

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
    {id: '0', title: 'rose gold ring', description: 'A symbol of endless love and elegance. Crafted in premium rose gold with sparkling stones.', status: 'new', image: ring, price: 450, oldPrice: 0, isFavorite: false, colors: ['gold', 'silver', 'black',], preferedColor: 'gold', minimumOrder: 6, purchaseQty: 6,  orderQty: 6, isAllowBelowMOQ: false, isUseMOQ: true, images: [ring, necklacegold, earring, bracelet]},

    {id: '2',title: 'classic hoop earrings', description: 'A symbol of endless love and elegance. Crafted in premium rose gold with sparkling stones.', status: '-15%',  image: earring, price: 270.00, oldPrice: 330, isFavorite: false, colors: ['white', 'silver', 'black'], preferedColor: 'white', minimumOrder: 30,  purchaseQty: 30, isAllowBelowMOQ: false, isUseMOQ: true, images: [ring, necklacegold, earring, bracelet]},

    {id: '1',title: 'heart necklace', description: 'A symbol of endless love and elegance. Crafted in premium rose gold with sparkling stones.', status: 'new', image: flowernecklace, price: 380.00, oldPrice: 0, isFavorite: false, colors: ['gold', 'silver', 'black',], preferedColor: 'gold', minimumOrder: 5, purchaseQty: 5, isAllowBelowMOQ: false, isUseMOQ: true, images: [ring, necklacegold, earring, bracelet]},

    {id: '3',title: 'tennie bracelet', description: 'A symbol of endless love and elegance. Crafted in premium rose gold with sparkling stones.', status: '',  image: bracelet, price: 520.00, oldPrice: 0, isFavorite: false, colors: ['gold', 'silver', 'black',], preferedColor: 'gold', minimumOrder: 12, purchaseQty: 12, isAllowBelowMOQ: false, isUseMOQ: true, images: [ring, necklacegold, earring, bracelet]},

    {id: '4',title: 'rose gold ring', description: 'A symbol of endless love and elegance. Crafted in premium rose gold with sparkling stones.', status: 'new',  image: bracelet, price: 450, oldPrice: 0, isFavorite: false, colors: ['gold', 'silver', 'black',], preferedColor: 'silver', minimumOrder: 1, purchaseQty: 1, isAllowBelowMOQ: false, isUseMOQ: true, images: [ring, necklacegold, earring, bracelet]},

    {id: '5',title: 'heart necklace', description: 'A symbol of endless love and elegance. Crafted in premium rose gold with sparkling stones.', status: '-5%',  image: ring, price: 380, oldPrice: 0, isFavorite: false, colors: ['gold', 'silver', 'black',], preferedColor: 'black', minimumOrder: 6, purchaseQty: 6, isAllowBelowMOQ: false, isUseMOQ: true, images: [ring, necklacegold, earring, bracelet]},

    {id: '6',title: 'tennie bracelet', description: 'A symbol of endless love and elegance. Crafted in premium rose gold with sparkling stones.', status: '',  image: flowernecklace, price: 270, oldPrice: 0, isFavorite: false, colors: ['gold', 'silver', 'black',], preferedColor: 'silver', minimumOrder: 24, purchaseQty: 24, isAllowBelowMOQ: false, isUseMOQ: true, images: [ring, necklacegold, earring, bracelet]},
];

export default function HomePage() {
    const [favorites, setFavorites] = useState([]);
    const [favoriteCount, setFavoriteCount] = useState(0);
    const [bestSellersCopy, setBestSellersCopy] = useState(bestSellers);
    const [bestSellerFavoriteIndex, setBestSellerFavoriteIndex] = useState();

    const [cartCount, setCartCount] = useState(0);
    const [cart, setCart] = useState([]);

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
                favorites={favorites}
                setFavorites={setFavorites}
                cart={cart}
                setCart={setCart}
                bestSellers={bestSellersCopy}
                setBestSellers={setBestSellersCopy}
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
                cartList={cart}
                setCartList={setCart}
            />
            <TrackYourOrder/>
            <WhyShopWithUs/>
            <Footer/>
            
        </div>
    )
}