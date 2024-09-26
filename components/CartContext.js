import { createContext, useEffect, useState }  from 'react';
import Swal from 'sweetalert2';

export const CartContext = createContext({})

export function CartContextProvider({children}){
    const ls = typeof window !== 'undefined' ? window.localStorage : null;
    const [cartBooks, setCartBooks] = useState([]);
    
    useEffect(()=>{
        if(cartBooks?.length > 0){
            ls?.setItem('cart', JSON.stringify(cartBooks))
        }
    }, [cartBooks]);

    useEffect(()=>{
        if(ls && ls.getItem("cart")){
            setCartBooks(JSON.parse(ls.getItem("cart")));
        }
    }, [])

    function addBook(bookId){
        setCartBooks(prev => [...prev, bookId]);

        // Trigger SweetAlert when a product is added
        Swal.fire({
            icon: 'success',
            title: 'Added to Cart',
            text: 'This book has been added to your cart.',
            timer: 1500,
            showConfirmButton: false,
            position: 'top-end',
            toast: true
        });
    }

    function removeBook(bookId){
        setCartBooks(prev => {
            const pos = prev.indexOf(bookId);
            if (pos !== -1){
                // Show SweetAlert before removing the book
                Swal.fire({
                    icon: 'info',
                    title: 'Removed from Cart',
                    text: 'This book has been removed from your cart.',
                    timer: 1500,
                    showConfirmButton: false,
                    position: 'top-end',
                    toast: true
                });
                return prev.filter((value, index) => index !== pos);
            }
            return prev;
        });
    }

    return (
        <CartContext.Provider value={{cartBooks, setCartBooks, addBook, removeBook}}>
            {children}
        </CartContext.Provider>
    )
}
