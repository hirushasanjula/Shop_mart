import React from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPrice } from '../utils/DisplayPrice'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { ProductDiscount } from '../utils/ProductDiscount'
import imageEmpty from '../assets/empty_cart.webp'
import toast from 'react-hot-toast'

const DisplayCartItem = ({close}) => {
    const {notDiscountTotalPrice,totalPrice,totalQty} = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    const redirectToCheckoutPage = () => {
        if(user?._id){
            navigate('/checkout')
            if(close){
                close()
            }
            return
        }
        toast("Please Login")
    }
  return (
    <section className='bg-neutral-900 fixed top-0 bottom-0 right-0 left-0 bg-opacity-70 z-50'>
        <div className='bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto'>
            <div className='flex items-center p-4 shadow-md gap-3 justify-between'>
                <h2 className='font-semibold'>Cart</h2>
                <Link to={"/"} className='lg:hidden'>
                    <IoClose size={25}/>
                </Link>
                <button onClick={close} className='hidden lg:block'>
                    <IoClose size={25}/>
                </button>
            </div>


            <div className='min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-120px)] p-2 flex flex-col gap-4'>
                {/*display cart item*/} 
                {
                    cartItem[0] ? (
                        <>
                            <div className='flex items-center px-4 py-2 justify-between bg-yellow-100 text-yellow-600 rounded-full'>
                                <p>Your total savings</p>
                                <p>{DisplayPrice(notDiscountTotalPrice - totalPrice)}</p>
                            </div>
                            <div className='rounded-lg p-4 grid gap-5 overflow-auto '>
                                {
                                    cartItem[0] && (
                                        cartItem.map((item,index)=>{
                                            return (
                                                <div key={item._id+"cartItemdisplay"} className='flex w-full gap-4'>
                                                    <div className='w-16 h-16 min-h-16 min-w-16'>
                                                        <img
                                                        src={item?.productId?.image[0]}
                                                        className='object-scale-down'
                                                        />
                                                    </div>
                                                    <div className=' w-full max-w-sm'>
                                                        <p className='text-sm text-ellipsis line-clamp-2'>{item?.productId?.name}</p>
                                                        <p className='text-sm text-neutral-400'>{item?.productId?.unit}</p>
                                                        <p className='text-sm font-semibold'>{DisplayPrice(ProductDiscount(item?.productId?.price,item?.productId?.discount))}</p>
                                                    </div>
                                                    <div>
                                                        <AddToCartButton data={item?.productId}/>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )
                                }
                            </div>  
                            <div className='p-4 text-sm shadow-md'>
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
                        </>
                    ) : (
                        <div className='flex flex-col items-center justify-center'>
                            <img 
                            src={imageEmpty}
                            className='w-full h-full object-scale-down'
                            />
                            <Link onClick={close} to={'/'} className='block bg-green-600 px-4 py-2 text-white rounded'>Shop Now</Link>
                        </div>
                    )
                }  
                           
            </div>
            
            {
                cartItem[0] && (
                    <div className='p-2'>
                        <div className='bg-green-600 text-white px-4 py-4 sticky bottom-3 rounded flex items-center gap-4 justify-between'>
                            <div>
                                {DisplayPrice(totalPrice)}
                            </div>
                           
                            <button onClick={redirectToCheckoutPage} className='flex items-center gap-1'>
                                Proceed
                                <span>
                                    <FaCaretRight />
                                </span>
                            </button>
                        </div>
                    </div>
                )
            }
            
        </div>
    </section>
  )
}

export default DisplayCartItem