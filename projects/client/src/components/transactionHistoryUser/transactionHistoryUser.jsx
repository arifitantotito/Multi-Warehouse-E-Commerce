import axios from "axios"
import { Modal, Button } from "flowbite-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast, Toaster } from 'react-hot-toast'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { IoReceiptOutline } from 'react-icons/io5'
import Loading from "../loading/loading"

import Moment from "react-moment"
import 'moment-timezone';

export default function TransactionHistory() {

    const [disable, setDisable] = useState(true)

    const [transaction, setTransaction] = useState([])
    const [totalPrice, setTotalPrice] = useState([])

    const [transactionID, setTransactionID] = useState(0)
    const [modal, setModal] = useState(false)

    const [payment, setPayment] = useState([])
    const [message, setMessage] = useState('')

    const [date, setDate] = useState([])
    const [dateCreated, setDateCreated] = useState([])

    const [arrProducts, setArrProducts] = useState([])
    const [showPage, setShowPage] = useState(1)


    let navigate = useNavigate()
    var sum = 0

    let shotgunStatus = [
        'bg-yellow-100 text-yellow-400 text-sm font-bold p-1 text-center rounded-sm',
        'bg-orange-100 text-orange-400 text-sm font-bold p-1 text-center rounded-sm',
        'bg-purple-200 text-purple-600 text-sm font-bold p-1 text-center rounded-sm',
        'bg-blue-100 text-blue-600 text-sm font-bold p-1 text-center rounded-sm',
        'bg-lime-400 bg-opacity-30 text-green-600 text-sm font-bold p-1 text-center rounded-sm',
        'bg-red-200 text-red-600 text-sm font-bold p-1 text-center rounded-sm'
    ]

    let getData = async (_page, btn) => {
        try {

            if (btn === "next") {
                _page = Number(_page) + 1
            } else if (btn === "prev") {
                _page = Number(_page) - 1
            }
            // console.log(showPage)
            var response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/transaction/page-transaction?page=${_page ? _page : showPage}`, {
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            // console.log(response.data.data)
            setTransaction(response.data.data)
            setShowPage({ page: response.data.page, pages: response.data.pages, total: response.data.total })

            var allDate = []
            response.data.data.forEach(value => {
                var dateString = value.createdAt
                var justClock = new Date(dateString).toTimeString();
                var justDate = new Date(dateString).toUTCString();
                allDate.push(`${justDate.split(' ').slice(0, 4).join(' ')} ${justClock.split(' ').slice(0, 1).join(' ')}`)
            })
            setDate(allDate)

            var sum = 0
            var totprice = []
            response.data.data.forEach(value => {
                sum += value.ongkir
                value.transaction_details.forEach(e => {
                    sum += e.qty * e.price
                })
                totprice.push(sum)
                sum = 0
            })
            // console.log(totprice)
            setTotalPrice(totprice)

        } catch (error) {

        }
    }
    let onImageValidation = (e) => {
        try {
            let files = [...e.target.files]
            // console.log(files[0])
            setPayment(files)

            if (files.length === 0) {
                setDisable(true)
            } else {
                setDisable(false)
            }

            if (files.length !== 0) {
                files.forEach((value) => {
                    if (value.size > 1000000) throw { message: `${value.name} more than 1000 Kb` }
                })
            }
            setMessage('')



        } catch (error) {
            // console.log(error)
            setMessage(error.message)

        }
    }

    let uploadPayment = async (input) => {
        try {
            // console.log(input)
            let fd = new FormData()
            fd.append('images', payment[0])
            fd.append('id', input)

            setDisable(true)
            let data = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/transaction/payment-proof`, fd)
            // console.log(data)


            toast.success('Upload Payment Proof Success!', {
                style: {
                    background: "black",
                    color: 'white'
                }
            })
            getData()

            setTimeout(() => {
                window.location.reload(false)
            }, 3000)
            setDisable(false)
        } catch (error) {
            // console.log(error)
            if (!error.response) {
                toast.error(error.message)
            } else {
                toast.error(error.response.data.message)
            }
            setDisable(false)
        }
    }

    useEffect(() => {
        getData(showPage)
    }, [])

    if (!transaction) {
        return (
            <Loading />
        )
    }

    return (
        transaction.length !== 0 ?
            <>
                <div className="border rounded-sm bg-white">
                    <div className="px-5 py-3 border-b">
                        <h2 className="font-semibold text-2xl">
                            Transaction History
                        </h2>
                    </div>
                    <div className="px-5 py-3 text-sm md:text-base">
                        {
                            transaction.map((value, index) => {
                                return (
                                    <div className="grid grid-cols-2 md:grid-cols-4 border px-5 py-5 gap-2">
                                        <div className="col-start-1 col-end-3 md:col-start-1 md:col-end-6">
                                            <p>
                                                Order Number:
                                            </p>
                                            <p className="font-bold text-gray-400">
                                                {value.id}
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                Order Date:
                                            </p>
                                            <p className="font-bold">
                                                {date[index]}
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                Total Price:
                                            </p>
                                            <p className="font-bold">
                                                Rp. {totalPrice[index].toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                Status:
                                            </p>
                                            <p className={shotgunStatus[value.order_status_id - 1]}>
                                                {value.order_status.status}
                                            </p>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <button onClick={() => {
                                                navigate(`/my-account/history-detail?id=${value.id}`)
                                                // console.log(`/my-account/history/${value.id}`)
                                            }} className="bg-black text-white rounded-sm border border-black hover:bg-white hover:text-black w-full py-2">
                                                Order Detail
                                            </button>
                                            {
                                                value.order_status_id === 1 ?
                                                    <>
                                                        <button onClick={() => {
                                                            setModal(!modal)
                                                            setTransactionID(value.id)
                                                        }} className="rounded-sm border border-black mt-2 w-full py-2 hover:bg-black hover:text-white">
                                                            Upload Payment
                                                        </button>
                                                        <Modal
                                                            show={modal}
                                                            size="md"
                                                            onClose={() => {
                                                                setModal(!modal)
                                                            }}
                                                        >
                                                            <Modal.Header>
                                                                Upload Payment
                                                            </Modal.Header>
                                                            <Modal.Body>
                                                                <div>
                                                                    <input onChange={(e) => onImageValidation(e)} type="file" accept="image/*" />
                                                                    {message}
                                                                </div>
                                                            </Modal.Body>
                                                            <Modal.Footer>
                                                                <button onClick={() => uploadPayment(value.id)} disabled={disable} className="bg-black text-white hover:bg-white hover:text-black border disabled:hover disabled:cursor-not-allowed border-black rounded-sm px-10 py-2">
                                                                    Upload
                                                                </button>
                                                                <button onClick={() => {
                                                                    setModal(false)
                                                                }} className="bg-white text-black hover:bg-black hover:text-white border border-black rounded-sm px-10 py-2">
                                                                    Decline
                                                                </button>
                                                            </Modal.Footer>
                                                        </Modal>
                                                    </>
                                                    :
                                                    null
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <div className='flex justify-center border p-5'>
                            <button disabled={showPage.page === 1 ? true : false} className={`border font-semibold rounded-l-lg px-7  ${showPage.page === 1 ? `disabled:cursor-not-allowed` : `block hover:bg-black hover:text-white`}`} onClick={() => { getData(showPage.page, "prev") }}>
                                Previous
                            </button>
                            <div>
                                Page {showPage.page}
                            </div>
                            <button disabled={showPage.page === showPage.pages ? true : false} className={`border font-semibold rounded-r-lg px-7  ${showPage.page === showPage.pages ? `disabled:cursor-not-allowed` : `block hover:bg-black hover:text-white`}`} onClick={() => { getData(showPage.page, "next") }}>
                                Next
                            </button>
                        </div>

                    </div>
                </div>
                <Toaster />
            </>
            :
            <div className="w-full flex flex-col items-center justify-center h-full ">
                <IoReceiptOutline className="text-6xl text-neutral-400" />
                <p className="font-semibold text-center text-xl text-neutral-700">You dont have any transaction history</p>
            </div>
    )
}