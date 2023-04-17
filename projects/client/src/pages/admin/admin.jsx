
import { useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { RiArrowDropDownLine, RiNotificationBadgeLine } from 'react-icons/ri'
import { AiOutlineSearch,AiOutlineMenu } from 'react-icons/ai'
import { Modal, Button } from 'flowbite-react'
import axios from 'axios'
import initialPP from '../../Assets/Blank_PP.jpg'

//import context
import { userData } from '../../data/userData'
import { TransactionData } from '../../data/transactionAdmin'

//import component
import SidebarAdmin from '../../components/sidebarAdmin/sidebaradmin'
import Loading from '../../components/loading/loading'
import TransactionDetail from './../../components/transaction/transactiondetail'

export default function Admin() {
    const { user, setUser } = useContext(userData)
    const { transaction } = useContext(TransactionData)

    let [profile, setProfile] = useState([]), [message, setMessage] = useState(''), [modal, setModal] = useState(false), [loading, setLoading] = useState(false)
    let [picture, setPicture] = useState(false)
    let navigate = useNavigate()
    let [tugel, setTugel] = useState(false)
    let [open, setOpen] = useState(false), [toogleMA,setToogleMA] = useState(false)

    let logout = () => {
        toast('Logout..', {
            style: {
                backgroundColor: 'black',
                color: 'white'
            }
        })
        setTimeout(() => {
            setUser({
                id: null,
                username: null
            })
            localStorage.removeItem('token')
            navigate('/login-admin')
        }, 2000)
    }

    let updateProfilePicture = async () => {
        try {
            if(profile.length==0) throw {message:'Please select image first'}
            let fd = new FormData()
            fd.append('images', profile[0])

            let data = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/admin/update-photo`, fd, {
                headers: {
                    "token": localStorage.getItem('token')
                }
            })
            toast.success('Update Profile Picture Success!', {
                style: {
                    background: "black",
                    color: 'white'
                }
            })

            setTimeout(() => {
                setModal(false)
                toast('loading...', {
                    duration: 2500
                })
            }, 2000)

            setTimeout(() => {
                window.location.reload(false)
            }, 3000)

        } catch (error) {
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    }


    let onImageValidation = (e) => {
        try {
            let files = [...e.target.files]
            setProfile(files)

            if (files.length !== 0) {
                files.forEach((value) => {
                    if (value.size > 1000000) throw { message: `${value.name} more than 1000 Kb` }
                    else { setMessage('') }
                })
            }

        } catch (error) {
            setMessage(error.message)
        }
    }


    useEffect(() => {
        if (!localStorage.getItem('token')) navigate('/page-not-found')
    }, [])


    return (
        user ?
            user.role ?
                <div>
                    {
                        transaction == null ?
                            null : <TransactionDetail />
                    }
                    <SidebarAdmin data={{ open, setOpen, toogleMA,setToogleMA }} />
                    <div className={`text-black ${open ? `lg:pl-60` : `lg:pl-20`} duration-300 flex flex-col`}>
                        {user.username ?
                            <div style={{ backgroundImage: `url(${process.env.REACT_APP_API_IMAGE_URL}Public/images/PIMG-1679298297754.jpeg)`, backgroundSize: 'cover' }} className='w-full flex justify-between fixed lg:relative z-10 p-5'>
                                    <div className='hidden lg:flex lg:flex-col lg:gap-1 lg:w-full text-white'>
                                        <p className='text-2xl font-semibold'>
                                            Welcome, Admin iFrit
                                        </p>
                                        <p className='opacity-70 ml-1'>
                                            All business in iFrit
                                        </p>
                                    </div>
                                    <button onClick={()=>setOpen(true)} className='lg:hidden text-white'>
                                        <AiOutlineMenu size={'23px'}/>
                                    </button>
                                  
                                <div className='flex items-center gap-6'>
                                    <button className='p-2 hover:bg-stone-200 rounded-full lg:text-black  text-white'>
                                        <RiNotificationBadgeLine size={'18px'} />
                                    </button>
                                    <button className=' p-2 hover:bg-stone-200 rounded-full lg:text-black text-white'>
                                        <AiOutlineSearch size={'20px'} />
                                    </button>
                                    <div className='relative group inline-block'>
                                        <button onBlur={() => setTugel(false)} onClick={() => setTugel(!tugel)} className='flex items-center '>
                                            <img src={user.photo_profile ? `${process.env.REACT_APP_API_IMAGE_URL}${user.photo_profile}` : initialPP} className="w-10 h-10 object-cover rounded-full" />
                                            <RiArrowDropDownLine color='gray' size={'28px'} />
                                        </button>
                                        <div className={`absolute ${tugel ? 'block' : 'hidden'} hover:block group-hover:block right-0 pt-1 z-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`} role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                                            <div className="py-1">
                                                <div className='px-4 py-2 font-semibold'>
                                                    {user.username}
                                                </div>
                                                <button className="text-gray-700 w-full text-start block px-4 py-2 hover:bg-violet-700 hover:text-white  text-sm" onClick={() => setPicture(!picture)}>
                                                    See Profile
                                                </button>
                                                <button onClick={() => setModal(!modal)} className=" text-gray-700 hover:bg-violet-700 hover:text-white block w-full px-4 py-2 text-left text-sm">
                                                    Change Profile Picture
                                                </button>
                                                <button onClick={() => logout()} className="text-gray-700 hover:bg-violet-700 hover:text-white block w-full px-4 py-2 text-left text-sm" role="menuitem" tabIndex="-1" id="menu-item-3">Sign out</button>
                                                <Modal
                                                    show={modal}
                                                    size="md"
                                                    popup={true}
                                                    onClose={() =>{
                                                        setProfile([])
                                                        setMessage('')
                                                        setModal(!modal)}}
                                                >
                                                    <Modal.Header />
                                                    <Modal.Body>
                                                        <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8 text-center">
                                                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                                                Change Profile Picture
                                                            </h3>
                                                            <input type="file" accept="image/*" onChange={(e) => onImageValidation(e)} className="w-full pr-3 border rounded-sm" />
                                                            <div className='text-red-500'>
                                                                {message}
                                                            </div>
                                                            <div className="w-full justify-center flex">
                                                                <Button
                                                                    disabled={message.length > 0 || loading == true}
                                                                    onClick={() => {
                                                                        setLoading(true)
                                                                        updateProfilePicture()
                                                                    }} className="active:ring-0 active:ring-transparent bg-neutral-900 hover:bg-neutral-700 rounded-sm">
                                                                    Submit
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Modal.Body>
                                                </Modal>

                                                <Modal
                                                    show={picture}
                                                    size="md"
                                                    popup={true}
                                                    onClose={() => setPicture(!picture)}
                                                >
                                                    <Modal.Header />
                                                    <Modal.Body className='flex items-center justify-center'>
                                                        <img src={`${process.env.REACT_APP_API_IMAGE_URL}${user.photo_profile?user.photo_profile:'Public/images/Blank_PP.jpg'}`} alt="" />
                                                    </Modal.Body>
                                                </Modal>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                        }
                        <Outlet />
                    </div>
                    <Toaster />
                </div>
                :
                navigate('/page-not-found')
            :
            <Loading />
    )
}