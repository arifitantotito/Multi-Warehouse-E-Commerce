import { Card, Dropdown } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
// import iphonedisc from './../../Assets/iphonedisc.jpg'

export default function Product(props){
    const {id} = useParams()
    
    let [condi, setCondi] = useState(undefined)

    let condition = (ada)=>{
        setCondi(ada)
    }

    useEffect(()=>{
        props.func.getProduct(id)
        props.func.getColor(id)
    },[])
    return(
        <div className="pt-28">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center px-5 md:px-24 w-full">
                <div className="flex text-xl md:text-2xl font-semibold">
                    All Products ({props.data.show.length})
                </div>
                <div className='flex mt-5'>
                    <div className='mx-5'>
                        <Dropdown
                            className=''
                            label="Color"
                            inline={true}
                        >
                            {props.data.adaSort.map((value, index)=>{
                                return(
                                <Dropdown.Item onClick={() => {props.func.getProduct(`${id}`,`${value.color}`)}}>
                                    {value.color}
                                </Dropdown.Item>
                                )
                            })}
                        </Dropdown>
                    </div>
                    <div className='mx-5'>
                        <Dropdown
                            className=''
                            label="Price"
                            inline={true}
                        >
                            <Dropdown.Item onClick={() => {props.func.getProduct(`${id}`,`hilo`);}}>
                                High to Low
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => {props.func.getProduct(`${id}`,`lohi`);}}>
                                Low to High
                            </Dropdown.Item>
                        </Dropdown>
                    </div>
                    <div className='mx-5'>
                        <Dropdown
                            className=''
                            label="Name"
                            inline={true}
                        >
                            <Dropdown.Item onClick={() => {props.func.getProduct(`${id}`,`az`);}}>
                                A to Z
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => {props.func.getProduct(`${id}`,`za`);}}>
                                Z to A
                            </Dropdown.Item>
                        </Dropdown>
                    </div>
                </div>
            </div>
            <div className="flex justify-center p-10">
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-10 p-5">
                    {props.data.show? props.data.show.map((value, index)=>{
                        return(
                            <Link to={`/product/productdetail/${!props.data.nyow?value.id:value.product.id}`}>
                                <button className=" ">
                                    <div className="">
                                    {/* imgSrc={require(`../../Assets/${value.product_images[0].img}`)} */}
                                        <div className=''>
                                            {!props.data.nyow?
                                                <div className='min-h-[5px]' >
                                                    <img src={`${process.env.REACT_APP_API_IMAGE_URL}Public/images/${value.product_images[0].img}`} className='flex items-start h-96 object-cover ' alt="hai" />
                                                </div>
                                                :
                                                <div className='min-h-[5px]' >
                                                    <img src={`${process.env.REACT_APP_API_IMAGE_URL}Public/images/${value.product.product_images[0].img}`} className='flex items-start h-96 object-cover' alt="hai" />
                                                </div>
                                            }
                                            <div className=''>
                                                {!props.data.nyow?
                                                    <div className="flex justify-center font-bold text-lg">
                                                        {value.name}
                                                    </div>
                                                :
                                                    <div className="flex justify-center font-bold text-lg">
                                                        {value.product.name}
                                                    </div>
                                                }
                                                {!props.data.nyow?    
                                                    <div className="gap-1 flex-col justify-center text-sm">
                                                        <div className='text-md'>
                                                            <s>
                                                                Rp {value.product_details[0].price.toLocaleString()}
                                                            </s>
                                                        </div>
                                                        <div className="text-red-600 font-bold text-lg">
                                                            Rp {value.product_details[0].price.toLocaleString()}
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="gap-1 flex-col justify-center text-sm">
                                                        <div className='text-md'>
                                                            <s>
                                                                Rp {value.price.toLocaleString()}
                                                            </s>
                                                        </div>
                                                        <div className="text-red-600 font-bold text-lg">
                                                            Rp {value.price.toLocaleString()}
                                                        </div>
                                                    </div>
                                                }
                                                <div className='flex p-5 justify-center gap-3'>
                                                    {props.data.arrColor[index].map((val, idx)=>{
                                                        return(
                                                            <div style={{backgroundColor: `${val}`}} className={`w-4 h-4 border rounded-full`}></div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </Link>
                        )
                    })
                    : null}
                </div>
            </div>
            <div className='flex justify-center border p-5'>
                {props.data.cek==undefined?
                <button className={`border font-semibold rounded-l-lg px-4 text-stone-800 bg-slate-200 hover:bg-stone-800 hover:text-slate-200 ${props.data.showPage.page==1?'hidden':'block'}`} onClick={()=> {props.func.getProduct(id, condi, props.data.showPage.page, "prev")}}>
                    Previous
                </button>:null
                }
                {props.data.cek==undefined?
                <div>
                    Page {props.data.showPage.page}
                </div>:null
                }
                {props.data.cek==undefined?
                <button className={`border font-semibold rounded-r-lg px-7 text-stone-800 bg-slate-200 hover:bg-stone-800 hover:text-slate-200 ${props.data.showPage.page==props.data.showPage.pages?'hidden':'block'}`} onClick={()=> {props.func.getProduct(id, condi, props.data.showPage.page, "next")}}>
                    Next
                </button>:null
                }
            </div>
        </div>
    )
}