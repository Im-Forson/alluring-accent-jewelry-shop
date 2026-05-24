import { useEffect, useRef, useState } from 'react'
import { MoveRight, Heart, ChevronLeft, ChevronRight, HeartIcon,  } from 'lucide-react'
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';

import { useShop } from '../../utilities/ShopContext'
import { allProductsDummy } from '../../utilities/dummyData';

import ring from '../assets/ring-2.png'
import earring from '../assets/earring.png'
import bracelet from '../assets/bracelet.png'
import necklacegold from '../assets/necklace-gold.png'
import necklacesilver from '../assets/silver-necklace.png'
import flowernecklace from '../assets/necklace-flower.png'
import collection1 from '../assets/hero-collection.png'
import collection2 from '../assets/collection-2.png'


export default function BestSellers() {
    const { cart, addToCart, favorites, manageFavorite, bestSellers, loadShopCategory, setViewingProductDetails } = useShop();
    const navigate = useNavigate();

    const [] = useState([]);

    const scrollContainerRef = useRef(null);

    // useEffect(() => {
    //     if (bestSellers.length === 0) {
    //         const bestSellers = allProductsDummy.filter(product => product.tag === 'Best Seller');
    //         loadBestSellers(bestSellers);
    //     }
    // }, [])

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

    function viewProduct(product, source) {
        setViewingProductDetails(product);
        navigate('/product', {state: {source: source}}); 
    }

    return (
        <section className='px-4 md:px-10 mb-15 md:mb-20'>
            <div className="flex justify-between items-center mb-">
                <div className="">
                <h2 className='text-medium md:text-2xl font-bold'>Best <span className='text-pink-600'>Sellers</span></h2>
                    {/* <p className="hidden md:flex text-[11px]">Hanpicked favorites just for you</p> */}
                </div>
                <button className="text-[12px] text-pink-500 md:text-black md:text-sm font-bold capitalize cursor-pointer hover:text-pink-500 active:opacity-25"
                onClick={() => {
                    loadShopCategory('All Jewellery');
                    navigate('/bestsellers');
                }}
                >
                view all
                </button>
            </div>

            <div className="relative w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {(bestSellers.slice(0, 8)).map((product, index) => (
                    <div
                        key={product.id}
                        className="rounded-xl shadow-sm overflow-hidden
                        transform transition-all duration-500 opacity-0 translate-y-6 animate-fadeIn"
                        style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                    >
                        {/* IMAGE */}
                        <div className="relative h-[140px] md:h-[200px] overflow-hidden">
                        <img
                            src={product.image}
                            className="w-full h-full object-cover hover:scale-110 transition duration-500"
                        />

                        <div className="absolute top-2 inset-x-0 px-2 flex items-center justify-between pointer-events-none">
                            <div>
                            {product.tag ? (
                                <span className="bg-pink-600 text-white text-[11px] px-2 py-1 rounded shadow-sm pointer-events-auto">
                                {product.tag}
                                </span>
                            ) : (
                                <div />
                            )}
                            </div>

                            <button
                            className="p-1 md-p-1.5 bg-white/80 backdrop-blur-xs hover:bg-white text-stone-800 hover:text-pink-600 rounded-full shadow-xs transition-all pointer-events-auto active:scale-90 cursor-pointer"
                            onClick={() => manageFavorite(product.id)}
                            >
                            <Heart
                                className={`w-4 h-4 md:w-5 md:h-5 ${
                                product.isFavorite
                                    ? "fill-pink-600 text-pink-600"
                                    : "text-stone-700"
                                }`}
                            />
                            </button>
                        </div>
                        </div>

                        {/* INFO */}
                        <div className="p-3">
                        <h3 className="text-xs md:text-sm font-bold capitalize">
                            {product.name}
                        </h3>

                        <div className="flex gap-3">
                            {product.oldPrice > product.price && (
                            <p className="text-xs md:text-sm font-semibold mt-1 line-through text-[grey]">
                                Gh₵ {product.oldPrice}
                            </p>
                            )}
                            <p className="text-xs md:text-sm font-semibold mt-1">
                            Gh₵ {product.price}
                            </p>
                        </div>
                        </div>

                        {/* VIEW PRODUCT */}
                        <button
                        className="w-full text-xs md-text-sm py-[5px] font-bold border-t border-zinc-200 text-zinc-400 active:bg-zinc-600 active:text-white"
                        onClick={() => viewProduct(product, 'bestsellers')}
                        >
                        View
                        </button>
                    </div>
                    ))}
                </div>
            </div>
        </section>
    )
}