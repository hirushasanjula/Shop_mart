import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../api/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const EditCategory = ({close,fetchData,data: CategoryData}) => {

  const [data, setData] = useState({
          _id : CategoryData._id,
          name: CategoryData.name,
          image: CategoryData.image,
      })
  
      const [loading, setLoading] = useState(false)
      
      const handleOnChange = (e) => {
          const {name, value} = e.target
  
          setData((preve) => {
              return {
                  ...preve,
                  [name]: value
              }
          })
      }

  const handlesubmit = async (e) => {
    e.preventDefault()
    
    try {
        setLoading(true)
        const response = await Axios({
            ...SummaryApi.updateCategory,
            data : data
        })
        const {data : responseData} = response

        if(responseData.success){
            toast.success(responseData.message)
            close()
            fetchData()
        }
    } catch (error) {
        AxiosToastError(error)
    } finally {
        setLoading(false)
    }
} 

  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;
    setLoading(true);
    const response = await uploadImage(file);
    setLoading(false);

    if (response.error) {
        toast.error(response.message || "Failed to upload image");
        return;
    }

    if (!response.data || !response.data.data) {
        toast.error("Invalid response from server");
        return;
    }

    setData((prev) => ({
        ...prev,
        image: response.data.data.url
    }));
};
  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 p-4 bg-slate-700 bg-opacity-60 flex items-center justify-center'>
            <div className='bg-green-100 max-w-4xl w-full p-4 rounded'>
                <div className='flex items-baseline justify-between'>
                    <h1 className='font-bold text-lg'>Update Category</h1>
                    <button onClick={close} className='w-fit block ml-auto'>
                    <IoClose size={25}/>
                    </button>
                </div>
                <form className='my-3 grid gap-2' onSubmit={handlesubmit}>
                    <div className='grid gap-1'>
                        <label id='categoryName' className='text-sm'>Name</label>
                        <input
                        type='text'
                        id='categoryName'
                        placeholder='Enter Category Name'
                        value={data.name}
                        name='name'
                        onChange={handleOnChange}
                        className='bg-blue-50 p-2 border-2 border-blue-200 focus-within:border-green-700 outline-none rounded-md'
                        />
                    </div>
                    <div className='grid gap-1'> 
                        <p className='text-sm'>Image</p>
                        <div className='flex gap-3 flex-col lg:flex-row items-center'>
                            <div className='border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded-sm'>
                                {
                                    data.image ? (
                                        <img
                                            alt='category'
                                            src={data.image}
                                            className='w-full h-full object-scale-down'
                                        />
                                    ) : (
    
                                        <p className='text-xs text-neutral-400'>No Image</p>
                                    )
                                }
                            </div>
                            <label htmlFor='uploadCategoryImage'>
                                <div className={`
                                     ${!data.name  ? 'bg-gray-300' : 'border-green-500  bg-white hover:bg-green-500 hover:text-white transition-all'} 
                                    px-4 py-2 border-2 rounded text-sm text-black cursor-pointer 
                                    `}>
                                      {
                                        loading ? 'Loading...' : 'Upload Image'
                                      }
                                        
                                </div>
                                <input
                                disabled={!data.name}
                                 onChange={handleUploadCategoryImage}
                                 type='file' className='text-xs hidden' id='uploadCategoryImage'/>
                            </label>
                            
                        </div>
                    </div>
    
                    <button className={
                        `
                        ${data.name && data.image ? 'bg-green-500' : 'bg-gray-300'}
                        py-2 hover:bg-green-600 hover:text-white
                        `
                    }
                    
                    >
                        Update Category
                    </button>
                </form>
            </div>
        </section>
  )
}

export default EditCategory