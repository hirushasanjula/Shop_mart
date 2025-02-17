import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";

export const addToCartItem = async (request, response) => {
    try {
        const userId = request.userId
        const { productId} = request.body

        if(!productId){
            return response.status(400).json({
                message: "Product ID is required",
                error: true,
                success: false
            })
        }

        const checkItemCart = await CartProductModel.findOne({
            userId: userId,
            productId: productId
        })

        if(checkItemCart){
            return response.status(400).json({
                message: "Product already in cart",
                error: true,
                success: false
            })
        }

        const cartItem = new CartProductModel({
            quantity: 1,
            userId : userId,
            productId: productId
        })
        const save = await cartItem.save()

        const updateCartUser = await UserModel.updateOne({_id: userId}, {
            $push : {
                shopping_cart : productId
            }
        }) 

        return response.json({
            data : save,
            message : "Item added to cart successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error: true,
            success: false
        })
    }
}

export const getCartItem = async (request, response) => {
    try {
        const userId = request.userId

        const cartItem = await CartProductModel.find({
            userId : userId
        }).populate('productId')

        return response.json({
            data : cartItem,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error: true,
            success: false
        })
    }
}

export const updateCartItemQty = async (request, response) => {
    try {
        const userId = request.userId
        const {_id, qty} = request.body

        if(!_id || !qty){
            return response.status(400).json({
                message: "Cart ID and quantity is required",
                error: true,
                success: false
            })
        }

        const UpdateCartItem = await CartProductModel.updateOne({
            _id : _id,
            userId : userId

        },{
            quantity : qty
        })

        return response.json({
            message : "Cart item updated successfully",
            error: false,
            success: true,
            data : UpdateCartItem,
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteCartItemQty = async (request,response) => {
    try {
        const userId = request.userId
        const { _id } = request.body

        if(!_id){
            return response.status(400).json({
                message : "Cart ID is required",
                error: true,
                success: false
            })
        }

        const deleteCartItem = await CartProductModel.deleteOne({_id: _id, userId: userId})

        return response.json({
            message : "Item Removed",
            error: false,
            success: true,
            data : deleteCartItem
        })
    } catch (error ){
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}