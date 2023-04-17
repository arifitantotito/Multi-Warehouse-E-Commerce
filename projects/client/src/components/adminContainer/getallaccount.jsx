import { useEffect, useState, useContext, useRef } from "react"
import axios from 'axios'
import { userData } from '../../data/userData'
import { useNavigate } from "react-router-dom"
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

export default function GetAllAccount() {
    let navigate = useNavigate()
    let inputSearch = useRef()
    let { user, setUser } = useContext(userData)

    let [dataAdmin, setDataAdmin] = useState({
        user: [],
        total_count: 0,
        total_pages: 0,
        page: 1,
        code: 1,
        loading: true, page_size:0
    }), [shotgun, setShotgun] = useState(['Users', 'Admins'])

    let getData = async (page, code, inputSearch) => {
        let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/allUser?page=${page}&code=${code}&inputSearch=${inputSearch}`)

        setDataAdmin({
            ...dataAdmin, user: response.data.data.response, total_count: response.data.data.total_count,
            total_pages: response.data.data.total_pages, page, code, loading: false, page_size:response.data.data.page_size
        })

    }

    useEffect(() => {
        getData(1, 1,'')
    }, [])

    return (
        user.role ?
            user.role == 1 ?
                <div className="p-5 flex flex-col gap-2 lg:pt-2 pt-24">
                    <div className="flex flex-col gap-1 mb-10" >
                        <div className="text-2xl font-semibold">
                            All Account
                        </div>
                        <div className="text-gray-500 text-sm opacity-60">
                            {dataAdmin.total_count} account found
                        </div>
                    </div>
                    <div className='relative overflow-x-auto shadow-md border border-y-4 border-red-500 rounded-md px-6 py-4 bg-stone-800 text-slate-200'>
                        <div className='flex justify-between'>
                            <div className="flex gap-6 mb-5">
                                {
                                    shotgun.map((item, index) => {
                                        return (
                                            <button
                                                disabled={dataAdmin.code == index + 1 ? true : false}
                                                onClick={() => {
                                                    setDataAdmin({ ...dataAdmin, loading: true })
                                                    getData(1, index + 1, inputSearch.current.value)
                                                }} className={`font-semibold relative hover:text-white ${dataAdmin.code == index + 1 ? 'underline-offset-4 underline text-white' : 'text-gray-600'}  `}>
                                                {item}
                                            </button>
                                        )
                                    })
                                }
                            </div>
                           
                            <div className='w-1/2 lg:w-1/3'>
                                <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </div>
                                    <input ref={inputSearch} type="search" id="default-search" className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search by name or email or phone number" required />
                                    <button onClick={() => {
                                        setDataAdmin({ ...dataAdmin, loading: true })
                                        getData(1, dataAdmin.code, inputSearch.current.value)
                                    }} className="text-white absolute right-2.5 bottom-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                                </div>
                            </div>
                        </div> 
                        {
                            dataAdmin.user.length==0?
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
                                <div className="relative overflow-x-auto shadow-md  sm:rounded-lg">
                                <table className="w-full text-sm text-center border border-red-500 text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th className="px-6 py-4">
                                               No
                                            </th>
                                            <th className="px-6 py-4">
                                                Name
                                            </th>
                                            <th className="px-6 py-4">
                                                Email
                                            </th>
                                            <th className="px-6 py-4">
                                                Status
                                            </th>
                                            <th className="px-6 py-4">
                                                Phone number
                                            </th>
                                        </tr>
    
                                    </thead>
                                    <tbody>
                                        {
                                            dataAdmin.loading ?
                                                <tr className='border-red-500 bg-stone-800 border-b dark:bg-gray-900 dark:border-gray-700 text-slate-200'>
                                                    <td className="px-6 py-4 text-center">
                                                        <AiOutlineLoading3Quarters className='animate-spin' size={'20px'} />
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <AiOutlineLoading3Quarters className='animate-spin' size={'20px'} />
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <AiOutlineLoading3Quarters className='animate-spin' size={'20px'} />
                                                    </td> <td className="px-6 py-4 text-center">
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
                                                dataAdmin.user.map((value, index) => {
                                                    return (
                                                        value.role == 1 ?
                                                            null :
                                                            <tr className='border-red-500 bg-stone-800 border-b dark:bg-gray-900 dark:border-gray-700 text-slate-200'>
                                                                <td className="px-6 py-4">
                                                                    {dataAdmin.page_size*(dataAdmin.page-1)+ (index+1)}
                                                                </td>
                                                                <td className="lg:px-6 gap-3 lg:gap-0 py-4 flex lg:justify-between items-center">
                                                                    <img src={`${process.env.REACT_APP_API_IMAGE_URL}${value.photo_profile ? value.photo_profile : `Public/images/Blank_PP.jpg`}`} className="w-8 h-8 object-cover rounded-full" alt="" /> <p className='text-start w-1/2'> {value.name}</p>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {value.email}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {
                                                                        value.role ? <div className='flex gap-1 justify-start pl-7'><p>Admin Warehouse-</p> <p>{value.location_warehouse.city ? value.location_warehouse.city : '-'}</p></div> : value.status
                                                                    }
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {value.phone_number ? value.phone_number : '-'}
                                                                </td>
    
                                                            </tr>
                                                    )
                                                })
                                        }
    
                                    </tbody>
                                </table>
    
                                <div className='flex justify-center pt-3 pb-4 gap-2 '>
                                    <button
                                        disabled={(dataAdmin.page - 1) == 0 || dataAdmin.loading}
                                        onClick={() => {
                                            setDataAdmin({ ...dataAdmin, loading: true })
                                            getData(dataAdmin.page - 1, dataAdmin.code, inputSearch.current.value)
                                        }} className='font-semibold rounded-l-lg px-4 hover:bg-white hover:text-black'>
                                        Previous
                                    </button>
                                    <div>
                                        Page {dataAdmin.page} of {dataAdmin?.total_pages}
                                    </div>
                                    <button
                                        disabled={(dataAdmin.page + 1) > dataAdmin.total_pages || dataAdmin.loading}
                                        onClick={() => {
                                            setDataAdmin({ ...dataAdmin, loading: true })
                                            getData(dataAdmin.page + 1, dataAdmin.code, inputSearch.current.value)
                                        }} className='font-semibold rounded-r-lg px-7 hover:bg-white hover:text-black'>
                                        Next
                                    </button>
                                </div>
                                {/* box */}
                            </div>
                        }
                    </div>
                </div>
                :
                navigate('/*')
            :
            navigate('/page-not-found')
    )
}