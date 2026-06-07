import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchApi } from "@/utils/api";

export interface CartItem {
  id: string;
  name: string;
  author: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const defaultCartItems: CartItem[] = [
  {
    id: "amy-byler",
    name: "The Overdue Life of Amy Byler",
    author: "Kelly Harms",
    price: 79.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=160&h=240&q=80",
  },
  {
    id: "ever-know",
    name: "All You Can Ever Know: A Memoir",
    author: "Nicole Chung",
    price: 49.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=160&h=240&q=80",
  },
  {
    id: "winter-garden",
    name: "Winter Garden",
    author: "Kristin Hannah",
    price: 59.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=160&h=240&q=80",
  },
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    const loadCart = async () => {
      try {
        const data = await fetchApi<CartItem[]>("/api/cart.php?userId=1");
        if (active) {
          if (data && Array.isArray(data) && data.length > 0) {
            setCartItems(data);
          } else {
            // Check localStorage
            const saved = localStorage.getItem("bookworm_cart");
            if (saved) {
              setCartItems(JSON.parse(saved));
            } else {
              setCartItems(defaultCartItems);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load cart from API:", err);
        const saved = localStorage.getItem("bookworm_cart");
        if (saved && active) {
          try {
            setCartItems(JSON.parse(saved));
          } catch (e) {
            setCartItems(defaultCartItems);
          }
        } else if (active) {
          setCartItems(defaultCartItems);
        }
      } finally {
        if (active) {
          setIsLoaded(true);
        }
      }
    };
    loadCart();
    return () => { active = false; };
  }, []);

  const addToCart = async (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const qty = item.quantity ?? 1;
    const existingIndex = cartItems.findIndex((i) => i.id === item.id);
    let newItems = [...cartItems];
    if (existingIndex > -1) {
      newItems[existingIndex].quantity += qty;
    } else {
      newItems.push({ ...item, quantity: qty });
    }
    setCartItems(newItems);
    localStorage.setItem("bookworm_cart", JSON.stringify(newItems));

    try {
      await fetchApi("/api/cart.php", {
        method: "POST",
        body: JSON.stringify({ userId: 1, bookId: item.id, quantity: qty })
      });
    } catch (err) {
      console.error("Failed to sync addToCart to API:", err);
    }
  };

  const removeFromCart = async (id: string) => {
    const newItems = cartItems.filter((i) => i.id !== id);
    setCartItems(newItems);
    localStorage.setItem("bookworm_cart", JSON.stringify(newItems));

    try {
      await fetchApi(`/api/cart.php?userId=1&bookId=${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
    } catch (err) {
      console.error("Failed to sync removeFromCart to API:", err);
    }
  };

  const updateQuantity = async (id: string, delta: number) => {
    const newItems = cartItems
      .map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + delta };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    setCartItems(newItems);
    localStorage.setItem("bookworm_cart", JSON.stringify(newItems));

    try {
      await fetchApi("/api/cart.php", {
        method: "POST",
        body: JSON.stringify({ userId: 1, bookId: id, quantity: delta })
      });
    } catch (err) {
      console.error("Failed to sync updateQuantity to API:", err);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    localStorage.setItem("bookworm_cart", JSON.stringify([]));

    try {
      await fetchApi("/api/cart.php?userId=1", {
        method: "DELETE"
      });
    } catch (err) {
      console.error("Failed to sync clearCart to API:", err);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems: isLoaded ? cartItems : defaultCartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
