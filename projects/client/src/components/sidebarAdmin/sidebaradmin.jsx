import { TbBuildingWarehouse, TbReportAnalytics } from 'react-icons/tb'
import { MdOutlineSpaceDashboard } from 'react-icons/md'
import { BsMailbox, BsCurrencyDollar, BsFillArrowLeftCircleFill } from 'react-icons/bs'
import { useNavigate, useLocation } from 'react-router-dom'
import { useContext, useState } from 'react'
import { userData } from "../../data/userData";
import { AiOutlineHistory } from 'react-icons/ai'

//import components
import ManageAccount from '../manageAccount/manageaccount'
import ManageProduct from '../manageProduct/manageProduct'

export default function SidebarAdmin(props) {
    let [visible, setVisible] = useState({
        sidebar: false
    })

    let location = useLocation()
    // console.log(location.pathname.split('/'))
    let { user, setUser } = useContext(userData)

    // console.log(props.data.open)
    let navigate = useNavigate()
    return (

        <div className={`fixed px-5 py-5 ${props.data.open ? `lg:w-60 w-fit` : `lg:w-20 lg:block -translate-x-32 lg:-translate-x-0`} duration-300 h-full text-white bg-black z-20`}>
            <div className='flex flex-col h-full'>
                <button onClick={() =>navigate('/')} className={`w-fit ${props.data.open ? 'ml-3' : ''} mb-10 object-contain relative flex items-end`}>
                    <img src={`${process.env.REACT_APP_API_IMAGE_URL}Public/images/${props.data.open ? 'F_logo' : 'favicon(1)'}.png`} alt="" width={`${props.data.open ? '80px' : '25px'}`} />
                </button>

                <button className={`absolute flex -right-3 mt-7 bg-white rounded-full`} onClick={() =>{
                     props.data.setOpen(!props.data.open)
                    if(props.data.open==true) props.data.setToogleMA(false)
                     }}>
                    <BsFillArrowLeftCircleFill color='grey' size={'30px'} className={`${!props.data.open && `rotate-180`}`} />
                </button>
                <div className='flex flex-col gap-8'>
                    {props.data.open ?
                        <button onClick={() =>{
                            props.data.setOpen(!props.data.open)
                            navigate('/admin')}} className={`flex items-center gap-3 ${location.pathname.split('/')[2] == undefined || location.pathname.split('/')[2] == '' ? '' : 'opacity-50 ease-in duration-200 hover:opacity-100 hover:translate-x-6 hover:delay-100'}`}>
                            <div className='flex items-center gap-3'>
                                <MdOutlineSpaceDashboard size={'20px'} />
                                Dashboard
                            </div>
                        </button>
                        :
                        <button onClick={() => navigate('/admin')} className={`flex items-center gap-3 ${location.pathname.split('/')[2] == undefined || location.pathname.split('/')[2] == '' ? '' : 'opacity-50 ease-in duration-200 hover:opacity-100 hover:delay-100'}`}>
                            <div className='flex items-center gap-3'>
                                <MdOutlineSpaceDashboard size={'20px'} />
                            </div>
                        </button>
                    }
                    {
                    user.role == 1 ?
                        <div className='flex flex-col gap-8'>
                            <ManageAccount data={{ ...props.data }} />
                        </div>
                        : null
                    }
                    {
                        user.role == 1 ?
                            <div className='flex flex-col gap-8'>
                                {props.data.open ?
                                    <div className='flex flex-col gap-8'>
                                        <button onClick={(() => navigate('warehouse'))} className={`flex items-center gap-3 ${location.pathname.split('/')[2] == 'warehouse' ? '' : 'opacity-50 ease-in duration-200 hover:opacity-100 hover:translate-x-6 hover:delay-100'}`}>
                                            <TbBuildingWarehouse size={'20px'} />
                                            Warehouse
                                        </button>
                                    </div>
                                    :
                                    <button onClick={(() => navigate('warehouse'))} className={`flex items-center gap-3 ${location.pathname.split('/')[2] == 'warehouse' ? '' : 'opacity-50 ease-in duration-200 hover:opacity-100 hover:delay-100'}`}>
                                        <TbBuildingWarehouse size={'20px'} />
                                    </button>
                                }
                            </div>
                            : null
                    }

                    {props.data.open ?
                        <button onClick={() => navigate('Transaction')} className={`flex items-center gap-3 ${location.pathname.split('/')[2] == 'Transaction' ? '' : 'opacity-50 ease-in duration-200 hover:opacity-100 hover:translate-x-6 hover:delay-100'}`}>
                            <BsCurrencyDollar size={'20px'} />
                            Transaction
                        </button>
                        :
                        <button onClick={() => navigate('Transaction')} className={`flex items-center gap-3 ${location.pathname.split('/')[2] == 'Transaction' ? '' : 'opacity-50 ease-in duration-200 hover:opacity-100  hover:delay-100'}`}>
                            <BsCurrencyDollar size={'20px'} />
                        </button>
                    }
                    {props.data.open ?
                        <button onClick={() => navigate('log-product')} className={`flex items-center gap-3 ${location.pathname.split('/')[2] == 'log-product' ? '' : 'opacity-50 ease-in duration-200 hover:opacity-100 hover:translate-x-6 hover:delay-100'}`}>
                            <AiOutlineHistory size={'22px'} />
                            Log Product
                        </button>
                        :
                        <button onClick={() => navigate('log-product')} className={`flex items-center gap-3 ${location.pathname.split('/')[2] == 'log-product' ? '' : 'opacity-50 ease-in duration-200 hover:opacity-100  hover:delay-100'}`}>
                            <AiOutlineHistory size={'22px'} />
                        </button>
                    }

                    {props.data.open ?
                        <button onClick={() => navigate('sales-report')} className={`flex items-center ${location.pathname.split('/')[2] == 'sales-report' ? '' : 'opacity-50 ease-in duration-200 hover:opacity-100 hover:translate-x-6 hover:delay-100'}  gap-3 `}>
                            <TbReportAnalytics size={'20px'} />
                            Sales Reports
                        </button>
                        :
                        <button onClick={() => navigate('sales-report')} className={`flex items-center ${location.pathname.split('/')[2] == 'sales-report' ? '' : 'opacity-50 ease-in duration-200 hover:opacity-100 hover:delay-100'}  gap-3 `}>
                            <TbReportAnalytics size={'20px'} />
                        </button>
                    }
                    <ManageProduct data={{ ...props.data }} />
                    {
                        user.role == 2 ?
                        props.data.open?
                            <button onClick={() => navigate('mutation')} className={`flex items-center gap-3 ${props.data.open?`opacity-50 ease-in duration-200 hover:opacity-100 hover:translate-x-6 hover:delay-100`:`opacity-50 hover:opacity-100`}`}>
                                <BsMailbox size={'20px'} />
                                Mutation
                            </button>
                            :
                            <button onClick={() => navigate('mutation')} className={`flex items-center gap-3 ${props.data.open?`opacity-50 ease-in duration-200 hover:opacity-100 hover:translate-x-6 hover:delay-100`:`opacity-50 hover:opacity-100`}`}>
                                <BsMailbox size={'20px'} />
                            </button>
                            :
                            null
                    }
                    {
                        user.role == 1 ?
                        props.data.open?
                            <button onClick={() => navigate('mutation-super')} className={`flex items-center gap-3 ${props.data.open?`opacity-50 ease-in duration-200 hover:opacity-100 hover:translate-x-6 hover:delay-100`:`opacity-50 hover:opacity-100`}`}>
                                <BsMailbox size={'20px'} />
                                All Mutation
                            </button>
                            :
                            <button onClick={() => navigate('mutation-super')} className={`flex items-center gap-3 ${props.data.open?`opacity-50 ease-in duration-200 hover:opacity-100 hover:translate-x-6 hover:delay-100`:`opacity-50 hover:opacity-100`}`}>
                                <BsMailbox size={'20px'} />
                            </button>
                            :
                            null
                    }
                </div>

                <div className='flex flex-col items-center justify-end h-full'>
                    <div className={`flex flex-col items-center justify-end h-full ${props.data.open ? `w-60` : `w-20 hidden`}`}>
                        Copyrights JCWD2301
                    </div>
                </div>
                {/* sidebar */}
            </div>
        </div>
    )
}