import { useState } from "react"

import { Sparkles, UserRound, Heart, ShoppingBag  } from "lucide-react"
import { Settings  } from "lucide-react"
import { LogIn } from "lucide-react"
import { User } from "lucide-react"

import logo from '../assets/logo.jpg'

export default function NavBar() {
    const [isHome, setIsHome] = useState(true);
    const [isShop, setIsShop] = useState(false);
    const [isContact, setIsContact] = useState(false);
    const [] = useState(false);
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

    return (
        <div>
            <div class="flex flex-row justify-center items-center gap-1 py-1 bg-pink-200">
                <Sparkles class="w-4 h-4 col"/>
                <p class="text-center">Enjoy your shopping to the max</p>
            </div>
            <div class="flex flex-row items-center justify-between px-8 py-2">
                <div class="logo">
                    <img src={logo} alt="Logo" class="w-13 h-3" />
                </div>

                <div class="flex flex-row items-center gap-10">
                    <div className="">
                        <button class={`${isHome?'text-pink-600':'black'} mb-2 cursor-pointer hover:text-pink-300`}
                            onClick={homeHandler}
                        >
                            Home
                        </button>
                        <div className={`${isHome?'bg-pink-600':'transparent'} w-full h-[1px]`}></div>
                    </div>
                    <div className="">
                        <button class={`${isShop?'text-pink-600':'black'} mb-2 cursor-pointer hover:text-pink-300`}
                            onClick={shopHandler}
                        >
                            Shop
                        </button>
                        <div className={`${isShop?'bg-pink-600':'transparent'} w-full h-[1px]`}></div>
                    </div>
                    <div className="">
                        <button class={`${isContact?'text-pink-600':'black'} mb-2 cursor-pointer hover:text-pink-300`}
                            onClick={contactHandler}
                        >
                            Contact
                        </button>
                        <div className={`${isContact?'bg-pink-600':'transparent'} w-full h-[1px]`}></div>
                    </div>
                </div>
                <div class="flex flex-row items-center gap-5">
                    <button className=" cursor-pointer">
                        <UserRound class="w-5 h-4 text-[grey] font-bold"/>
                    </button>
                    <button className="flex flex-row items-center cursor-pointer">
                        <ShoppingBag class="w-5 h-4 text-[grey] font-bold"/>
                        <p className={`relative bottom-[6px] right-[3px] text-pink-600 text-[12px] font-bold`}>3</p>
                    </button>
                    
                </div>
            </div>
        </div>
    )
}