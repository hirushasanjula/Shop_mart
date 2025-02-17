import React, { useEffect, useRef, useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../api/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';


const OtpVerification = () => {
    const [data,setData] = useState(['','','','','',''])
    const navigate = useNavigate()
    const inputRef = useRef([])
    const location = useLocation()

    console.log('location', location)

    useEffect(() => {
        if(!location?.state?.email){
            navigate('/forgot-password')
        }
    },[])

    const valideValue = data.every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data: {
                    otp: data.join(''),
                    email: location?.state?.email
                }
            })

            if(response.data.error) {
                toast.error(response.data.error)
            }

            if(response.data.success) {
                toast.success(response.data.success)
                setData(['','','','','',''])
                navigate('/reset-password',{
                    state: {
                        data: response.data,
                        email: location?.state?.email
                    }
                })
            }


        } catch (error) {
            AxiosToastError(error)
        }
    }

  return (
    <section className='w-full container mx-auto px-8'>
        <div className='bg-gray-100 my-4 w-full max-w-lg mx-auto rounded p-7'>
            <p className='font-semibold text-2xl flex justify-center'>Enter OTP</p>
            <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
                <div className='grid gap-1'>
                    <label htmlFor='otp-0'>Enter Your OTP :</label>
                    <div className='flex items-center gap-2 justify-between mt-3'>
                        {
                            data.map((element, index) => {
                                return (
                                    <input
                                        key={"otp"+index}
                                        type='text'
                                        id={`otp-${index}`} 
                                        ref={(ref) => {
                                            inputRef.current[index] = ref
                                            return ref
                                        }}  
                                        value={data[index]}
                                        onChange={(e) => {
                                            const value = e.target.value

                                            const newData = [...data]
                                            newData[index] = value
                                            setData(newData)

                                            if(value && index < 5) {
                                                inputRef.current[index+1].focus()
                                            }
                                        }}
                                        maxLength={1}
                                        className='p-2 border w-full max-w-16
                                         rounded outline-none focus:border-blue-500 text-center font-semibold'
                                    />
                                )
                            })
                        }
                    </div>
                </div>
                
                <button disabled={!valideValue} className={`${valideValue ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500'}  text-white py-2 rounded-md font-semibold my-2 tracking-wide hover:bg-green-700 trans`}>
                    Verify OTP
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

export default OtpVerification