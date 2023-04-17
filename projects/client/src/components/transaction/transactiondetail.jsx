import { AiOutlineClose } from 'react-icons/ai'
import { useContext, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { TransactionData } from '../../data/transactionAdmin'

export default function TransactionDetail() {
    const { transaction, setTransaction } = useContext(TransactionData)
    
    const [maxpayment, setMaxpayment] = useState(false), [pop, setPop] = useState(false), [disable, setDisable] = useState(false)
    let [submit, setSubmit] = useState(1)

    let total_price = 0
    let total_weight = 0
    transaction?.transaction_details.forEach((item, index) => {
        total_price += item.price * item.qty
        total_weight += item.weight * item.qty
    })

    let [load, setLoad] = useState({
        price: total_price,
        weight: total_weight,
        total: total_price + transaction?.ongkir
    })

    let updateOrder = async (id, code, load, wh_id) => {
        try {
            let response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/transaction/update?transaction_id=${id}&code=${code}&load=${JSON.stringify(load)}&warehouse_id=${wh_id}`)
            toast.success(response.data.message)
            setTimeout(() => {
                toast('Loading..')
                setPop(false)
                setDisable(false)
                setTransaction(null)
                window.location.reload(false)
            }, 1500)
        } catch (error) {

        }
    }

    return (
        <div className="fixed z-30 lg:w-screen w-full h-screen flex items-center justify-center bg-black bg-opacity-50 ">
            {
                transaction.upload_payment ?
                    maxpayment ?
                        <div className='fixed z-50 p-10 lg:w-screen w-fit h-fit lg:h-screen flex flex-col items-center'>
                            <div className='p-5 bg-white lg:w-1/3 w-1/2 h-1/2 xl:h-full'>
                                <button onClick={() => setMaxpayment(false)}><AiOutlineClose size={'20px'} /></button>
                                <img src={`${process.env.REACT_APP_API_IMAGE_URL}${transaction.upload_payment}`} className='w-full h-full object-contain overflow-y-auto bg-gray-200 bg-opacity-20' alt="" />
                            </div>
                        </div> : null : null
            }
            <div className="w-3/5 h-3/4 border shadow-lg bg-white flex flex-col relative">

                <div className="flex justify-between items-center w-full px-7 py-4">
                    <div className="text-2xl font-bold">
                        Transaction Detail
                    </div>

                    <button onClick={() => setTransaction(null)} className='hover:bg-gray-300'>
                        <AiOutlineClose size={'25px'} />
                    </button>
                </div>

                <hr className='border-t' />

                <div className='flex overflow-scroll'>
                    <div className='w-full border-r px-7'>
                        <div className='flex justify-between py-3'>
                            <div className='font-semibold'>
                                {transaction.order_status.status}
                            </div>

                            <button className='flex font-semibold text-sm gap-3'>
                                Open Detail
                            </button>
                        </div>

                        <hr className='border-t border-dashed mx-7' />

                        <div className='flex justify-between py-2'>
                            <div className='text-sm text-gray-500'>
                                No. Invoice
                            </div>
                            <div className='font-bold text-emerald-600 text-xs'>
                                {transaction.id}
                            </div>
                        </div>

                        <div className='flex justify-between py-2'>
                            <div className='text-sm text-gray-500'>
                                Date Order
                            </div>
                            <div className='font-semibold text-xs'>
                                08 April 2022, 14:50 WIB
                            </div>
                        </div>

                        <hr className='h-2 bg-gray-100 my-4' />


                        <div className='flex '>
                            <div className={`${transaction.upload_payment ? 'w-3/4' : 'w-full'} flex flex-col`}>
                                <div className='font-semibold'>
                                    Detailed Products
                                </div>

                                <div className='flex'>
                                    <div className='w-full'>
                                        {
                                            transaction.transaction_details.map((item, index) => {
                                                return (
                                                    <div className='flex justify-between'>
                                                        <div className='flex'>
                                                            <img className='w-20 h-20 object-contain' src={require(`../../Assets/${item.product_img}`)} alt="" />
                                                            <div className='flex flex-col justify-start py-2'>
                                                                <div className='lg:text-lg text-sm font-semibold'>
                                                                    {item.product_name}
                                                                </div>
                                                                <div className='text-gray-500 text-xs'>
                                                                    {item.color ? item.color : null}
                                                                </div>
                                                                <div className='text-gray-500 text-xs'>
                                                                    {item.connectivity ? item.connectivity : null}
                                                                </div>
                                                                <div className='text-gray-500 text-xs'>
                                                                    {item.processor ? item.processor : null}
                                                                </div>
                                                                <div className='text-gray-500 text-xs'>
                                                                    {item.screensize ? item.screensize : null}
                                                                </div>
                                                                <div className='text-gray-500 text-xs'>
                                                                    {item.memory_storage ? `${item.memory_storage} GB` : null}
                                                                </div>
                                                            </div>

                                                        </div>



                                                        <div className='p-3 w-1/2  flex justify-end'>
                                                            <div className='border-r border-gray-300 w-1/3'>
                                                                <div className='flex pr-3 flex-col justify-start items-end py-2 text-xs text-gray-500'>
                                                                    <p>{item.qty} item x</p>    <p>Rp.{(item.price).toLocaleString()}</p>
                                                                </div>
                                                            </div>

                                                            <div className='flex flex-col justify-end items-end gap-2 w-2/3'>
                                                                <div className='text-gray-500'>
                                                                    total harga
                                                                </div>
                                                                <div className='lg:text-lg text-sm font-semibold'>
                                                                    Rp. {(item.price * item.qty).toLocaleString()}
                                                                </div>
                                                            </div>

                                                        </div>

                                                    </div>
                                                )
                                            })
                                        }
                                    </div>


                                </div>
                            </div>
                            {
                                transaction.upload_payment ?
                                    <div className='w-1/4 flex flex-col pl-5 gap-2'>
                                        <div className='font-semibold'>
                                            Payment Proof :
                                        </div>
                                        <button className='m-4' onClick={() => setMaxpayment(true)}>
                                            <img src={`${process.env.REACT_APP_API_IMAGE_URL}${transaction.upload_payment}`} className='w-12 h-20' alt="" />
                                            {/* <img src={require(`../../Assets/${transaction.upload_payment}.jpeg`)} className='w-14 h-20' alt="" /> */}
                                        </button>

                                        {
                                            transaction.order_status_id == 2 ?
                                                <div className='flex gap-4 mt-4'>
                                                    <button onClick={() => {
                                                        setSubmit(1)
                                                        setPop(true)

                                                        // updateOrder(transaction.id, 3, transaction.transaction_details, transaction.location_warehouse_id)
                                                    }
                                                    } className='bg-green-500 text-white py-1 px-3'>
                                                        Submit
                                                    </button>
                                                    <button onClick={() => {
                                                        setSubmit(2)
                                                        setPop(true)
                                                    }
                                                    } className='bg-orange-500 text-white py-1 px-3'>
                                                        Cancel
                                                    </button>
                                                    <div className={`${pop ? 'flex items-center justify-center' : 'hidden'} fixed top-0 bg-slate-300 bg-opacity-10  left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full`}>
                                                        <div className="relative w-full h-full max-w-md md:h-auto">
                                                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                                                <button type="button" onClick={() => setPop(false)} className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="popup-modal">
                                                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                                                    <span className="sr-only">Close modal</span>
                                                                </button>
                                                                <div className="p-6 flex flex-col justify-center items-center">
                                                                    <lottie-player
                                                                        autoplay
                                                                        loop
                                                                        mode="normal"
                                                                        src="https://assets8.lottiefiles.com/packages/lf20_G2XAygvB2h.json"
                                                                        style={{ width: "200px" }}    >
                                                                    </lottie-player>
                                                                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                                        Do you want to {submit == 1 ? 'submit' : 'cancel'} this transaction?
                                                                    </h3>
                                                                    <div className='flex gap-4'>
                                                                        <button
                                                                            disabled={disable}
                                                                            onClick={() => {
                                                                                setDisable(true)
                                                                                submit == 1 ?
                                                                                    updateOrder(transaction.id, 3, transaction.transaction_details, transaction.location_warehouse_id)
                                                                                    :
                                                                                    updateOrder(transaction.id, 1, transaction.transaction_details, transaction.location_warehouse_id)
                                                                            }} data-modal-hide="popup-modal" type="button" className={`text-white ${submit == 1 ? 'bg-green-500 hover:bg-green-700' : 'bg-red-600 hover:bg-red-800'} focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2`}>
                                                                            Yes, {submit == 1 ? "i'm sure" : 'cancel it'}
                                                                        </button>
                                                                        <button onClick={() => setPop(false)} data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                : null
                                        }

                                    </div> : null
                            }
                        </div>

                        <hr className='h-2 my-4 bg-gray-200' />

                        <div className='flex flex-col gap-4 text-sm text-gray-500'>
                            <div className='font-bold text-md text-black'> Shipping Info</div>
                            <div className='flex'>
                                <div className='w-1/4 '>
                                    Courier
                                </div>

                                <div className='w-3/4 text-black flex gap-3'>
                                    :
                                    <div className='text-black'>
                                        {transaction.courier}
                                    </div>
                                </div>
                            </div>
                            <div className='flex'>
                                <div className='w-1/4'>
                                    No. Shipping
                                </div>

                                <div className='w-3/4 flex gap-3'>
                                    :
                                    <div className='font-bold text-emerald-600 text-xs'>
                                {transaction.id}
                            </div>
                                </div>
                            </div>
                            <div className='flex'>
                                <div className='w-1/4 '>
                                    Address
                                </div>

                                <div className='w-3/4 flex gap-3'>
                                    <div>:</div>
                                    <div className='flex flex-col text-black'>
                                        <div className='font-bold'>
                                            {transaction.user_name}
                                        </div>
                                        <div>
                                            {transaction.phone_number}
                                        </div>
                                        <div>
                                            {transaction.address}
                                        </div>
                                        <div>
                                            {transaction.subdistrict}, {transaction.city}
                                        </div>

                                        <div>
                                            {transaction.province}
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>

                        <hr className='h-2 my-4 bg-gray-200' />

                        <div className='flex flex-col pb-5 gap-4 text-sm text-gray-500'>
                            <div className='font-bold text-lg text-black'> Payment Details</div>
                            <div className='flex flex-col gap-5'>
                                <div className='flex justify-between items-end'>
                                    <div>
                                        Payment Method
                                    </div>
                                    <img src={`${process.env.REACT_APP_API_IMAGE_URL}Public/images/Bank_Central_Asia.webp`} className=' w-28' alt="" />
                                </div>

                                <div className='flex justify-between items-center'>
                                    <div >
                                        Total Price
                                    </div>
                                    <div>
                                        Rp. {(load.price).toLocaleString()}
                                    </div>
                                </div>

                                <div className='flex justify-between items-center'>
                                    <div>
                                        Total Shipping Cost {(load.weight * 1000).toLocaleString()} gram
                                    </div>
                                    <div>
                                        Rp. {(transaction.ongkir).toLocaleString()}
                                    </div>
                                </div>

                                <div className='flex justify-between items-center'>

                                    <div>
                                        Total Discount Items
                                    </div>
                                    <div>
                                        -Rp. 0
                                    </div>
                                </div>

                                <div className='flex justify-between items-center border-t border-gray-300'>
                                    <div className='font-bold text-lg text-black mt-3'>
                                        Total Cost Shopping
                                    </div>
                                    <div className='font-bold text-lg text-black mt-3'>
                                        Rp. {(load.total).toLocaleString()}
                                    </div>

                                </div>
                            </div>

                        </div>



                        {/* box */}

                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    )
}
