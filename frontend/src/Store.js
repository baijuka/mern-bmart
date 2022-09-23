import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
        
    cart: {
        shippingAddress: localStorage.getItem('shippingAddress')
            ? JSON.parse(localStorage.getItem('shippingAddress'))
            : {},
        paymentMethod: localStorage.getItem('paymentMethod')
        ? localStorage.getItem('paymentMethod')
        : '', // as paymenMethod is a string (paypal or stripe) you don't need to parse JSON.
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
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

            // Add to local storage in order to cart items availble even after refreshing the page - to convert to JSON format use JSON.stringify()
            // Now initialise cartItems with local starage in const initialState = {} section
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            return {...state, cart: {...state.cart, cartItems}};
            
            // ...state.cart -> all previous values of the cart object in the state
            // ...state.cart.cartItems -> all previous item in the array cartItems of the cart object in the state
            // action.playload --> new item the in the cart.

        case 'CART_REMOVE_ITEM':
            {
                const cartItems = state.cart.cartItems.filter(
                    (item) => item._id !== action.payload._id);
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    return { ...state, cart: { ...state.cart, cartItems } };
            }
        case 'CART_CLEAR':
            return { ...state, cart: { ...state.cart, cartItems: [] } };
        case 'USER_SIGNIN':
            return { ...state, userInfo: action.payload };
        case 'USER_SIGNOUT':
            //Clear all the fields (userinfo, cart and shipping address) when sign out
        return {
            ...state,
            userInfo: null,
            cart: {
                cartItems: [],
                shippingAddress: {},
                paymentMethod: '',
              },
            };
        case 'SAVE_SHIPPING_ADDRESS':
            return {
              ...state,
              cart: {
                ...state.cart,
                shippingAddress: action.payload,
              },
            };
        case 'SAVE_PAYMENT_METHOD':
            return {
                ...state,
                cart: { ...state.cart, paymentMethod: action.payload },
            };
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