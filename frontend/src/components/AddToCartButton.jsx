import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../api/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { FaMinus,FaPlus  } from "react-icons/fa";

const AddToCartButton = ({data}) => {
    const {fetchCartItem,updateCartItem,deleteCartItem} = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state?.cartItem.cart)
    const [isAvaliableCart, setIsAvaliableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails, setCartItemDetails] = useState({})

    const handleaddToCart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setLoading(true)

            const response = await Axios({
                ...SummaryApi.addTocart,
                data: {
                    productId : data?._id
                }
            })

            const {data: responseData} = response

            if(responseData.success){
                toast.success(responseData.message)
                if(fetchCartItem){
                    fetchCartItem()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    //check if product is in cart or not
    useEffect(() => {
        const checkingitem = cartItem.some(item => item.productId._id === data._id)
        setIsAvaliableCart(checkingitem)

        const product = cartItem.find(item => item.productId._id === data._id)
        setQty(product?.quantity)
        setCartItemDetails(product)

    },[data,cartItem])

    const incrementQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()

       const response = await updateCartItem(cartItemDetails?._id,qty + 1)

       if(response.success){
        toast.success("Item added")
       }
    }

    const decrementQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        if(qty === 1){
            deleteCartItem(cartItemDetails?._id)      
        } else {
           const response =await updateCartItem(cartItemDetails?._id,qty - 1)

            if(response.success){
                toast.success("Item removed")
               }
        }
    }

  return (
    <div className='w-full max-w-[150px]'>
        {
            isAvaliableCart ? (
                <div className='flex text-sm w-full h-full  '>
                    <button onClick={decrementQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 p-1 rounded flex items-center justify-center'>
                        <FaMinus />
                    </button>
                    <p className='flex-1 px-1 flex items-center justify-center'>{qty}</p>
                    <button onClick={incrementQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 p-1 rounded flex items-center justify-center'>
                        <FaPlus />
                    </button>
                </div>
            ): (
                <button onClick={handleaddToCart} className='bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded text-sm'>
                     {loading ? <Loading/> : "Add"} 
                </button>
            )
        }
       
    </div>
  )
}

export default AddToCartButton