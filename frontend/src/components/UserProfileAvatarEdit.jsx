import React, { useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import SummaryApi from '../api/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { updateAvatar } from '../store/userSlice'
import { IoIosClose } from "react-icons/io";

const UserProfileAvatarEdit = ({close}) => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [loading,setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        
    }

    const handleUploadAvatar = async (e) => {
        const file = e.target.files[0]

        if(!file) {
            return
        }

        const formData = new FormData()
        formData.append('avatar',file)

        try{
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.uploadAvatar,
                data: formData,
    
            })
            const{ data: responseData} = response
            dispatch(updateAvatar(responseData.data.avatar))
        } catch (error) {
            AxiosToastError(error)
        } finally {

            setLoading(false)
        }
    }
  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-900
     bg-opacity-60 p-4 flex items-center justify-center'>
      <div className='bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center'>
        <button onClick={() => close(false)} className='text-neutral-700 w-fit block ml-auto'>
         <IoIosClose size={25}/>
        </button>
         <div className='w-16 h-16 bg-green-400 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
                {
                  user.avatar ? (
                    <img 
                      alt={user.name}
                      src={user.avatar}
                      className='w-full h-full'
                    />
                  ) : (
                    <FaUserCircle size={60}/>
                  )
                }
            </div>  
            <form onSubmit={handleSubmit}>
                <label htmlFor='uploadProfile'>
                    <div className='border border-black hover:bg-black
                    hover:text-white cursor-pointer px-4 py-1 text-sm my-3 rounded-full'>
                        {
                            loading ? "Uploading..." : "Upload"
                        }
                        
                     </div>
                </label>
                <input
                onChange={handleUploadAvatar}
                    type='file'
                    id='uploadProfile'
                    className='hidden'
                />
            </form>

           
      </div>  
    </section>
  )
}

export default UserProfileAvatarEdit