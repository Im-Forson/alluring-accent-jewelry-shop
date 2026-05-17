import { Sparkles  } from "lucide-react"
import { Settings  } from "lucide-react"

import logo from '../assets/logo.jpg'

export default function NavBar() {
    return (
        <div>
            <div class="flex flex-row justify-center items-center gap-1 py-1 bg-pink-200">
                <Sparkles class="w-4 h-4 col"/>
                <p class="text-center">Enjoy your shopping to the max</p>
            </div>
            <div class="flex flex-row items-center justify-between px-5 py-2">
                <div class="logo">
                    <img src={logo} alt="Logo" class="w-13 h-3" />
                </div>

                <div class="flex flex-row items-center gap-5">
                    <div className="">
                        <button class="">
                            Home
                        </button>
                        <div className="
                        "></div>
                    </div>
                </div>
                <div class="flex flex-row items-center gap-5"></div>
            </div>

            <section id="center">
                <h1 class='text-3xl md:text-5xl font-bold uppercase'>alluring <span  class="text-pink-500">accent</span></h1>
                
                <div class="flex flex-row items-center justify-cennter gap-2">
                    <p class=" md:text-[16px] text-center text-[grey] font-bold">Under Development</p>
                    <Settings class="w-4 h-4 animate-spin text-[grey] font-bold"/>
                </div>
                
            </section>
        </div>
    )
}