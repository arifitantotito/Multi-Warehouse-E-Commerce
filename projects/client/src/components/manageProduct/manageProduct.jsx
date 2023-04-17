
import {FaChevronDown, FaChevronUp } from 'react-icons/fa'
import {  BsBox, BsInboxes, BsInbox } from 'react-icons/bs'

import { useState } from "react"
import { useNavigate } from 'react-router-dom'

export default function ManageProduct(props){
    let navigate = useNavigate()
    let [toogleMA, setToogleMA] = useState(false)
    return(
        <div className='flex flex-col'>
        <button onClick={() => setToogleMA(!toogleMA)} className={`flex ease-out hover:opacity-100 duration-300 items-center gap-3 ` + (toogleMA?'opacity-100':'opacity-50')}>
            {props.data.open?
                <div className='flex gap-3'>
                    <BsBox size={'18px'} />
                    Manage Product
                    {
                        toogleMA ? <FaChevronUp className='animate-bounce' /> : <FaChevronDown className='animate-bounce' />
                    }
                </div>
                :
                <div className='flex gap-3'>
                    <BsBox size={'18px'} />
                        {
                            toogleMA ? <FaChevronUp className='animate-bounce' /> : <FaChevronDown className='animate-bounce' />
                        }
                </div>
            }
        </button>
        {
            toogleMA ?
                props.data.open?
                    <div className='flex flex-col gap-3 mt-3' >
                        <button onClick={() => navigate('products')} className='ml-5 flex text-sm focus:opacity-100 items-center gap-2 opacity-50 ease-in duration-200 hover:opacity-100 hover:translate-x-6 hover:delay-100'>
                            <BsInbox size={'20px'} />
                            Products List
                        </button>
                        <button onClick={() => navigate('products-location')} className='ml-5 flex text-sm focus:opacity-100 items-center gap-2 opacity-50 ease-in duration-200 hover:opacity-100 hover:translate-x-6 hover:delay-100'>
                            <BsInboxes size={'20px'} />
                            Products Warehouse
                        </button>
                    </div>
                    :
                    <div className='flex flex-col gap-3 mt-3' >
                        <button onClick={() => navigate('products')} className={`ml-5 flex text-sm focus:opacity-100 items-center gap-2 ${props.data.open?`opacity-50 ease-in duration-200 hover:opacity-100 hover:translate-x-6 hover:delay-100`:`opacity-50 hover:opacity-100`}`}>
                            <BsInbox size={'20px'} />
                        </button>
                        <button onClick={() => navigate('products-location')} className={`ml-5 flex text-sm focus:opacity-100 items-center gap-2 ${props.data.open?`opacity-50 ease-in duration-200 hover:opacity-100 hover:translate-x-6 hover:delay-100`:`opacity-50 hover:opacity-100`}`}>
                            <BsInboxes size={'20px'} />
                        </button>
                    </div>
            :
            null
        }
    </div>
    )
}