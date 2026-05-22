import { useEffect, useRef, useState } from 'react'
import { MoveRight, Heart, ChevronLeft, ChevronRight, HeartIcon,  } from 'lucide-react'
import { toast } from 'react-hot-toast';

import { useShop } from '../../utilities/ShopContext'

import ring from '../assets/ring-2.png'
import earring from '../assets/earring.png'
import bracelet from '../assets/bracelet.png'
import necklacegold from '../assets/necklace-gold.png'
import necklacesilver from '../assets/silver-necklace.png'
import flowernecklace from '../assets/necklace-flower.png'
import collection1 from '../assets/hero-collection.png'
import collection2 from '../assets/collection-2.png'


export default function BestSellers() {
    const { cart, addToCart, favorites, manageFavorite, bestSellersData } = useShop();

    const [] = useState([]);
    const [] = useState(0);
    const [] = useState();
    const [] = useState();

    const [] = useState(0);
    const [] = useState([]);

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
                    {bestSellersData.map((item, index) => (
                    /* Added shrink-0 so items don't squeeze together when overflowing */
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
                                onClick={() => {manageFavorite(index)}}
                                >
                                    <Heart className={`w-4 h-4 md:w-5 md:h-5 ${item.isFavorite ? 'text-pink-600':'text-black'} transition-colors`}/>
                                </button>
                            </div>
                        </div>
                        <div className="w-full pt-1 pb-2 md:pb-3 px-2">
                            <h1 className='text-xs md:text-sm text-black capitalize font-bold mb-1'>{item.title}</h1>
                            <div className="flex gap-3 mb-[5px] md:mb-[10px]">
                                <h1 className={`${item.oldPrice > item.price ? 'flex':'hidden'} text-xs md:text-sm text-[grey] capitalize font-bold line-through`}>Gh₵ {item.oldPrice}</h1>
                                <h1 className='text-xs md:text-sm capitalize font-bold'>Gh₵ {item.price}</h1>
                            </div>
                            <button className='text-center text-white font-bold uppercase text-[8px] md:text-[10px] px-5 md:px-10 pt-[7px] pb-[5px] rounded bg-black active:opacity-25 cursor-pointer'
                            onClick={() => {
                                addToCart(item);
                                toast.success('Added to cart', {duration: 2000});
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
    )
}