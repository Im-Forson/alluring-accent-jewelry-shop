import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'

import HomePage from './pages/home'
import NotFound from './pages/NotFound'



const appRouter = createBrowserRouter([
  {path: '/', element: <HomePage/>},
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
