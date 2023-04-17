import { React, useContext, useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom"
import Moment from "react-moment"
import Loading from "../../components/loading/loading"
import { userData } from "../../data/userData"

export default function ShippingSuccess(props) {
    // const { id } = useParams()
    const queryParams = new URLSearchParams(window.location.search);

    const [status, setStatus] = useState('')
    const [orderNumber, setOrderNumber] = useState('')
    const [totalPrice, setTotalPrice] = useState(0)
    const [data, setData] = useState({})
    const [statusID, setStatusID] = useState(0)

    const { user, setUser } = useContext(userData)

    let navigate = useNavigate()

    let getData = async () => {
        try {
            const id = queryParams.get('id');
            // console.log(id)
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/transaction/getDataTransaction?id=${id}`, {
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            // console.log(response)
            setStatus(response.data.data.order_status.status)
            setOrderNumber(response.data.data.id)
            setData(response.data.data)
            setStatusID(response.data.data.order_status_id)

            let sum = 0
            response.data.data.transaction_details.forEach(e =>
                sum += e.qty * e.price)

            setTotalPrice(sum + response.data.data.ongkir)
        } catch (error) {
            // console.log(error)
        }
    }

    useEffect(() => {
        getData()
        props.func.getCart()
    }, [])

    return (
        user == null ?
            <Loading />
            :
            user.id == null ?
                navigate('/')
                :
            data ?
                <>
                    <div className="pt-28 px-5 md:px-0 grid grid-cols-6">
                        <div className="col-start-1 col-end-7 md:col-start-2 md:col-end-6 lg:col-start-3 lg:col-end-5">
                            <p className="border-b-2 pb-4 text-2xl text-center font-bold">
                                Payment Information
                            </p>
                            <p className="py-6 text-sm">
                                Thank you, order invoice created successfully. Please complete your transaction
                            </p>
                            <div className="flex justify-evenly text-sm">
                                <div>
                                    <p>
                                        Order Status
                                    </p>
                                    <p>
                                        Order Number
                                    </p>
                                    <p>
                                        Total Payment
                                    </p>
                                    <p>
                                        Payment Method
                                    </p>
                                </div>
                                <div className="font-bold text-right pb-6">
                                    <p>
                                        {status}
                                    </p>
                                    <p>
                                        {orderNumber}
                                    </p>
                                    <p>
                                        Rp. {totalPrice.toLocaleString()}
                                    </p>
                                    <p>
                                        BCA Virtual Account
                                    </p>
                                </div>
                            </div>

                            {
                                statusID == 6 ?
                                    <div className="bg-blue-200 flex justify-center rounded-sm py-4 px-3">
                                        <p className="text-teal-800 font-semibold">
                                            Your Transactions Cancelled
                                        </p>
                                    </div>
                                    :
                                    <div className="bg-blue-200 flex justify-between rounded-sm py-4 px-3">
                                        <p className="text-teal-800">
                                            Expired Payment
                                        </p>
                                        <p className="font-bold text-teal-800">
                                            <Moment date={data.exprired}
                                                durationFromNow
                                                interval={1000}
                                            />
                                        </p>
                                    </div>
                            }

                            <div className="text-center rounded-sm bg-sky-50 mt-6 py-3">
                                <p>
                                    VA Number - BCA Virtual Account
                                </p>
                                <p className="font-bold">
                                    1231203912380928
                                </p>
                            </div>

                            <div className="flex justify-center my-6">
                                <button onClick={() => navigate(`/my-account/history-detail?id=${orderNumber}`)} className="bg-black rounded-sm text-white px-3 py-2 font-bold">
                                    Order Detail
                                </button>
                            </div>

                            <div className="text-center text-sm">
                                <p>
                                    You will received confirmation order email with order detail. Your order will process now.
                                </p>
                                <p>
                                    You have trouble with this order? <span className="font-bold">Contact Us</span>
                                </p>
                            </div>

                        </div>
                    </div>
                </>
                :
                <Loading />
    )
}