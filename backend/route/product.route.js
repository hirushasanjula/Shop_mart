import {Router} from 'express';
import auth from '../middleware/auth.js';
import { createProductController, deleteProductDetails, getProductByCategoryAndSubCategory, getProductByIdController, getProductController, getProductDetails, searchProduct, updateProductDetails,  } from '../controllers/product.controller.js';
import { admin } from '../middleware/Admin.js';

const productRouter = Router();

productRouter.post('/create',auth,admin,createProductController)
productRouter.post('/get',getProductController)
productRouter.post('/get-product-by-category',getProductByIdController)
productRouter.post('/get-product-by-id',getProductByCategoryAndSubCategory)
productRouter.post('/get-product-details',getProductDetails)
productRouter.put('/update-product',auth,admin, updateProductDetails)
productRouter.delete('/delete-product',auth,admin, deleteProductDetails)
productRouter.post('/search-product',searchProduct)

export default productRouter;