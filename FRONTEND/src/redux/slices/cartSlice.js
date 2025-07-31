import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : {
      cartItems: [],
      totalQuantity: 0,
      totalPrice: 0,
    };
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return {
      cartItems: [],
      totalQuantity: 0,
      totalPrice: 0,
    };
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const cartSlice = createSlice({
  name: "cart",

  initialState: loadCartFromStorage(),

  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item._id === newItem._id
      );
      if (existingItemIndex === -1) {
        state.cartItems.push({
          ...newItem,
          quantity: newItem.quantity,
          price: newItem.price,
          totalItemPrice: newItem.quantity * newItem.price,
        });
      } else {
        state.cartItems[existingItemIndex].quantity += newItem.quantity;
        state.cartItems[existingItemIndex].totalItemPrice +=
          newItem.price * newItem.quantity;
      }

      state.totalQuantity += newItem.quantity;
      state.totalPrice = Number(
        (state.totalPrice + newItem.price * newItem.quantity).toFixed(2)
      );
      
      // Ensure totalPrice is never negative
      if (state.totalPrice < 0) {
        state.totalPrice = 0;
      }
      
      // Save to localStorage
      saveCartToStorage(state);
    },

    removeFromCart: (state, action) => {
      const itemToRemove = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item._id === itemToRemove._id
      );

      if (existingItemIndex === -1) {
        return;
      }

      const existingItem = state.cartItems[existingItemIndex];
      existingItem.quantity -= itemToRemove.quantity;
      existingItem.totalItemPrice -= itemToRemove.price * itemToRemove.quantity;

      state.totalQuantity -= itemToRemove.quantity;
      state.totalPrice = Number(
        (state.totalPrice - itemToRemove.price * itemToRemove.quantity).toFixed(2)
      );

      // Ensure values are never negative
      if (state.totalPrice < 0) {
        state.totalPrice = 0;
      }
      if (state.totalQuantity < 0) {
        state.totalQuantity = 0;
      }

      if (existingItem.quantity <= 0) {
        state.cartItems.splice(existingItemIndex, 1);
      }
      
      // Save to localStorage
      saveCartToStorage(state);
    },

    emptyCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      
      // Save to localStorage
      saveCartToStorage(state);
    },
  },
});

export const { addToCart, removeFromCart, emptyCart } = cartSlice.actions;
export default cartSlice.reducer;
