import '../App.css'
import NavBar from '../components/NavBar'
import { Settings } from 'lucide-react'

import Hero from '../components/Hero'

export default function HomePage() {
    return (
        <div>
            <NavBar activePage={'home'}/>
            <Hero/>
        </div>
    )
}