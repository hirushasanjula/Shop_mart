import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../api/SummaryApi'
import { Link, useParams } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { validURLConverter } from '../utils/validurl'

const ProductListPage = () => {
  const [data,setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading,setLoading] = useState(false)
  const [totalPage,setTotalPage] = useState(1)
  const params = useParams()
  const AllsubCategory = useSelector(state => state.product.allSubCategory)
  const [DisplaySubCategory,setDisplaySubCategory] = useState([])

  const subCategory = params?.subCategory?.split("-")
  const subCategoryName = subCategory?.slice(0, subCategory?.length - 1)?.join(" ")

  const categoryId = params.category.split('-').slice(-1)[0]
    const subCategoryId = params.subCategory.split('-').slice(-1)[0]

  const fetchProductdata = async () => {
   try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
         subCategoryId: subCategoryId,
          page: page,
          limit: 10,
        }
      })

      const{data: responseData} = response

      if(responseData.success){
        if(responseData.page ==1){
          setData(responseData.data)
        } else {
          setData([...data,...responseData.data])
        }
        setTotalPage(responseData.totalCount)

      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductdata()
  },[params])

  useEffect(() => {
    const sub = AllsubCategory.filter(s =>{
      const filterData = s.category.some(el =>{
        return el._id == categoryId
      })

      return filterData ? filterData : null
    })
    setDisplaySubCategory(sub)
  },[params,AllsubCategory])

  return (
    <section className='sticky top-24 lg:top-20'>
      <div className='container sticky top-24 mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[250px,1fr]'>
        {/* sub category*/}
        <div className='min-h-[88vh] max-h-[88vh] overflow-y-scroll shadow-md grid gap-1 scrollbarStyle bg-white py-2'>
          {
            DisplaySubCategory.map((s,index) =>{
              const link = `/${validURLConverter(s?.category[0]?.name)}-${s?.category[0]?._id}/${validURLConverter(s.name)}-${s._id}`
              return(
                <Link to={link} className={`w-full p-2 lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b
                  hover:bg-green-100 cursor-pointer
                 ${subCategoryId === s._id ? "bg-green-100" : ""}`}>
                  <div className='w-fit max-w-28 mx-auto lg:mx-0 bg-white rounded box-border'>
                    <img 
                    src={s.image}
                    alt='sub category'
                    className='w-14 lg:w-12 lg:h-14 h-full object-scale-down '
                    />
                  </div>
                  <p className='-mt-4 text-xs text-center lg:text-sm lg:text-left'>{s.name}</p>
                </Link>
              )
            })
          }
        </div>


        {/* product list */}
        <div className='bg-green-50 py-2 sticky top-20'>
          <div className='bg-white shadow-md p-4'>
            <h3>{subCategoryName}</h3>
          </div>
          <div>

            <div className='min-h-[80vh] max-h-[80vh] overscroll-y-auto'>
              <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 p-4 gap-4'>
                {
                    data.map((p,index) =>{
                      return(
                        <CardProduct 
                        data={p}
                        key={p._id+"ProductSubCategory"+index}
                        />
                      )
                    })
                }
              </div>
            </div>
            
            {
              loading && (
                <Loading />
              )
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductListPage