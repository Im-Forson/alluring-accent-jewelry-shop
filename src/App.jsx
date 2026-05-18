import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'

import HomePage from './pages/home';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';



const appRouter = createBrowserRouter([
  {path: '/', element: <HomePage/>},
  {path: '/shop', element: <Shop/>},
  {path: '/contact', element: <Contact/>},
  {path: '/*', element: <NotFound/>}
])

function App() {
  return (
    <>
        <RouterProvider router={appRouter}/>
    </>
  )
}

export default App
