import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div>
          <h1 class='text-3xl md:text-5xl font-bold uppercase'>alluring <span  class="text-pink-500">accent</span></h1>
          <p class="italic md:text-lg text-center mt-[10px]">website under development</p>
        </div>
      </section>
    </>
  )
}

export default App
