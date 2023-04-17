import { useEffect, useState, useRef, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import Loading from '../loading/loading'

import { BsGear } from 'react-icons/bs'

import { userData } from '../../data/userData'

export default function AdminSettingProfile() {
    let { user, setUser } = useContext(userData)

    let navigate = useNavigate()
    let email = useRef(), name = useRef(), phone_number = useRef(), location = useRef()
    let { id } = useParams()
    let [admin, setAdmin] = useState()
    let [enable, setEnable] = useState(true)
    let [updateAdmin, setUpdateAdmin] = useState({
        id: id,
        email: '',
        name: '',
        phone_number: '',
        location_warehouse_id: ''
    })

    let profile = async () => {
        try {
            let response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/admin/profile-setting`, { id: id })
            setAdmin(response.data.data)
        } catch (error) {
            navigate('/page-not-found')
        }
    }

    let update = (input, type) => {
        let loader = { ...updateAdmin }
        if (type == 'email') loader.email = input
        if (type == 'name') loader.name = input
        if (type == 'phone_number') loader.phone_number = input
        if (type == 'location') loader.location_warehouse_id = input
        setUpdateAdmin(loader)
    }

    let submit = async (input) => {
        let response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/admin/update`, input)
        toast.success(response.data.message)
        setTimeout(() => {
            window.location.reload(false)
        }, 2000)
    }

    useEffect(() => {
        profile()
    }, [])

    return (
        user ?
            user.role ?
                user.role == 1 ?
                    admin ?
                        <div className='h-full p-8'>
                            <div className='text-2xl font-semibold mb-5 flex items-center gap-5'>

                                {
                                    admin ?
                                        `${admin.name}'s Admin Profile Edit`
                                        :
                                        null
                                }

                                <button onClick={() => setEnable(!enable)}><BsGear /></button>
                            </div>

                            <div className={`h-3/4 border shadow-2xl border-emerald-200 ${enable ? 'bg-gray-200' : null} rounded-xl p-8 flex flex-col gap-12`}>
                                <div class="relative w-1/3 flex h-10 flex-row-reverse overflow-clip rounded-lg">
                                    <input onChange={() => update(email.current.value, 'email')} ref={email} disabled={enable} class="peer w-full  rounded-r-lg border border-slate-400 px-2 text-slate-900 placeholder-slate-400 transition-colors duration-300 focus:border-sky-400 focus:outline-none" type="text" placeholder={admin.email} />
                                    <label class="flex items-center rounded-l-lg border border-slate-400 bg-slate-50 px-2 text-sm text-slate-400 transition-colors duration-300 peer-focus:border-sky-400 peer-focus:bg-sky-400 peer-focus:text-white" htmlFor="domain">Email</label>
                                </div>

                                <div class="relative w-1/3 flex h-10 flex-row-reverse overflow-clip rounded-lg">
                                    <input onChange={() => update(name.current.value, 'name')} ref={name} disabled={enable} class="peer w-full  rounded-r-lg border border-slate-400 px-2 text-slate-900 placeholder-slate-400 transition-colors duration-300 focus:border-sky-400 focus:outline-none" type="text" placeholder={admin.name} />
                                    <label class="flex items-center rounded-l-lg border border-slate-400 bg-slate-50 px-2 text-sm text-slate-400 transition-colors duration-300 peer-focus:border-sky-400 peer-focus:bg-sky-400 peer-focus:text-white" htmlFor="domain">Name</label>
                                </div>

                                <div class="relative w-1/3 flex h-10 flex-row-reverse overflow-clip rounded-lg">
                                    <input onChange={() => update(phone_number.current.value, 'phone_number')} ref={phone_number} disabled={enable} class="peer w-full  rounded-r-lg border border-slate-400 px-2 text-slate-900 placeholder-slate-400 transition-colors duration-300 focus:border-sky-400 focus:outline-none" type="text" placeholder={admin.phone_number ? admin.phone_number : '-'} />
                                    <label class="flex items-center rounded-l-lg border border-slate-400 bg-slate-50 px-2 text-sm text-slate-400 transition-colors duration-300 peer-focus:border-sky-400 peer-focus:bg-sky-400 peer-focus:text-white" htmlFor="domain">Phone_number</label>
                                </div>

                                <div class="relative w-1/3 flex h-10 flex-row-reverse overflow-clip rounded-lg">
                                    <input onChange={() => update(location.current.value, 'location')} ref={location} disabled={enable} class="peer w-full  rounded-r-lg border border-slate-400 px-2 text-slate-900 placeholder-slate-400 transition-colors duration-300 focus:border-sky-400 focus:outline-none" type="text" placeholder={admin.location_warehouse_id ? admin.location_warehouse_id : '-'} />
                                    <label class="flex items-center rounded-l-lg border border-slate-400 bg-slate-50 px-2 text-sm text-slate-400 transition-colors duration-300 peer-focus:border-sky-400 peer-focus:bg-sky-400 peer-focus:text-white" htmlFor="domain">Location_Warehouse</label>
                                </div>

                            </div>

                            <div className='flex justify-end mr-10 mt-3 gap-6 '>
                                <button onClick={() => submit(updateAdmin)} className='bg-blue-500 rounded-xl p-3 shadow-xl hover:bg-blue-600 text-white text-lg font-semibold'>Submit</button>
                                {/* <button className='bg-red-500 rounded-xl p-3 shadow-xl hover:bg-red-600 text-white text-lg font-semibold'>Cancel</button> */}
                            </div>
                            <Toaster />

                        </div>
                        :
                        <Loading />
                    :
                    navigate('*')
                :
                navigate('/page-not-found')
                :
                <Loading/>
    )
}