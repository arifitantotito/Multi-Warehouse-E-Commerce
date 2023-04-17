import axios from "axios"
import { useContext, useEffect, useRef, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { toast, Toaster } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { Spinner } from "flowbite-react"
import { userData } from "../../data/userData"
import Loading from "../../components/loading/loading"

export default function ConfirmEmail(props) {

    let email = useRef()
    let navigate = useNavigate()

    const [disabledButton, setDisabledButton] = useState(false)
    const { user, setUser } = useContext(userData)

    let onConfirmEmail = async () => {
        try {
            let inputEmail = email.current.value

            if (props.data.chance === true) throw { message: "Only one chance per request" }

            if (!inputEmail) throw { message: 'Incomplete input' }

            if (!inputEmail.includes('@') || !inputEmail.includes('.com')) throw { message: 'Please input a valid email' }

            setDisabledButton(true)

            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/confirm-email`, { email: inputEmail })

            toast.success(`Please check your email`)

            setDisabledButton(false)
            email.current.value = ''

            props.data.setChance(true)

        } catch (error) {
            // console.log(error)
            if (!error.response) {
                toast.error(error.message)
            } else {
                toast.error(error.response.data.message)
            }
        } finally {
            setDisabledButton(false)

        }
    }

    // if (statusUser === 'Verified') {
    //     return <Navigate to='/login' />
    // }

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
                    <div className="flex flex-col h-max mx-5 md:w-max px-5 py-3 border-2 border-gray-200 rounded-sm">
                        <div className="flex justify-start font-bold text-xl md:text-3xl pb-3 border-b-2 border-gray-300">
                            Reset Password
                        </div>

                        <div className="py-3">
                            Input your email to get link to reset your password.
                        </div>

                        <div className="pb-3 font-semibold">
                            Email
                        </div>
                        <div className="flex items-center">
                            <input ref={email} type='text' placeholder="Input your email" className="focus:border-black focus:ring-transparent w-full md:w-96" />
                        </div>
                        <button disabled={disabledButton} onClick={() => onConfirmEmail()} className="bg-neutral-900 px-5 py-3 mt-5 text-white w-full">
                            {disabledButton ?
                                <>
                                    <Spinner
                                        aria-label="Medium sized spinner example"
                                        size="md"
                                    />
                                </>
                                :
                                'Submit'}
                        </button>

                    </div>
                </div>
                <Toaster />
            </>
    )
}