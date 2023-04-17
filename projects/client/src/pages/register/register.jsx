import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";
import { userData } from "../../data/userData";
import Loading from "../../components/loading/loading";

export default function Register(props) {

    const [disabledButton, setDisabledButton] = useState(false)
    const { user, setUser } = useContext(userData)

    let navigate = useNavigate()

    let fullName = useRef()
    let email = useRef()
    let phoneNumber = useRef()

    let onSubmit = async () => {
        try {
            let inputName = fullName.current.value
            let inputEmail = email.current.value
            let inputPhoneNumber = phoneNumber.current.value

            if (inputName.length === 0 || inputEmail.length === 0 || inputPhoneNumber.length === 0) throw { message: 'Please input your data' }

            if (!inputEmail.includes('@') || !inputEmail.includes('.com')) throw { message: 'Please input a valid email' }

            if (isNaN(inputPhoneNumber)) throw { message: 'Please input a number' }

            if (inputPhoneNumber.length < 8 || inputPhoneNumber.length > 13) throw { message: 'Please input your valid phone number' }

            setDisabledButton(true)

            let result = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/register`, { name: inputName, email: inputEmail, phone_number: inputPhoneNumber })
            // console.log(result)

            toast.success(`Register success, please check your email`)

            setDisabledButton(false)
            fullName.current.value = ''
            email.current.value = ''
            phoneNumber.current.value = ''

        } catch (error) {
            // console.log(error)
            if (!error.response) {
                toast.error(error.message)
            } else {
                toast.error(error.response.data.message)
            }
            setDisabledButton(false)
        }
    }

    useEffect(()=>{
        props.data.setConditionPage(true)
    },[])


    return (
        user == null ?
            <Loading />
            :
            user.id != null ?
                navigate('/my-account')
                :
                <>
                    {/* Main */}
                    <div className="flex justify-center items-center h-screen">

                        {/* Card */}
                        <div className="border-2 border-gray-200 w-max p-5 rounded-sm">

                            <div className="border-b-2 w-full pb-3">
                                <h1 className="font-bold text-lg md:text-xl">Create an Account</h1>
                            </div>

                            <div className="my-5">
                                <p className="font-semibold">Full Name</p>
                                <input ref={fullName} required type='text' placeholder="Input your full name" className="py-1 px-2 w-full md:w-96 mt-2 focus:ring-transparent focus:border-black" />
                            </div>

                            <div className="my-5">
                                <p className="font-semibold">Email</p>
                                <input ref={email} required type='email' placeholder="Input your email" className="py-1 px-2 w-full md:w-96 mt-2 focus:ring-transparent focus:border-black" />
                            </div>

                            <div className="my-5">
                                <p className="font-semibold">Phone Number</p>
                                <input ref={phoneNumber} required type='text' placeholder="Input your phone number" className="py-1 px-2 w-full md:w-96 mt-2 focus:ring-transparent focus:border-black" />
                            </div>

                            {disabledButton ? <button disabled={disabledButton} onClick={onSubmit} className="bg-neutral-900 px-5 py-3 mt-3 text-white w-full">
                                <Spinner
                                    aria-label="Medium sized spinner example"
                                    size="md"
                                /> Loading . . .
                            </button> : <button disabled={disabledButton} onClick={onSubmit} className="bg-neutral-900 px-5 py-3 mt-3 text-white w-full">
                                Create an Account
                            </button>}


                            <div className="mt-2 flex justify-center">
                                Already have an account? <Link to='/login' className="font-bold ml-2 hover:text-gray-700 ">Login Here</Link>
                            </div>

                        </div>
                    </div>
                    <Toaster
                        toastOptions={{
                            success: {
                                duration: 10000
                            },
                            error: {
                                duration: 5000
                            }
                        }}
                    />
                </>
    )
}