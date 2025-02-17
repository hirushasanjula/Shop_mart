import {Router} from 'express';
import auth from '../middleware/auth.js';
import {addToCartItem, deleteCartItemQty, getCartItem, updateCartItemQty} from '../controllers/cart.controller.js'

const cartRouter = Router();

cartRouter.post('/create',auth,addToCartItem)
cartRouter.get('/get',auth,getCartItem)
cartRouter.put('/update-qty',auth,updateCartItemQty)
cartRouter.delete('/delete-cart-item',auth,deleteCartItemQty)

export default cartRouter;