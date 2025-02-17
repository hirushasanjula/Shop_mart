import React, { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../api/SummaryApi'
import EditCategory from '../components/EditCategory'
import DeleteBox from '../components/DeleteBox'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { useSelector } from 'react-redux'

const CategoryPage = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categoryData, setCategoryData] = useState([])
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({
    name: '',
    image: '',
  })

  const [openConfrimBoxDelete, setOpenConfrimBoxDelete] = useState(false)
  const [deleteCategory, setDeleteCategory] = useState({
    _id: ''
  })

  const allCategory = useSelector(state => state.product.allCategory)

  useEffect(() => {
    setCategoryData(allCategory)
  },[allCategory])

  const fetchCategory = async () => {
    try {
      setLoading(true)

      const response = await Axios({
        ...SummaryApi.getCategory
      })
      const {data: responseData} = response

      if(responseData.success){
        setCategoryData(responseData.data)
      }
      
    } catch (error) {
      
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategory()
  },[])

  const handleDeleteCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCategory,
        data: deleteCategory
      })

      const {data: responseData} = response

      if(responseData.success){
        toast.success(responseData.message)
        fetchCategory()
        setOpenConfrimBoxDelete(false)
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section>
        <div className='p-2 bg-green-100 shadow-md flex items-center justify-between'>
          <h2 className='font-semibold'>Category</h2>
          <button
          onClick={() => setOpenUploadCategory(true)}
           className='text-xs border-2 border-green-600 hover:bg-green-600 hover:text-white px-3 py-1 rounded-md'>
            Add Category
          </button>
        </div>
        {
            !categoryData[0] && !loading && (
              <NoData/>
            )
        }

        {
          loading && (
            <Loading/>
          )
        }

       <div className='p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2'>
       {
          categoryData.map((category,index) => {
            return(
              <div className='w-32 h-56 rounded shadow-md' key={category._id}>
                <img 
                  alt={category.name}
                  src={category.image}
                  className='w-full object-scale-down'
                />
                <div className='items-center h-9 flex gap-2'>
                  <button onClick={() => {
                    setOpenEdit(true)
                    setEditData(category)
                  }} 
                  className='flex-1 bg-green-200 hover:bg-green-300 text-green-600 font-medium py-1 rounded'>
                    Edit
                  </button>
                  <button
                  onClick={() => {
                    setOpenConfrimBoxDelete(true)
                    setDeleteCategory(category)
                  }}
                  className='flex-1 bg-red-200 hover:bg-red-300 text-red-600 font-medium py-1 rounded'>
                    Delete
                  </button>
                </div>
              </div>
            )
          })
        }
       </div>

        {
          openUploadCategory && (

            <UploadCategoryModel fetchData={fetchCategory} close={() =>setOpenUploadCategory(false)}/>
          )
        }

        {
          openEdit && (
            <EditCategory data={editData} close={() => setOpenEdit(false)} fetchData={fetchCategory}/>
          )
      } 

      {
        openConfrimBoxDelete && (
          <DeleteBox close={() => setOpenConfrimBoxDelete(false)} cancel={() => setOpenConfrimBoxDelete(false)}
           confirm={handleDeleteCategory}/>
        )
      }
    </section>
  )
}

export default CategoryPage