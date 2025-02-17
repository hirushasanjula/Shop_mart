import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../api/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [data,setData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()

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

            if(data.password !== data.confirmPassword){
                toast.error('Password and Confirm Password do not match')
        }
        
        try {
            const response = await Axios({
                ...SummaryApi.register,
                data: data
            })

            if(response.data.error) {
                toast.error(response.data.error)
            }

            if(response.data.success) {
                toast.success(response.data.success)
                setData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                })
                navigate('/login')
            }


        } catch (error) {
            AxiosToastError(error)
        }
    }

  return (
    <section className='w-full container mx-auto px-8'>
        <div className='bg-gray-100 my-4 w-full max-w-lg mx-auto rounded p-7'>
            <p>Welcome to ShopMart</p>

            <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
                <div className='grid gap-1'>
                    <label htmlFor='name'>Name :</label>
                    <input
                        type='text'
                        id='name'
                        autoFocus
                        className='p-2 border rounded outline-none focus:border-blue-500'
                        name='name'
                        value={data.name}
                        onChange={handleChange}
                        placeholder='Enter your name'
                    />
                </div>
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

                <div className='grid gap-1'>
                    <label htmlFor='confirmPassword'>ConfirmPassword :</label>
                    <div className='p-2 border rounded flex items-center focus:border-blue-500'>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id='confirmPassword'
                            className='w-full outline-none'
                            name='confirmPassword'
                            value={data.confirmPassword}
                            onChange={handleChange}
                            placeholder='Enter your password again'
                        />
                        <div onClick={() => setShowConfirmPassword(prev => !prev)} className='cursor-pointer'>
                            {
                                showConfirmPassword ? (
                                    <FaRegEye />
                                ) : (
                                    <FaRegEyeSlash />
                                )
                            }
                            
                        </div>
                    </div>
                </div>

                <button disabled={!valideValue} className={`${valideValue ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500'}  text-white py-2 rounded-md font-semibold my-2 tracking-wide hover:bg-green-700 trans`}>
                    Register
                </button>
            </form>

            <p>
                Already have account ?
                 <Link to={'/login'} className='font-semibold text-green-600 hover:text-green-700 px-1'>
                     Login
                 </Link>
            </p>
        </div>  
    </section>
  )
}

export default Register