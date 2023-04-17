import { useState, useContext, useEffect } from "react"
import axios from "axios"
import { userData } from "../../data/userData"
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import DatePicker from 'react-datepicker'
import React from 'react'
import Select from 'react-select'
import Loading from './../loading/loading'
import { TbNotebook, TbReceipt } from "react-icons/tb"

export default function LogProduct() {
    let { user } = useContext(userData)

    let [dataFilter, setDataFilter] = useState([])
    let [dataLog, setDataLog] = useState({
        log: [], category: [], product: [], addition: [], reduction: [], final: [],
        total_count: 0,
        total_pages: 0,
        warehouse: user.warehouse_id ? user.warehouse_id : 0,
        date: null,
        code: 1,
        shotgun: ['Summary', 'Detail'],
        page: 1,
        loading: true,
        pilihKategori: 1,
        pilihProduk: 1,
        pilihProdukIndex: 0,
        namaProduk: '',
        statusIndex: 0
    })

    let [filterStatus, setFilterStatus] = useState([
        { value: '', label: 'All Status', index: 0 },
        { value: 'Additional', label: 'Additional', index: 1 },
        { value: 'Reduction', label: 'Reduction', index: 2 },
        { value: 'Sold', label: 'Sold', index: 3 },
        { value: 'Cancelation', label: 'Cancelation', index: 4 }
    ])

    let filter = async () => {
        let response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/transaction/filter`, { data: 'Warehouse' })
        setDataFilter(response.data.data)
    }

    let getAllLog = async (page, warehouse_id, code, date, pilihKategori, pilihProduk, pilihProdukIndex, filterStatus) => {
        let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/log/log-history?page=${page}&warehouse_id=${warehouse_id}&code=${code}&date=${date}&pilihKategori=${pilihKategori}&pilihProduk=${pilihProduk}&filterStatus=${filterStatus.value}`)

        if (code == 1) {
            let loader = [], loader2 = []
            response.data.data.f_addition.forEach((item, index) => loader2.push(item - response.data.data.f_reduction[index]))
            response.data.data.product.forEach((item, index) => {
                loader.push({ 'value': item.id, 'label': item.name, 'index': index })
            })
            setDataLog({
                ...dataLog, log: response.data.data.getData,
                total_count: response.data.data.total_count,
                total_pages: response.data.data.total_pages,
                warehouse: warehouse_id, page, loading: false, category: response.data.data.category, code,
                product: loader, addition: response.data.data.addition, namaProduk: loader[pilihProdukIndex].label, pilihProdukIndex,
                reduction: response.data.data.reduction, final: loader2, pilihKategori, pilihProduk, date: date == 0 ? new Date() : new Date(date)
            })
        } else {
            let loader = []
            response.data.data.product.forEach((item, index) => {
                loader.push({ 'value': item.id, 'label': item.name, 'index': index })
            })
            setDataLog({
                ...dataLog, log: response.data.data.getData, product: loader, code, page, date, pilihKategori, pilihProduk, pilihProdukIndex, loading: false,
                total_count: response.data.data.total_count, category: response.data.data.category, namaProduk: loader[pilihProdukIndex].label,
                total_pages: response.data.data.total_pages, warehouse: warehouse_id, date: date == 0 ? new Date() : new Date(date), statusIndex: filterStatus.index
            })
        }

    }

    useEffect(() => {
        getAllLog(1, user.warehouse_id ? user.warehouse_id : 0, 1, 0, 1, 0, 0, { value: '', label: 'All Status', index: 0 })
        filter()
    }, [])

    return (
        <div className="px-5 lg:pt-8 pt-24">
            <div className='flex justify-between'>
                <div>
                    <div className="text-2xl font-semibold">
                        Log Product
                    </div>
                    <div className='text-gray-400 text-sm mb-6'>
                        {dataLog.total_count} log found
                    </div>
                </div>
                {
                    !user.warehouse ?
                        <div className='lg:hidden'>
                            <select
                                onChange={(e) => {
                                    setDataLog({ ...dataLog, loading: true, warehouse: e.target.value })
                                    getAllLog(1, e.target.value, dataLog.code, dataLog.date, dataLog.pilihKategori,
                                        dataLog.pilihProduk, dataLog.pilihProdukIndex, filterStatus[dataLog.statusIndex])
                                }}
                                className="border-gray-200 focus:ring-0 focus:border-border-200 focus:outline-none rounded-md" placeholder="Select Warehouse">
                                <option value={0}>All Warehouse Log</option>
                                {
                                    dataFilter.map((item, index) => {
                                        return (
                                            <option value={item.id}>{item.city}</option>
                                        )
                                    })
                                }
                            </select>
                        </div> :
                        <p className='text-md lg:hidden gap-2 flex items-end font-medium text-black'> <p>Warehouse</p>  {user.warehouse}</p>

                }
            </div>

            <div>

                <div className='flex justify-between gap-3 my-5 '>
                    <div className='flex gap-3'>
                        {dataLog.shotgun.map((item, index) => {
                            return (
                                <div className='gap-5 px-4 py-3 bg-stone-800 flex border-b-4 border-lime-300 rounded-md group'>
                                    <button
                                        disabled={dataLog.code == index + 1}
                                        onClick={() => {
                                            setDataLog({ ...dataLog, loading: true })
                                            getAllLog(1, dataLog.warehouse, index + 1, dataLog.date, dataLog.pilihKategori, dataLog.pilihProduk, dataLog.pilihProdukIndex, filterStatus[dataLog.statusIndex])
                                        }}
                                        className={`font-semibold flex gap-2 items-center relative hover:text-gray-200 ${dataLog.code == index + 1 ? 'text-gray-200' : 'text-gray-400'}  `}
                                    >
                                        {item == 'Summary' ? <TbNotebook /> : <TbReceipt />}

                                        {item}
                                    </button>
                                </div>
                            )
                        })}
                        <div className='flex flex-col gap-2 ml-5'>
                            <label className='text-xs pl-2 text-gray-700' htmlFor="A">Choose month</label>
                            <DatePicker
                                dateFormat="MMMM yyyy"
                                id="A"
                                showMonthYearPicker
                                placeholderText="Select month"
                                className="bg-gray-100 border w-fit border-gray-100 text-gray-900 text-xs rounded-md"
                                selected={dataLog.date}
                                onChange={(date) => {
                                    setDataLog({ ...dataLog, date, loading: true })
                                    getAllLog(1, dataLog.warehouse, dataLog.code, date.toLocaleDateString(), dataLog.pilihKategori, dataLog.pilihProduk, dataLog.pilihProdukIndex, filterStatus[dataLog.statusIndex])
                                }}
                            />

                        </div>
                    </div>

                    <div className='flex gap-3'>

                        {
                            !user.warehouse ?
                                <div className='hidden lg:block'>
                                    <select
                                        onChange={(e) => {
                                            setDataLog({ ...dataLog, loading: true, warehouse: e.target.value })
                                            getAllLog(1, e.target.value, dataLog.code, dataLog.date, dataLog.pilihKategori,
                                                dataLog.pilihProduk, dataLog.pilihProdukIndex, filterStatus[dataLog.statusIndex])
                                        }}
                                        className="border-gray-200 focus:ring-0 focus:border-border-200 focus:outline-none rounded-md" placeholder="Select Warehouse">
                                        <option value={0}>All Warehouse Log</option>
                                        {
                                            dataFilter.map((item, index) => {
                                                return (
                                                    <option value={item.id}>{item.city}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div> :
                                <p className='text-md hidden gap-2 lg:flex items-end font-medium text-black'> <p>Warehouse</p>  {user.warehouse}</p>

                        }

                    </div>

                </div>
            </div>

            {
                dataLog.code == 1 ?
                    dataLog.loading ?
                        <Loading />
                        :
                        <div className="relative overflow-x-auto shadow-md border p-4 border-y-4 border-green-500 rounded-lg px-6 py-7 bg-stone-800 text-slate-200">
                            <div className='flex justify-between w-full'>
                                <div className='flex w-1/2 lg:w-3/4 gap-10 mb-4 overflow-x-auto'>
                                    {
                                        dataLog.category?.map((item, index) => {
                                            return (
                                                <button
                                                    disabled={dataLog.pilihKategori == index + 1}
                                                    onClick={() => {
                                                        setDataLog({ ...dataLog, loading: true, warehouse: index + 1 })
                                                        getAllLog(1, dataLog.warehouse, dataLog.code, dataLog.date, index + 1,
                                                            0, 0, filterStatus[dataLog.statusIndex])
                                                    }}
                                                    className={`font-semibold relative hover:text-gray-200 ${dataLog.pilihKategori == index + 1 ? 'underline-offset-4 underline text-gray-200' : 'text-gray-500'}  `}
                                                >
                                                    {item.name}
                                                </button>
                                            )
                                        })}
                                </div>

                                <div className='w-1/2 lg:w-1/4 mb-5'>
                                    <Select
                                        menuPosition="fixed"
                                        className="basic-single text-black"
                                        classNamePrefix="select"
                                        defaultValue={dataLog.product[dataLog.pilihProdukIndex]}
                                        // isDisabled={dataLog.loading}
                                        // isLoading={dataLog.loading}
                                        onChange={(e) => {
                                            setDataLog({ ...dataLog, loading: true })
                                            getAllLog(1, dataLog.warehouse, dataLog.code, dataLog.date, dataLog.pilihKategori, e.value, e.index, filterStatus[dataLog.statusIndex])
                                        }}
                                        maxMenuHeight={220}
                                        options={dataLog.product} >

                                    </Select>
                                </div>
                            </div>
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-center border border-green-500 text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr >
                                            <th scope="col" className="px-6 py-3">
                                                Product
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Details
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Total Additional
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Total Reductional
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Final Stock
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            dataLog.loading ?
                                                <tr >
                                                    <td className="px-6 py-4 text-center">
                                                        <AiOutlineLoading3Quarters className='animate-spin' size={'20px'} />
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <AiOutlineLoading3Quarters className='animate-spin' size={'20px'} />
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <AiOutlineLoading3Quarters className='animate-spin' size={'20px'} />
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <AiOutlineLoading3Quarters className='animate-spin' size={'20px'} />
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <AiOutlineLoading3Quarters className='animate-spin' size={'20px'} />
                                                    </td>
                                                </tr>
                                                :
                                                dataLog.log.map((item, index) => {
                                                    return (
                                                        <tr className='border-green-500 bg-stone-800 border-b dark:bg-gray-900 dark:border-gray-700 text-slate-200'>
                                                            <td scope="col" className="px-6 py-3">
                                                                {dataLog.namaProduk}
                                                            </td>
                                                            {
                                                                item.connectivity == '' &&
                                                                    item.memory_storage == 0 &&
                                                                    item.processor == '' &&
                                                                    item.screen_size == '' ?
                                                                    <td className="px-6 py-4">
                                                                        -
                                                                    </td> :
                                                                    <td scope="col" className="px-6 py-3 flex flex-col gap-1.5">
                                                                        <div className="flex gap-2 justify-center">
                                                                            {item.color} <p style={{ backgroundColor: `${item.colorhex}` }} className={`w-5 rounded-full border border-stone-500 border-opacity-50 h-5 `}></p>
                                                                        </div>
                                                                        <div>{item.connectivity}</div>
                                                                        <div>{item.memory_storage} GB</div>
                                                                        <div>{item.processor}</div>
                                                                        <div>{item.screen_size ? item.screen_size + ' ' + 'inch' : null} </div>
                                                                        <div>{item.weight * 1000} g</div>
                                                                    </td>

                                                            }

                                                            <td scope="col" className=" px-6 py-3">
                                                                {dataLog.addition[index]}
                                                            </td>
                                                            <td scope="col" className=" px-6 py-3">
                                                                {dataLog.reduction[index]}
                                                            </td>
                                                            <td scope="col" className="px-6 py-3">
                                                                {dataLog.final[index]}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                        }
                                    </tbody>

                                </table>
                            </div>

                            <div className='flex justify-center pt-3 pb-4 gap-2'>
                                <button
                                    disabled={(dataLog.page - 1) == 0 || dataLog.loading}
                                    onClick={() => {
                                        setDataLog({ ...dataLog, loading: true, page: dataLog.page - 1 })
                                        getAllLog(dataLog.page - 1, dataLog.warehouse, dataLog.code, dataLog.date, dataLog.pilihKategori, dataLog.pilihProduk, dataLog.pilihProdukIndex, filterStatus[dataLog.statusIndex])
                                    }} className='font-semibold rounded-l-lg px-4 hover:bg-white hover:text-black'>
                                    Previous
                                </button>
                                <div>
                                    Page {dataLog.page} of {dataLog?.total_pages}
                                </div>
                                <button
                                    disabled={(dataLog.page + 1) > dataLog.total_pages || dataLog.loading}
                                    onClick={() => {
                                        setDataLog({ ...dataLog, loading: true, page: dataLog.page + 1 })
                                        getAllLog(dataLog.page + 1, dataLog.warehouse, dataLog.code, dataLog.date, dataLog.pilihKategori, dataLog.pilihProduk, dataLog.pilihProdukIndex, filterStatus[dataLog.statusIndex])
                                    }} className='font-semibold rounded-r-lg px-7 hover:bg-white hover:text-black'>
                                    Next
                                </button>
                            </div>

                        </div>
                    :
                    dataLog.loading ?
                        <Loading />
                        :
                        <div className="relative overflow-x-auto shadow-md border p-4 border-y-4 border-green-500 rounded-md px-12 py-7 bg-stone-800 text-slate-200">
                            <div className='flex justify-between w-full'>
                                <div className='flex gap-10 mb-4'>
                                    {
                                        dataLog.category?.map((item, index) => {
                                            return (
                                                <button
                                                    disabled={dataLog.pilihKategori == index + 1}
                                                    onClick={() => {
                                                        setDataLog({ ...dataLog, loading: true, warehouse: index + 1 })
                                                        getAllLog(1, dataLog.warehouse, dataLog.code, dataLog.date, index + 1,
                                                            0, 0, filterStatus[dataLog.statusIndex])
                                                    }}
                                                    className={`font-semibold relative hover:text-gray-200 ${dataLog.pilihKategori == index + 1 ? 'underline-offset-4 underline text-gray-200' : 'text-gray-500'}  `}
                                                >
                                                    {item.name}
                                                </button>
                                            )
                                        })}
                                </div>

                                <div className='flex gap-4 mb-5'>
                                    <Select

                                        className="basic-single text-black"
                                        classNamePrefix="select"
                                        defaultValue={filterStatus[dataLog.statusIndex]}
                                        onChange={(e) => {
                                            setDataLog({ ...dataLog, loading: true })
                                            getAllLog(1, dataLog.warehouse, dataLog.code, dataLog.date, dataLog.pilihKategori, dataLog.pilihProduk, dataLog.pilihProdukIndex, e)
                                        }}
                                        maxMenuHeight={220}
                                        options={filterStatus} >

                                    </Select>
                                    <Select
                                        className="basic-single text-black"
                                        classNamePrefix="select"
                                        defaultValue={dataLog.product[dataLog.pilihProdukIndex]}
                                        // isDisabled={dataLog.loading}
                                        // isLoading={dataLog.loading}
                                        onChange={(e) => {
                                            setDataLog({ ...dataLog, loading: true })
                                            getAllLog(1, dataLog.warehouse, dataLog.code, dataLog.date, dataLog.pilihKategori, e.value, e.index, filterStatus[dataLog.statusIndex])
                                        }}
                                        maxMenuHeight={220}
                                        options={dataLog.product} >

                                    </Select>
                                </div>
                            </div>

                            {
                                dataLog.log.length > 0 ?
                                    <div className="relative overflow-x-auto shadow-md  sm:rounded-lg">
                                        <table className="w-full text-sm text-center border border-green-500 text-gray-500 dark:text-gray-400">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3">
                                                        Id
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Warehouse
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Quantity
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Product
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Details
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    dataLog.log?.map((item, index) => {
                                                        return (
                                                            <tr className='border-green-500 bg-stone-800 border-b dark:bg-gray-900 dark:border-gray-700 text-slate-200'>
                                                                <td className="px-6 py-4" >
                                                                    {item.id}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {item.location_warehouse?.city}
                                                                </td>
                                                                <td className={`px-6 py-4 font-semibold ${item.status == 'Additional' ? 'text-green-500' : 'text-red-500'}`}>
                                                                    {item.status}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {item.qty}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {item.product_detail?.product.name}
                                                                </td>
                                                                <td className="flex px-6 py-4 flex-col gap-1.5 w-40">
                                                                    <div className="flex gap-2 justify-center">
                                                                        {item.product_detail?.color} <p style={{ backgroundColor: `${item.product_detail?.colorhex}` }} className={`w-5 rounded-full border border-stone-500 border-opacity-50 h-5 `}></p>
                                                                    </div>
                                                                    <div>{item.product_detail?.connectivity}</div>
                                                                    {
                                                                        item.product_detail?.memory_storage == 0 ?
                                                                            null
                                                                            :
                                                                            <div>{item.product_detail?.memory_storage != 1000 ? item.product_detail?.memory_storage + ' ' + 'GB' : (item.product_detail?.memory_storage / 1000) + ' ' + 'TB'}</div>
                                                                    }
                                                                    <div>{item.product_detail?.processor}</div>
                                                                    {item.product_detail?.screen_size.length > 0 ? <div>{item.product_detail?.screen_size} inch</div> : null}
                                                                    <div>{item.product_detail?.weight * 1000} g</div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                        <div className='flex justify-center p-5 gap-2'>
                                            <button
                                                disabled={(dataLog.page - 1) == 0 || dataLog.loading}
                                                onClick={() => {
                                                    setDataLog({ ...dataLog, loading: true, page: dataLog.page - 1 })
                                                    getAllLog(dataLog.page - 1, dataLog.warehouse, dataLog.code, dataLog.date, dataLog.pilihKategori, dataLog.pilihProduk, dataLog.pilihProdukIndex, filterStatus[dataLog.statusIndex])
                                                }} className='font-semibold rounded-l-lg px-4 hover:bg-black hover:text-white'>
                                                Previous
                                            </button>
                                            <div>
                                                Page {dataLog.page} of {dataLog?.total_pages}
                                            </div>
                                            <button
                                                disabled={(dataLog.page + 1) > dataLog.total_pages || dataLog.loading}
                                                onClick={() => {
                                                    setDataLog({ ...dataLog, loading: true, page: dataLog.page + 1 })
                                                    getAllLog(dataLog.page + 1, dataLog.warehouse, dataLog.code, dataLog.date, dataLog.pilihKategori, dataLog.pilihProduk, dataLog.pilihProdukIndex, filterStatus[dataLog.statusIndex])
                                                }} className='font-semibold rounded-r-lg px-7 hover:bg-black hover:text-white'>
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                    :
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
                            }
                        </div>
            }
        </div>
    )
}