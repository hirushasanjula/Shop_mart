import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../api/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';


const UploadSubCategoryModel = ({close,fetchData}) => {
    const [subCategoryData,setSubCategoryData] = useState({
        name: '',
        image: '',
        category : []
    })

    const allCategory = useSelector(state => state.product.allCategory)

    const handleChange = (e) => {
        const {name,value} = e.target
        setSubCategoryData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleUploadSubCategoryImage = async (e) => {
        const file = e.target.files[0]

        const response = await uploadImage(file);

        if (response.error) {
            toast.error(response.message || "Failed to upload image");
            return;
        }
    
        if (!response.data || !response.data.data) {
            toast.error("Invalid response from server");
            return;
        }
    
        setSubCategoryData((prev) => ({
            ...prev,
            image: response.data.data.url
        }));
    }

    const handleRemoveCategorySelected = (categoryId) => {
        const index = subCategoryData.category.findIndex(el => el._id === categoryId)
         subCategoryData.category.splice(index,1)
         setSubCategoryData((prev) => {
                return {
                    ...prev,
                    
                }
         })
    }

    const handleSubmitSubCategory = async (e) => {
        e.preventDefault()
        try {
            const response = await Axios({
                ...SummaryApi.createSubCategory,
                data: subCategoryData
            })

            const {data: responseData} = response

            if(responseData.success){
                toast.success(responseData.message)
                if(close){
                    close()
                }
                if(fetchData){
                    fetchData()
                }
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

  return (
    <section className='fixed top-0 right-0 bottom-0 left-0 bg-neutral-800 bg-opacity-70 z-50 flex items-center justify-center p-4'>
        <div className='w-full max-w-5xl bg-white p-4 rounded'>
           <div className='flex items-center justify-between gap-3'>
             <h1 className='font-semibold'>Add Sub Category</h1>
             <button onClick={close}>
                <IoClose size={25}/>
             </button>
           </div>
           <form className='my-4 grid gap-3' onSubmit={handleSubmitSubCategory}>
                <div className='grid gap-1'>
                    <label htmlFor='name' className='text-sm'>Name</label>
                    <input 
                    id='name'
                    name='name'
                    value={subCategoryData.name}
                    onChange={handleChange}
                    className='p-3 bg-blue-50 border outline-none focus-within:border-green-500 rounded'
                    />
                </div>
                <div className='grid gap-1'>
                    <p className='text-sm'> Image</p>
                    <div className='flex flex-col gap-3 lg:flex-row items-center'>
                        <div className='border h-36 w-full lg:w-36 bg-blue-50 flex items-center justify-center rounded'>
                            {
                                !subCategoryData.image ? (
                                    <p className='text-xs text-neutral-400'>No Image</p>
                                ) : (
                                    <img
                                        alt='subCategory'
                                        src={subCategoryData.image}
                                        className='w-full h-full object-scale-down'
                                    />
                                )
                            }
                        </div>
                        <label htmlFor='uploadSubCategoryImage'>
                            <div className='px-4 py-1 text-sm border border-green-600 text-green-600 rounded
                            hover:bg-green-600 hover:text-white cursor-pointer'>
                                Upload Image
                            </div>
                            <input
                             type='file'
                             id='uploadSubCategoryImage'
                             className='hidden'
                             onChange={handleUploadSubCategoryImage}
                            />
                        </label>
                        
                    </div>
                </div>
                <div className='grid gap-1'>
                    <label className='text-sm'>Select Category</label>
                        <div className='border focus-within:border-green-600 rounded'>
                        {/* diplay values from category */}
                            <div className='flex flex-wrap gap-2'>
                                {
                                    subCategoryData.category.map((category,index) => {
                                        return (
                                            <p key={category._id+"selectedValue"} className='bg-white shadow-md px-1 m-1 flex items-center gap-2 text-sm'>
                                                {category.name}
                                                <div className='cursor-pointer hover:text-red-500' onClick={() =>handleRemoveCategorySelected(category._id)}>
                                                    <IoClose size={20}/>
                                                </div>
                                            </p>
                                        )
                                    })
                                }
                            </div>
                        {/* select category */}
                        <select
                        className='w-full p-2 bg-transparent outline-none border text-sm'
                        onChange={(e) => {
                            const value = e.target.value
                            const categoryDetails = allCategory.find(el => el._id === value)
                            setSubCategoryData((preve) => {
                                return{
                                    ...preve,
                                    category: [...preve.category,categoryDetails]
                                }
                            })
                        }}
                        >
                            <option value={''}>Select Category</option>
                            {
                                allCategory.map((category,index) => {
                                    return (
                                        <option value={category?._id} key={category._id+"subCategory"}>{category?.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
                
                <button className={`px-4 py-2 border text-sm ${subCategoryData?.name && subCategoryData?.image && subCategoryData?.category[0]  ?
                 "bg-green-600 hover:bg-green-700 hover:text-white" : "bg-gray-200" }           
                    `}>
                    Submit
                </button>
           </form>
        </div>
    </section>
  )
}

export default UploadSubCategoryModel