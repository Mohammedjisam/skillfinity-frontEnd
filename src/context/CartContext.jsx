import React, { createContext, useContext, useEffect } from 'react';
import axiosInstance from '../AxiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartCount } from '@/redux/slices/cartSlice';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { count: cartCount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const userDatas = useSelector((store) => store.user.userDatas);

  const updateCartCount = async () => {
    try {
      const response = await axiosInstance.post(`/user/data/cartcount/${userDatas._id}`);
      dispatch(updateCartCount(response.data.totalItems));
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const incrementCartCount = () => {
    dispatch(updateCartCount(cartCount + 1));
  };

  const decrementCartCount = () => {
    dispatch(updateCartCount(Math.max(0, cartCount - 1)));
  };

  const resetCartCount = () => {
    dispatch(updateCartCount(0));
  };

  useEffect(() => {
    if (userDatas?._id) {
      updateCartCount();
    }
  }, [userDatas?._id]);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        updateCartCount,
        incrementCartCount,
        decrementCartCount,
        resetCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

