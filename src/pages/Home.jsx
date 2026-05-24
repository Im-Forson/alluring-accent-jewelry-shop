import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Settings, MoveRight, Heart, ChevronLeft, ChevronRight, HeartIcon, Phone, Mail, MessageSquare,  } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

import { useShop } from '../../utilities/ShopContext'

import NavBar from '../components/NavBar'
import Hero from '../components/Hero'
import BestSellers from '../components/BestSellers'
import WhyShopWithUs from '../components/WhyShopWithUs'
import TrackYourOrder from '../components/TrackYourOrder'
import Footer from '../components/Footer'
import { allProductsDummy } from '../../utilities/dummyData'

import ring from '../assets/ring-2.png'
import earring from '../assets/earring.png'
import bracelet from '../assets/bracelet.png'
import necklacegold from '../assets/necklace-gold.png'
import necklacesilver from '../assets/silver-necklace.png'
import flowernecklace from '../assets/necklace-flower.png'
import collection1 from '../assets/hero-collection.png'
import collection2 from '../assets/collection-2.png'
import OrderSuccessModal from '../components/OrderSuccessModal'

const categories = [
    {title: 'Rings', image: ring},
    {title: 'Necklaces', image: flowernecklace},
    {title: 'Earrings', image: earring},
    {title: 'Bracelets', image: bracelet},
    // {title: 'bracelets', image: necklace},
];

export default function HomePage() {
    const navigate = useNavigate();
    const { allProducts, loadBestSellers, loadAllMainBestSellers, loadAllProducts, loadShopCategory, } = useShop();

    const [favorites, setFavorites] = useState([]);
    const [favoriteCount, setFavoriteCount] = useState(0);
    const [bestSellersCopy, setBestSellersCopy] = useState();
    const [bestSellerFavoriteIndex, setBestSellerFavoriteIndex] = useState();

    const [cartCount, setCartCount] = useState(0);
    const [cart, setCart] = useState([]);

    const [] = useState(false);

    // Initialize all products
    loadAllProducts(allProductsDummy);
    // Initialize best sellers
    // loadBestSellers(bestSellers);

    useEffect(() => {
        const bestSellers = allProductsDummy.filter(product => product.tag === 'Best Seller');
        loadBestSellers(bestSellers);
    }, [])

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
                    <button className="text-[12px] text-pink-500 md:text-black md:text-sm font-bold capitalize cursor-pointer hover:text-pink-500 active:opacity-25"
                    onClick={() => {
                        loadShopCategory('All Jewellery');
                        navigate('/shop');
                    }}
                    >view all</button>
                </div>
                <div className="flex flex-wrap justify-between">
                    {categories.map((category, index) => (
                        <div key={index}  className="w-[24%] mb-5">
                            <div 
                                className="group relative h-[70px] md:h-[200px] w-full rounded-full md:rounded-xl bg-[linear-gradient(90deg,#f7e9ea_0%,#e9d4d2_40%,#d8b1ad_75%,#c7938f_100%)] cursor-pointer overflow-hidden active:opacity-25"

                                onClick={() => {
                                    loadShopCategory(category.title)
                                    navigate('/shop')
                                }}
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
            <OrderSuccessModal/>
            <BestSellers/>
            <div className="mb-15"></div>
            <TrackYourOrder/>
            <WhyShopWithUs/>
            <Footer/>
            
        </div>
    )
}