import { useState } from 'react'
import './App.css'

import { Settings } from 'lucide-react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
          <h1 class='text-3xl md:text-5xl font-bold uppercase'>alluring <span  class="text-pink-500">accent</span></h1>
          
          <div class="flex flex-row items-center justify-cennter gap-2">
            <p class=" md:text-[16px] text-center text-[grey] font-bold">Under Development</p>
            <Settings class="w-4 h-4 animate-spin text-[grey] font-bold"/>
          </div>
          
      </section>
    </>
  )
}

export default App
