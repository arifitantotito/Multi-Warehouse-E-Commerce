import { Link, useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from 'react'
import { LoginAccount } from "../../utils/login";
import { userData } from "../../data/userData";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import Loading from '../../components/loading/loading'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function AdminLogin() {
    let [disable, setDisable] = useState(false)
    let navigate = useNavigate()
    const { user, setUser } = useContext(userData)
    const [visiblePassword, setVisiblePassword] = useState(false)
    const [typePassword, setTypePassword] = useState('password')

    let confirmation = (data) => {
        if (data.id == undefined) {
            toast.error(data.response)
            setDisable(false)
        } else {
            localStorage.setItem('token', data.id)
            setDisable(false)
            toast.success(data.response, {
                style: {
                    background: "black",
                    color: 'white'
                }
            })

            setTimeout(() => {
                toast('redirecting...', {
                    duration: 2500
                })
            }, 2000)

            setTimeout(() => {
                navigate('/admin')
                setUser(data)
            }, 3000)
        }
    }
    let changeVisiblePassword = () => {
        // console.log('masuk')
        if (typePassword === 'password') {
            setVisiblePassword(true)
            setTypePassword('text')
        } else if (typePassword === 'text') {
            setVisiblePassword(false)
            setTypePassword('password')
        }
    }

    let email = useRef()
    let password = useRef()

    return (
        !user ?
            <Loading />
            :
            user.role != null?
                navigate('/admin')
                :
                user.id?
                navigate('/')
                :
                <>
                    {/* Main */}
                    <div className="flex relative justify-center items-center h-screen">

                        {/* Card */}
                        <div className="border-2 border-gray-200 w-max px-5 py-5 rounded-lg shadow-lg">

                            <div className="border-b-2 pb-3">
                                <h1 className="font-bold text-lg md:text-2xl">Login as Admin</h1>
                            </div>


                            <div className="py-3">
                                <p className="font-semibold">Email</p>
                                <input disabled={disable} ref={email} required type='text' placeholder="Input your email" className="py-1 px-1 w-96 rounded mt-2 focus:ring-transparent focus:border-black" />
                            </div>

                            <div>
                                <div className="py-3 font-semibold">
                                    Password
                                </div>
                                <div className="flex items-center relative">
                                    <input disabled={disable} ref={password} type={typePassword} placeholder="Input your password" className="focus:border-black focus:ring-transparent w-full md:96 rounded-sm" />
                                    <button className="absolute right-3 text-xl" onClick={changeVisiblePassword}>{visiblePassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}</button>
                                </div>
                            </div>

                            <button disabled={disable} onClick={async () => {
                                setDisable(!disable)
                                let data = await LoginAccount(email.current.value, password.current.value, true)
                                confirmation(data)
                            }} className="bg-neutral-900 hover:bg-neutral-800 text-center px-5 py-2 text-white font-semibold text-lg mt-5 rounded w-full">
                                {
                                    disable ?
                                        <div className="flex justify-center items-center gap-3">
                                            <AiOutlineLoading3Quarters className="animate-spin" />
                                            <div>processing..</div>
                                        </div>
                                        : 'Login'
                                }
                            </button>
                        </div>

                        <Toaster />
                    </div>
                </>

    )
}