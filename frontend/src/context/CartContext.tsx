"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  subtotal: number;
}

interface Cart {
  id: number;
  items: CartItem[];
  total_price: number;
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Synchronize cart records on initial frame load
  const refreshCart = async () => {
    try {
      // Include credentials to handle Django session backend cookies cleanly
      const res = await fetch("http://localhost:8000/api/cart/current/", {
        method: "GET",
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (err) {
      console.error("Critical syncing drop with backend cart tables:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (productId: number, quantity = 1) => {
    try {
      const res = await fetch("http://localhost:8000/api/cart/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ product_id: productId, quantity }),
      });
      if (res.ok) {
        const updatedCart = await res.json();
        setCart(updatedCart);
      }
    } catch (err) {
      console.error("Cart allocation execution failure:", err);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/cart/update/${itemId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity }),
      });
      if (res.ok) {
        const updatedCart = await res.json();
        setCart(updatedCart);
      }
    } catch (err) {
      console.error("Cart line amendment processing failure:", err);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/cart/remove/${itemId}/`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        const updatedCart = await res.json();
        setCart(updatedCart);
      }
    } catch (err) {
      console.error("Cart line drop execution failure:", err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, isLoading, addToCart, updateQuantity, removeFromCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart hooks must be scoped inside active CartProviders.");
  }
  return context;
}