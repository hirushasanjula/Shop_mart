import { createSlice } from "@reduxjs/toolkit";

const initalState = {
    cart  : []
}

const cartSlice = createSlice({
    name : 'cartItem',
    initialState : initalState,
    reducers : {
        handleAddItemCart : (state, action) => {
            state.cart = [...action.payload]
        }
    }
});

export const {handleAddItemCart} = cartSlice.actions

export default cartSlice.reducer