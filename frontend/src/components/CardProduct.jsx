import React, { useState } from 'react'
import { DisplayPrice } from '../utils/DisplayPrice'
import { Link } from 'react-router-dom'
import { validURLConverter } from '../utils/validurl'
import { ProductDiscount } from '../utils/ProductDiscount'
import SummaryApi from '../api/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import { useGlobalContext } from '../provider/GlobalProvider'
import AddToCartButton from './AddToCartButton'

const CardProduct = ({data}) => {
    const url = `/product/${validURLConverter(data.name)}-${data._id}`
    const [loading, setLoading] = useState(false)




  return (
    <Link to={url} className='border lg:p-4 py-2 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 max-w-32 rounded cursor-pointer bg-white'>
        <div className='min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden'>
            <img 
            src={data.image[0]}
            className='w-full h-full object-scale-down lg:scale-125'
            />
        </div>
        <div className='flex items-center lg:gap-4'>
            <div className=' p-1 rounded-full text-xs w-fit px-2 text-green-600 bg-green-50'>
                10 min
            </div>
            <div>
                {
                Boolean(data.discount) && (
                    <p className='text-green-600 bg-green-100 lg:px-2 w-fit text-xs rounded-full'>{data.discount}% discount</p>
                )
                }
            </div>
        </div>
        <div className='px-2 rounded lg:px-0 font-semibold line-clamp-2 text-sm lg:text-base'>
            {data.name}
        </div>
        <div className='w-fit lg:px-0 text-sm px-2 lg:text-base'>
            {data.unit}
        </div>

        <div className='px-2 flex lg:px-0 items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base'>
            <div className='flex items-center gap-1'>
                <div className='text-sm font-semibold'>
                    {DisplayPrice(ProductDiscount(data.price, data.discount))}
                </div>
                
                
            </div>
            <div className=''>
                {
                    data.stock == 0 ? (
                        <p className='text-xs text-red-500 text-center'>Out of stock</p>
                    ) : (
                       <AddToCartButton data={data}/>
                    )
                }
                
            </div>
        </div>
    </Link>
  )
}

export default CardProduct