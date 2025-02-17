import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import  SummaryApi  from '../api/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { DisplayPrice } from '../utils/DisplayPrice'
import Divider from '../components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import { ProductDiscount } from '../utils/ProductDiscount'
import AddToCartButton from '../components/AddToCartButton'

const ProductDisplay = () => {
  const params = useParams()
  let productId = params?.product?.split('-')?.slice(-1)[0]
  const [data, setData] = useState({
    name: '',
    image: [],

  })
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const imagecontainer = useRef()

  const fetchProductDetails = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId : productId
        }
      })

      const { data: responseData } = response

      if(responseData.success){
        setData(responseData.data)

      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    fetchProductDetails(0)
  }, [params])
  console.log(data)
 
  const handleScrollRight = () => {
    imagecontainer.current.scrollLeft += 100
  }
  const handleScrollLeft = () => {
    imagecontainer.current.scrollLeft -= 100
  }
  return (
    <section className='container mx-auto p-10 grid lg:grid-cols-2 bg-green-50'>
      <div className=''>
        <div className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 w-full h-full'>
          <img 
          src={data.image[image]}
          className='w-full h-full object-scale-down'
          />
        </div>
        <div className='flex items-center p-2 justify-center gap-3'>
          {
            data.image.map((img, index) =>{
              return(
                <div key={image+index+"point"} className={`bg-slate-200 w-5 h-5 rounded-full ${index === image  && 'bg-green-300'}`}>

                </div>
              )
            })
          }
        </div>
        <div className='grid relative'>
          <div ref={imagecontainer} className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none'>
            {
              data.image.map((img, index) =>{
                return(
                  <div className='w-20 h-20 min-h-20 min-w-20 cursor-pointer shadow-xl bg-white' key={img+index}>
                    <img
                    src={img}
                    alt='mini'
                    onClick={() => setImage(index)}
                    className='w-full h-full object-scale-down'
                    />
                  </div>
                )
              })
            }
          </div>
          <div className='w-full -ml-3 h-full lg:flex justify-between absolute items-center'>
              <button 
              onClick={handleScrollLeft}
              className=' z-10 bg-white relative p-1 rounded-full shadow-lg'>
                <IoIosArrowBack />
              </button>
              <button
              onClick={handleScrollRight}
              className=' z-10 bg-white relative p-1 rounded-full shadow-lg'>
                <IoIosArrowForward />
              </button>
          </div>
        </div>
        <div>
          
        </div>

        <div className='my-4 hidden lg:grid gap-3'>
          <div className=''>
            <p className='font-semibold'>Description</p>
            <p className='text-sm'>{data.description}</p>
          </div>
          <div className=''>
            <p className='font-semibold'>Unit</p>
            <p className='text-sm'>{data.unit}</p>
          </div>
          {
            data?.more_details && Object.keys(data?.more_details).map((element,index) => {
              return (
                <div className=''>
                <p className='font-semibold'>{element}</p>
                <p className='text-sm'>{data.more_details[element]}</p>
              </div>
              )
            })
          }
        </div>
      </div>


      <div className='p-4 lg:pl-7 text-base lg:text-lg'>
            <h2 className='text-lg font-semibold lg:text-3xl'>{data.name}</h2>
            <p className='bg-green-300 w-fit px-2 rounded-full mt-1 text-sm'>{data.unit}</p>
            <Divider />
            <div>
            <p className='text-sm'>Price</p>
            <div className='flex items-center gap-2 lg:gap-4'>
              <div className='border border-green-500 px-4 py-2 rounded bg-green-100 w-fit'>
                <p className='font-semibold text-lg lg:text-lg'>{DisplayPrice(ProductDiscount(data.price,data.discount))}</p>
              </div>
              {
                data.discount && (
                  <p className='line-through text-sm'>{DisplayPrice(data.price)}</p>
                )
              }
              {
                data.discount && (
                  <p className='font-semibold text-green-500'>{data.discount}% <span className=' text-sm text-neutral-600'>Discount</span></p>
                )
              }
              
            </div>
            </div>

            {
              data.stock == 0 ? (
                <p className='text-red-500 my-2 text-sm'>Out of Stock</p>
              ) : (
                //<button className='my-4 px-4 py-1 text-white bg-green-600 hover:bg-green-700 rounded-md'>Add</button>
                <div className='my-4'>
                  <AddToCartButton data={data}/>
                </div>
              )
            }
            
            <Divider />

            <h2 className='font-medium'>Why shop from shopmart?</h2>
            <div>
              <div className='flex items-center gap-4 my-3'>
                <img
                src={image1}
                alt='' 
                className='w-20 h-20'
                />
              <div className='text-sm'>
                <div className='font-bold'>Superfast Delivery</div>
                <p>Get your order delivered to your doorstep at earliest from dark stores near you</p>
              </div>
            </div>
              <div className='flex items-center gap-4 my-3'>
                <img
                src={image2}
                alt='price offer' 
                className='w-20 h-20'
                />
              <div className='text-sm'>
                <div className='font-bold'>Best Price & Offers</div>
                <p>Best Price destination with offers directly from the </p>
              </div>
            </div>
          </div>
      </div>
    </section>
  )
}

export default ProductDisplay