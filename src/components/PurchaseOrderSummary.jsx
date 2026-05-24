import { useState } from 'react';
import { X, Truck, ShieldCheck, MapPin, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router';

import { useShop } from '../../utilities/ShopContext';

export default function PurchaseOrderSummary({ isOpen, setIsOpen }) {
  const { orders, cart, removeCartItem, updateIsOrderSuccess } = useShop();
  const navigate = useNavigate();
  // console.log(orders)

  const [] = useState(false);
  
  // 1. Initialize Controlled Form Input State Fields
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    region: 'Accra',
    city: '',
    deliveryAddress: ''
  });

  // Sample purchase cost payload attributes matching your item structure
  const orderDetails = {
    title: "Rose Gold Infinity Ring",
    purchasingPrice: 450.00,
    purchaseQty: 1,
    shippingFee: formData.region === 'Accra' ? 15.00 : 30.00, // Dynamic location pricing calculations
    currency: "GH₵"
  };

  const totalCost = (orderDetails.purchasingPrice * orderDetails.purchaseQty) + orderDetails.shippingFee;

  const itemsTotalCost = orders.reduce((totalCost, order) => {return totalCost + order.totalPrice}, 0)
  const grandTotal = itemsTotalCost + orderDetails.shippingFee

  // Form Field Change Listener Action
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Process and Submit final form handler 
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    
    // Quick baseline input validation check
    if (!formData.fullName || !formData.phoneNumber || !formData.city || !formData.deliveryAddress) {
      alert("Please fill in all delivery information details to secure your purchase order.");
      return;
    }

    const receiptPayload = {
      customer: formData,
      item: orderDetails.title,
      totalPaid: totalCost
    };
    
    handleRemoveOrdersFromCart();
    setIsOpen(false);
    updateIsOrderSuccess(true); // show upon transaction onsuccess
    navigate(-1);
  };

  const handleRemoveOrdersFromCart = (e) => {
    cart.map((item) => {
      removeCartItem(item.id);
    })
  }

  return (
    <div className="flex flex-col items-center justify-center p-">
      
      {/* 2. THE CHASSIS BUY NOW LINK ACTION TRIGGER */}
      

      {/* ========================================================================= */}
      {/* PURCHASE ORDER SLIDE MODAL WINDOW CONTENT LAYER                          */}
      {/* ========================================================================= */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          
          {/* Backdrop Blur Dimmer Mask */}
          <div 
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-fadeIn cursor-pointer"
          />

          {/* Modal layout component structure */}
          <form 
            onSubmit={handleSubmitOrder}
            className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-5 md:p-7 max-h-[90vh] overflow-y-auto animate-scaleIn z-10 border border-zinc-100 font-sans no-scrollbar"
          >
            {/* Modal Exit Action button */}
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* HEADER BRANDING BANNER ROW */}
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-zinc-100">
              <div className="p-2 bg-pink-50 rounded-xl text-pink-600">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-base font-bold text-zinc-900 tracking-wide">Purchase Order</h2>
                <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Confirm delivery details & items summary</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              
              {/* LEFT SIDE BLOCK: CUSTOMER RECIPIENT INFORMATION FORM */}
              <div className="space-y-3.5">
                <h3 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-pink-500" /> Delivery Address
                </h3>
                
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 tracking-wide uppercase">Recipient Full Name</label>
                  <input 
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Ama Serwaa"
                    className="w-full mt-1 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-pink-400 bg-[#fafafa]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-500 tracking-wide uppercase">Phone Number</label>
                  <input 
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. +233 24 000 0000"
                    className="w-full mt-1 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-pink-400 bg-[#fafafa]"
                  />
                </div>

                {/* Ghanaian Regions Select Menu dropdown wrapper */}
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 tracking-wide uppercase">Region</label>
                  <select 
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full mt-1 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-pink-400 bg-[#fafafa] cursor-pointer"
                  >
                    <option value="Accra">Greater Accra (Accra)</option>
                    <option value="Kumasi">Ashanti (Kumasi)</option>
                    <option value="Takoradi">Western (Takoradi)</option>
                    <option value="Takoradi">Eastern (Koforidua)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 tracking-wide uppercase">City / Town</label>
                    <input 
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. East Legon"
                      className="w-full mt-1 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-pink-400 bg-[#fafafa]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 tracking-wide uppercase">Address</label>
                    <input 
                      type="text"
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      placeholder="e.g. GA-123-4567"
                      className="w-full mt-1 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-pink-400 bg-[#fafafa]"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE BLOCK: ORDER SUMMARY ITEM COST METRICS */}
              <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase mb-3 flex items-center gap-1">
                    <Truck className="w-3 h-3 text-pink-500" /> Order Summary
                  </h3>
                  
                  {/* Small inline preview panel containing line product metrics summary card */}
                  {
                    orders.map((order, index) => (
                      <div key={index} className="pb-3 mb-3 border-b border-zinc-200/60 flex flex-col gap-0.5">
                        <span className="text-xs font-bold font-sans capitalize text-zinc-800 truncate">{order.title}</span>
                        <div className="flex justify-between mt-[2px]">
                          <span className="text-[11px] font-semibold font-sans text-zinc-400">{order.quantity} x {orderDetails.currency}{order.price.toLocaleString()}</span>
                          <span className="text-[11px] font-semibold font-sans text-zinc-400">{orderDetails.currency}{order.totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  }

                  <div className="space-y-2 text-[11px] font-medium text-zinc-500">
                    <div className="flex justify-between">
                      <span>Item Subtotal</span>
                      <span className="font-bold text-zinc-700">{orderDetails.currency} {(itemsTotalCost).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insured Delivery</span>
                      <span className="font-bold text-zinc-700">{orderDetails.currency} {orderDetails.shippingFee.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                  </div>
                </div>

                {/* CUMULATIVE AGGREGATE TOTAL CALCULATION BLOCK CARD BAR */}
                <div className="pt-4 border-t border-zinc-200/60 mt-4">
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Total Cost</span>
                    <span className="text-base font-black text-pink-600 font-sans">
                      {orderDetails.currency} {grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </span>
                  </div>

                  {/* Submission dispatch action button link hook */}
                  <button 
                    type="submit"
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold py-3 rounded-xl uppercase tracking-widest transition-colors shadow-sm active:scale-[0.98]"
                  >
                    Place Purchase Order
                  </button>
                </div>

              </div>

            </div>
          </form>
        </div>
      )}
    </div>
  );
}
