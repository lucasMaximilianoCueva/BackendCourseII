import React, { useContext, useState } from "react";

export const CartContext = React.createContext();

export const useCartContext = () => useContext(CartContext);

export default function CartProvider({ children, defaultCart = [] }) {
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [cart, setCart] = useState(defaultCart);
  const [cartTotal, setCartTotal] = useState(0);

  function addItem(item, quantity) {
    const newCart = [...cart];

    const itemWithQuantity = { ...item, quantity: quantity };

    const i = newCart.findIndex((itemInCart) => itemInCart.id === item.id);

    if (i > -1) {
      newCart[i] = itemWithQuantity;
    } else {
      newCart.push(itemWithQuantity);
    }
    setCart(newCart);
    counter(newCart);
  }

  function counter(items) {
    let countTotal = 0;
    let costTotal = 0;
    for (let i = 0; i < items.length; i++) {
      countTotal += items[i].quantity;
      costTotal += items[i].price * items[i].quantity;
    }
    setTotalItemCount(countTotal);
    setCartTotal(costTotal);
  }

  function removeItem(itemId) {
    if (cart.length > 0) {
      const newCart = cart.filter((item) => item.id !== itemId);
      setCart(newCart);
      counter(newCart);
    }
  }

  function clear() {
    setCart([]);
    setTotalItemCount(0);
    setCartTotal(0);
  }

  return (
    <CartContext.Provider
      value={{ cart, totalItemCount, cartTotal, addItem, removeItem, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}
