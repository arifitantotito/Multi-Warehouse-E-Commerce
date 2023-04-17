import axios from "axios"
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import AdminProductListLocation from "./adminProductListLocation";
import { userData } from "../../data/userData"

export default function AdminProductLocation(){
    let {user} = useContext(userData)

    const [locationName, setLocationName] = useState([])
    const [locationProduct, setLocationProduct] = useState([])
    const [locationCity, setLocationCity] = useState("")
    const [initialCity, setInitialCity] = useState(1)
    const [showPage, setShowPage] = useState(1)

    let getLocation = async()=>{
        try {
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/location`)
            setLocationName(response.data.data)
        } catch (error) {
        }
    }

    let getLocationProduct = async(id, _page, btn)=>{
        try {
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/location/location-product/${id?id:initialCity}?page=${_page?_page:showPage}`)
            setShowPage({page: response.data.page, pages: response.data.pages, total: response.data.total})
            setLocationCity(response.data.response[0].city);
            setLocationProduct(response.data.data);
            if(btn==="next"){
                _page = Number(_page) + 1
                let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/location/location-product/${id?id:initialCity}?page=${_page?_page:showPage}`)
                setShowPage({page: response.data.page, pages: response.data.pages, total: response.data.total})
                setLocationCity(response.data.response[0].city);
                setLocationProduct(response.data.data);
            }else if(btn==="prev"){
                _page = Number(_page) - 1
                let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/location/location-product/${id?id:initialCity}?page=${_page?_page:showPage}`)
                setShowPage({page: response.data.page, pages: response.data.pages, total: response.data.total})
                setLocationCity(response.data.response[0].city);
                setLocationProduct(response.data.data);
            }
        } catch (error) {
            
        }
    }
    
    useEffect(() => {
      getLocation()
      user.role==1?getLocationProduct():getLocationProduct(user.warehouse_id)
      getLocationProduct(showPage)
    }, [])
    

    return(
        <div className="p-5 flex flex-col gap-8 min-h-screen">
            <div className="text-2xl font-semibold">
                Products Warehouse
            </div>
            {
                user.role==1?
                <div className="border rounded-sm flex justify-between w-full">
                    <div className="flex gap-5 py-3 px-5 overflow-y-hidden">
                    {locationName.map((value, index)=>{
                        return(
                            <Link to={`/admin/products-location/${value.id}`}>
                                <div className='gap-5 px-4 py-3 bg-stone-800 flex border-b-4 border-lime-300 rounded-md group'>                            
                                    <div className='flex flex-col items-end'>
                                        <button onClick={()=>{getLocationProduct(value.id, showPage.page)}} className=" rounded text-white min-w-[100px] ">
                                            <p className='text-xl font-semibold'>{value.city} </p>
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                    </div>
                </div>:null
            }
            
            <div className="text-center text-3xl font-semibold">
                {locationCity}'s Warehouse
            </div>
            <div>
                <AdminProductListLocation func={{getLocation, getLocationProduct}} data={{locationName, locationProduct, locationCity, showPage}}/>
            </div>
        </div>
    )
}