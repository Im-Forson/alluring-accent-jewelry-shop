import { createContext, useContext, useState } from 'react';

// Initialize the raw context instance object
const ShopContext = createContext(undefined);

// Structural Wrapper Component Provider
export function ShopProvider({ children }) {
    const [allProducts, setAllProducts] = useState([]);
    const [viewingProduct, setViewingProduct] = useState({});

    const [orders, setOrders] = useState([]);
    const [isOrderSuccess, setIsOrderSuccess] = useState(false);

    const [cart, setCart] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [bestSellersData, setBestSellersData] = useState([]);
    const [bestSellerFavoriteIndex, setBestSellerFavoriteIndex] = useState();

    const loadAllProducts = (products) => {
        setAllProducts(products);
    }

    const addOrder = (newOrder) => {
            setOrders(newOrder);
    }

    const updateIsOrderSuccess = (value) => {
        setIsOrderSuccess(value);
    }

    const clearOrders = () => {
        setOrders([]);
    }

    const addToCart = (product) => {
        setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);
        if (existingItem) {
            return prevCart;
        }

        return [...prevCart, product];
        });
    };

    const updateCartItemUseMOQ = (index) => {
        const updated = [...cart];
                                            
        updated[index].isUseMOQ = !updated[index].isUseMOQ;
        updated[index].purchaseQty = updated[index].minimumOrder;
        updated[index].purchasingPrice = !updated[index].isUseMOQ ? updated[index].belowMOQPrice : updated[index].price;
        setCart(updated);
    }

    const updateCartItemQty = (id, change) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = item.purchaseQty + change;
                return newQty > 0 ? { ...item, purchaseQty: newQty } : item;
            }
            return item;
        }));
    }

    const updateCartItemColor = (color, index) => {
        const updated = [...cart];
        updated[index].preferedColor = color
        setCart(updated);
    }

    const removeCartItem = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const manageFavorite = (index) => {
        const updated = [...bestSellersData];
                                    
        // toggle favorite
        updated[index].isFavorite = !updated[index].isFavorite;
        setBestSellersData(updated);

        // update favorites list
        if (updated[index].isFavorite) {
            setFavorites((prev) => [updated[index], ...prev]);
            // setFavoriteCount((prev) => prev + 1);
        } else {
            const newFavorites = favorites.filter(
                (item) => item.id !== updated[index].id
            );
            setFavorites(newFavorites);
            // setFavoriteCount(newFavorites.length);
        }
    };

    const removeFavorite = (id) => {
        setFavorites(favorites.filter(item => item.id !== id));

        // Remove favorite in best seller
        bestSellersData.map((item, index) => {
            if (item.id === id) {
                const updated = bestSellersData;
                updated[index].isFavorite = false
                setBestSellersData(updated);
            }
        });
    };

    const loadBestSellers = (products) => {
        setBestSellersData(products);
    }

    const setViewingProductDetails = (productDetail) => {
        setViewingProduct(productDetail);
    }

    return (
        <ShopContext.Provider 
            value={{
                allProducts,
                
                orders,
                addOrder,
                clearOrders,
                isOrderSuccess,
                updateIsOrderSuccess,

                cart, 
                addToCart,
                removeCartItem,
                updateCartItemUseMOQ,
                updateCartItemQty,
                updateCartItemColor,

                favorites, 
                manageFavorite,
                removeFavorite,

                bestSellersData,
                loadBestSellers,

                viewingProduct,
                setViewingProductDetails,
            }}
        >
        {children}
        </ShopContext.Provider>
    );
}

// 3. Create a clean customized Hook wrapper for rapid component access
export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useSart must be wrapped inside a valid <CartProvider /> component node context.");
  }
  return context;
}
