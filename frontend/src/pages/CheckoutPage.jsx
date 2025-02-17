import React, { useState } from 'react'
import { DisplayPrice } from '../utils/DisplayPrice'
import { useGlobalContext } from '../provider/GlobalProvider'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import SummaryApi from '../api/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import {loadStripe} from '@stripe/stripe-js'

const CheckoutPage = () => {
        const {notDiscountTotalPrice,totalPrice,totalQty,fetchCartItem,fetchOrder} = useGlobalContext()
        const [openAddress, setOpenAddress] = useState(false)
        const addressList = useSelector(state => state.adresses.addressList)
        const [selectAddress, setSelectAddress] = useState(0)
        const cartItemList = useSelector(state => state.cartItem.cart)
        const navigate = useNavigate()
        

        const handleCashOnDelivery = async () => {
            try {
                const response = await Axios({
                    ...SummaryApi.cashondelivery,
                    data: {
                        list_items : cartItemList,
                        totalAmount : totalPrice,
                        addressId : addressList[selectAddress]?._id,
                        subTotal: totalPrice
                    }
                })

                const {data: responseData} = response

                if(responseData.success){
                    toast.success(responseData.message)
                    if(fetchCartItem){
                        fetchCartItem()
                    }
                    if(fetchOrder){
                        fetchOrder()
                    }
                    navigate('/success',{
                        state: {
                            text : "Order"
                        }
                    })
                }

            } catch (error) {

            }
        }

        const handleOnlinePayment = async () => {
            try {
                toast.loading('Loading...')
                const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
                const stripePromise = await loadStripe(stripePublicKey)
                
                const response = await Axios({
                    ...SummaryApi.payment_url,
                    data: {
                        list_items : cartItemList,
                        totalAmount : totalPrice,
                        addressId : addressList[selectAddress]?._id,
                        subTotal: totalPrice 
                    }
                })

                const {data: responseData} = response

                stripePromise.redirectToCheckout({sessionId : responseData.id})

                if(fetchCartItem){
                    fetchCartItem()
                }
                if(fetchOrder){
                    fetchOrder()
                }

            } catch (error) {
                AxiosToastError(error)
            }
        }


  return (
    <section className='bg-green-100'>
        <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-4 justify-between'>
            <div className='w-full '>
                {/* address */}
                <h3 className='font-semibold'>Choose your address</h3>
                <div className='bg-white p-2 grid gap-4'>
                    {
                        addressList.map((address,index) =>{
                            return (
                                <label htmlFor={'address'+index} className={!address.status && "hidden"}>
                                    <div className='border rounded p-3 flex gap-3 hover:bg-blue-50'>
                                        <div>
                                            <input id={"address"+index} type='radio' name='address' value={index} onChange={(e) =>setSelectAddress(e.target.value)} />
                                        </div>
                                        <div>
                                            <p>{address.address_line}</p>
                                            <p>{address.city}</p>
                                            <p>{address.state}</p>
                                            <p>{address.country}-{address.pincode}</p>
                                            <p>{address.mobile}</p>
                                        </div>                                    
                                    </div>
                                </label>
                            )
                        })
                    }
                    <div onClick={()=>setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex items-center justify-center cursor-pointer'>
                        Add address
                    </div>
                </div>
                
            </div>

            <div className='w-full mx-w-md bg-white py-4 px-2'>
                {/*summary */}
                <h3 className='font-semibold'>Summary</h3>
                <div className='p-4 text-sm bg-white'>
                    <h3 className='font-semibold'>Bill details</h3>
                        <div className='flex justify-between gap-4 ml-1'>
                            <p>Item total</p>
                            <p className='flex items-center gap-2'><span className='line-through'>{DisplayPrice(notDiscountTotalPrice)}</span><span>{DisplayPrice(totalPrice)}</span></p>
                        </div>
                        <div className='flex justify-between gap-4 ml-1'>
                            <p>Quntity total</p>
                            <p className='flex items-center gap-2'>{totalQty}</p>
                        </div>
                        <div className='font-semibold flex items-center justify-between gap-4'>
                            <p>Sub total</p>
                            <p>{DisplayPrice(totalPrice)}</p>
                        </div>
                </div>
                <div className='w-full flex flex-col gap-4'>
                    <button
                    onClick={handleOnlinePayment}
                     className='py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white'>
                        Online Payment
                    </button>
                    <button
                    onClick={handleCashOnDelivery}
                     className='py-2 px-4 border-2 border-green-600 hover:bg-green-600 hover:text-white rounded'
                     >
                        Cash on Delivery
                    </button>
                </div>
            </div>
        </div>

        {
            openAddress &&(
                <AddAddress close={()=>setOpenAddress(false)}/>
            )
        }
    </section>
  )
}

export default CheckoutPage