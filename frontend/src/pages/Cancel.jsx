import React from 'react'
import { Link } from 'react-router-dom'

const Cancel = () => {
  return (
    <div className='m-2 w-full max-w-md bg-red-200 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5'>
        <p className='text-red-800 font-bold text-lg text-center'> Order Cancel</p>
        <Link to={'/'} className='border border-red-600 px-4 py-1 text-red-600 hover:bg-red-700 hover:text-white transition-all'>Go to home</Link>
    </div>
  )
}

export default Cancel