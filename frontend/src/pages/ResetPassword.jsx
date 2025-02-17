import React, { useEffect, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SummaryApi from '../api/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState({
      email: '',
      newPassword: '',
      confirmPassword: '',
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfrimPassword, setShowConfrimPassword] = useState(false)

    const valideValue = Object.values(data).every(el => el)

    useEffect(() => {
        if(!(location?.state?.data?.success)) {
            navigate('/')
        }

        if(location?.state?.email) {
          setData((preve) => {
            return {
              ...preve,
              email: location?.state?.email
            }
          })
        }
    },[])


    const handleChange = (e) => {
      const {name, value} = e.target

      setData((prev) => {
          return {
              ...prev,
              [name]: value
          }
      })
  }

    console.log("data reset password", data)

    const handleSubmit = async (e) => {
      e.preventDefault()

      if(data.newPassword !== data.confirmPassword) {
        toast.error('NewPassword and ConfirmPassword must be same')
      }

      try {
          const response = await Axios({
              ...SummaryApi.resetPassword,
              data: data
          })

          if(response.data.error) {
              toast.error(response.data.error)
          }

          if(response.data.success) {
              toast.success(response.data.success)
              navigate('/login')
                  setData: ({
                    email: '',
                    newPassword: '',
                    confirmPassword: '',
              })
              
          }


      } catch (error) {
          AxiosToastError(error)
      }
  }


  return (
    <section className='w-full container mx-auto px-8'>
        <div className='bg-gray-100 my-4 w-full max-w-lg mx-auto rounded p-7'>
            <p className='font-semibold text-2xl flex justify-center'>Enter your New Password</p>
            <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                      <label htmlFor='newPassword'>New Password :</label>
                        <div className='p-2 border rounded flex items-center focus:border-blue-500'>
                          <input
                          type={showPassword ? 'text' : 'password'}
                          id='password'
                          className='w-full outline-none'
                          name='newPassword'
                          value={data.newPassword}
                          onChange={handleChange}
                          placeholder='Enter your password'
                          />
                            <div onClick={() => setShowPassword(prev => !prev)} className='cursor-pointer'>
                              {
                                showPassword ? (
                                  <FaRegEye />
                                  ) : (
                                 <FaRegEyeSlash />
                                  )
                              }
                                                
                          </div>
                        </div>
                      </div>

                      <div className='grid gap-1'>
                      <label htmlFor='confirmPassword'>Confrim Password :</label>
                        <div className='p-2 border rounded flex items-center focus:border-blue-500'>
                          <input
                          type={showConfrimPassword ? 'text' : 'password'}
                          id='password'
                          className='w-full outline-none'
                          name='confirmPassword'
                          value={data.confirmPassword}
                          onChange={handleChange}
                          placeholder='Enter your confrim password'
                          />
                            <div onClick={() => setShowConfrimPassword(prev => !prev)} className='cursor-pointer'>
                              {
                                showConfrimPassword ? (
                                  <FaRegEye />
                                  ) : (
                                 <FaRegEyeSlash />
                                  )
                              }
                                                
                          </div>
                            </div>
                      </div>
                
                <button disabled={!valideValue} className={`${valideValue ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500'}  text-white py-2 rounded-md font-semibold my-2 tracking-wide hover:bg-green-700 trans`}>
                    Change Password
                </button>
            </form>

            <p>
                Already have an account?
                 <Link to={'/login'} className='font-semibold text-green-600 hover:text-green-700 px-1'>
                     Login
                 </Link>
            </p>
        </div>  
    </section>
  )
}

export default ResetPassword