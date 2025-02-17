import React from 'react'
 import { useGlobalContext } from '../provider/GlobalProvider'
import { IoCartSharp } from 'react-icons/io5'
import { DisplayPrice } from '../utils/DisplayPrice'
import { Link } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa";
import { useSelector } from 'react-redux'

const CartMobile = () => {
    const {totalPrice,totalQty} = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)

  return (
    <>
      {
        cartItem[0] && (
            <div className=' p-2 sticky bottom-4'>
            <div className='bg-green-600 px-2 py-1 rounded text-neutral-100 text-sm flex items-center justify-between gap-3 lg:hidden'>
              <div className='flex items-center gap-2'>
                <div className='p-2 bg-green-500 rounded w-fit'>
                  <IoCartSharp />
                </div>
                <div className='text-sm'>
                  <p>{totalQty} items</p>
                  <p>{DisplayPrice(totalPrice)}</p>
                </div>
              </div>
    
    
              <Link to={'/cart'} className='flex items-center gap-2'>
                <span className='text-sm'>View Cart</span>
                <FaArrowRight />
              </Link>
            </div>
          </div>
        )
      }
    </>
      
  )
}

export default CartMobile