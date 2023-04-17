import { useEffect, useState, useContext } from 'react'
import { Label } from "flowbite-react"
import axios from 'axios'
import { Outlet } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { FiUserPlus, FiUserX, FiShoppingBag } from 'react-icons/fi'
import { TbHome2 } from 'react-icons/tb'
import { AiOutlineStock } from 'react-icons/ai'
import { userData } from '../../data/userData'
import Loading from '../loading/loading'
import React from 'react';
import Moment from 'react-moment';
import { BsCurrencyDollar } from 'react-icons/bs'

//component
import Summary from './salesContainer/summary'
import SalesProduct from './salesContainer/product'
import Category from './salesContainer/category'

export default function SalesReport() {
    let { user } = useContext(userData)
    let [year, setYear] = useState([
        new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2, new Date().getFullYear() - 3
    ])
    let [pickM, setPickM] = useState(''), [pickY, setPickY] = useState(year[0]), [pickWH, setPickWH] = useState(0), [pickT, setPickT] = useState(1)


    let [month, setMonth] = useState([
        { 'month_id': 1, 'month': 'January' },
        { 'month_id': 2, 'month': 'February' },
        { 'month_id': 3, 'month': 'March' },
        { 'month_id': 4, 'month': 'April' },
        { 'month_id': 5, 'month': 'May' },
        { 'month_id': 6, 'month': 'June' },
        { 'month_id': 7, 'month': 'July' },
        { 'month_id': 8, 'month': 'August' },
        { 'month_id': 9, 'month': 'September' },
        { 'month_id': 10, 'month': 'October' },
        { 'month_id': 11, 'month': 'November' },
        { 'month_id': 12, 'month': 'December' }
    ])

    let [visible, setVisible] = useState({
        'month': false,
        'list_wh': [],
        success_t: 0,
        cancel_t: 0,
        'total': 0,
        'ongkir': 0,
        'discount': 0,
        'transaction': 0,
        'qty': 0,
        'category': [],
        'total_qty': 0,
        'page': 1,
        'total_count': 0,
        'total_pages': 0, 'totalMoney': 0, loading: true
    })

    let depault = async () => {
        setPickWH(user.warehouse_id ? user.warehouse.id : 0)
        try {
            toast('Welcome to sales report sir!', {
                style: {
                    background: 'black',
                    color: 'white'
                }
            })
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/transaction/allSales?start=${pickY}-01-01&end=${parseInt(pickY) + 1}-01-01&type=${pickT}&WH=${user.warehouse_id ? user.warehouse_id : 0}&page=${1}`)
            let total_price = 0, total_tr = 0, total_ongkir = 0, total_discount = 0
            response.data.data.forEach((item, index) => {
                total_ongkir += item.ongkir
                item.transaction_details.forEach((item) => {
                    total_price += (item.price * item.qty)
                    total_tr += item.qty
                })
            })

            setVisible({
                ...visible, list_wh: response.data.list_wh, total: total_price, ongkir: total_ongkir,
                total_count: response.data.total_count, success_t: response.data.success_t, loading: false, cancel_t: response.data.cancel_t,
                transaction: response.data.data.length, qty: total_tr, totalMoney: response.data.totalMoney
            })
        } catch (error) {
        }
    }

    let getSales = async (Y, M, T, WH, page) => {
        setPickWH(WH)
        setPickT(T)
        try {

            if (!M) {
                var response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/transaction/allSales?start=${Y}-01-01&end=${parseInt(Y) + 1}-01-01&type=${T}&WH=${WH}&page=${page}`)


            } else if (M) {
                if (M.split(',')[0] == 12) {
                    var response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/transaction/allSales?start=${Y}-${M.split(',')[0]}-01&end=${parseInt(Y) + 1}-01-01&type=${T}&WH=${WH}&page=${page}`)
                } else {
                    var response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/transaction/allSales?start=${Y}-${M.split(',')[0]}-01&end=${Y}-${parseInt(M) + 1}-01&type=${T}&WH=${WH}&page=${page}`)
                }

            }
            setPickY(Y)
            setPickM(M)

            if (T == 1) {
                let total_price = 0, total_ongkir = 0, total_discount = 0, total_product = 0, total_transaction = response.data.data.length
                response.data.data.forEach((item, index) => {
                    total_ongkir += item.ongkir
                    item.transaction_details.forEach((item) => {
                        total_price += (item.price * item.qty)
                        total_product += item.qty
                    })
                })

                setVisible({ ...visible, total: total_price, ongkir: total_ongkir, loading: false, transaction: total_transaction, qty: total_product, success_t: response.data.success_t, cancel_t: response.data.cancel_t })

            } else if (T == 2) {

                let price = 0
                let loader = [], items = 0, total_items = 0, price_product = 0
                response.data.data.forEach((item, index) => {
                    item.transaction_details.forEach((item) => {
                        price += item.price * item.qty
                        items += item.qty
                    })
                    total_items += items
                    loader.push({ 'category': item.name, 'totalC': price, 'qty': items })
                    price = 0
                    items = 0
                })

                setVisible({ ...visible, category: loader, total_qty: total_items, loading: false, success_t: response.data.success_t, cancel_t: response.data.cancel_t })
                total_items = 0
            } else if (T == 3) {
                setVisible({ ...visible, category: response.data.data, loading: false, page, total_count: response.data.total_count, total_pages: response.data.total_pages, success_t: response.data.success_t, cancel_t: response.data.cancel_t })
            }

        } catch (error) {

        }
    }

    useEffect(() => {
        depault()
    }, [])


    return (
            <div className="min-h-screen px-5 pt-24 lg:pt-3 pb-10">

                <div className="flex flex-col mt-2 mb-5 ">
                    <div className='text-2xl font-semibold'>
                        Summary Records
                    </div>
                    <div className='text-gray-500 text-sm mb-5 flex gap-2'>
                        <div>
                            until
                        </div>
                        <Moment
                            format='MMMM YYYY'

                        >

                        </Moment>
                        this year
                    </div>

                    <div className='flex flex-col lg:flex-row lg:justify-between mb-2 text-white '>
                        <div className='w-fit lg:w-1/2 flex lg:flex-row flex-col gap-5'>
                            <div className='h-20 gap-5 px-4 py-3 bg-stone-800 flex border-b-4 border-lime-300 rounded-md group'>
                                <div className='flex items-center justify-center px-3.5 text-center rounded-full bg-white group-hover:rotate-12 group-hover:duration-200'>
                                    <FiShoppingBag color='black' size={'24px'} />
                                </div>
                                <div className='flex flex-col items-end'>
                                    <div className='flex items-center gap-2'>
                                        <p className='text-xl font-semibold'>{visible.success_t}</p> <p>Orders done</p>
                                    </div>

                                    <div className='flex text-slate-400 items-center text-sm gap-1'>
                                        {visible.cancel_t} canceled
                                    </div>
                                </div>
                            </div>

                            <div className='h-20 gap-5 w-max px-4 py-3 bg-stone-800 flex border-b-4 border-slate-400 rounded-md group'>
                                <div className='flex items-center justify-center px-4 text-center rounded-full bg-white group-hover:rotate-12 group-hover:duration-200'>
                                    <BsCurrencyDollar color='black' size={'18px'} />
                                </div>
                                <div className='flex flex-col items-end'>
                                    <p className='text-xl font-semibold'>Rp. {(visible.total).toLocaleString()}</p>
                                    <div className='flex text-white items-center text-sm gap-1'>
                                        Incomes
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='lg:w-1/2 w-full mt-4 lg:mt-0 flex gap-5 justify-end'>
                            <div className='flex gap-5'>
                                <div className={`sm:min-w-fit block}`}>
                                    <div className="mb-2 block sm:min-w-fit">
                                        <Label
                                            value="Month"
                                        />
                                    </div >
                                    <select className='w-full text-gray-600 p-1 rounded-md border border-[#DBDBDB] focus:ring-transparent focus:border-black'
                                        onChange={(e) =>{
                                            setVisible({...visible, loading:true})
                                            getSales(pickY, e.target.value, pickT, pickWH, visible.page)
                                        }}
                                        id="bulan"
                                        required={true}
                                    >
                                        <option value={''}>All Month</option>
                                        {
                                            month.map((item, index) => {
                                                return (
                                                    <option value={`${item.month_id},${item.month}`}>{item.month}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='sm:min-w-fit'>
                                    <div className="mb-2">
                                        <Label
                                            value="Year"
                                        />
                                    </div >
                                    <select className='w-full text-gray-600 p-1 rounded-md border border-[#DBDBDB] focus:ring-transparent focus:border-black'
                                        onChange={(e) => {
                                            setVisible({...visible, loading:true})
                                            getSales(e.target.value, pickM, pickT, pickWH, visible.page)
                                        }}
                                        id="tahun"
                                        required={true}
                                    >
                                        {
                                            year.map((item, index) => {
                                                return (
                                                    <option value={item}>{item}</option>
                                                )
                                            })
                                        }

                                    </select>
                                </div>
                            </div>

                            {
                                user.warehouse_id > 0 ?
                                    <p className='text-md gap-2 flex items-center justify-end h-20 font-medium text-black'> <p>Warehouse</p>  {user.warehouse}</p> : 
                                    <div className='sm:min-w-fit'>
                                        <div className="mb-2">
                                            <Label
                                                value="Warehouse List :"
                                            />
                                        </div >
                                        <select className='w-full text-gray-600 px-3 py-1 border rounded-md border-[#DBDBDB] focus:ring-transparent focus:border-black'
                                            onChange={(e) => {
                                                setVisible({...visible, loading:true})
                                                getSales(pickY, pickM, pickT, e.target.value, visible.page)
                                            }}
                                            id="warehouse"
                                            required={true}
                                        >
                                            <option value="0">All Warehouse</option>
                                            {
                                                visible.list_wh.map((item, index) => {
                                                    return (
                                                        <option value={item.id}>{item.city}</option>
                                                    )
                                                })
                                            }

                                        </select>
                                    </div>
                            }
                        </div>

                    </div>
                </div>

                <div className='border-y-4 lg:text-md lg:text-lg text-xs border-yellow-300 rounded-md px-6 py-7 bg-stone-800 text-slate-200'>

                    <div className='flex gap-4'>
                        <button onClick={() => getSales(pickY, pickM, 1, pickWH, visible.page)} disabled={pickT == 1 ? true : false} className={`font-semibold ${pickT == 1 ? `scale-110 underline-offset-4 underline` : `hover:underline hover:underline-offset-4 transition duration-150 ease-in-out hover:scale-110 hover:bg-stone-700`}  px-2 `}>
                            Summary
                        </button>
                        <button onClick={() => {
                            setVisible({ ...visible, category: [] })
                            getSales(pickY, pickM, 2, pickWH, visible.page)
                        }} disabled={pickT == 2 ? true : false} className={`font-semibold ${pickT == 2 ? `scale-110 underline-offset-4 underline` : `hover:underline hover:underline-offset-4 transition duration-150 ease-in-out hover:scale-110 hover:bg-stone-700`}  px-2 `}>
                            Category
                        </button>
                        <button onClick={() => {
                            setVisible({ ...visible, category: [] })
                            getSales(pickY, pickM, 3, pickWH, visible.page)
                        }} disabled={pickT == 3 ? true : false} className={`font-semibold ${pickT == 3 ? `scale-110 underline-offset-4 underline` : `hover:underline hover:underline-offset-4 transition duration-150 ease-in-out hover:scale-110 hover:bg-stone-700`}  px-2 `}>
                            Products
                        </button>
                    </div>

                    <div className='h-full mt-6'>
                        <Outlet />
                        {
                            visible.loading?
                            <Loading/>
                            :
                            pickT == 1 ?
                                <Summary data={visible} />
                                :
                                pickT == 2 ?
                                    <Category data={visible} />
                                    : pickT == 3 ?
                                        visible.category.length==0?
                                        <div className='flex flex-col h-full items-center justify-center'>
                                        <lottie-player
                                            autoplay
                                            loop
                                            mode="normal"
                                            src="https://assets9.lottiefiles.com/packages/lf20_QbzmYGklCe.json"
                                            style={{ width: "200px" }}    >
                                        </lottie-player>
                                        <div className='text-2xl'>
                                            Data not found
                                        </div>
                                    </div>
                                    :
                                        <div className='flex flex-col'>
                                            <SalesProduct data={visible} />
                                            <div className='flex justify-center py-4 gap-2'>
                                                <button
                                                    disabled={(visible.page - 1) < visible.total_pages || visible.loading}
                                                    onClick={() => {
                                                        setVisible({...visible, loading:true})
                                                        getSales(pickY, pickM, pickT, pickWH, visible.page - 1)
                                                    }}
                                                    className='font-semibold rounded-l-lg px-4 hover:bg-black hover:text-white'>
                                                    Previous
                                                </button>
                                                <div>
                                                    Page {visible.page} of {visible.total_pages}
                                                </div>
                                                <button
                                                    disabled={(visible.page + 1) > visible.total_pages || visible.loading}
                                                    onClick={() => {
                                                        setVisible({...visible, loading:true})
                                                        getSales(pickY, pickM, pickT, pickWH, visible.page + 1)
                                                    }}
                                                    className='font-semibold rounded-r-lg px-7 hover:bg-black hover:text-white'>
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                        : null
                        }
                    </div>

                </div>

                <Toaster />
            </div>
    )
}