
import { FaUserFriends, FaChevronDown, FaChevronUp, FaUsers, FaUserCog } from 'react-icons/fa'
import { MdOutlineManageAccounts } from 'react-icons/md'
import { FiUsers, FiUserPlus } from 'react-icons/fi'

import { useState } from "react"
import { useNavigate } from 'react-router-dom'

export default function ManageAccount(props) {
    let navigate = useNavigate()
    return (
        <div className={`${props.data.open?'flex flex-col':''} relative`}>
            <button onClick={() => props.data.setToogleMA(!props.data.toogleMA)} className={`flex ease-out hover:opacity-100 duration-300 items-center gap-3 ` + (props.data.toogleMA ? 'opacity-100' : 'opacity-50')}>
                {props.data.open ?
                    <div className='flex gap-3'>
                        <MdOutlineManageAccounts size={'23px'} />
                        Manage Account
                        {
                            props.data.toogleMA ? <FaChevronUp className='animate-bounce' /> : <FaChevronDown className='animate-bounce' />
                        }
                    </div>
                    :
                    <div className='flex gap-3'>
                        <MdOutlineManageAccounts size={'23px'} />
                    </div>
                }
            </button>
            {
                props.data.toogleMA ?
                    props.data.open ?
                        <div className='flex flex-col gap-3 mt-3' >
                            <button onClick={() =>{
                                props.data.setToogleMA(false)
                                navigate('all-user')}} className='ml-5 flex text-sm focus:opacity-100 items-center gap-2 opacity-50 ease-in duration-200 hover:opacity-100 hover:translate-x-6 hover:delay-100'>
                                <FiUsers size={'18px'} />
                                All Account
                            </button>

                            <button onClick={() =>{
                                props.data.setToogleMA(false)
                                navigate('setting')}} className='ml-5 flex text-sm focus:opacity-100 items-center gap-2 opacity-50 ease-in duration-200 hover:opacity-100 hover:translate-x-6 hover:delay-100'>
                                <FiUserPlus size={'18px'} />
                                Admin Settings
                            </button>
                        </div>
                        :
                        <div  className={` ${props.data.toogleMA? 'absolute' : 'hidden'} bg-black left-16 z-10 w-40 rounded-md p-4 -top-10 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`} role="menu" aria-orientation="horizontal" aria-labelledby="menu-button" tabIndex="-1">
                            <div className='flex flex-col gap-3' >
                                <button onClick={() =>{
                                    props.data.setToogleMA(false)
                                    navigate('all-user')
                                    }} className='flex text-sm focus:opacity-100 items-center gap-2 opacity-50 ease-in duration-200 hover:opacity-100 hover:delay-100'>
                                    <FiUsers size={'18px'} />
                                    All Account
                                </button>

                                <button onClick={() =>{
                                    props.data.setToogleMA(false)
                                    navigate('setting')
                                    }} className=' flex text-sm focus:opacity-100 items-center gap-2 opacity-50 ease-in duration-200 hover:opacity-100 hover:delay-100'>
                                    <FiUserPlus size={'18px'} />
                                    Admin Settings
                                </button>
                            </div>
                        </div>
                    :
                    null
            }
        </div>
    )
}