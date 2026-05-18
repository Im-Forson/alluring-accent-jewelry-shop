import '../App.css'
import NavBar from '../components/NavBar'
import { Settings } from 'lucide-react'

import Hero from '../components/Hero'

export default function HomePage() {
    return (
        <div>
            <section className="h-[100vh]">
                <NavBar activePage={'home'}/>
                <Hero/>
            </section>
        </div>
    )
}