import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../AxiosConfig';
import { useSelector } from 'react-redux';
const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const userDatas = useSelector((store) => store.user.userDatas);

  const updateCartCount = async () => {
    try {
      // Replace userData._id with the actual user ID as per your application context
      const response = await axiosInstance.post(`/user/data/cartcount/${userDatas._id}`);
      setCartCount(response.data.totalItems);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const incrementCartCount = () => {
    setCartCount((prevCount) => prevCount + 1);
  };

  const decrementCartCount = () => {
    setCartCount((prevCount) => Math.max(0, prevCount - 1));
  };

  useEffect(() => {
    updateCartCount();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        updateCartCount,
        incrementCartCount,
        decrementCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
