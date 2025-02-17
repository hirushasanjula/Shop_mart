import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../api/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
    const [data,setData] = useState({
        email: '',
        password: '',
    })

    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const {name, value} = e.target

        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }


    const valideValue = Object.values(data).every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.login,
                data: data
            })

            if(response.data.error) {
                toast.error(response.data.error)
            }

            if(response.data.success) {
                toast.success(response.data.success)
                localStorage.setItem('accesstoken', response.data.accesstoken)
                localStorage.setItem('refreshtoken', response.data.refreshtoken)

                const userDetails = await fetchUserDetails()

                dispatch(setUserDetails(userDetails.data))

                setData({
                    email: '',
                    password: '',
                })
                navigate('/')
            }


        } catch (error) {
            AxiosToastError(error)
        }
    }

  return (
    <section className='w-full container mx-auto px-8'>
        <div className='bg-gray-100 my-4 w-full max-w-lg mx-auto rounded p-7'>
            <p className='text-2xl font-medium flex items-center justify-center'>Login</p>

            <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
                <div className='grid gap-1'>
                    <label htmlFor='email'>Email :</label>
                    <input
                        type='email'
                        id='email'
                        className='p-2 border rounded outline-none focus:border-blue-500'
                        name='email'
                        value={data.email}
                        onChange={handleChange}
                        placeholder='Enter your email'
                    />
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='password'>Password :</label>
                    <div className='p-2 border rounded flex items-center focus:border-blue-500'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id='password'
                            className='w-full outline-none'
                            name='password'
                            value={data.password}
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
                <Link to={'/forgot-password'} className='block ml-auto hover:text-green-700'>Forgot password ?</Link>

                <button disabled={!valideValue} className={`${valideValue ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500'}  text-white py-2 rounded-md font-semibold my-2 tracking-wide hover:bg-green-700 trans`}>
                    Login
                </button>
            </form>

            <p>
                Don't have account? 
                 <Link to={'/register'} className='font-semibold text-green-600 hover:text-green-700 px-1'>
                     Register
                 </Link>
            </p>
        </div>  
    </section>
  )
}

export default Login