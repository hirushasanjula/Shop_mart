import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const user = useSelector(state => state.user)

  
  return (
    <section className='bg-slate-100'>
            <div className='container mx-auto p-3 grid lg:grid-cols-[250px,1fr]'>
                {/** left menu */}
                <div className='py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-auto hidden lg:block border-r'>
                    <UserMenu />
                </div>




                {/** right content */}
                <div className='p-4 min-h-[70vh]'>
                    <Outlet />
                </div>
            </div>
    </section>
  )
}

export default Dashboard