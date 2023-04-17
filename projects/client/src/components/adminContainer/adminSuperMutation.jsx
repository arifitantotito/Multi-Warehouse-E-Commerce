import axios from 'axios'
import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useParams } from "react-router-dom"
import { userData } from "../../data/userData"
import { Modal, Button, Label, Pagination } from 'flowbite-react'
import toast,{ Toaster } from "react-hot-toast";
import { MdOutlineDescription } from 'react-icons/md'
import { BsClock, BsFillChatDotsFill } from 'react-icons/bs'
import noData from '../../Assets/data_not_found2.jpg'

export default function AdminSuperMutation(){
    let {user} = useContext(userData)
        // console.log(user)

    const [locationName, setLocationName] = useState([])
    let shotgunStatus = [
        'bg-yellow-100 text-yellow-400 text-sm font-bold p-1',
        'bg-orange-100 text-orange-400 text-sm font-bold p-1',
        'bg-purple-200 text-purple-600 text-sm font-bold p-1',
        'bg-blue-100 text-blue-600 text-sm font-bold p-1',
        'bg-lime-400 bg-opacity-30 text-green-600 text-sm font-bold p-1',
        'bg-red-200 text-red-600 text-sm font-bold p-1',
        'bg-yellow-100 text-yellow-400 text-sm font-bold p-1',
    ]
    
    let [myMutation, setMyMutation] = useState([])
    let [myRequest, setMyRequest] = useState([])
    let [showPage, setShowPage] = useState(1)
    let [showPages, setShowPages] = useState(1)
    let [forStatus, setForStatus] = useState("")
    let [adaNama, setAdaNama] = useState(1)
    let [aku, setAku] = useState(1)
    
    let getLocation = async()=>{
        try {
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/location`)
            // console.log(response.data.data);
            setLocationName(response.data.data);
        } catch (error) {
            // console.log(error)
        }
    }

    let ab = []
    for(let i=0 ; i<locationName.length ; i++){
        ab.push(locationName[i].city)
    }
    // console.log(ab);

    let getMutation = async(valueid, _page, btn, status)=>{
        // console.log(adaNama);
        // // console.log(status);
        // // console.log(forStatus);
        // console.log(status);
        try {
            if(!status){
                if(btn==="next"){
                    _page=Number(_page)+1
                }else if(btn==="prev"){
                    _page=Number(_page)-1
                }
                let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/location/all-mutation/${valueid?valueid:aku}?page=${_page?_page:showPages}`)
                    // console.log(response.data.data);
                    setShowPage({page: response.data.page, pages: response.data.pages, total: response.data.total})
                    setMyMutation(response.data.data);
            }else if(status==7||status==5||status||6){
                // console.log(valueid)
                // console.log(_page)
                // console.log(btn)
                // console.log(status)
                let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/location/all-mutation/${valueid}/${status}?page=${_page?_page:showPage}`)
                // console.log(response.data.data);
                setShowPage({page: response.data.page, pages: response.data.pages, total: response.data.total})
                setMyMutation(response.data.data);
            }
        } catch (error) {
            
        }
    }

    let getMutationn = async(valueid, _page, btn, status)=>{
        // console.log(valueid);
        // console.log(_page);
        // console.log(btn);
        // console.log(showPages);
        // // // console.log(status);
        // // // console.log(forStatus);
        // // console.log(status);
        // console.log(status);
        // console.log("PAGE",_page==undefined?showPages:_page);
        // console.log("VALUE",valueid)
        try {
            if(status==19){
                if(btn==="next"){
                    _page=Number(_page)+1
                }else if(btn==="prev"){
                    _page=Number(_page)-1
                }
                let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/location/all-mutation/${valueid}?page=${_page?_page:showPages}`)
                    // console.log(response.data.data);
                    setShowPage({page: response.data.page, pages: response.data.pages, total: response.data.total})
                    setMyMutation(response.data.data);
            }
        } catch (error) {
            
        }
    }

    let ada = async(ya)=>{
        try {
            setForStatus(ya)
        } catch (error) {
            
        }
    }

    let wayaw = async(ada)=>{
        try {
            setAdaNama(ada)
        } catch (error) {
            
        }
    }
    useEffect(() => {
        getLocation()
        getMutation()
        // getConfirm()
    }, [])
    
    if(myRequest.length==0){
        <div>
            Loading
        </div>
    }
    
    return(
        <div className="p-5 flex flex-col gap-8 min-h-screen overflow-x-hidden">
            <div className="text-2xl font-semibold">
                All Warehouse Mutation
            </div>
            {
                user.role==1?
                <div className="border rounded-sm flex justify-between w-full">
                    <div className="flex gap-5 py-3 px-5 overflow-y-hidden">
                    {locationName.map((value, index)=>{
                        return(
                            <div className='gap-5 px-4 py-2 bg-stone-800 flex border-b-4 border-lime-300 rounded-md group'>                            
                                <div className='flex flex-col items-end'>
                                    <button onClick={()=>{getMutation(value.id, null, null, null);wayaw(value.id)}} className=" rounded text-white min-w-[200px] lg:min-w-[100px] ">
                                        <p className='text-sm md:text-xl font-semibold'>{value.city} </p>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                    </div>
                </div>:null
            }
            <div>
                <div className='flex justify-between gap-5'>
                    <div className='flex  mt-5 mb-5'>
                        <div className='flex gap-5'>
                            <button className={`font-semibold hover:text-black 'underline-offset-4 underline text-black' : 'text-gray-300'} `}>
                                Warehouse {ab[adaNama-1]}
                            </button>
                        </div>
                    </div>
                    <div className='flex mt-5 mb-5 gap-4'>
                        <select className=' text-gray-600 p-1 rounded-sm border border-[#DBDBDB] focus:ring-transparent focus:border-black'
                            onChange={(e) => {ada(e.target.value);getMutation(adaNama,showPage.page, "prev"||"next", e.target.value);getMutationn(adaNama,showPage.page, "prev"||"next", e.target.value)}}
                            id="bulan"
                            required={true}
                        >
                            <option value={19}>All Status</option>
                            <option value={7}>Waiting</option>
                            <option value={5}>Confirmed</option>
                            <option value={6}>Canceled</option>
                            
                            </select>
                    </div>
                </div>
                    <div>
                        { myMutation.length>0?
                            myMutation.map((value, index)=>{
                                return(
                                    <div className='flex flex-col rounded-md border border-slate-200 shadow-sm z-0'>
                                            <div className='flex flex-col md:flex-row font-semibold gap-3 p-3'>
                                                <div className='flex md:w-1/2 gap-3'>
                                                    {/* <div className='font-semibold'>
                                                        {value.id}
                                                    </div> */}
                                                    <div className={`${shotgunStatus[value.order_status_id - 1]} flex justify-start px-2 rounded-xl py-1`}>
                                                        {value.order_status.status}
                                                    </div>

                                                    <div className='flex justify-end items-center opacity-50 gap-3'>
                                                        <BsClock />
                                                        {value.updatedAt.slice(0, 10)}
                                                    </div>
                                                </div>

                                                <div className='flex w-full md:justify-end items-center gap-3'>
                                                    <div className='opacity-60 text-sm font-medium'>
                                                        Request to :
                                                    </div>
                                                    Warehouse {ab[value.location_warehouse_id_target-1]}
                                                </div>
                                            </div>

                                            <div className='flex px-5 justify-between'>
                                                <div className='w-4/5 flex flex-col'>
                                                    <div className='flex'>
                                                        <img src={`${process.env.REACT_APP_API_IMAGE_URL}Public/images/${value.product_detail.product.product_images[0].img}`} className='w-20 h-20 object-contain' alt="" />
                                                        <div className='mt-4 font-bold flex flex-col items-start'>
                                                            <button>
                                                            {value.product_detail.product.name}
                                                            </button>
                                                            <div className='flex flex-col gap-2'>
                                                            {
                                                                (value.product_detail.color==null && value.product_detail.memory_storage==null)==true?
                                                                    <div className='opacity-60 font-lg'>
                                                                        Price: Rp. {value.product_detail.price}
                                                                    </div>
                                                                    :
                                                                    (value.product_detail.color && value.product_detail.memory_storage==null)==true?
                                                                    <div className='opacity-60 font-lg'>
                                                                        Price: {value.product_detail.price}, Color: {value.product_detail.color}
                                                                    </div>
                                                                    :
                                                                    <div className='opacity-60 font-lg'>
                                                                        Color: {value.product_detail.color}, Storage: {value.product_detail.memory_storage} GB
                                                                    </div>
                                                            }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='hidden md:w-1/5 md:flex'>
                                                    <div className='border'></div>
                                                    <div className='flex flex-col w-full h-full items-center justify-center text-lg font-bold'>
                                                        <div className='text-sm font-medium opacity-60'>Total Products</div>
                                                        <div>{value.qty} Pcs</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='flex items-center justify-between gap-8 p-5'>
                                                <div className='flex items-center gap-2'>
                                                    <div>
                                                        Category : 
                                                    </div>
                                                    <div className=' text-green-500'>
                                                        {value.product_detail.product.category.name}
                                                    </div>
                                                </div>
                                                    <div className=' flex justify-end md:hidden'>
                                                    <div className='border'></div>
                                                    <div className='flex flex-col w-full h-full items-center justify-center text-lg font-bold'>
                                                        <div className='text-sm font-medium opacity-60'>Total Products</div>
                                                        <div>{value.qty} Pcs</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                )
                            })
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
            </div>
            <div className='flex justify-center p-5'>
                <button className={`border font-semibold rounded-l-lg px-4 text-stone-800 bg-slate-200 hover:bg-stone-800 hover:text-slate-200 ${myMutation.length>0?`block`:`hidden`} ${showPage.page==1?'hidden':'block'}`} onClick={()=> {getMutationn(adaNama, showPage.page, "prev", forStatus);getMutation(adaNama, showPage.page, "prev", forStatus)}}>
                    Previous
                </button>
                <div>
                    Page {showPage.page}
                </div>
                <button className={`border font-semibold rounded-r-lg px-7 text-stone-800 bg-slate-200 hover:bg-stone-800 hover:text-slate-200 ${myMutation.length>0?`block`:`hidden`} ${showPage.page==showPage.pages?'hidden':'block'}`} onClick={()=> {getMutationn(adaNama, showPage.page, "next", forStatus);getMutation(adaNama, showPage.page, "next", forStatus)}}>
                    Next
                </button>
            </div>
        </div>
    )
}