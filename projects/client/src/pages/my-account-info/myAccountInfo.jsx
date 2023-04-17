import axios from "axios"
import { useContext, useEffect, useRef, useState } from "react"
import { toast, Toaster } from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

import { Modal, Button } from 'flowbite-react'

import { userData } from '../../data/userData'
import Loading from "../../components/loading/loading"

export default function MyAccountInfo() {

    let navigate = useNavigate()

    const { user, setUser } = useContext(userData)

    const [disable, setDisable] = useState(false)
    const [message, setMessage] = useState('')
    const [profile, setProfile] = useState({
        name: '',
        phone_number: '',
        email: '',
        oldpassword: '',
        newpassword: '',
        newconfirmpassword: '',
        photo_profile: []
    })
    const [visible, setVisible] = useState({
        password: false,
        oldPassword: false,
        newPassword: false,
        newConfirmPassword: false,
        check: false
    })
    const [modal, setModal] = useState(false)
    const [inputPassword, setInputPassword] = useState()
    const [disablePicture, setDisablePicture] = useState(false)

    let getProfile = async () => {
        try {
            let { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/keep-login`, {
                headers: {
                    "token": localStorage.getItem('token')
                }
            })
            setProfile({ ...profile, name: data.data.name, phone_number: data.data.phone_number, email: data.data.email, photo_profile: data.data.photo_profile })

        } catch (error) {
        }
    }

    let onImageValidation = (e) => {
        try {
            let files = [...e.target.files]
            setProfile({ ...profile, photo_profile: files })

            if (files.length === 0) {
                setDisablePicture(true)
            } else {
                setDisablePicture(false)
            }

            if (files.length !== 0) {
                files.forEach((value) => {
                    if (value.size > 1000000) throw { message: `${value.name} more than 1000 Kb` }
                })
            }
            setMessage('')
        } catch (error) {
            setMessage(error.message)
        }
    }

    let updateProfilePicture = async () => {
        try {
            if(profile.photo_profile.length==0) throw {message:'Please select image first'}
            let fd = new FormData()
            fd.append('images', profile.photo_profile[0])
            let data = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/photo_profile`, fd, {
                headers: {
                    token: localStorage.getItem('token')
                }
            })

            toast.success('Update Profile Picture Success!', {
                style: {
                    background: "black",
                    color: 'white'
                }
            })

            setTimeout(() => {
                toast('Loading...', {
                    duration: 2500
                })
            }, 2000)

            setTimeout(() => {
                window.location.reload(false)
            }, 3000)

            setDisablePicture(false)
        } catch (error) {
            toast.error(error.message)
            setDisablePicture(false)
        }
    }

    let updateDataProfile = async () => {
        try {

            if (isNaN(profile.phone_number)) throw { message: 'Please input a number' }

            if (profile.phone_number.length < 8 || profile.phone_number.length > 13) throw { message: 'Please input valid phone number' }

            setDisable(true)

            if (profile.name && profile.phone_number && !profile.oldpassword && !profile.newpassword) {

                await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/users/data_profile`, { name: profile.name, phone_number: profile.phone_number }, {
                    headers: {
                        token: localStorage.getItem('token')
                    }
                })
            } else if (profile.name && profile.phone_number && profile.oldpassword && profile.newpassword) {

                if (profile.newpassword.length < 8) throw { message: 'Password at least has 8 characters' }

                let character = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
                if (!character.test(profile.newpassword)) throw { message: 'Password must contains number' }

                if (profile.newpassword !== profile.newconfirmpassword) throw { message: 'Confirm password wrong' }

                await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/users/data_profile`, { name: profile.name, phone_number: profile.phone_number, oldpassword: profile.oldpassword, newpassword: profile.newpassword }, {
                    headers: {
                        token: localStorage.getItem('token')
                    }
                })

            }
            toast.success("Update Data Profile Success")

            setDisable(false)

            setTimeout(() => {
                window.location.reload(false)
            }, 2000)

        } catch (error) {
            // console.log(error)
            if (!error.response) {
                toast.error(error.message)
            } else {
                toast.error(error.response.data.message)
            }
        }
    }

    useEffect(() => {
        getProfile()
    }, [])

    return (
        user ?
            <div className="w-full h-max bg-white">
                <div className="border text-base lg:text-xl font-bold px-5 py-2">
                    Change Account Information
                </div>
                <div className="border p-5 grid grid-cols-1 md:grid-cols-2">
                    <div className="my-5 flex flex-col items-center">
                        <img src={`${process.env.REACT_APP_API_IMAGE_URL}${user.photo_profile ? user.photo_profile : `Public/images/Blank_PP.jpg`}`} className="w-52 h-52 object-cover rounded-full" />
                        <div className="bg-blue-500 mt-3">
                            <button onClick={() => setModal(!modal)} className="text-white bg-black border border-black hover:bg-white hover:text-black font-semibold rounded-sm px-10 py-2">
                                Change Profile Picture
                            </button>
                            <Modal
                                show={modal}
                                size="md"
                                popup={true}
                                onClose={() =>{
                                    setProfile({...profile, photo_profile:[]})
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
                                        <div>
                                            {message}
                                        </div>
                                        <div className="w-full justify-center flex">
                                            <button disabled={disablePicture} onClick={() =>{
                                            setDisablePicture(true)
                                            updateProfilePicture()}} className=" text-white bg-black border border-black hover:bg-white hover:text-black disabled:cursor-not-allowed font-semibold rounded-sm px-10 py-2">
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </Modal.Body>
                            </Modal>
                        </div>

                    </div>

                    <div>
                        <div className="my-5">
                            <p className="font-semibold">Name</p>
                            <input onChange={(e) => setProfile({ ...profile, name: e.target.value })} type='text' defaultValue={profile.name} placeholder={profile.name} className="py-1 px-2 w-full rounded-sm mt-2 focus:ring-transparent focus:border-black" />
                        </div>

                        <div className="my-5">
                            <p className="font-semibold">Phone Number</p>
                            <input onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })} type='text' defaultValue={profile.phone_number} placeholder={profile.phone_number} className="py-1 px-2 w-full rounded-sm mt-2 focus:ring-transparent focus:border-black" />
                        </div>

                        <div className="my-5">
                            <p className="font-semibold">Email</p>
                            <input disabled type='text' defaultValue={profile.email} className="py-1 px-2 w-full rounded-sm mt-2 focus:ring-transparent focus:border-black disabled:bg-gray-300 disabled:text-gray-500" />
                        </div>

                        <div className="my-5 flex items-center">
                            <input onChange={() => setVisible({ ...visible, check: visible.check ? false : true })} id="black-checkbox" type="checkbox" value="" className="w-4 h-4 mr-2 text-black bg-gray-100 border-gray-300 rounded-sm focus:ring-transparent" />
                            <p className="font-semibold">Change Password</p>
                        </div>

                        {visible.check ?
                            <>

                                <div className="my-5 items-center">
                                    <div className="my-5">
                                        <p className="font-semibold">Your Password</p>
                                        <div className="flex items-center relative">
                                            <input type={visible.password ? 'text' : 'password'} onChange={(e) => setProfile({ ...profile, oldpassword: e.target.value })} placeholder="Input your password" className="focus:border-black focus:ring-transparent w-full rounded-sm" />
                                            <button onClick={() => setVisible({ ...visible, password: visible.password ? false : true })} className="absolute right-3 text-xl" >{visible.password ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}</button>
                                        </div>
                                    </div>
                                    <div className="my-5">
                                        <p className="font-semibold">Your New Password</p>
                                        <div className="flex items-center relative">
                                            <input type={visible.newPassword ? 'text' : 'password'} onChange={(e) => setProfile({ ...profile, newpassword: e.target.value })} placeholder="Input your new password" className="focus:border-black focus:ring-transparent w-full rounded-sm" />
                                            <button onClick={() => setVisible({ ...visible, newPassword: visible.newPassword ? false : true })} className="absolute right-3 text-xl" >{visible.newPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}</button>
                                        </div>
                                    </div>
                                    <div className="my-5">
                                        <p className="font-semibold">Confirm New Password</p>
                                        <div className="flex items-center relative">
                                            <input type={visible.newConfirmPassword ? 'text' : 'password'} onChange={(e) => setProfile({ ...profile, newconfirmpassword: e.target.value })} placeholder="Input your new password" className="focus:border-black focus:ring-transparent w-full rounded-sm" />
                                            <button onClick={() => setVisible({ ...visible, newConfirmPassword: visible.newConfirmPassword ? false : true })} className="absolute right-3 text-xl" >{visible.newConfirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}</button>
                                        </div>
                                    </div>
                                </div>
                            </>
                            :
                            null}


                    </div>
                </div>
                <div className="border py-5 px-5">
                    <button disabled={disable} onClick={() => updateDataProfile()} className="bg-black text-white hover:bg-white hover:text-black border border-black font-semibold px-10 py-2 rounded-sm">
                        SAVE
                    </button>
                </div>
                <Toaster />
            </div>
            : <Loading />
    )
}