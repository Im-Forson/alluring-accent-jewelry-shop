import { useState } from "react"
import { Link, useNavigate } from "react-router" // Using your existing router package import

import { Sparkles, UserRound, Heart, ShoppingBag, Menu, X } from "lucide-react" // Added 'X' to close the drawer
import logo from '../assets/logo.png'

export default function NavBar({ activePage, favoriteCount, cartCount }) {
    const navigate = useNavigate();

    // 1. Sidebar toggle visibility state hook
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [isHome, setIsHome] = useState(true);
    const [isShop, setIsShop] = useState(false);
    const [isContact, setIsContact] = useState(false);

    function homeHandler() {
        setIsHome(true);
        setIsShop(false);
        setIsContact(false);
        setIsMenuOpen(false); // Close sidebar drawer when menu path is selected
    }

    function shopHandler() {
        setIsHome(false);
        setIsShop(true);
        setIsContact(false);
        setIsMenuOpen(false); // Close sidebar drawer when menu path is selected
    }

    function contactHandler() {
        setIsHome(false);
        setIsShop(false);
        setIsContact(true);
        setIsMenuOpen(false); // Close sidebar drawer when menu path is selected
    }

    function loginHandler() {
        navigate('/login');
        setIsMenuOpen(false); // Close sidebar drawer when route changes
    }

    return (
        <div className="fixed top-0 left-0 w-full bg-white shadow z-50">
            <div className="flex flex-row justify-center items-center gap-1 py-[2px] bg-pink-200">
                {/* Announcement Bar */}
            </div>
            
            <div className="flex flex-row items-center justify-between px-4 md:px-8 py-2">
                {/* 2. Hamburger button toggles state drawer visible */}
                <button 
                    className="md:hidden cursor-pointer active:opacity-25 p-1"
                    onClick={() => setIsMenuOpen(true)}
                >
                    <Menu className="w-6 h-5"/>
                </button>
                
                <div className="logo">
                    <img src={logo} alt="Logo" className="w-25 h-8 md:w-25 md:h-12" />
                </div>

                {/* DESKTOP LINKS */}
                <div className="hidden md:flex flex-row items-center gap-10">
                    <div>
                        <Link to={'/'} className={`${activePage === 'home' ? 'text-pink-600' : 'text-black'} cursor-pointer hover:text-pink-500 active:opacity-25`} onClick={homeHandler}>
                            Home
                        </Link>
                        <div className={`${activePage === 'home' ? 'bg-pink-600' : 'bg-transparent'} w-full h-[1px] mt-2`}></div>
                    </div>
                    <div>
                        <Link to={'/shop'} className={`${activePage === 'shop' ? 'text-pink-600' : 'text-black'} cursor-pointer hover:text-pink-500 active:opacity-25`} onClick={shopHandler}>
                            Shop
                        </Link>
                        <div className={`${activePage === 'shop' ? 'bg-pink-600' : 'bg-transparent'} w-full h-[1px] mt-2`}></div>
                    </div>
                    <div>
                        <Link to={'/contact'} className={`${activePage === 'contact' ? 'text-pink-600' : 'text-black'} cursor-pointer hover:text-pink-500 active:opacity-25`} onClick={contactHandler}>
                            Contact
                        </Link>
                        <div className={`${activePage === 'contact' ? 'bg-pink-600' : 'bg-transparent'} w-full h-[1px] mt-2`}></div>
                    </div>
                </div>

                {/* NAVBAR ACTION BUTTONS */}
                <div className="flex flex-row items-center gap-3 md:gap-5">
                    <button className="hidden md:flex cursor-pointer active:opacity-25" onClick={loginHandler}>
                        <UserRound className="w-5 h-5 text-[grey] font-bold"/>
                    </button>
                    <Link className="flex flex-row items-center cursor-pointer active:opacity-25">
                        <Heart className="w-5 h-5 text-[grey] font-bold"/>
                        <p className={`relative bottom-[6px] text-[12px] md:text-medium font-bold ${favoriteCount > 0 ? 'text-pink-400' : 'text-transparent'}`}>{favoriteCount}</p>
                    </Link>
                    <Link className="flex flex-row items-center cursor-pointer active:opacity-25">
                        <ShoppingBag className="w-5 h-5 text-[grey] font-bold"/>
                        <p className={`relative bottom-[6px] text-[12px] md:text-medium font-bold ${cartCount > 0 ? 'text-pink-400' : 'text-transparent'}`}>{cartCount}</p>
                    </Link>
                </div>
            </div>

            {/* 3. MOBILE SLIDING SIDEBAR DRAWER AND BLACK TRANSPARENT BACKDROP */}
            <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${isMenuOpen ? "visible" : "invisible pointer-events-none"}`}>
                
                {/* Backdrop Layer overlay - Clicking here will trigger close sidebar slide action */}
                <div 
                    className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMenuOpen ? "opacity-40" : "opacity-0"}`}
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* Left Drawer container panel */}
                <div className={`absolute top-0 left-0 w-[75%] max-w-[300px] h-full bg-white shadow-xl flex flex-col p-6 transition-transform duration-300 ease-in-out transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    
                    {/* Header line containing branding and exit button icon */}
                    <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                        <img src={logo} alt="Logo" className="w-20 h-6 object-contain" />
                        <button 
                            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 active:scale-95 cursor-pointer"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Sliding Nav Drawer Links list stack */}
                    <div className="flex flex-col gap-6 mt-8">
                        <Link 
                            to={'/'} 
                            onClick={homeHandler}
                            className={`text-base font-semibold transition-colors ${activePage === 'home' ? 'text-pink-600' : 'text-gray-800 hover:text-pink-500'}`}
                        >
                            Home
                        </Link>
                        <Link 
                            to={'/shop'} 
                            onClick={shopHandler}
                            className={`text-base font-semibold transition-colors ${activePage === 'shop' ? 'text-pink-600' : 'text-gray-800 hover:text-pink-500'}`}
                        >
                            Shop Collection
                        </Link>
                        <Link 
                            to={'/contact'} 
                            onClick={contactHandler}
                            className={`text-base font-semibold transition-colors ${activePage === 'contact' ? 'text-pink-600' : 'text-gray-800 hover:text-pink-500'}`}
                        >
                            Contact Us
                        </Link>
                    </div>

                    {/* Bottom Utility Profile Section inside Drawer container */}
                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <button 
                            onClick={loginHandler}
                            className="w-full flex items-center justify-center gap-2 bg-pink-500 text-white font-bold py-3 px-4 rounded-xl text-sm active:scale-95 transition-all shadow-sm cursor-pointer"
                        >
                            <UserRound className="w-4 h-4" />
                            Account Login
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
