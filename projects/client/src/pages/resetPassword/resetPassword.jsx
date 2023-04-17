import axios from "axios"
import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast, Toaster } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { Spinner } from "flowbite-react"
import { userData } from "../../data/userData"
import Loading from "../../components/loading/loading"

export default function ResetPassword(props) {

    let password = useRef()
    let confirmPassword = useRef()

    const { user, setUser } = useContext(userData)

    const [visiblePassword, setVisiblePassword] = useState(false)
    const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false)

    const [typePassword, setTypePassword] = useState('password')
    const [typeConfirmPassword, setTypeConfirmPassword] = useState('password')

    const [inputPassword, setInputPassword] = useState()

    const [disable, setDisable] = useState(false)

    let navigate = useNavigate()

    let { id } = useParams()

    let characterLength = /^.{8,30}$/
    let characterNumber = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/

    let onResetPassword = async () => {
        try {
            // let inputPassword = password.current.value
            let inputConfirmPassword = confirmPassword.current.value

            if (inputPassword.length === 0 || inputConfirmPassword.length === 0) throw { message: 'Please input your password' }

            if (inputPassword.length < 8) throw { message: 'Password at least has 8 characters' }

            if (!characterNumber.test(inputPassword)) throw { message: 'Password must contains number' }

            if (inputPassword !== inputConfirmPassword) throw { message: 'Password not match' }
            setDisable(true)
            let result = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/users/reset-password/${id}`, { password: inputPassword })


            password.current.value = ''
            confirmPassword.current.value = ''

            toast.success('Change Password Success')

            setDisable(false)

            props.data.setChance(false)

            setTimeout(() => {
                toast('redirecting...', {
                    duration: 2500
                })
            }, 2000)

            setTimeout(() => {
                navigate('/login')
            }, 2000);

            props.data.setConditionPage(true)

        } catch (error) {
            // console.log(error)
            if (!error.response) {
                toast.error(error.message)
            } else {
                toast.error(error.response.data.message)
            }
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

    let changeVisibleConfirmPassword = () => {
        // console.log('masuk')
        if (typeConfirmPassword === 'password') {
            setVisibleConfirmPassword(true)
            setTypeConfirmPassword('text')
        } else if (typeConfirmPassword === 'text') {
            setVisibleConfirmPassword(false)
            setTypeConfirmPassword('password')
        }
    }

    useEffect(() => {
        props.data.setConditionPage(true)
    }, [])

    return (
        user == null ?
            <Loading />
            :
            user.id != null ?
                navigate('/')
                :
                <>
                    <div className="pt-28 flex justify-center items-center h-screen">
                        <div className="flex flex-col h-max w-max px-5 py-3 border-2 border-gray-200 rounded-sm">
                            <div className="flex justify-center font-bold text-3xl py-2 border-b-2 border-gray-500">
                                Reset Password
                            </div>

                            <div className="py-3 font-semibold">
                                Password
                            </div>
                            <div className="flex items-center relative">
                                <input onChange={(e) => setInputPassword(e.target.value)} ref={password} type={typePassword} placeholder="Input your password" className="focus:border-black focus:ring-transparent w-full md:w-96" />
                                <button className="absolute right-3 text-xl" onClick={changeVisiblePassword}>{visiblePassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}</button>
                            </div>
                            <div className="py-3 font-semibold">
                                Confirm Password
                            </div>
                            <div className="flex items-center relative">
                                <input ref={confirmPassword} type={typeConfirmPassword} placeholder="Input your password" className="focus:border-black focus:ring-transparent w-full md:w-96" />
                                <button className="absolute right-3 text-xl" onClick={changeVisibleConfirmPassword}>{visibleConfirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}</button>
                            </div>
                            <div className="text-gray-400 font-semibold py-3">
                                <div>
                                    Password
                                </div>
                                {/*  */}
                                <li className={(!inputPassword ? '' : characterLength.test(inputPassword) ? 'text-green-600' : 'text-red-600')}>At least have 8 characters</li>
                                {/*  */}
                                <li className={(!inputPassword ? '' : characterNumber.test(inputPassword) ? 'text-green-600' : 'text-red-600')}>Must contain Number</li>
                            </div>
                            {
                                disable ?
                                    <button disabled={disable} onClick={() => onResetPassword()} className="bg-neutral-900 px-5 py-3 mt-5 text-white w-full">
                                        <Spinner
                                            aria-label="Medium sized spinner example"
                                            size="md"
                                        /> Loading . . .
                                    </button>
                                    :
                                    <button disabled={disable} onClick={() => onResetPassword()} className="bg-neutral-900 px-5 py-3 mt-5 text-white w-full">
                                        Submit
                                    </button>
                            }

                        </div>
                    </div>
                    <Toaster />
                </>
    )
}