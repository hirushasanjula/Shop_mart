import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../api/SummaryApi'
import DisplayTable from '../components/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/ViewImage'
import { LuPencil } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditSubCategory from '../components/EditSubCategory'
import DeleteBox from '../components/DeleteBox'
import toast from 'react-hot-toast'


const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const columnHelper = createColumnHelper()
  const [ImageUrl, setImageUrl] = useState('')
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({
    _id : '',
  })
  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id : ""
  })
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false)

  const fetchSubCategory = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getSubCategory
      })
      const {data: responseData} = response
      
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
    fetchSubCategory()
  },[])

  const column = [
    columnHelper.accessor('name',{
      header : "Name"
    }),
    columnHelper.accessor('image',{
      header : "Image",
      cell : ({row}) => {
        return <div className='flex justify-center items-center'>
            <img 
          src={row.original.image}
          alt={row.original.name}
          className='w-9 h-9 cursor-pointer'
          onClick={() => {
            setImageUrl(row.original.image)
          }}
          />
        </div>
      }
    }),
    columnHelper.accessor("category",{
      header : "Category",
      cell : ({row}) => {
        return (
          <p>
            {
              row.original.category.map((c,index) => {
                return(
                  <p key={c._id+"table"} className='shadow-md px-1 inline-block'>{c.name}</p>
                )
              })
            }
          </p>
        )
      }
    }),
    columnHelper.accessor("_id",{
      header : "Action",
      cell : ({row}) => {
        return (
          <div className='flex justify-center items-center gap-3'>
            <button onClick={() =>{
              setOpenEdit(true)
              setEditData(row.original)
            }} className='p-2 bg-green-200 rounded-full hover:text-green-600'>
              <LuPencil size={20}/>
            </button>
            <button onClick={() =>{
              setOpenDeleteConfirmation(true)
              setDeleteSubCategory(row.original)
            }} className='p-2 bg-red-200 rounded-full text-red-500 hover:text-red-600'>
              <RiDeleteBin6Line size={20}/>
            </button>
          </div>
        )
      }
    })
  ]

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data : deleteSubCategory
      })

      const {data: responseData} = response

      if(responseData.success){
        toast.success(responseData.message)
        fetchSubCategory()
        setOpenDeleteConfirmation(false)
        setDeleteSubCategory({_id : ""})
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section>
        <div className='p-2 bg-green-100 shadow-md flex items-center justify-between'>
          <h2 className='font-semibold'>Sub Category</h2>
          <button
          onClick={() =>setOpenAddSubCategory(true)}
           className='text-xs border-2 border-green-600 hover:bg-green-600 hover:text-white px-3 py-1 rounded-md'>
            Add Sub Category
          </button>
        </div>

        <div className='overflow-auto w-full max-w-[95vw]'>
          <DisplayTable 
          data ={data}
          column={column}
          />
        </div>

        {
          openAddSubCategory && (
            <UploadSubCategoryModel 
            close={() =>setOpenAddSubCategory(false)}
            fetchData={fetchSubCategory}
            />
          )
        }

        {
          ImageUrl &&
          <ViewImage url={ImageUrl} close={() => setImageUrl('')}/>
        }

        {
          openEdit &&
          <EditSubCategory
           data={editData}
            close={() =>setOpenEdit(false)}
            fetchData={fetchSubCategory}
            />
        }

        {
          openDeleteConfirmation && (
            <DeleteBox 
            cancel={() =>setOpenDeleteConfirmation(false)}
            close={() =>setOpenDeleteConfirmation(false)}
            confirm={handleDeleteSubCategory}
            />
          )
        }
    </section>
  )
}

export default SubCategoryPage