import React, { useState, useEffect } from 'react';
import { DoorClosed, DoorOpen, Calendar, Clock, Heart } from 'lucide-react';

export default function ShopClosed() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex flex-col items-center justify-center p-6 text-gray-800 font-sans selection:bg-pink-200">
      
      {/* Decorative Floating Accent Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-pink-100 rounded-full blur-xl opacity-60 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-200 rounded-full blur-2xl opacity-40 animate-pulse delay-700"></div>

      <div className="max-w-md w-full text-center space-y-8 relative z-10">
        
        {/* Animated Door Container */}
        <div 
          className="relative w-40 h-40 mx-auto flex items-center justify-center cursor-pointer group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Subtle Outer Glow */}
          <div className="absolute inset-0 bg-pink-200 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
          
          {/* Animated Icons */}
          <div className="relative transform transition-all duration-500 ease-out group-hover:scale-110">
            {isHovered ? (
              <DoorOpen className="w-24 h-24 text-pink-400 transition-all duration-300 transform -scale-x-100" />
            ) : (
              <DoorClosed className="w-24 h-24 text-pink-500 transition-all duration-300" />
            )}
          </div>
        </div>

        {/* Messaging Text */}
        <div className="space-y-3">
          <span className="inline-block px-4 py-1.5 bg-pink-100 text-pink-600 text-xs font-semibold tracking-widest uppercase rounded-full shadow-sm">
            Notice
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-pink-600 sm:text-5xl font-serif">
            We Are Closed
          </h1>
          <p className="text-base text-gray-500 max-w-xs mx-auto leading-relaxed">
            Our digital doors are temporarily shut. We look forward to treating you next time!
          </p>
        </div>

        {/* Divider */}
        <div className="w-16 h-0.5 bg-pink-200 mx-auto rounded-full"></div>

        {/* Operational / Quick Info Cards */}
        {/* <div className="grid grid-cols-2 gap-4 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-pink-100 shadow-sm text-left">
          <div className="flex items-start gap-2.5">
            <Clock className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hours</p>
              <p className="text-sm font-medium text-gray-700">9 AM - 6 PM</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Calendar className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
              <p className="text-sm font-medium text-gray-700">Opens Tomorrow</p>
            </div>
          </div>
        </div> */}

        {/* Subtle Sign-off Footer */}
        <div className="pt-4 flex items-center justify-center gap-1.5 text-xs text-pink-400/80 tracking-wide font-medium">
          <span>Thank you for choosing Alluring Accent</span>
          <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400 animate-bounce" />
        </div>

      </div>
    </div>
  );
}
