import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { ShopProvider } from '../utilities/ShopContext';
import { Toaster } from 'react-hot-toast'; // Kept your existing toast import

import HomePage from './pages/Home';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProductPage from './pages/ProductPage';
import AllProducts from './pages/AllProducts';
import AllBestSellers from './pages/AllBestSellers';

const appRouter = createBrowserRouter([
  {path: '/', element: <HomePage/>},
  {path: '/shop', element: <Shop/>},
  {path: '/contact', element: <Contact/>},
  {path: '/*', element: <NotFound/>},
  {path: '/login', element: <LoginPage/>},
  {path: '/signup', element: <SignupPage/>},
  {path: '/product', element: <ProductPage/>} ,
  {path: '/products', element: <AllProducts/>} ,
  {path: '/bestsellers', element: <AllBestSellers/>} ,

])

function App() {
  return (
    <ShopProvider>
        <Toaster 
          position="top-right" 
          reverseOrder={false}
          toastOptions={{
            // Premium custom default styling matching your luxury jewelry branding palette
            style: {
              background: '#18181b', // Dark zinc-900 look matching your footer
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '600',
              borderRadius: '12px',
              padding: '12px 16px',
              border: '1px solid #27272a',
              marginTop: '35px',
              marginRight: '-15px',
            },
            success: {
              iconTheme: {
                primary: '#db2777', // Signature Luvora pink-600 accent color
                secondary: '#ffffff',
              },
            },
          }}
        />
        
        <RouterProvider router={appRouter}/>
    </ShopProvider>
  )
}

export default App
