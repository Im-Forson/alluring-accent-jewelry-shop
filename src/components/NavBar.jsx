import { useState } from "react"
import { Link, useNavigate, } from "react-router"

import { Sparkles, UserRound, Heart, ShoppingBag, Menu  } from "lucide-react"
import { Settings  } from "lucide-react"
import { LogIn } from "lucide-react"
import { User } from "lucide-react"

import logo from '../assets/logo.png'
import LoginPage from "../pages/LoginPage"

export default function NavBar({ activePage }) {
    const navigate = useNavigate();

    const [isHome, setIsHome] = useState(true);
    const [isShop, setIsShop] = useState(false);
    const [isContact, setIsContact] = useState(false);
    // const [activePage, setActivePage] = useState('');
    const [] = useState(true);

    function homeHandler() {
        setIsHome(true);
        setIsShop(false);
        setIsContact(false);
    }

    function shopHandler() {
        setIsHome(false);
        setIsShop(true);
        setIsContact(false);
    }

    function contactHandler() {
        setIsHome(false);
        setIsShop(false);
        setIsContact(true);
    }

    function loginHandler() {
        navigate('/login')
    }

    return (
        <div className="fixed top-0 left-0 w-full bg-white shadow z-50">
            <div class="flex flex-row justify-center items-center gap-1 py-[2px] bg-pink-200">
                {/* <Sparkles class="w-4 h-4 col"/> */}
                {/* <p class="text-center">Enjoy your shopping to the max</p> */}
            </div>
            <div class="flex flex-row items-center justify-between px-4 md:px-8 py-2">
                <button className="md:hidden cursor-pointer active:opacity-25">
                    <Menu className="w-6 h-5"/>
                </button>
                <div class="logo">
                    <img src={logo} alt="Logo" class="w-25 h-8 md:w-25 md:h-12" />
                </div>

                <div class="hidden md:flex flex-row items-center gap-10">
                    <div className="">
                        <Link to={'/'} class={`${activePage=='home'?'text-pink-600':'black'} cursor-pointer hover:text-pink-500 active:opacity-25`}
                            onClick={homeHandler}
                        >
                            Home
                        </Link>
                        <div className={`${activePage=='home'?'bg-pink-600':'transparent'} w-full h-[1px] mt-2`}></div>
                    </div>
                    <div className="">
                        <Link to={'/shop'} class={`${activePage=='shop'?'text-pink-600':'black'} cursor-pointer hover:text-pink-500 active:opacity-25`}
                            onClick={shopHandler}
                        >
                            Shop
                        </Link>
                        <div className={`${activePage=='shop'?'bg-pink-600':'transparent'} w-full h-[1px] mt-2`}></div>
                    </div>
                    <div className="">
                        <Link to={'/contact'} class={`${activePage=='contact'?'text-pink-600':'black'} cursor-pointer hover:text-pink-500 active:opacity-25`}
                            onClick={contactHandler}
                        >
                            Contact
                        </Link>
                        <div className={`${activePage=='contact'?'bg-pink-600':'transparent'} w-full h-[1px] mt-2`}></div>
                    </div>
                </div>
                <div class="flex flex-row items-center gap-5">
                    <button className=" cursor-pointer active:opacity-25"
                     onClick={loginHandler}
                    >
                        <UserRound class="w-5 h-5 text-[grey] font-bold"/>
                    </button>
                    <Link className="flex flex-row items-center cursor-pointer active:opacity-25">
                        <ShoppingBag class="w-5 h-5 text-[grey] font-bold"/>
                        <p className={`relative bottom-[6px] right-[3px] text-pink-600 text-[12px] font-bold`}>3</p>
                    </Link>
                    
                </div>
            </div>
        </div>
    )
}