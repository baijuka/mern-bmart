import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
    cart: {
        cartItems: [],
    },
};

function reducer(state, action) {
    switch (action.type) {
        case 'CART_ADD_ITEM':
            //Add to cart

            const newItem = action.payload;
            const existItem = state.cart.cartItems.find(
                (item) => item._id === newItem._id
            );
            const cartItems = existItem 
            ? state.cart.cartItems.map((item) => 
            item._id === existItem._id ? newItem : item
            )
            : [...state.cart.cartItems, newItem];
            return {...state, cart: {...state.cart, cartItems}};
            
            // ...state.cart -> all previous values of the cart object in the state
            // ...state.cart.cartItems -> all previous item in the array cartItems of the cart object in the state
            // action.playload --> new item the in the cart.
        default:
            return state;
    }
}

export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = {state, dispatch};
    return <Store.Provider value={value}>{props.children}</Store.Provider>;
    // You need to wrap the application with Store.Provider in the index.js
}