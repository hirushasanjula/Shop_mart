import React from 'react'
import banner from '../assets/b1.jpg'
import bannermobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { validURLConverter } from '../utils/validurl'
import {  useNavigate } from 'react-router-dom'
import CategoryProductDisplay from '../components/CategoryProductDisplay'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListpage = (id,cat) => {
    console.log(id,cat)
    const subcategory = subCategoryData.find(sub =>{
      const filterData = sub.category.some(c => {
        return c._id == id
      })

      return filterData ? true : null
    })
    const url = `/${validURLConverter(cat)}-${id}/${validURLConverter(subcategory.name)}-${subcategory._id}`

    console.log(url)
    navigate(url)
  }
  return (
    <section>
      <div className='container mx-auto rounded my-6 px-8'>
        <div className={`w-full h-full min-h-48 flex items-center justify-center ${!banner && "animate-pulse"} `}>
          <img
            src={banner}
            className='w-[1000px] h-[400px] rounded hidden lg:block'
            alt='banner'
            />
          <img
            src={bannermobile}
            className='w-[1000px] h-[400px] rounded lg:hidden'
            alt='banner'
            />
        </div>
      </div>

      <div className='container mx-auto px-4 my-2 grid grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-2'>
        {
          loadingCategory ? (
            new Array(12).fill(null).map((c,index) =>{
              return(
                <div key={index+"loadingCategory"} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow-md animate-pulse'>
                  <div className='bg-green-100 min-h-24 rounded'></div>
                    <div className='bg-green-100 h-8 rounded'></div>
  
                </div>
              )
            })
          ) : (
            categoryData.map((cat,index) => {
              return (
                <div key={cat._id+"displayCategory"} className='w-full h-full' onClick={() =>handleRedirectProductListpage(cat._id,cat.name)}>
                  <div>
                    <img
                    src={cat.image}
                    className='w-full h-full object-scale-down'
                    />
                  </div>
              </div>
              )
            })
            
          )
         
        }
      </div>

      {/** display category product */}
      {
        categoryData.map((c,index) => {
          return(
            <CategoryProductDisplay key={c?._id+"CategoryProductDisplay"} id={c?._id} name={c?.name}/>
          )
        })
      }

    </section>
  )
}

export default Home