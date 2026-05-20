import { Settings, MoveRight, Heart, ChevronLeft, ChevronRight, HeartIcon, Phone, Mail, MessageSquare,  } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

export default function TrackYourOrder() {
    return(
        <section className="mb-10 max-w-6xl mx-auto px-4 md:px-8">
            {/* Flex container that breaks into a single column on mobile, and two columns on desktop */}
            <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-pink-300">
                
                {/* LEFT SIDE: INPUT FORM */}
                <div className="w-full md:w-[55%]">
                    <h2 className="text-medium md:text-2xl font-bold mb-2">
                        Track Your <span className="text-pink-600">Order</span>
                    </h2>
                    <p className="text-[11px] md:text-xs text-gray-500 mb-6">
                        Enter your Order ID and phone number to get updates
                    </p>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] text-gray-600 font-semibold tracking-wider">ORDER ID</label>
                            <input
                                type="text"
                                placeholder="LUV12345"
                                className="w-full mt-1 border border-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-[#fafafa]"
                            />                                                                      
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-600 font-semibold tracking-wider">PHONE NUMBER</label>
                            <input
                                type="tel"
                                placeholder="+233..."
                                className="w-full mt-1 border border-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-[#fafafa]"
                            />                      
                        </div>
                        <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-xl font-bold text-[11px] md:text-sm uppercase tracking-wide active:scale-95 transition-all cursor-pointer">
                            Track Order
                        </button>
                    </div>
                </div>

                {/* RIGHT SIDE: QUICK ASSISTANCE / SOCIAL CHANNELS */}
                <div className="w-full md:w-[45%] bg-[#fafafa] border border-gray-100 rounded-2xl p-6 md:p-8 flex flex-col justify-center">
                    <h3 className="text-sm md:text-base font-bold text-gray-800 mb-1">
                        Need Quick Assistance?
                    </h3>
                    <p className="text-[11px] md:text-xs text-gray-500 mb-6">
                        Instantly track your parcel or reach our delivery desk directly.
                    </p>
                    
                    <div className="space-y-3">
                        {/* WhatsApp Option */}
                        <a 
                            href="https://wa.me" 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-4 p-3.5 bg-white border border-gray-200 rounded-xl hover:border-pink-200 active:scale-[0.99] transition-all group shadow-sm cursor-pointer"
                        >
                            <div className="p-2.5 bg-green-50 text-green-500 rounded-lg group-hover:bg-green-100 transition-colors">
                                <FaWhatsapp className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-800">Track via WhatsApp</h4>
                                <p className="text-[10px] text-gray-400">Live agent dispatch update</p>
                            </div>
                        </a>

                        {/* Call Option */}
                        <a 
                            href="tel:+233000000000"
                            className="flex items-center gap-4 p-3.5 bg-white border border-gray-200 rounded-xl hover:border-pink-200 active:scale-[0.99] transition-all group shadow-sm cursor-pointer"
                        >
                            <div className="p-2.5 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-100 transition-colors">
                                <Phone className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-800">Call Support Desk</h4>
                                <p className="text-[10px] text-gray-400">Direct helpline confirmation</p>
                            </div>
                        </a>

                        {/* Email Option */}
                        <a 
                            href="mailto:support@yourdomain.com"
                            className="flex items-center gap-4 p-3.5 bg-white border border-gray-200 rounded-xl hover:border-pink-200 active:scale-[0.99] transition-all group shadow-sm cursor-pointer"
                        >
                            <div className="p-2.5 bg-pink-50 text-pink-500 rounded-lg group-hover:bg-pink-100 transition-colors">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-800">Email Query</h4>
                                <p className="text-[10px] text-gray-400">Get tracking logs via inbox</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
} 