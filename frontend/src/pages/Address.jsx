import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAddress from '../components/AddAddress'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import EditAddress from '../components/EditAddress';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';
import SummaryApi from '../api/SummaryApi';
import toast from 'react-hot-toast';

const Address = () => {
  const addressList = useSelector(state => state.adresses.addressList)
  const [openAddress, setOpenAddress] = useState(false)
  const [OpenEdit, setOpenEdit] = useState(false)
  const [editData,setEditData] = useState({}) 
  const {fetchAddress} = useGlobalContext()

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: {
          _id: id
        }
      })
      if(response.data.success){
        toast.success("Address Removed")
        if(fetchAddress){
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
  return (
    <div>
      <div className='bg-green-100 shadow-md px-2 py-2 flex justify-between items-center gap-4'>
        <h2 className='font-semibold text-ellipsis line-clamp-1'>Address</h2>
        <button
         onClick={() => setOpenAddress(true)}
         className='border border-green-600 text-green-600 hover:bg-green-700 hover:text-white px-3 py-1 rounded text-sm'>
          Add Address
        </button>
      </div>
      <div className='bg-white p-2 grid gap-4'>
        {
          addressList.map((address,index) =>{
            return (
                <div key={index+"address"} className={`border rounded p-3 flex gap-3 hover:bg-blue-50 ${!address.status && 'hidden'}`}>
                      <div className='w-full'>
                        <p>{address.address_line}</p>
                        <p>{address.city}</p>
                        <p>{address.state}</p>
                        <p>{address.country}-{address.pincode}</p>
                        <p>{address.mobile}</p>
                      </div>    
                      <div className='grid gap-10'>
                        <button onClick={()=>{
                          setOpenEdit(true)
                          setEditData(address)
                        }} className='bg-green-200 p-1 rounded hover:bg-green-300 hover:text-white'>
                        <MdEdit size={20}/>
                        </button>
                        <button onClick={() =>{
                          handleDisableAddress(address._id)
                        }} className='bg-red-200 p-1 rounded hover:bg-red-300 hover:text-white'>
                        <MdDelete size={20}/>
                        </button>
                      </div>                                
                  </div>

            )
          })
        }
          <div onClick={()=>setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex items-center justify-center cursor-pointer'>
             Add address
          </div>
      </div>

      {
        openAddress && (
          <AddAddress close={() =>setOpenAddress(false)}/>
        )
      }

      {
        OpenEdit && (
          <EditAddress data={editData} close={() =>setOpenEdit(false)}/>
        )
      }
    </div>
  )
}

export default Address