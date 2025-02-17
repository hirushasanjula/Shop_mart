import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa";
import useMobile from '../hooks/useMobile';

const Search = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isSearchPage,setIsSearchPage] = useState(false)
    const [isMobile] = useMobile()
    const params = useLocation()
    const searchText = params.search.slice(3)

    useEffect(() => {
        const isSearch = location.pathname === '/search'
        setIsSearchPage(isSearch)
    },[location])


    const redirectToSearchPage = () => {
        navigate('/search')
    }

    const handleonChange = (e) => {
        const value = e.target.value

        const url = `/search?q=${value}`
        navigate(url)
    }

  return (
    <div className='w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12
     rounded-lg border p-1 overflow-hidden flex items-center text-neutral-500 bg-slate-50
     group focus-within:border-black'>
        <div>
            

            {
                (isMobile && isSearchPage) ? (
                    <Link to={'/'} className='flex justify-center items-center h-full p-2 m-1 text-neutral-600
                    group-focus-within:text-black bg-white rounded-full shadow-md'>
                        <FaArrowLeft size={20}/>
                    </Link>
                ) : (
                    <button className='flex justify-center items-center h-full p-3 text-neutral-600
                        group-focus-within:text-black'>
                        <IoSearch size={25}/>
                    </button> 
                )
            }

            
        </div>
        <div className='w-full h-full'>
            {
                !isSearchPage ? (
                    //not search page
                    <div onClick={redirectToSearchPage} className='w-full h-full flex items-center'>
                        <TypeAnimation
                        sequence={[
                            // Same substring at the start will only be typed out once, initially
                            'Search "food"',
                            1000, // wait 1s before replacing "Mice" with "Hamsters"
                            'Search "vegetable"',
                            1000,
                            'Search "fish"',
                            1000,
                            'Search "meats"',
                            1000
                        ]}
                        wrapper="span"
                        speed={50}
                        repeat={Infinity}
                        />
                    </div>
                ): (
                    // when i was search page
                    <div className='w-full h-full'>
                        <input 
                            type='text'
                            placeholder='Search for'
                            autoFocus={true}
                            defaultValue={searchText}
                            className='bg-transparent w-full h-full outline-none'
                            onChange={handleonChange}
                        />
                    </div>
                )
            }
        
       
        </div>
    </div>
  )
}

export default Search