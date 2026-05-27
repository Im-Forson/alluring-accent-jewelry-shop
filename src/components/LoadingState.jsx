import { Loader2 } from 'lucide-react'

export function LoadingState() {
  // Generates an array of 6 items to fill out the grid layout placeholder
  const placeholders = Array(6).fill(null);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      {/* Top Header Placeholder */}
      <div className="mb-8 max-w-sm animate-pulse">
        <div className="h-7 bg-gray-200 rounded-lg w-3/4 mb-2" />
        <div className="h-4 bg-gray-100 rounded-md w-1/2" />
      </div>

      {/* Grid Layout mimicking your product cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {placeholders.map((_, idx) => (
          <div key={idx} className="border border-pink-100 rounded-2xl p-4 bg-white space-y-4 animate-pulse">
            {/* Image Placeholder */}
            <div className="w-full h-48 bg-slate-100 rounded-xl" />
            
            {/* Text details content placeholder */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>

            {/* Price tag placeholder */}
            <div className="flex justify-between items-center pt-2">
              <div className="h-5 bg-pink-100 rounded w-1/4" />
              <div className="h-8 bg-gray-200 rounded-lg w-1/3" />
            </div>
          </div>
        ))}
      </div>

      {/* Floating Centered Subtle Loader */}
      <div className="flex justify-center items-center gap-2 mt-12 text-pink-500 font-medium text-xs tracking-wide uppercase">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Fetching Catalog...</span>
      </div>
    </div>
  )
}
