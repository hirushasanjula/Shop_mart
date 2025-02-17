import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { IoCartSharp } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu';
import { DisplayPrice } from '../utils/DisplayPrice';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';



function Header() {
    const [isMobile] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === '/search'
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const cartItem = useSelector((state) => state?.cartItem.cart)
   // const [totalPrice, setTotalPrice] = useState(0) 
    //const [totalQty, setTotalQty] = useState(0)
    const {totalPrice,totalQty} = useGlobalContext()
    const [openCartSection, setOpenCartSection] = useState(false)

    const redirectToLoginPage = () => {
        navigate('/login')
    }

    const handleCloseUserMenu = () => {
        setOpenUserMenu(false)
    }

    const handleMobileUser = () => {
        if(!user?._id) {
            navigate('/login')
            return
        }

        navigate('/user')
    }

    //total cart item
    /*useEffect(() => {
        const qty = cartItem.reduce((preve,curr) =>{
            return preve + curr.quantity
        },0)
        setTotalQty(qty)

        const tPrice = cartItem.reduce((preve,curr) =>{
            return preve + (curr.productId.price * curr.quantity)
        },0)
        setTotalPrice(tPrice)
    },[cartItem])*/

  return (
    <header className='h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1'>
        {
            !(isSearchPage && isMobile) && (
                <div className='container mx-auto flex items-center  px-4 justify-between'>
                {/**Logo */}
                <div>
                    <Link to={"/"}>
                        <img 
                            src={logo}
                            width={100}
                            height={100}
                            alt='logo'
                            className='hidden lg:block'
                        />
                        <img 
                            src={logo}
                            width={70}
                            height={70}
                            alt='logo'
                            className='lg:hidden'
                        />
                    </Link>
                </div>


                {/**Search Bar */}
                <div className='hidden lg:block'>
                    <Search />
                </div>



                {/**login and cart mobile */} 
                <div className=''>
                    <button className='text-stone-600 lg:hidden' onClick={handleMobileUser}>
                        <FaRegCircleUser size={25}/>
                    </button>

                    {/**login and cart desktop */}
                    <div className='hidden lg:flex items-center gap-10'>
                        {
                            user?._id ? (
                                <div className='relative flex cursor-pointer'>
                                    <div onClick={() => setOpenUserMenu(preve => !preve)} className='flex items-center gap-1'>
                                        <p>Account</p>
                                        {
                                            openUserMenu ? (
                                                <GoTriangleUp size={24}/> 
                                            ) : (

                                                <GoTriangleDown size={24}/>
                                            )
                                        }
                                        
                                    </div>
                                    {
                                        openUserMenu && (
                                        <div className='absolute right-0 top-12'>
                                            <div className='bg-gray-100 rounded p-4 min-w-52 lg:shadow-lg'>
                                                <UserMenu close={handleCloseUserMenu}/>
                                            </div>
                                        </div>
                                        )
                                    }
                                    
                                </div>
                            ) : (

                            <button onClick={redirectToLoginPage} className='text-lg px-2'>
                                Login
                            </button>
                            )
                        }
                        <button
                        onClick={()=>setOpenCartSection(true)}
                         className='flex items-center gap-2 bg-green-700 hover:bg-green-800 px-3 py-2 rounded-md text-white'>
                            {/** add to cart icon */}
                            <div className='animate-bounce'>
                                <IoCartSharp size={25}/>
                            </div>
                            <div className='font-semibold'>
                                {
                                    cartItem[0] ? (
                                        <div>
                                            <p className='text-sm'>{totalQty} Items</p>
                                            <p className='text-sm'>{DisplayPrice(totalPrice)}</p>
                                        </div>
                                    ) : (
                                        <p>My Cart</p>
                                    )
                                }
                                
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            )
        }
      
    <div className='container mx-auto px-12 lg:hidden'>
        <Search />
    </div>

    {
        openCartSection && (
            <DisplayCartItem close={() =>setOpenCartSection(false)}/>
        )
    }
    </header>
  )
}

export default Header