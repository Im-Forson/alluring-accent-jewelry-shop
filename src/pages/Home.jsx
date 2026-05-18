import '../App.css'
import NavBar from '../components/NavBar'
import { Settings, MoveRight } from 'lucide-react'

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
    // {title: 'bracelets', image: necklace},
];

export default function HomePage() {
    return (
        <div>
            <section className="mb-10">
                <NavBar activePage={'home'}/>
                <Hero/>
            </section>
            {/* categories */}
            <section className='px-10 mb-20'>
                <div className="flex justify-between items-center mb-4">
                    <div className="">
                        <h1 className='text-sm md:text-lg font-bold mb-1'>SHOP BY <span className='text-pink-600'>CATEGORY</span></h1>
                        <p className="hidden md:flex text-[11px]">Explore our most loved pieces</p>
                    </div>
                    <button className="text-[11px] text-pink-500 md:text-black md:text-sm font-bold uppercase cursor-pointer hover:text-pink-500 active:opacity-25">view all</button>
                </div>
                <div className="flex flex-wrap justify-between">
                    {categories.map((category, index) => (
                        <div key={index}  className="w-[20%] md:w-[24%] ">
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
                            <div className="w-full flex justify-center md:hidden mt-2">
                                <h1 className='text-[12px] capitalize font-bold'>{category.title}</h1>
                            </div>
                        </div>
                      
                    ))}
                </div>
            </section>
        </div>
    )
}