import {Router} from 'express';
import auth from '../middleware/auth.js';
import { addAddresscontroller, deleteAddresscontroller, getAddresscontroller, updateAddresscontroller } from '../controllers/address.controller.js';

const addressRouter = Router();

addressRouter.post('/create',auth,addAddresscontroller)
addressRouter.get('/get',auth,getAddresscontroller)
addressRouter.put('/update',auth,updateAddresscontroller)
addressRouter.delete('/delete',auth,deleteAddresscontroller)

export default addressRouter