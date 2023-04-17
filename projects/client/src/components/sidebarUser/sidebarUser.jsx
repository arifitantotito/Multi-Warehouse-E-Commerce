import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import { useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { userData } from '../../data/userData'
import { toast, Toaster } from "react-hot-toast";
import { Accordion } from 'flowbite-react'

export default function Sidebar(props) {

    let navigate = useNavigate()
    const { user, setUser } = useContext(userData)

    const [showContent, setShowContent] = useState(0)

    let showAccordion = (id) => {
        // console.log(id)
        if (showContent != id) {
            setShowContent(id)
        } else if (showContent == 0) {
            setShowContent(id)
        } else if (showContent) {
            setShowContent(0)
        }
    }

    let logout = () => {
        toast('Logout..', {
            style: {
                backgroundColor: 'black',
                color: 'white'
            }
        })
        setTimeout(() => {
            localStorage.removeItem('token')
        }, 2000)

        setTimeout(() => {
            window.location.reload(false)
        }, 2000)
    }

    return (
        <>
            <div className='mx-3 min-h-max  pt-5'>

                {
                    props.data.category.map((value, index) => {
                        return (
                            <>
                                <div className='z-20 '>
                                    <button onClick={() => showAccordion(value.id)} className="flex w-full items-center justify-between px-4 py-2 text-left  font-medium text-white">
                                        <p className='text-base md:text-xl'>{value.name}</p>
                                        <MdOutlineKeyboardArrowDown className={!showContent ? 'rotate-180 transform' : ''} />
                                    </button>
                                    {
                                        showContent == value.id ?
                                            value.products.map((val, idx) => {
                                                return (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                props.data.setMemory([])
                                                                props.data.setSelected(0)
                                                                props.data.setLoadingPage(true)
                                                                props.func.getProductDetail(val.id)
                                                                navigate(`/product/productdetail/${val.id}`)
                                                                props.data.setShowSidebar(false)
                                                            }}
                                                            className="w-full flex justify-start px-4 py-2 text-base md:text-xl text-white font-light ">
                                                            {val.name}
                                                        </button>
                                                        {
                                                            idx + 1 == value.products.length ?

                                                                <button
                                                                    onClick={() => {
                                                                        navigate(`/product/${value.id}`)
                                                                        props.data.setShowSidebar(false)
                                                                    }}
                                                                    className="w-full flex justify-start px-4 py-2 text-lg text-white font-light ">
                                                                    View All
                                                                </button>
                                                                :
                                                                null
                                                        }
                                                    </>
                                                )
                                            })
                                            :
                                            null
                                    }
                                </div>
                            </>
                        )
                    })
                }

                <div className=' border-y md:border-y-2 border-white mt-5'>
                    {
                        localStorage.getItem('token') ?
                            <div className='py-2'>
                                <p className='text-sm md:text-xl px-3 font-normal'>Profile</p>
                                <button onClick={() => {
                                    navigate('/my-account')
                                    props.data.setShowSidebar(false)
                                }}>
                                    <p className='text-base md:text-xl font-medium px-3'>{user.username}</p>
                                </button>
                                {
                                    !localStorage.getItem('token') ?
                                        null :
                                        <div className=''>
                                            <button onClick={() => logout()} className='text-sm md:text-xl font-normal px-3'>
                                                Logout
                                            </button>
                                        </div>
                                }
                            </div>
                            :
                            <div className='py-2'>
                                <button onClick={() => {
                                    navigate('/login')
                                    props.data.setShowSidebar(false)
                                }}>
                                    <p className='text-base md:text-xl font-medium px-3 py-2'>Login or Register</p>
                                </button>
                            </div>
                    }
                </div>

                <div>
                    <div className='border-b md:border-b-2 border-white pb-2 md:pb-3 md:pt-1'>
                        <button className='text-sm md:text-xl font-normal px-3'>
                            Event & Promo
                        </button>
                    </div>
                    <div className='border-b md:border-b-2 border-white pb-2 md:pb-3 md:pt-1'>
                        <button className='text-sm md:text-xl font-normal px-3'>
                            Business
                        </button>
                    </div>
                    <div className='border-b md:border-b-2 border-white pb-2 md:pb-3 md:pt-1'>
                        <button className='text-sm md:text-xl font-normal px-3'>
                            Services
                        </button>
                    </div>
                </div>

            </div>
        </>
    )
}