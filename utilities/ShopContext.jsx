import { createContext, useContext, useState } from 'react';

// Initialize the raw context instance object
const ShopContext = createContext(undefined);

// Structural Wrapper Component Provider
export function ShopProvider({ children }) {
    const [allProducts, setAllProducts] = useState([]);
    const [viewingProduct, setViewingProduct] = useState({});

    const [] = useState([]);

    const [orders, setOrders] = useState([]);
    const [isOrderSuccess, setIsOrderSuccess] = useState(false);

    const [cart, setCart] = useState([]);
    const [favorites, setFavorites] = useState([]);
    
    const [bestSellers, setBestSellers] = useState([]);

    const [activePage, setActivePage] = useState('home');

    const [shopCategory, setShopAllCategory] = useState("All Jewellery");
    const [shopColor, setShopColor] = useState("All Colors");
    const [shopPrice, setShopPrice] = useState("All Prices");
    const [shopCollection, setShopCollection] = useState("All Collections");

    const activatePage = (page) => {
        setActivePage(page);
    }

    const loadAllProducts = (products) => {
        setAllProducts(products);
    }

    const loadAllBestSellers = (products) => {
        setBestSellers(products);
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

    const manageFavorite = (id) => {
        const updatedAllProduct = [...allProducts];
        let productIndex = -1;

        // toggle favorite
        updatedAllProduct.map((product, index) => {
            if (product.id === id) {
                product.isFavorite = !product.isFavorite;
                productIndex = index
            }
        })
        
        setAllProducts(updatedAllProduct);

        // update favorites list
        if (updatedAllProduct[productIndex].isFavorite) {
            setFavorites((prev) => [updatedAllProduct[productIndex], ...prev]);
        } else {
            const newFavorites = favorites.filter(
                (item) => item.id !== updatedAllProduct[id].id
            );
            setFavorites(newFavorites);
        }
    };

    const removeFavorite = (id) => {
        setFavorites(favorites.filter(item => item.id !== id));

        // Remove favorite in all products
        allProducts.map((item, index) => {
            if (item.id === id) {
                const updated = allProducts;
                updated[index].isFavorite = false
                setAllProducts(updated);
            }
        });
    };

    const loadBestSellers = (products) => {
        setBestSellers(products);
    }

    const setViewingProductDetails = (productDetail) => {
        setViewingProduct(productDetail);
    }

    const loadShopCategory = (category) => {
        setShopAllCategory(category);
    }

    return (
        <ShopContext.Provider 
            value={{
                allProducts,
                loadAllProducts,

                activePage,
                activatePage,
                
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

                bestSellers,
                loadBestSellers,

                viewingProduct,
                setViewingProductDetails,

                shopCategory,
                shopColor,
                shopCollection,
                shopPrice,
                loadShopCategory,
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
