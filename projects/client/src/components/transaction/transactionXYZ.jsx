import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { TransactionData } from '../../data/transactionAdmin'
import { userData } from '../../data/userData'
import noData from '../../Assets/data_not_found2.jpg'
import React from 'react';
import Moment from 'react-moment';
import { BsClock, BsFillChatDotsFill } from 'react-icons/bs'
import { MdOutlineDescription } from 'react-icons/md'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import Loading from '../loading/loading'
import toast, { Toaster } from 'react-hot-toast'

export default function TransactionXYZ() {
    const { transaction, setTransaction } = useContext(TransactionData)
    const { user, setUser } = useContext(userData)

    let [pickWH, setPickWH] = useState(0), [pickStatus, setPickStatus] = useState(0), [pop, setPop] = useState(false), [disable, setDisable] = useState(false)
    let [select, setSelect] = useState(null), [dataFilter, setDataFilter] = useState([]), [page, setPage] = useState(0), [ship, setShip] = useState(1)
    let [dataTR, setDataTR] = useState([]), [totalPrice, setTotalPrice] = useState(0), [loadDate, setLoadDate] = useState([])

    let [ok,setOk] = useState({
        id:null,
        code:null,
        transaction:[],
        warehouse:null
    })

    const [date, setDate] = useState({
        from: "",
        to: "",
    });
    const [selectedDate, setSelectedDate] = useState({
        from: "",
        to: "",
    });
    let [shotgun, setShotgun] = useState([
        'Transaction', 'Payment', 'Confirmation', 'Processing', 'Shipped', 'Done', 'Canceled'
    ])


    let shotgunStatus = [
        'bg-yellow-100 text-yellow-400 text-sm font-bold p-1',
        'bg-orange-100 text-orange-400 text-sm font-bold p-1',
        'bg-purple-200 text-purple-600 text-sm font-bold p-1',
        'bg-blue-100 text-blue-600 text-sm font-bold p-1',
        'bg-lime-400 bg-opacity-30 text-green-600 text-sm font-bold p-1',
        'bg-red-200 text-red-600 text-sm font-bold p-1'
    ]

    let option = [
        'Filter',
        'Warehouse'
    ]

    let filter = async (input) => {
        if (input == "Filter") return setDataFilter([])
        if (input == "Warehouse") {
            setSelect(input)
            let response = await axios.post('http://localhost:8000/transaction/filter', { data: input })

            setDataFilter(response.data.data)
        }
    }

    let searchFilter = async (input) => {
        if (input == "All Transaction") return getAllTr()
        let response = await axios.post('http://localhost:8000/transaction/FWarehouse', { warehouse_city: input })
        setDataTR(response.data.data)

        let loaderPrice = [], loaderDate = []
        for (let i = 0; i < response.data.data.length; i++) {
            let TP = 0
            // loaderDate.push(new Date(response.data.data[i].updatedAt).toGMTString().replace('GMT', 'WIB'))
            loaderDate.push(response.data.data[i].updatedAt.split('T')[0])
            TP += response.data.data[i].ongkir
            response.data.data[i].transaction_details.forEach((item) => {
                TP += (item.qty * item.price)
            })
            loaderPrice.push(TP)

            setTotalPrice(loaderPrice)
            setLoadDate(loaderDate)
        }
    }

    let getAllTr = async () => {
        setPickWH(user.warehouse_id ? user.warehouse_id : 0)
        let response = await axios.post('http://localhost:8000/transaction/getAllTransaction', user.warehouse_id ? { warehouse: user.warehouse_id, order_status_id: 0 } : { order_status_id: 0 })
        setDataTR(response.data.data)
       

        let loaderPrice = [], loaderDate = []
        for (let i = 0; i < response.data.data.length; i++) {
            let TP = 0
            // loaderDate.push(new Date(response.data.data[i].updatedAt).toGMTString().replace('GMT', 'WIB'))
            loaderDate.push(response.data.data[i].createdAt.split('T')[0])
            TP += response.data.data[i].ongkir
            response.data.data[i].transaction_details.forEach((item) => {
                TP += (item.qty * item.price)
            })
            loaderPrice.push(TP)
        }
        setTotalPrice(loaderPrice)
        setLoadDate(loaderDate)
    }

    let getTr = async (wh, status, from, to) => {
        try {
            setPickWH(wh)
            setPickStatus(status)
            var response = await axios.post('http://localhost:8000/transaction/getAllTransaction', { warehouse: wh, order_status_id: status, from: from ? from.toISOString().split("T")[0] : null, to: to ? to.toISOString().split("T")[0] : null })
            setDataTR(response.data.data)

            let loaderPrice = [], loaderDate = []
            for (let i = 0; i < response.data.data.length; i++) {
                let TP = 0
                // loaderDate.push(new Date(response.data.data[i].updatedAt).toGMTString().replace('GMT', 'WIB'))
                loaderDate.push(response.data.data[i].updatedAt.split('T')[0])
                TP += response.data.data[i].ongkir
                response.data.data[i].transaction_details.forEach((item) => {
                    TP += (item.qty * item.price)
                })
                loaderPrice.push(TP)
            }
            setTotalPrice(loaderPrice)
            setLoadDate(loaderDate)
        } catch (error) {
            setDataTR([])
        }
    }

    let description = (index, type) => {
        setTransaction(dataTR[index])
    }

    let shipping = async (id, code, load, wh_id) => {
        // console.log(ok)
        let response = await axios.patch(`http://localhost:8000/transaction/ship?transaction_id=${ok.id}&code=${ok.code}&load=${JSON.stringify(ok.transaction)}&warehouse_id=${ok.warehouse}`)
        response.data.message == 'Order canceled' ? toast.error(response.data.message) : toast.success(response.data.message)
        setTimeout(()=>{
            toast('Loading..')
            setPop(false)
            setDisable(false)
            window.location.reload(false)
         }, 1500)
    }

    useEffect(() => {
        getAllTr()
    }, [])
    return (

        dataTR ?
            <div className="p-5">
                <div className="text-2xl font-bold">
                    Transaction
                </div>
                <div className='text-gray-500 font-semibold mb-6'>
                    {dataTR.length} transactions found
                </div>
                <div>

                </div>
                <div>
                    <div className='flex justify-between gap-3 '>
                        <div className='flex gap-5 items-center'>
                            <DatePicker
                                showMonthDropdown={true}
                                showYearDropdown={true}
                                scrollableYearDropdown={true}
                                selected={selectedDate.from === "" ? null : selectedDate.from}
                                className="bg-gray-100 border w-fit border-gray-100 text-gray-900 text-xs rounded-md"
                                onChange={(date) => {
                                    setDate({ ...date, from: date.toISOString().split("T")[0] });
                                    setSelectedDate({ ...selectedDate, from: date });
                                    getTr(pickWH, pickStatus, date, selectedDate.to)
                                }}
                            />
                            to
                            <DatePicker
                                showMonthDropdown={true}
                                showYearDropdown={true}
                                scrollableYearDropdown={true}
                                selected={selectedDate.to === "" ? null : selectedDate.to}
                                className="bg-gray-100 border w-fit border-gray-100 text-gray-900 text-xs rounded-md"
                                onChange={(date) => {
                                    setDate({ ...date, to: date.toISOString().split("T")[0] });
                                    setSelectedDate({ ...selectedDate, to: date });
                                    getTr(pickWH, pickStatus, selectedDate.from, date)
                                }}
                            />
                        </div>
                        <div className='flex gap-3'>
                            {
                                dataFilter.length > 0 ?
                                    <div>
                                        <select onChange={(e) => getTr(e.target.value, pickStatus, selectedDate.from, selectedDate.to)} className="border-gray-200 focus:ring-0 focus:border-border-200 focus:outline-none rounded-md" placeholder="Select Warehouse">
                                            <option value="All Transaction">All Transaction</option>
                                            {
                                                dataFilter.map((item, index) => {
                                                    return (
                                                        <option value={item.id}>{item.city}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div> : null
                            }
                            {
                                !user.warehouse ?
                                    <div className="relative">

                                        <select onChange={(e) => filter(e.target.value)}
                                            className="rounded-md border border-gray-200 focus:ring-0 focus:border-gray-200 focus:outline-none" placeholder="Filter"
                                        >
                                            {
                                                option.map((item, index) => {
                                                    return (
                                                        <option value={item} >{item}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div> : null
                            }

                        </div>

                    </div>

                    <div className='flex justify-start items-center mt-5'>
                        <div className='flex gap-5 ml-5'>
                            {
                                shotgun.map((item, index) => {
                                    return (
                                        <button
                                            disabled={page == index ? true : false}
                                            onClick={() => {
                                                setPage(index)
                                                getTr(pickWH, index)
                                            }} className={`font-semibold relative hover:text-black ${page == index ? 'underline-offset-4 underline text-black' : 'text-gray-300'}  `}>
                                            {item}
                                            {/* {
                                                index==1 || index==4?
                                                <div className='absolute w-4 -top-1.5 text-xs -right-3 rounded-full bg-green-700 text-white'>
                                                1
                                            </div>:null
                                            } */}

                                        </button>
                                    )
                                })
                            }
                        </div>

                    </div>
                </div>


                <div className='h-full flex flex-col gap-7 mt-5'>
                    {
                        dataTR.length > 0 ?
                            dataTR.map((item, index) => {
                                return (
                                    <div className='flex flex-col rounded-md border border-slate-200 shadow-sm z-0'>
                                        <div className='flex font-semibold gap-3 pt-3 px-3'>
                                            <div className='flex w-3/4 gap-3'>
                                                <div className='font-semibold text-emerald-600 text-md'>
                                                    {item.id}
                                                </div>

                                                <div className={`${shotgunStatus[item.order_status_id - 1]} px-2 rounded-xl py-1`}>
                                                    {item.order_status.status}
                                                </div>

                                                {
                                                    item.order_status_id == 1 || item.order_status_id == 2 || item.order_status_id == 4 ?
                                                        Date.now() < new Date(item.exprired) ?
                                                            <div className='flex gap-2 items-center text-sm text-gray-700'>
                                                                <BsClock size={'13px'} />
                                                                {item.order_status_id==4?'done in':'expired in'}
                                                                <Moment date={item.exprired}
                                                                    durationFromNow
                                                                    interval={1000}
                                                                />
                                                            </div>
                                                            : null
                                                        : null

                                                }
                                            </div>

                                            <div className='flex w-1/4 justify-start items-center gap-3'>
                                                <div className='opacity-60 text-sm font-medium'>
                                                    Deliver from :
                                                </div>
                                                WH-{item.location_warehouse.city}
                                            </div>
                                        </div>


                                        <div className='pl-3 text-gray-500 opacity-70 text-sm '>
                                            <Moment format="DD MMMM YYYY HH:mm:ss">
                                                {(loadDate[index])}
                                            </Moment>
                                            

                                        </div>

                                        <div className='flex px-5 justify-between'>
                                            <div className='w-4/5 flex flex-col'>
                                                <div className='flex'>
                                                    <img src={require(`../../Assets/${item.transaction_details[0].product_img}`)} className='w-20 h-20 object-contain' alt="" />
                                                    {/* <img src={`http://localhost:8000/Public/images/${item.transaction_details[0].product_img}`} className='w-20 h-20 object-contain' alt="" /> */}
                                                    <div className='mt-4 font-bold flex flex-col items-start'>
                                                        <button>
                                                            {item.transaction_details[0].product_name}
                                                        </button>
                                                        <div className='text-sm opacity-60 font-medium'>
                                                            {item.transaction_details[0].qty} item x Rp. {(item.transaction_details[0].price).toLocaleString()}
                                                        </div>
                                                        {
                                                            (item.transaction_details.length - 1) == 0 ?
                                                                null
                                                                :
                                                                <div className='text-sm opacity-60 font-medium text-gray-500'>
                                                                    ({item.transaction_details.length - 1} products more..)
                                                                </div>
                                                        }

                                                    </div>
                                                </div>
                                            </div>

                                            <div className='w-1/5 flex'>
                                                <div className='border'></div>
                                                <div className='flex flex-col w-full h-full items-center justify-center text-lg font-bold'>
                                                    <div className='text-sm font-medium opacity-60'>Total Shopping</div>
                                                    <div>RP. {(totalPrice[index]).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex items-center justify-between p-5 text-green-500'>
                                            <div className='flex gap-8'>
                                                <button className='flex items-center gap-2'>
                                                    <BsFillChatDotsFill />
                                                    Chat with Buyer
                                                </button>

                                                <button onClick={() => description(index)} className='flex gap-2 items-center'>
                                                    <MdOutlineDescription />
                                                    Transaction Description
                                                </button>
                                            </div>
                                            {
                                                item.order_status.id == 3 ?

                                                    <div className='flex gap-5'>
                                                        <button onClick={() => {
                                                            setShip(1)
                                                            setPop(true)
                                                            setOk({...ok, id:item.id, code:4,transaction:item.transaction_details,warehouse:item.location_warehouse_id})
                                                        }
                                                        } className='py-1 px-3 text-white bg-green-500 rounded-sm'>
                                                            Ready to Ship
                                                        </button>
                                                        <button onClick={() => {
                                                            setShip(2)
                                                            setPop(true)
                                                            setOk({...ok, id:item.id, code:6,transaction:item.transaction_details,warehouse:item.location_warehouse_id})
                                                        }} className='px-3 py-1 text-white bg-red-500 rounded-sm'>
                                                            Cancel
                                                        </button>
                                                    </div>
                                                    : null
                                            }

                                        </div>
                                        <div className={`${pop ? 'flex items-center justify-center' : 'hidden'} fixed top-0 bg-slate-300 bg-opacity-10  left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full`}>
                                            <div className="relative w-full h-full max-w-md md:h-auto">
                                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                                    <button type="button" onClick={() => setPop(false)} className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="popup-modal">
                                                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                                        <span className="sr-only">Close modal</span>
                                                    </button>
                                                    <div className="p-6 text-center">
                                                        <svg aria-hidden="true" className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                            {
                                                                ship == 1 ?
                                                                    'Are you sure to ship item?'
                                                                    :
                                                                    ' Cancel this transaction?'
                                                            }
                                                        </h3>
                                                        <button
                                                        disabled={disable}
                                                            onClick={() => {
                                                                setDisable(true)                             
                                                                    shipping(ok.id, ok.code, ok.transaction, ok.warehouse)  
                                                            }} data-modal-hide="popup-modal" type="button" className={`text-white ${ship == 1 ? 'bg-green-500 hover:bg-green-700' : 'bg-red-600 hover:bg-red-800'} focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2`}>
                                                            {
                                                                ship == 1 ?
                                                                    'Yes, send items' : 'Yes, cancel it'
                                                            }
                                                        </button>
                                                        <button disabled={disable} onClick={() => setPop(false)} data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                )

                            })
                            :
                            <div className='h-full w-full flex flex-col items-center justify-center'>
                                <img src={noData} width={'300px'} alt="" />
                                <div className='text-xl font-semibold'>
                                    Sorry Data Not Found
                                </div>
                            </div>
                    }



                </div>
                <Toaster />
            </div>
            :
            <Loading />
    )
}