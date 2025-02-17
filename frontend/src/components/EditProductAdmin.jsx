import React, { useState } from 'react'
import { LuUpload } from "react-icons/lu";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDeleteOutline } from "react-icons/md";
import { useSelector } from 'react-redux';
import { IoClose } from "react-icons/io5";
import AddFelidComponent from '../components/AddFelidComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../api/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';

const EditProductAdmin = ({close,data: propsData,fetchProductData}) => {
    const [data, setData] = useState({
        _id: propsData._id,
        name: propsData.name,
        image: propsData.image,
        category: propsData.category,
        subCategory: propsData.subCategory,
        unit: propsData.unit,
        stock: propsData.stock,
        price: propsData.price,
        discount: propsData.discount,
        description: propsData.description,
        more_details: propsData.more_details || {},
      })
      const [loading, setLoading] = useState(false)
      const [ViewImageUrl, setViewImageUrl] = useState('')
      const allCategory = useSelector(state => state.product.allCategory)
      const [selectCategory, setSelectCategory] = useState("")
      const [selectSubCategory, setSelectSubCategory] = useState("")
      const allSubCategory = useSelector(state => state.product.allSubCategory)
    
      const [openAddFeild, setOpenAddFeild] = useState(false)
      const [fieldName, setFieldName] = useState("")
    
      const handleChange = (e) => {
        const {name, value} = e.target
        setData((preve) =>{
          return {
          ...preve,
          [name]: value
          }
        })
      }
    
      const handleUploadImage = async (e) => {
        const file = e.target.files[0]
    
        if(!file){
          return
        }
        setLoading(true)
        const response = await uploadImage(file)
        const {data: ImageResponse} = response
        const imageUrl = ImageResponse.data.url
    
        setData((preve) => {
          return {
            ...preve,
            image: [...preve.image, imageUrl]
          }
        })
        setLoading(false)
        
      }
    
      const handleDeleteImage = async (index) => {
        data.image.splice(index, 1)
        setData((preve) =>{
          return {
            ...preve
          }
        })
      }
    
      const handleRemoveCategory = async (index) => {
        data.category.splice(index, 1)
        setData((preve) =>{
          return {
            ...preve
          }
        })
      }
    
      const handleRemoveSubCategory = async (index) => {
        data.subCategory.splice(index, 1)
        setData((preve) =>{
          return {
            ...preve
          }
        })
      }
    
      const handleAddField = () => {
        setData((preve) => {
          return {
            ...preve,
            more_details: {
              ...preve.more_details,
              [fieldName]: ""
            }
          }
        })
        setFieldName("")
        setOpenAddFeild(false)
      }
    
      const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          const response = await Axios({
            ...SummaryApi.updateProductDetails,
            data: data
          })
          const {data: responseData} = response
    
          if(responseData.success){
            successAlert(responseData.message)
            if(close){
                close()
            }
            fetchProductData()
            setData({
              name: "",
              image: [],
              category: [],
              subCategory: [],
              unit: "",
              stock: "",
              price: "",
              discount: "",
              description: "",
              more_details: {},
            })
          }
        } catch (error) {
          AxiosToastError(error)
    
        }
    
      }
  return (
    <section className='fixed top-0 right-0 left-0 bottom-0 bg-black z-50 bg-opacity-70 p-4'>
        <div className='bg-white w-full p-4 max-w-2xl mx-auto rounded overflow-y-auto h-full max-h-[95vh]'>
            <section>
            <div className='p-2 bg-green-100 shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Upload Product</h2>
            <button onClick={close}>
                <IoClose size={20}/>
            </button>
            </div>
            <div className='p-3'>
            <form className='grid gap-4' onSubmit={handleSubmit}>
                <div className='grid gap-1'>
                <label htmlFor='name' className='text-sm'>Name</label>
                <input
                    id='name'
                    type='text'
                    placeholder='Enter product name'
                    name='name'
                    value={data.name}
                    onChange={handleChange}
                    required
                    className='bg-blue-50 p-2 outline-none border focus-within:border-green-500 rounded'
                />
                </div>
                <div className='grid gap-1'>
                <label htmlFor='description' className='text-sm'>Description</label>
                <textarea
                    id='description'
                    type='text'
                    placeholder='Enter product description'
                    name='description'
                    value={data.description}
                    onChange={handleChange}
                    required
                    multiple
                    rows={3}
                    className='bg-blue-50 p-2 outline-none border focus-within:border-green-500 rounded resize-none'
                />
                </div>
                <div>
                <p className='text-sm'>Image</p>
                <div>
                    <label htmlFor='productImage' className='bg-gray-200 h-24 border flex justify-center items-center cursor-pointer'>
                    <div className='text-center flex justify-center items-center flex-col gap-2'>
                        {
                        loading ? <Loading /> : (
                            <>
                                <LuUpload size={25}/>
                                <p className='text-xs'>Upload Image</p>
                            </>
                        )
                        }
                        
                    </div>
                    <input
                    type='file'
                    id='productImage'
                    accept='image/*'
                    className='hidden'
                    onChange={handleUploadImage}
                    />
                    </label>
                    {/** Display images */}
                    <div className='my-2 flex flex-wrap gap-2'>
                    {
                        data.image.map((img,index) => {
                            return(
                            <div key={img+index} className='h-20 w-20 min-w-20 relative group'>
                                <img
                                src={img}
                                alt={img}
                                className='w-full h-full object-scale-down cursor-pointer'
                                onClick={() => setViewImageUrl(img)}
                                />
                                <div
                                onClick={() =>handleDeleteImage(index)}
                                className='absolute bottom-0 right-0 p-1 bg-red-500 hover:bg-red-600
                                rounded-full text-white cursor-pointer hidden group-hover:block'>
                                <MdDeleteOutline />
                                </div>
                            </div>
                            )
                        })
                    }
                    </div>
                </div>
                </div>
                <div className='grid gap-1'>
                <label className='text-sm'>Category</label>
                <div>
                    <select className='text-sm bg-blue-50 border w-full p-2 rounded outline-none'
                    value={selectCategory}
                    onChange={(e) => {
                    const value = e.target.value
                    const category = allCategory.find(el => el._id === value)

                    setData((preve) => {
                        return {
                        ...preve,
                        category: [...preve.category,category]
                        }
                    })
                    setSelectCategory("")
                    }}
                    >
                    <option value={""} >Select Category</option>
                    {
                        allCategory.map((c,index) => {
                        return(
                            <option value={c?._id}>{c.name}</option>
                        )
                        })
                    }
                    </select>
                    <div className='flex flex-wrap gap-3'>
                    {
                        data.category.map((c,index) => {
                        return(
                            <div key={c._id+index+"productsection"} className='text-xs flex items-center gap-2 bg-green-100 mt-2'>
                            <p>{c.name}</p>
                            <div
                            onClick={() => handleRemoveCategory(index)}
                            className='hover:text-red-500 cursor-pointer'>
                                <IoClose size={20}/>
                            </div>
                            </div>
                        )
                        })
                    }
                    </div>
                </div>
                </div>
                <div className='grid gap-1'>
                <label className='text-sm'>Sub Category</label>
                <div>
                    <select className='text-sm bg-blue-50 border w-full p-2 rounded outline-none'
                    value={selectSubCategory}
                    onChange={(e) => {
                    const value = e.target.value
                    const subCategory = allSubCategory.find(el => el._id === value)

                    setData((preve) => {
                        return {
                        ...preve,
                        subCategory: [...preve.subCategory,subCategory]
                        }
                    })
                    setSelectSubCategory("")
                    }}
                    >
                    <option value={""} >Select Sub Category</option>
                    {
                        allSubCategory.map((c,index) => {
                        return(
                            <option value={c?._id}>{c.name}</option>
                        )
                        })
                    }
                    </select>
                    <div className='flex flex-wrap gap-3'>
                    {
                        data.subCategory.map((c,index) => {
                        return(
                            <div key={c._id+index+"SubCategorySection"} className='text-xs flex items-center gap-2 bg-green-100 mt-2'>
                            <p>{c.name}</p>
                            <div
                            onClick={() => handleRemoveSubCategory(index)}
                            className='hover:text-red-500 cursor-pointer'>
                                <IoClose size={20}/>
                            </div>
                            </div>
                        )
                        })
                    }
                    </div>
                </div>
                </div>

                <div className='grid gap-1'>
                <label htmlFor='unit' className='text-sm'>Unit</label>
                <input
                    id='unit'
                    type='text'
                    placeholder='Enter product unit'
                    name='unit'
                    value={data.unit}
                    onChange={handleChange}
                    required
                    className='bg-blue-50 p-2 outline-none border focus-within:border-green-500 rounded'
                />
                </div>

                <div className='grid gap-1'>
                <label htmlFor='stock' className='text-sm'>Number of Stock</label>
                <input
                    id='stock'
                    type='number'
                    placeholder='Enter product stock'
                    name='stock'
                    value={data.stock}
                    onChange={handleChange}
                    required
                    className='bg-blue-50 p-2 outline-none border focus-within:border-green-500 rounded'
                />
                </div>

                <div className='grid gap-1'>
                <label htmlFor='price' className='text-sm'>Price</label>
                <input
                    id='price'
                    type='number'
                    placeholder='Enter product price'
                    name='price'
                    value={data.price}
                    onChange={handleChange}
                    required
                    className='bg-blue-50 p-2 outline-none border focus-within:border-green-500 rounded'
                />
                </div>

                <div className='grid gap-1'>
                <label htmlFor='discount' className='text-sm'>Discount</label>
                <input
                    id='discount'
                    type='number'
                    placeholder='Enter product discount'
                    name='discount'
                    value={data.discount}
                    onChange={handleChange}
                    required
                    className='bg-blue-50 p-2 outline-none border focus-within:border-green-500 rounded'
                />
                </div>
                
                <div>
                {
                    Object?.keys(data?.more_details)?.map((key,index) => {
                    return (
                        <div className='grid gap-1'>
                        <label htmlFor={key} className='text-sm'>{key}</label>
                        <input
                            id={key}
                            type='text'
                            value={data.more_details[key]}
                            onChange={(e) => {
                            const value = e.target.value
                            setData((preve) =>{
                                return {
                                ...preve,
                                more_details: {
                                    ...preve.more_details,
                                    [key]: value
                                }
                                }
                            })
                            }}
                            className='bg-blue-50 p-2 outline-none border focus-within:border-green-500 rounded resize-none'
                        />
                        </div>
                    )
                    })
                }
                </div>
                <div
                onClick={() => setOpenAddFeild(true)}
                className='inline-block bg-green-600 hover:bg-white border border-green-500
                py-1 px-3 w-32 font-semibold cursor-pointer rounded'>
                Add Feild
                </div>

                <button className='bg-green-500 hover:bg-green-600 hover:text-white py-2 rounded font-semibold'>
                Update Product
                </button>
            </form>
            </div>

            {
            ViewImageUrl && (
                <ViewImage url={ViewImageUrl} close={() =>setViewImageUrl("")}/>
            )
            }

            {
            openAddFeild && (
                <AddFelidComponent close={() =>setOpenAddFeild(false)}
                value={fieldName}
                onChange={(e) =>{
                setFieldName(e.target.value)
                }}
                submit={handleAddField}
                />
            )
            }
            </section>
        </div>
    </section>
  )
}

export default EditProductAdmin





