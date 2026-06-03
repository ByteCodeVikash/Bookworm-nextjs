import React, { createContext, useContext, useState, useEffect } from "react";

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
    const saved = localStorage.getItem("bookworm_cart");
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        setCartItems(defaultCartItems);
      }
    } else {
      setCartItems(defaultCartItems);
    }
    setIsLoaded(true);
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("bookworm_cart", JSON.stringify(items));
  };

  const addToCart = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const qty = item.quantity ?? 1;
    const existingIndex = cartItems.findIndex((i) => i.id === item.id);
    if (existingIndex > -1) {
      const newItems = [...cartItems];
      newItems[existingIndex].quantity += qty;
      saveCart(newItems);
    } else {
      saveCart([...cartItems, { ...item, quantity: qty }]);
    }
  };

  const removeFromCart = (id: string) => {
    saveCart(cartItems.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    const newItems = cartItems
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    saveCart(newItems);
  };

  const clearCart = () => {
    saveCart([]);
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
