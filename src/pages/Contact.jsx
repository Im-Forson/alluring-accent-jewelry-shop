import NavBar from '../components/NavBar'
import { Settings } from 'lucide-react'

export default function Contact() {
    return (
        <div>
            <NavBar/>

            <section id="center">
                <h1 class='text-3xl md:text-3xl font-bold uppercase'>contact <span  class="text-pink-500">page</span></h1>
                
                <div class="flex flex-row items-center justify-cennter gap-2">
                    <p class=" md:text-[16px] text-center text-[grey] font-bold">Under Development</p>
                    <Settings class="w-4 h-4 animate-spin text-[grey] font-bold"/>
                </div>
                
            </section>
        </div>
    )
}