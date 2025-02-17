import {Router} from 'express';
import auth from '../middleware/auth.js';
import { CashPaymentController, getOrderDetails, paymentController, webhookStripe } from '../controllers/order.controller.js';

const orderRouter = Router();

orderRouter.post('/cash-on',auth,CashPaymentController)
orderRouter.post('/checkout',auth,paymentController)
orderRouter.post('/webhook',webhookStripe)
orderRouter.get('/order-list',auth,getOrderDetails)

export default orderRouter;