import Moment from 'react-moment';
import { GrTransaction } from 'react-icons/gr'
import { AiOutlineStock } from 'react-icons/ai'
import { BiCoinStack } from 'react-icons/bi'
import { useEffect, useContext, useState, React } from 'react';
import axios from 'axios';
import { userData } from '../../data/userData'
import { FiUserCheck, FiUserX, FiUser } from 'react-icons/fi'
import Loading from '../loading/loading'
import {useNavigate} from 'react-router-dom'

export default function Dashboard() {
    let navigate = useNavigate()
    let { user } = useContext(userData)
    // console.log(user)
    let [data, setData] = useState({
        balances: 0,
        stock: 0,
        active_t: 0,
        getUser: 0,
        getUserX: 0,
        getUserY: 0,
        category: [],
        total_qty: 0,
        product: [],
        indexWarehouse: 0,
        loading: true
    })

    let getData = async (warehouse_id) => {
        try {
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/dash/allDash?warehouse_id=${warehouse_id}`)
            let duit = 0
            response.data.data.balances.forEach((item, index) => {
                item.transaction_details.forEach((item, index) => {
                    duit += item.qty * item.price
                })
            })

            setData({
                ...data, getUser: response.data.data.getUser, getUserY: response.data.data.getUserY, getUserX: response.data.data.getUserX,
                balances: duit, stock: response.data.data.total_stock, active_t: response.data.data.active_transaction, category: response.data.data.allCategory, total_qty: response.data.data.total_qty,
                product: response.data.data.allProduct1, loading: false
            })

        } catch (error) {

        }
    }

    useEffect(() => {
        getData(user.warehouse_id ? user.warehouse_id : 0)
    }, [])
    return (
        data.loading ?
            <Loading />
            :
            <div className=" h-full py-6 lg:pt-2 pt-24">
                <div className=' flex flex-col px-4'>
                    <div className='flex'>
                        <div className='flex flex-col'>
                            <div className="text-xl font-semibold">
                                Analyse data
                            </div>
                            <div>Update until today :  <Moment format="dddd, DD-MMMM-YYYY" date={new Date()} /></div>
                        </div>
                    </div>
                    <div className="flex w-full mt-4 gap-6">
                        <div className='flex flex-col lg:flex-row gap-8 w-fit lg:w-full text-white'>
                            <div className='h-20 gap-5 px-2 py-3 bg-stone-800 flex rounded-md border-b-4 border-yellow-300 text-white group'>
                                <div className='flex items-center justify-center px-4 text-center rounded-full bg-white group-hover:rotate-12 group-hover:duration-200'>
                                    <GrTransaction width={'20px'} />
                                </div>
                                <button onClick={()=>navigate('/admin/transaction')} className='flex flex-col items-end'>
                                    <div className='flex items-center gap-2'>
                                        <p className='text-md font-semibold'>{data.active_t} Active Transaction</p>
                                    </div>

                                    <div className='flex items-center text-sm gap-1 text-slate-400 '>
                                        Today
                                    </div>
                                </button>
                            </div>

                            <div className='h-20 gap-5 px-2 py-3 bg-stone-800 flex rounded-md border-b-4 border-yellow-300 text-white group'>
                                <div className='flex items-center justify-center text-black px-3.5 text-center rounded-full bg-white group-hover:rotate-12 group-hover:duration-200'>
                                    <BiCoinStack size={'22px'} />
                                </div>
                                <div className='flex flex-col items-end'>
                                    <div className='flex items-center gap-2'>
                                        <p className='text-md font-semibold'>  {data.stock} Total stock</p>
                                    </div>

                                    <div className='flex items-center text-sm gap-1 text-slate-400 '>
                                        Stock in all warhouse
                                    </div>
                                </div>
                            </div>
                            <div className='h-20 gap-5 px-2 py-3  bg-stone-800 flex border-b-4 border-slate-400 rounded-md group'>
                                <div className='flex items-center justify-center px-3 text-center rounded-full bg-white group-hover:rotate-12 group-hover:duration-200'>
                                    <AiOutlineStock color='black' size={'24px'} />
                                </div>
                                <div className='flex flex-col items-end'>
                                    <p className='text-md font-semibold'>Rp. {(data.balances).toLocaleString()}</p>
                                    <div className='flex text-white items-end text-sm gap-1'>
                                        total Balances
                                    </div>
                                </div>
                            </div>
                            <div className='h-20 gap-5 px-2 py-3 bg-stone-800 flex border-b-4 border-slate-400 rounded-md group'>
                                <div className='flex items-center justify-center px-3.5 text-center rounded-full bg-white group-hover:rotate-12 group-hover:duration-200'>
                                    <FiUser color='black' size={'24px'} />
                                </div>
                                <div className='flex flex-col items-end'>
                                    <p className='text-md font-semibold'>{data.getUser} Registered User</p>
                                    <div className='flex text-white items-center text-sm gap-3'>
                                        <div className='flex text-white items-center text-sm gap-1'>
                                            {data.getUserY} <FiUserCheck color='white' size={'14px'} />
                                        </div>
                                        <div className='flex text-white items-center text-sm gap-1'>
                                            {data.getUserX} <FiUserX color='white' size={'14px'} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>


                    </div>
                </div>
                <div className='flex flex-col lg:flex-row lg:justify-between'>
                    <div className="w-full lg:w-1/2 h-full px-6 flex flex-col mt-10">
                        <div className="flex flex-col  w-full min-h-fit px-9 pt-5 bg-stone-800 text-white rounded-md">
                            <div className="w-full flex flex-col mb-5 pb-2">
                                <div className="flex justify-between items-center border-b pb-3 border-white ">
                                    <div className="  flex flex-col gap-1 text-start text-lg ">
                                        Category
                                    </div>
                                    <div className="text-start text-lg ">
                                        Sold qty all time(%)
                                    </div>
                                </div>
                            </div>
                            {
                                data.category.map((item, index) => {
                                    return (
                                        <div className="w-full flex flex-col mb-5 pb-2 group">
                                            <div className="flex justify-between items-center ">
                                                <div className=" flex flex-col gap-1 text-start items-end text-lg ">
                                                    {item.category}
                                                    <hr className="w-0 group-hover:w-full group-hover:duration-500 h-0.5 bg-slate-300" />
                                                </div>
                                                <div className="w-2/4">
                                                    <div className="flex justify-end mb-1">
                                                        <span className="text-sm font-medium text-blue-700 dark:text-white">{`${item.qty?Math.floor((item.qty / data.total_qty) * 100):0}% `}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                                        <div className="bg-blue-600 h-2.5 rounded-full duration-300 ease-in" style={{ width: `${item.qty?Math.floor((item.qty / data.total_qty) * 100):0}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className='w-full lg:w-1/2 px-6 mt-4'>
                        <p className='text-xl mb-3 font-semibold'>Top gainers</p>
                        <div className='flex flex-col gap-4'>
                            {
                                data.product.map((item, index) => {
                                    return (
                                        <div className=' gap-5 pl-4 flex rounded-md border-b-4 border-yellow-300  '>
                                            <img src={`${process.env.REACT_APP_API_IMAGE_URL}Public/images/${item.image}`} className='w-20 h-20 object-contain' alt="" />
                                            <div className='w-full rounded-r-md px-4 py-2 text-white flex justify-between bg-stone-800'>
                                                <div className='flex flex-col gap-1'>
                                                    <p className='text-md font-semibold'>{item.label} </p> <p>{item.qty} items sold</p>
                                                </div>
                                                <div className="w-1/2 mt-3">
                                                    <div className="flex justify-end mb-1">
                                                        <span className="text-sm font-medium text-blue-700 dark:text-white">{`${item.qty?Math.floor((item.qty / data.total_qty) * 100):0}% `}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                                        <div className="bg-blue-600 h-2.5 rounded-full duration-300 ease-in" style={{ width: `${item.qty?Math.floor((item.qty / data.total_qty) * 100):0}%` }}></div>
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


            </div>
    )
}