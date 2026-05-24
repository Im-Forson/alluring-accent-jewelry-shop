import { useState } from "react";
import { CheckCircle, Truck, Package, XCircle, User, Phone, MapPin } from "lucide-react";
import { useShop } from "../../utilities/ShopContext";

export default function OrderProgress({showOrderTracker, setShowOrderTracker, setOrderIdInput, setOrderPhoneInput}) {
    const { trackingOrder } = useShop();
    const [showModal, setShowModal] = useState(false);

    const products = trackingOrder.products;

    return (
        <>
            {
                showOrderTracker && (
                    <section className="mb-20 max-w-6xl mx-auto px-4 md:px-8">
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                            
                            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative animate-fadeIn">
                                
                                {/* CLOSE BUTTON */}
                                <button
                                    onClick={() => {
                                        setShowOrderTracker(false);
                                        setOrderIdInput('');
                                        setOrderPhoneInput('');
                                    }}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>

                                {/* HEADER */}
                                <h3 className="text-lg font-bold text-center">
                                    Order: {trackingOrder.orderId}
                                </h3>
                                <p className="text-xs text-gray-500 text-center mb-4">
                                    Estimated Delivery: 3 - 5 Days
                                </p>

                                {/* PRODUCT INFO */}
                                <div className="max-h-[180px] overflow-y-auto pr-2 no-scrollbar border-b border-gray-100 pb-3">
                                    {
                                        products.map((product, index) => (
                                            <div key={index} className="flex items-center gap-4 mb-4 last:mb-0">
                                                <img
                                                    src={product.image}
                                                    className="w-14 h-14 object-cover rounded-lg shrink-0"
                                                />
                                                <div>
                                                    <h4 className="text-sm font-bold mb-0.5">
                                                        {product.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">
                                                        Product ID: {product.productId}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>

                                {/* ✅ RECIPIENT & SHIPPING DETAILS */}
                                <div className="my-4 p-3.5 bg-pink-50/50 border border-pink-100 rounded-xl space-y-2">
                                    <h4 className="text-xs font-bold text-pink-700 uppercase tracking-wide mb-1">
                                        Shipping Information
                                    </h4>
                                    
                                    {/* Name */}
                                    <div className="flex items-center gap-2.5 text-xs text-gray-700">
                                        <User className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                                        <p><span className="font-semibold">Recipient:</span> {trackingOrder.recipient}</p>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-center gap-2.5 text-xs text-gray-700">
                                        <Phone className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                                        <p><span className="font-semibold">Phone:</span> {trackingOrder.phone}</p>
                                    </div>

                                    {/* Address */}
                                    <div className="flex items-start gap-2.5 text-xs text-gray-700">
                                        <MapPin className="w-3.5 h-3.5 text-pink-500 mt-0.5 shrink-0" />
                                        <p><span className="font-semibold">Address:</span> {trackingOrder.address || trackingOrder.address}</p>
                                    </div>
                                </div>
                                
                                {/* PROGRESS TRACKER */}
                                <div className="space-y-4 pt-2">
                                    <div className="">
                                        <div className="flex items-center gap-3">
                                            {trackingOrder.isOrderPlaced ? (
                                                <CheckCircle className="text-green-500 w-5 h-5" />
                                            ) : (
                                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                                            )}

                                            <p className={`text-sm ${trackingOrder.isOrderPlaced ? "text-gray-800 font-semibold" : "text-gray-400"}`}>
                                                Order Placed
                                            </p>
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="flex items-center gap-3">
                                            {trackingOrder.isProcessing ? (
                                                <CheckCircle className="text-green-500 w-5 h-5" />
                                            ) : (
                                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                                            )}

                                            <p className={`text-sm ${trackingOrder.isProcessing ? "text-gray-800 font-semibold" : "text-gray-400"}`}>
                                                Processing
                                            </p>
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="flex items-center gap-3">
                                            {trackingOrder.isOutForDelivery ? (
                                                <CheckCircle className="text-green-500 w-5 h-5" />
                                            ) : (
                                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                                            )}

                                            <p className={`text-sm ${trackingOrder.isOutForDelivery ? "text-gray-800 font-semibold" : "text-gray-400"}`}>
                                                Out for Delivery
                                            </p>
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="flex items-center gap-3">
                                            {trackingOrder.isDelivered ? (
                                                <CheckCircle className="text-green-500 w-5 h-5" />
                                            ) : (
                                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                                            )}

                                            <p className={`text-sm ${trackingOrder.isDelivered ? "text-gray-800 font-semibold" : "text-gray-400"}`}>
                                                Delivered
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* DELIVERY STATUS */}
                                <div className="mt-6 p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                                    <Truck className="text-pink-600 w-5 h-5" />
                                    <p className="text-xs text-gray-600">
                                        Your package is currently in transit to your location.
                                    </p>
                                </div>
                            </div>
                        </div>
                    
                    </section>
                )
            }
        </>
    );
}
