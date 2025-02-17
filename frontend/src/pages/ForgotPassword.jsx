import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../api/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [data,setData] = useState({
        email: '',
    })

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

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data: data
            })

            if(response.data.error) {
                toast.error(response.data.error)
            }

            if(response.data.success) {
                toast.success(response.data.success)
                navigate('/verfication-otp',{
                    state: data
                })
                setData({
                    email: '',
                })
                
            }


        } catch (error) {
            AxiosToastError(error)
        }
    }

  return (
    <section className='w-full container mx-auto px-8'>
        <div className='bg-gray-100 my-4 w-full max-w-lg mx-auto rounded p-7'>
            <p className='font-semibold text-2xl flex justify-center'>Forgot Password</p>
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
                
                <button disabled={!valideValue} className={`${valideValue ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500'}  text-white py-2 rounded-md font-semibold my-2 tracking-wide hover:bg-green-700 trans`}>
                    Send Otp
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

export default ForgotPassword