import { createContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export const CartContext = createContext({});

export function AppProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const ls = typeof window !=='undefined' ?window.localStorage:null;

  useEffect(() => {
    if(ls && ls.getItem('cart')){
      setCartProducts(JSON.parse(ls.getItem('cart')))
    }
  }, []);

  function clearCart(){
    setCartProducts([]);
    saveCartProductsToLocalStorage([])
  }

  function removeCartProduct(indexToRemove){
    setCartProducts(prevCartProducts =>{
      const newCartProducts = prevCartProducts
      .filter((v,index)=>index !== indexToRemove);
      saveCartProductsToLocalStorage(newCartProducts);
      return newCartProducts;
    })
    Swal.fire({
      text: 'Meal removed from cart',
      icon: 'success',
      position: 'top',
      toast: true,
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    });
  }  

  function saveCartProductsToLocalStorage(cartProducts){
    if (ls) {
      ls.setItem('cart', JSON.stringify(cartProducts));
    }
  }

  function addToCart(product, price = null) {
    setCartProducts((prevProducts) => {
      const cartProduct = { ...product, price };
      const newProducts = [...prevProducts, cartProduct];
      saveCartProductsToLocalStorage(newProducts)
    
      return newProducts;
    });

  }

  return (
    <CartContext.Provider value={{ cartProducts,clearCart,removeCartProduct, setCartProducts, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}
