import React, { createContext, useState, ReactNode } from "react";
import {
  ProductTypes,
  GlobalContextTypes,
  GlobalStateTypes,
} from "../types";

export const GlobalContext = createContext<GlobalContextTypes | null>(null);

interface GlobalContextProviderProps {
  children: ReactNode;
}

export const GlobalContextProvider: React.FC<GlobalContextProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<GlobalStateTypes>({
    cart: [],
  });

  const [searchBy, setSearchBy] = useState("");

  const handleAddToCart = (product: ProductTypes) => {
    setState({
      ...state,
      cart: [...state.cart, product],
    });
  };

  const handleDeleteFromCart = (id: string) => {
    const cart = state.cart;
    const index = state.cart.findIndex((item) => item.productId === id);
    if (index > -1) {
      cart.splice(index, 1);
    }
    setState({
      ...state,
      cart: [...cart],
    });
  };

  const handleRemoveFromCart = () => {
    setState({
      ...state,
      cart: [],
    });
  };

  const value: GlobalContextTypes = {
    state,
    handleAddToCart,
    handleDeleteFromCart,
    handleRemoveFromCart,
    searchBy,
    setSearchBy,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

/**
 * Custom hook to use the Global Context
 */
export const useGlobalContext = (): GlobalContextTypes => {
  const context = React.useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within GlobalContextProvider");
  }
  return context;
};
