import { useState } from "react"
import { Link, useNavigate } from "react-router" 

import { Sparkles, UserRound, Heart, ShoppingBag, Menu, X, Trash2, Plus, Minus, CheckSquare, Check, CheckSquare2Icon, Square } from "lucide-react"
import logo from '../assets/logo.png'

const colors= []

export default function NavBar({ activePage, favoriteCount, cartCount, favorites, setFavorites, cart, setCart,bestSellers, setBestSellers }) {
    const navigate = useNavigate();

    // Drawer Interface Visibility States
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // const [selectedColor, setSelectedColor] =useState(null);

    // Mock Database Arrays for testing state updates reactively
    // const [favorites, setFavorites] = useState([
    //     { id: 1, title: "Diamond Halo Ring", price: 4200, image: "https://unsplash.com" },
    //     { id: 2, title: "Sapphire Drop Earrings", price: 5800, image: "https://unsplash.com" }
    // ]);

    // const [cart, setCart] = useState([
    //     { id: 3, title: "Gold Tennis Bracelet", price: 7500, quantity: 1, image: "https://unsplash.com" },
    //     { id: 4, title: "Pearl Pendant Necklace", price: 3100, quantity: 2, image: "https://unsplash.com" }
    // ]);

    // Derived values for live dynamic numerical indicator dots
    // const favoriteCount = favorites.length;
    // const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
    const totalCartCost = cart.reduce((acc, curr) => acc + (curr.price * curr.purchaseQty), 0);
    // const totalCartCost = 5000;

    // Favorites Mutation Handlers
    const removeFavorite = (id) => {
        setFavorites(favorites.filter(item => item.id !== id));

        // Remove favorite in best seller
        bestSellers.map((item, index) => {
            if (item.id === id) {
                const updated = bestSellers;
                updated[index].isFavorite = false
                setBestSellers(updated);
            }
        });
    };

    const moveToCart = (item) => {
        // Remove item from wishlist array
        setFavorites(favorites.filter(fav => fav.id !== item.id));

        // Remove favorite in best seller
        bestSellers.map((bestSeller, index) => {
            if (bestSeller.id === item.id) {
                const updated = bestSellers;
                updated[index].isFavorite = false
                setBestSellers(updated);
            }
        });
        
        // Add to shopping cart array (or increment if item duplicate checks match)
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            setCart(cart.map(cartItem => cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    // Cart Modification Logic
    const updateQuantity = (id, change) => {
        
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = item.purchaseQty + change;
                return newQty > 0 ? { ...item, purchaseQty: newQty } : item;
            }
            return item;
        }));
    };

    const handleInputChange = (id, val) => {
        // Strip out anything that isn't a numeric digit
        const numericValue = val.replace(/\D/g, '');
        
        setCart(cart.map(item => {
            if (item.id === id) {
                // If the input is completely empty, leave it as 0 or empty string so they can type freely
                if (numericValue === '') {
                    return { ...item, purchaseQty: '' };
                }
                
                let parsedQty = parseInt(numericValue, 10);
                
                // Enforce minimum order quantity if active
                if (item.isUseMOQ && parsedQty < item.minimumOrder) {
                    parsedQty = item.minimumOrder;
                }
                
                return { ...item, purchaseQty: parsedQty };
            }
            return item;
        }));
    };

    const removeCartItem = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    // Global route state handlers
    function closeAllDrawers() {
        setIsMenuOpen(false);
        setIsFavoritesOpen(false);
        setIsCartOpen(false);
    }

    function homeHandler() { navigate('/'); closeAllDrawers(); }
    function shopHandler() { navigate('/shop'); closeAllDrawers(); }
    function contactHandler() { navigate('/contact'); closeAllDrawers(); }
    function loginHandler() { navigate('/login'); closeAllDrawers(); }

    // UseMOQ Modification Logic
    const updateUseMOQ = (index) => {
        let list = cart;
        list[index].isUseMOQ = !item.isUseMOQ;
        setCart(list)
        
    };

    return (
        <div className="fixed top-0 left-0 w-full bg-white shadow z-50 font-sans">
            {/* ANNOUNCEMENT BAR */}
            <div className="flex flex-row justify-center items-center gap-1 py-[2px] bg-pink-200 text-[10px] md:text-xs font-semibold tracking-wider text-pink-800 uppercase">
                {/* <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" /> */}
                {/* <span>Enjoy free insured shipping on premium lines</span> */}
            </div>
            
            {/* MAIN DESKTOP NAVIGATION BAR */}
            <div className="flex flex-row items-center justify-between px-4 md:px-8 py-2">
                <button className="md:hidden cursor-pointer active:opacity-25 p-1" onClick={() => setIsMenuOpen(true)}>
                    <Menu className="w-6 h-5"/>
                </button>
                
                <div className="logo cursor-pointer" onClick={homeHandler}>
                    <img src={logo} alt="Logo" className="w-24 h-8 md:w-28 md:h-10 object-contain" />
                </div>

                <div className="hidden md:flex flex-row items-center gap-10">
                    <div>
                        <span className={`${activePage === 'home' ? 'text-pink-600' : 'text-black'} font-medium cursor-pointer hover:text-pink-500 transition-colors`} onClick={homeHandler}>Home</span>
                        <div className={`${activePage === 'home' ? 'bg-pink-600' : 'bg-transparent'} w-full h-[2px] mt-1 transition-all`}></div>
                    </div>
                    <div>
                        <span className={`${activePage === 'shop' ? 'text-pink-600' : 'text-black'} font-medium cursor-pointer hover:text-pink-500 transition-colors`} onClick={shopHandler}>Shop</span>
                        <div className={`${activePage === 'shop' ? 'bg-pink-600' : 'bg-transparent'} w-full h-[2px] mt-1 transition-all`}></div>
                    </div>
                    <div>
                        <span className={`${activePage === 'contact' ? 'text-pink-600' : 'text-black'} font-medium cursor-pointer hover:text-pink-500 transition-colors`} onClick={contactHandler}>Contact</span>
                        <div className={`${activePage === 'contact' ? 'bg-pink-600' : 'bg-transparent'} w-full h-[2px] mt-1 transition-all`}></div>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-4 md:gap-5">
                    <button className="hidden md:flex cursor-pointer hover:text-pink-500 transition-colors" onClick={loginHandler}>
                        <UserRound className="w-5 h-5 text-zinc-700 font-bold"/>
                    </button>
                    
                    {/* Favorites Activation Button Hook */}
                    <button onClick={() => setIsFavoritesOpen(true)} className="flex flex-row items-center relative cursor-pointer hover:text-pink-500 transition-colors">
                        <Heart className="w-5 h-5 text-zinc-700 font-bold"/>
                        {favorites.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-scaleIn">
                                {favorites.length}
                            </span>
                        )}
                    </button>
                    
                    {/* Cart Activation Button Hook */}
                    <button onClick={() => setIsCartOpen(true)} className="flex flex-row items-center relative cursor-pointer hover:text-pink-500 transition-colors">
                        <ShoppingBag className="w-5 h-5 text-zinc-700 font-bold"/>
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-scaleIn">
                                {cart.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* LEFT SIDE DRAWER - MOBILE NAVIGATION MENU */}
            <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${isMenuOpen ? "visible" : "invisible pointer-events-none"}`}>
                <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMenuOpen ? "opacity-40" : "opacity-0"}`} onClick={() => setIsMenuOpen(false)} />
                <div className={`absolute top-0 left-0 w-[75%] max-w-[300px] h-full bg-white shadow-xl flex flex-col p-6 transition-transform duration-300 ease-in-out transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="flex justify-between items-center pb-4 border-b border-pink-200">
                        <img src={logo} alt="Logo" className="w-20 h- object-contain" />
                        <button className="p-1 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer" onClick={() => setIsMenuOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex flex-col gap-6 mt-8">
                        <span onClick={homeHandler} className={`text-base font-semibold transition-colors ${activePage === 'home' ? 'text-pink-600' : 'text-gray-800'}`}>Home</span>
                        <span onClick={shopHandler} className={`text-base font-semibold transition-colors ${activePage === 'shop' ? 'text-pink-600' : 'text-gray-800'}`}>Shop Collection</span>
                        <span onClick={contactHandler} className={`text-base font-semibold transition-colors ${activePage === 'contact' ? 'text-pink-600' : 'text-gray-800'}`}>Contact Us</span>
                    </div>
                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <button onClick={loginHandler} className="w-full flex items-center justify-center gap-2 bg-pink-500 text-white font-bold py-3 px-4 rounded-xl text-sm active:scale-95 transition-all cursor-pointer">
                            <UserRound className="w-4 h-4" /> Account Login
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE DRAWER - FAVORITES (WISHLIST) PANEL */}
            <div className={`fixed inset-0 z-50 transition-all duration-300 ${isFavoritesOpen ? "visible" : "invisible pointer-events-none"}`}>
                <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isFavoritesOpen ? "opacity-40" : "opacity-0"}`} onClick={() => setIsFavoritesOpen(false)} />
                <div className={`absolute top-0 right-0 w-[85%] max-w-[400px] h-full bg-white shadow-2xl flex flex-col p-6 transition-transform duration-300 ease-in-out transform ${isFavoritesOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="flex justify-between items-center pb-4 border-b border-zinc-600">
                        <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                            <h2 className="text-sm font-bold font-mono uppercase tracking-wide text-zinc-800">Your Wishlist ({favorites.length})</h2>
                        </div>
                        <button className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer" onClick={() => setIsFavoritesOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1 no-scrollbar">
                        {favorites.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center pb-12">
                                <Heart className="w-10 h-10 text-zinc-200 mb-2" />
                                <p className="text-xs font-mono font-medium text-zinc-400">Your wishlist is currently empty.</p>
                            </div>
                        ) : (
                            favorites.map(item => (
                                <div key={item.id} className="flex gap-3 bg-pink-0 border border-zinc-100 shadow rounded-xl p-3 items-center">
                                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover  shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-sm font-bold text-zinc-800 truncate capitalize font-mono">{item.title}</h4>
                                            <button onClick={() => removeFavorite(item.id)} className="text-[11px] font-medium font-mono font-black text-[maroon] hover:text-red-500 p-0.5 transition-colors hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer active:text-red-500">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-pink-600 font-mono font-bold mt-0.5">Gh₵ {item.price.toLocaleString()}</p>
                                        <div className="flex justify-between gap-5 items-center mt-2">
                                            <button onClick={() => moveToCart(item)} className="bg-zinc-900 text-white text-[10px] font-bold px-3 py-1 rounded-md hover:bg-pink-500 transition-colors cursor-pointer active:opacity-25">
                                                Add To Cart
                                            </button>
                                            <Link className="active:opacity-25"><p className="text-[12px] font-bold font-mono text-[#0B3954]">Details{`>`}</p></Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE DRAWER - SHOPPING CART PANEL */}
            <div className={`fixed inset-0 z-50 transition-all duration-300 ${isCartOpen ? "visible" : "invisible pointer-events-none"}`}>
                <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isCartOpen ? "opacity-40" : "opacity-0"}`} onClick={() => setIsCartOpen(false)} />
                <div className={`absolute top-0 right-0 w-[85%] max-w-[400px] h-full bg-white shadow-2xl flex flex-col p-6 transition-transform duration-300 ease-in-out transform ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="flex justify-between items-center pb-4 border-b border-zinc-600">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-pink-600" />
                            <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-800 font-mono">Your Cart ({cart.length})</h2>
                        </div>
                        <button className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer" onClick={() => setIsCartOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* SCROLLABLE CART LIST */}
                    <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1 no-scrollbar">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center pb-12">
                                <ShoppingBag className="w-10 h-10 text-zinc-200 mb-2" />
                                <p className="text-xs font-medium font-mono text-zinc-400">Your shopping cart is empty.</p>
                            </div>
                        ) : (
                            cart.map((item, index) => (
                                <div key={item.id} className="flex gap-3 border border-zinc-500 shadow rounded-lg p-3 items-center">
                                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-medium font-bold text-zinc-800 font-mono  pr-2 capitalize mb-1">{item.title}</h4>
                                            <button onClick={() => removeCartItem(item.id)} className="text-[maroon] hover:text-red-500 p-0.5 transition-colors cursor-pointer">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-pink-400 font-mono font-bold  mb-1">Gh₵ {item.price.toLocaleString()}</p>
                                        <div className=""></div>

                                        {/* Product Colors Display */}
                                        <div className="flex flex-wrap">
                                            <p className="text-sm font-mono capitalize mr-2">color:</p>
                                            {item.colors.map((color, colorIndex) => (
                                            <div className={`${item.preferedColor === color ? 'bg-zinc-200':'bg-zinc-50'} mr-2 px-[5px] py-[2px] rounded mb-1`}
                                                onClick={() => {
                                                    const updated = [...cart];
                                                    updated[index].preferedColor = color
                                                    setCart(updated);
                                                }}
                                            >
                                                <p className="text-xs font-mono capitalize ">{color} </p>
                                            </div>
                                            ))}
                                        </div>

                                        {/* Minimum Order and Purchase Quantity */}
                                        <div className="flex justify-between">
                                        {/* Dynamic Quantity Controller & Price Summation Row */}
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center shadow border border-zinc-500 bg-white rounded-md">
                                                    <button onClick={() => {
                                                        let subValue = -1;

                                                        if (item.isUseMOQ && item.purchaseQty <= item.minimumOrder) {subValue = 0}

                                                        updateQuantity(item.id, subValue)
                                                        
                                                    }} className="p-1 text-zinc-500 hover:bg-gray-50 cursor-pointer">
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <input 
                                                        type="text" 
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        className="w-8 text-center text-xs font-bold text-zinc-700 border-none focus:outline-none bg-transparent" 
                                                        value={item.purchaseQty} 
                                                        onChange={(e) => handleInputChange(item.id, e.target.value)}
                                                        onBlur={() => handleInputBlur(item.id)}
                                                    />
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-zinc-500 hover:bg-gray-50 cursor-pointer">
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="">
                                                <p className={`${item.isUseMOQ ? '':'line-through'} text-xs font-mono font-bold mb-1`}>minimum order: {item.minimumOrder}</p>

                                                <div className="flex items-center active:opacity-25"
                                                    onClick={()=>{
                                                        const updated = [...cart];
                                    
                                                        updated[index].isUseMOQ = !updated[index].isUseMOQ;
                                                        updated[index].purchaseQty = updated[index].minimumOrder;
                                                        setCart(updated);
                                                    }}
                                                >
                                                    {item.isUseMOQ ? <Square className="h-3 ml-[-5px]"/>:<CheckSquare className="h-3 ml-[-5px]"/>}
                                                    <p className="text-xs font-mono font-bold">order less</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Dynamic Quantity Controller & Price Summation Row */}
                                        <div className="flex items-center justify-between mt-3">
                                            <Link className="active:opacity-25"><p className="text-[12px] font-bold font-mono text-[#0B3954]">Details{`>`}</p></Link>
                                            <p className="text-xs text-zinc-800 font-bold">₵{(item.price * item.purchaseQty).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* FOOTER CHECKOUT CARD (TOTAL ACCUMULATION VALUES) */}
                    {cart.length > 0 && (
                        <div className="pt-4 border-t border-gray-150 mt-auto bg-white">
                            <div className="flex justify-between items-baseline mb-4">
                                <span className="text-sm font-bold font-mono text-zinc-500 uppercase tracking-wider">Subtotal:</span>
                                <span className="text-xl font-bold  font-mono text-pink-600">₵{totalCartCost.toLocaleString()}</span>
                            </div>
                            <button className="w-full font-mono bg-zinc-900 text-white text-sm font-bold py-3.5 rounded-xl uppercase tracking-widest hover:bg-pink-600 active:scale-[0.99] transition-all shadow-md cursor-pointer">
                                Proceed To Checkout
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}
