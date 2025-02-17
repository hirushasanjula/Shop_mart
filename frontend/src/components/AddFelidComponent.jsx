import React from 'react'
import { IoClose } from "react-icons/io5";

const AddFelidComponent = ({close,value,onChange,submit}) => {
  return (
    <section className='fixed top-0 bottom-0 right-0 left-0 bg-neutral-900 opacity-70 z-50 flex justify-center items-center p-4'>
        <div className='bg-white rounded p-4 w-full max-w-md'>
            <div className='flex items-center justify-between gap-3'>
                <h1 className='font-semibold'>Add Feild</h1>
                <button onClick={close}>
                    <IoClose size={20}/>
                </button>
            </div>
            <input
            className='bg-blue-50 p-2 my-3 border outline-none focus-within:border-green-500 rounded w-full'
            placeholder='Enter Feild Name'
            value={value}
            onChange={onChange}
            />
            <button
            onClick={submit}
             className='bg-green-500 px-4 py-2 rounded mx-auto w-fit block hover:bg-green-700 hover:text-white'
             >
                Add Feild
            </button>
        </div>
    </section>
  )
}

export default AddFelidComponent