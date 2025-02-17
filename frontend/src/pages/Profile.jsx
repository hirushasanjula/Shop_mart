import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../api/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';

const Profile = () => {
  const user = useSelector(state => state.user)
  const [openProfileAvatarEdit,setProfileAvatarEdit] = useState(false)
  const [userData,setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile
  })
  const [loading,setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile
    })
  },[user])

  const handleOnChange = (e) => {
    const {name,value} = e.target

    setUserData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData
      })

      const { data: responseData } = response

      if(responseData.success) {
        toast.success(responseData.message)
        const userData = await fetchUserDetails()
        dispatch(setUserDetails(userData.data))
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-4'>
      {/* profile upload and display image*/}
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
      <button onClick={() => setProfileAvatarEdit(true)} className='text-xs min-w-20 border border-black hover:bg-black
       hover:text-white  px-3 py-1 rounded-full mt-3'>
        Change
      </button>

      {
        openProfileAvatarEdit && (
          <UserProfileAvatarEdit close={setProfileAvatarEdit}/>
        )
      }

      {/* profile details */}
      <form className='my-4 grid gap-4' onSubmit={handleSubmit}>
        <div className='grid'>
          <label>Name</label>
          <input
           type='text'
           placeholder='Enter your name'
           className='p-2 outline-none border hover:border-black rounded'
           value={userData.name}
            name='name'
           onChange={handleOnChange}
           required
          />
        </div>
        <div className='grid'>
          <label htmlFor='email'>Email</label>
          <input
           type='email'
           id='email'
           placeholder='Enter your email'
           className='p-2 outline-none border hover:border-black rounded'
           value={userData.email}
            name='email'
           onChange={handleOnChange}
           required
          />
        </div>
        <div className='grid'>
          <label htmlFor='mobile'>Mobile</label>
          <input
           type='number'
           id='mobile'
           placeholder='Enter your mobile'
           className='p-2 outline-none border hover:border-black rounded'
           value={userData.mobile}
            name='mobile'
           onChange={handleOnChange}
           required
          />
        </div>

        <button className='border px-4 py-2 font-semibold border-black hover:bg-black hover:text-white rounded'>

          {
            loading ? "Loading..." : "Submit"
          }
        </button>
      </form>
    </div>
  )
}

export default Profile