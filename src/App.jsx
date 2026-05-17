import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'

import HomePage from './pages/home'



const appRouter = createBrowserRouter([
  {path: '/', element: <HomePage/>}
])

function App() {
  return (
    <>
        <RouterProvider router={appRouter}/>
    </>
  )
}

export default App
