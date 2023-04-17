import { useContext, useEffect, useRef, useState } from "react";
import {FiPlusCircle, FiMinusCircle} from 'react-icons/fi'
import { Modal, Button} from 'flowbite-react'
import axios from 'axios'
import toast,{ Toaster } from "react-hot-toast";
import { userData } from "../../data/userData"
import { useParams } from "react-router-dom";

export default function AdminProductListLocation(props){
    let {user} = useContext(userData)
        // console.log(user)

    const {id} = useParams()
    // console.log(id);
    let onUpdateInc = useRef()
    let onUpdateDec = useRef()
    
    const [showIncQty, setShowIncQty] = useState(false)
    const [showDecQty, setShowDecQty] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [quantity, setQuantity] = useState(0)
    const [defaultQty, setDefaultQty] = useState("")
    const [loc, setLoc] = useState(0)
    const [proId, setProId] = useState(0)
    const [detailProId, setDetailProId] = useState(0)
    
    let getQuantity = (valueid, valueqty, valueloc, valueproductid, valuedetailproductid)=>{
        setQuantity(valueid);
        setDefaultQty(valueqty)
        setLoc(valueloc)
        setProId(valueproductid)
        setDetailProId(valuedetailproductid)
    }

    let updateQty = async()=>{
        try {
            let a = Number(onUpdateInc.current.value)+defaultQty
            let b = defaultQty - Number(onUpdateDec.current.value)

            if(isNaN(onUpdateInc.current.value) || isNaN(onUpdateDec.current.value)){
                toast.error("Quantity Must Be Number")
                a=""
                b=""
                onUpdateInc.current.value = ""
                onUpdateDec.current.value = ""
            }
            else if(b<0){
                toast.error("Quantity Cannot Be Minus")
                a=""
                b=""
                onUpdateInc.current.value = ""
                onUpdateDec.current.value = ""
            }else if(onUpdateInc.current.value==0&&onUpdateDec.current.value==0){
                toast.error("Quantity Must Be Filled")
                a=""
                b=""
                onUpdateInc.current.value = ""
                onUpdateDec.current.value = ""
            }
            else if(onUpdateInc.current.value>0&&onUpdateDec.current.value==0){
                // console.log("Masuk Pertama")
                let response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/location/update`,{id: quantity, qty: a})
                // console.log(response);

                let data = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/location/stock`,{qty:onUpdateInc.current.value, status: "Additional", location_warehouse_id: loc, product_detail_id: proId, product_id: detailProId})
                // console.log(data);
                setTimeout(() => {
                    toast.success(`Update Quantity of Id ${quantity} Success`, {
                        duration: 3000
                    })
                }, 100)
                props.func.getLocationProduct(user.warehouse_id, props.data.showPage.page)
                setShowIncQty(!showIncQty)
                setShowModal(!showModal)
                a=""
                b=""
                onUpdateInc.current.value = ""
                onUpdateDec.current.value = ""
            }else if(onUpdateInc.current.value==0&&onUpdateDec.current.value>0){
                // console.log("Masuk Kedua")
                let response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/location/update`,{id: quantity, qty: b})
                // console.log(response);
                let data = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/location/stock`,{qty:onUpdateDec.current.value, status: "Reduction", location_warehouse_id: loc, product_detail_id: proId, product_id: detailProId})

                // console.log(data);
                setTimeout(() => {
                    toast.success(`Update Quantity of Id ${quantity} Success`, {
                        duration: 3000
                    })
                }, 100)
                props.func.getLocationProduct(user.warehouse_id, props.data.showPage.page)
                setShowDecQty(!showDecQty)
                setShowModal(!showModal)
                a=""
                b=""
                onUpdateInc.current.value = ""
                onUpdateDec.current.value = ""
            }

            a=""
            b=""
            onUpdateInc.current.value = ""
            onUpdateDec.current.value = ""
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
      props.func.getLocation()
      user.role==1?props.func.getLocationProduct():props.func.getLocationProduct(user.warehouse_id, props.data.showPage.page)
    //   props.func.getLocationProduct(user.warehouse_id, props.data.showPage.page)
    }, [])
    
    return(
        <div className="overflow-x-hidden">
            {/* Modal Increment */}
            <Modal
                show={showIncQty}
                size="lg"
                popup={true}
                onClose={()=>setShowIncQty(!showIncQty)  }
            >
            <Modal.Header/>
            <Modal.Body>
                <h3 className="text-xl mb-5 font-medium text-gray-900 dark:text-white text-center">
                    Additional of Quantity ({quantity})
                </h3>
                <div className="flex justify-center gap-4 mb-5">
                    <input ref={onUpdateInc} className='w-[100px] text-center py-2 border border-black focus:ring-transparent focus:border-black'                         
                    placeholder="0"
                    required={true}
                    />
                </div>
                <div className=" flex justify-center py-5">
                    <Button onClick={()=>{setShowModal(true)}} className='hover:border-black text-white border rounded-sm hover:text-black border-black bg-neutral-900 hover:bg-white w-[640px]'>                                                                                
                        Submit
                    </Button>
                </div>
            </Modal.Body>
            </Modal>
            {/* Modal Increment */}

            {/* Modal Decrement */}
            <Modal
                show={showDecQty}
                size="lg"
                popup={true}
                onClose={()=>setShowDecQty(!showDecQty)  }
            >
            <Modal.Header/>
            <Modal.Body>
                <h3 className="text-xl mb-5 font-medium text-gray-900 dark:text-white text-center">
                    Reduction of Quantity ({quantity})
                </h3>
                <div className="flex justify-center gap-4 mb-5">
                    <input ref={onUpdateDec} className='w-[100px] text-center py-2 border border-black focus:ring-transparent focus:border-black'                     
                    placeholder="0"
                    required={true}
                    />
                </div>
                <div className=" flex justify-center py-5">
                    <Button onClick={()=>{setShowModal(true)}} className='hover:border-black text-white border rounded-sm hover:text-black border-black bg-neutral-900 hover:bg-white w-[640px]'>                                                                                
                        Submit
                    </Button>
                </div>
            </Modal.Body>
            </Modal>
            {/* Modal Decrement */}

            <Modal
                    show={showModal}
                    size="sm"
                    popup={true}
                    onClose={()=>setShowModal(!showModal)  }
                >
                <Modal.Header/>
                    <Modal.Body>
                        <div className="flex-col">
                            <div className="felx text-xl mb-10 font-bold text-gray-900 dark:text-white text-center gap-5">
                                Save Changes?
                            </div>
                            <div className="flex justify-center gap-5">
                                <Button color="failure" onClick={()=>updateQty()} className="w-[150px] h-[50px]">
                                    <div className="text-xl font-bold">
                                        Yes
                                    </div>
                                </Button>
                                <Button onClick={()=>setShowModal(!showModal)} color="light" className="w-[150px] h-[50px]">
                                    <div className="text-xl font-bold">
                                        No
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                <div className="flex justify-center p-10 overflow-x-hidden">
                <div className='border-y-4 border-yellow-300 rounded-md w-96 md:w-full bg-stone-800 text-slate-200'>
                    <div className="flex justify-center gap-10 p-5">
                        <div className="relative overflow-y-auto shadow-md  sm:rounded-lg">
                            <table className="w-full text-sm text-center border border-yellow-300 text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Id
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Color
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Storage
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Location
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Quantity
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                {
                                    props.data.locationProduct.map((value, index)=>{
                                        return(
                                            <tbody >
                                                <tr className="border-yellow-300 bg-stone-800 border-b dark:bg-gray-900 dark:border-gray-700  text-slate-200">
                                                    <td className="px-6 py-3 font-bold">
                                                        {value.id}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        {value.product_detail.product.name}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        {value.product_detail.color}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        {value.product_detail.memory_storage}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        {props.data.locationCity}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        {value.qty}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <div className="flex justify-center gap-4">
                                                            <button onClick={()=>{getQuantity(value.id, value.qty, value.location_warehouse_id, value.product_detail.id, value.product_detail.product.id);setShowIncQty(!showIncQty)}} className="flex items-center"> 
                                                                <FiPlusCircle size={'20px'}/>
                                                            </button>
                                                            <button onClick={()=>{getQuantity(value.id, value.qty, value.location_warehouse_id, value.product_detail.id, value.product_detail.product.id);setShowDecQty(!showDecQty)}} className="flex items-center"> 
                                                                <FiMinusCircle size={'20px'}/>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        )
                                    })
                                }
                            </table>
                        </div>
                    </div>
                                {
                                    user.role == 1?
                            <div className='flex justify-center border p-5'>
                                    <button className={`border font-semibold rounded-l-lg px-4 text-stone-800 bg-slate-200 hover:bg-stone-800 hover:text-slate-200 ${props.data.showPage.page==1?'hidden':'block'}`} onClick={()=> {props.func.getLocationProduct(id, props.data.showPage.page, "prev")}}>
                                        Previous
                                    </button>
                                    <div>
                                        Page {props.data.showPage.page}
                                    </div>
                                    <button className={`border font-semibold rounded-r-lg px-7 text-stone-800 bg-slate-200 hover:bg-stone-800 hover:text-slate-200 ${props.data.showPage.page==props.data.showPage.pages?'hidden':'block'}`} onClick={()=> {props.func.getLocationProduct(id, props.data.showPage.page, "next")}}>
                                        Next
                                    </button>
                                </div>:
                                    <div className='flex justify-center border p-5'>
                                    <button className={`border font-semibold rounded-l-lg px-4 text-stone-800 bg-slate-200 hover:bg-stone-800 hover:text-slate-200 ${props.data.showPage.page==1?'hidden':'block'}`} onClick={()=> {props.func.getLocationProduct(user.warehouse_id, props.data.showPage.page, "prev")}}>
                                        Previous
                                    </button>
                                    <div>
                                        Page {props.data.showPage.page}
                                    </div>
                                    <button className={`border font-semibold rounded-r-lg px-7 text-stone-800 bg-slate-200 hover:bg-stone-800 hover:text-slate-200 ${props.data.showPage.page==props.data.showPage.pages?'hidden':'block'}`} onClick={()=> {props.func.getLocationProduct(user.warehouse_id, props.data.showPage.page, "next")}}>
                                        Next
                                    </button>
                                </div>
                                }
                </div>
            </div>
        </div>
    )
}