import React from 'react'
import noDataImage from '../assets/nodata.png'

const NoData = () => {
  return (
    <div className='flex flex-col items-center justify-center py-4'>
        <img 
        src={noDataImage}
        alt='No Data'
        className='w-36'
        />
        <p className='text-neutral-600'>No Data</p>
    </div>
  )
}

export default NoData