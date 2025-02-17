import React, { useEffect, useState } from 'react'
import SummaryApi from '../api/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { CiSearch } from "react-icons/ci";


const ProductAdmin = () => {
  const [productData, setProductData] = useState([])
    const [page,setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalPageCount, setTotalPageCount] = useState(1)
    const [Search,setSearch] = useState('')

    const fetchProductData = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProduct,
                data: {
                    page: page,
                    limit: 12,
                    search: Search
                }
            }) 

            const {data: responseData} = response

            if(responseData.success){
                setProductData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProductData()
    },[page])

    const handleNext = () => {
        if(page !== totalPageCount -1){

            setPage(preve => preve + 1)
        }
    }

    const handlePrevious = () => {
        if(page > 1){

            setPage(preve => preve - 1)
        }
    }

    const handleOnChange = (e) => {
        const {value} = e.target
        setSearch(value)
        setPage(1)
    }

    useEffect(() => {
        let flag = true

        const interval = setInterval(() => {
            if(flag){
                fetchProductData()
                flag = false
            }
        },300)

        return () => {
            clearInterval(interval)
        }
    },[Search])

  return (
    <section>
        <div className='p-2 bg-green-100 shadow-md flex items-center justify-between gap-4'>
            <h2 className='font-semibold'>Product</h2>
            <div className='bg-blue-50 min-w-24 h-full max-w-56 w-full ml-auto px-4 flex items-center gap-3 border py-2 rounded focus-within:border-green-500'>
                <CiSearch size={20} className=''/>
                <input 
                    type='text' 
                    placeholder='Search Product here...' 
                    className=' bg-blue-50 h-full w-full outline-none bg-transparent'
                    onChange={handleOnChange}
                    value={Search}
                />
            </div>
        </div>
        {
            loading && (
                <Loading />
            )
        }

        <div className='p-4 bg-blue-50'>
            <div className='min-h-[55vh]'>
                <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                    {
                        productData.map((p,inde) => {
                            return (
                                <ProductCardAdmin data={p} fetchProductData={fetchProductData}/>
                            )
                        })
                    }
                </div>
            </div>
            <div className='flex justify-between my-4'>
                <button onClick={handlePrevious} className='border border-green-500 px-4 py-1 hover:bg-green-600'>Previous</button>
                <button className=''>{page}/{totalPageCount}</button>
                <button
                onClick={handleNext}
                 className='border border-green-500 px-4 py-1 hover:bg-green-600'>Next</button>
            </div>
        </div>

        
    </section>
  )
}

export default ProductAdmin