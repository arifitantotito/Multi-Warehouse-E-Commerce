import axios from 'axios'
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, Button, TextInput, Label } from 'flowbite-react'
import { toast, Toaster } from "react-hot-toast";
import iPhone14pro from './../../Assets/iphone_14_pro.jpg'

// import LogoBCA from './../../Assets/bca.png'

export default function Shipping(props) {

    let navigate = useNavigate()

    // const {id} = useParams()

    let onReceiver_name = useRef()
    let onUser_address = useRef()
    let onProvince = useRef()
    let onCity = useRef()
    let onSubdistrict = useRef()
    let onPhone_number = useRef()
    let onCourier = useRef()
    let onCost = useRef()

    const [address, setAddress] = useState([])
    const [checkAddress, setCheckAddress] = useState([])
    const [valueDefault, setValueDefault] = useState([])
    const [show, setShow] = useState(false)
    const [showAddress, setShowAddress] = useState(false)
    const [arrProvince, setArrProvince] = useState([])
    const [arrCity, setArrCity] = useState([])
    const [arrInitial, setArrInitial] = useState([])
    const [arrInitialCity, setArrInitialCity] = useState(0)
    const [initialID, setInitialID] = useState(0)

    const [selectedCity, setSelectedCity] = useState("")
    const [selectedCityId, setSelectedCityId] = useState(0)
    const [selectedName, setSelectedName] = useState("")
    const [selectedNumber, setSelectedNumber] = useState("")
    const [selectedUserAddress, setSelectedUserAddress] = useState("")
    const [selectedProvince, setSelectedProvince] = useState("")
    const [selectedSubdistrict, setSelectedSubdistrict] = useState("")
    const [checkValue, setCheckValue] = useState("")
    const [selectedID, setSelectedID] = useState(0)

    const [initialCity, setInitialCity] = useState("")
    const [initialName, setInitialName] = useState("")
    const [initialUserAddress, setInitialUserAddress] = useState("")
    const [initialProvince, setInitialProvince] = useState("")
    const [initialSubdistrict, setInitialSubdistrict] = useState("")
    const [initialNumber, setInitialNumber] = useState("")

    const [costShipping, setCostShipping] = useState([])
    const [priceShipping, setPriceShipping] = useState(0)
    const [disable, setDisable] = useState(true)

    const [dataCart, setDataCart] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)

    const [paymentInfoModal, setPaymentInfoModal] = useState(false)
    const [paymentModal, setPaymentModal] = useState(false)

    let getAllAddress = async () => {
        try {
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/shipping`, {
                headers: {
                    "token": localStorage.getItem('token')
                }
            })
            // console.log(response.data.data);
            setCheckAddress(response.data.data);
            let aa = []
            response.data.data.forEach((item) => {
                return item.value == 1 ? aa.push(item) : null
            })
            // console.log(aa[0]);
            setArrInitial(aa[0])
            setInitialID(aa[0].id)
            setArrInitialCity(aa[0].city_id)
            setValueDefault(response.data.data);
            setAddress(response.data.data)
            setInitialCity(aa[0].city)
            setInitialName(aa[0].receiver_name)
            setInitialUserAddress(aa[0].user_address)
            setInitialProvince(aa[0].province)
            setInitialSubdistrict(aa[0].subdistrict)
            setInitialNumber(aa[0].phone_number)
        } catch (error) {
            // console.log(error.message)
        }
    }

    let postAddress = async () => {
        try {
            let inputReceiverName = onReceiver_name.current.value
            let inputUserAddress = onUser_address.current.value
            let inputProvince = onProvince.current.value.split(", ")[1]
            let inputCity = onCity.current.value.split(",")[0]
            let inputCityId = onCity.current.value.split(",")[1]
            let inputSubdistrict = onSubdistrict.current.value
            let inputPhoneNumber = onPhone_number.current.value
            if (inputReceiverName.length === 0 || inputUserAddress.length === 0 || inputProvince.length === 0 || inputCity.length === 0 || inputSubdistrict.length === 0 || inputPhoneNumber.length === 0) throw { message: 'Incomplete Input' }
            let response = checkAddress.length ? await axios.post(`${process.env.REACT_APP_API_BASE_URL}/shipping/add-address`, { receiver_name: inputReceiverName, value: 0, user_address: inputUserAddress, province: inputProvince, city: inputCity, city_id: inputCityId, subdistrict: inputSubdistrict, phone_number: inputPhoneNumber },
                {
                    headers: {
                        "token": localStorage.getItem('token')
                    }
                })
                :
                await axios.post(`${process.env.REACT_APP_API_BASE_URL}/shipping/add-address`, { receiver_name: inputReceiverName, value: 1, user_address: inputUserAddress, province: inputProvince, city: inputCity, city_id: inputCityId, subdistrict: inputSubdistrict, phone_number: inputPhoneNumber },
                    {
                        headers: {
                            "token": localStorage.getItem('token')
                        }
                    })
            toast.success(`Add New Address Success`)
            setShow(!show)
            getAllAddress()
        } catch (error) {
            toast.error(error.message)
        }
    }

    let getDataProvince = async () => {
        try {
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/rajaongkir/province`, {
                headers: {
                    key: "767e2faef8f409adc96f179e3a949442",
                },
            });
            setArrProvince(response.data.data);
        } catch (error) {
            // console.log(error);
        }
    };

    let getDataCity = async () => {
        try {
            let data = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/rajaongkir/city?province_id=${onProvince.current.value.split(",")[0]}`, {
                headers: {
                    key: "767e2faef8f409adc96f179e3a949442",
                },
            });
            setArrCity(data.data.data.results)
        } catch (error) {
            // console.log(error);
        }
    };

    let getSelected = (value) => {
        try {
            setCheckValue(value)
            setSelectedCity(value.city);
            setSelectedCityId(value.city_id);
            setSelectedName(value.receiver_name);
            setSelectedNumber(value.phone_number);
            setSelectedUserAddress(value.user_address);
            setSelectedProvince(value.province);
            setSelectedSubdistrict(value.subdistrict);
            setShowAddress(false)
            setSelectedID(value.id)
            // console.log(value);


        } catch (error) {
            // console.log(error);
        }
    }

    let getCost = async () => {
        try {
            // console.log(onCourier.current.value);
            // console.log(onCost.current.value);
            let data = selectedCityId ? await axios.post(`${process.env.REACT_APP_API_BASE_URL}/rajaongkir/ongkir`, { origin: selectedCityId, destination: selectedCityId, weight: 1700, courier: `${onCourier.current.value}` }, {
                headers: {
                    key: "767e2faef8f409adc96f179e3a949442",
                },
            }) :
                await axios.post(`${process.env.REACT_APP_API_BASE_URL}/rajaongkir/ongkir`, { origin: arrInitialCity, destination: arrInitialCity, weight: 1700, courier: `${onCourier.current.value}` }, {
                    headers: {
                        key: "767e2faef8f409adc96f179e3a949442",
                    },
                })

            setCostShipping(data.data.data.results[0].costs);
            // console.log(data);
            setPriceShipping(costShipping[onCost.current.value.split(",")[1]].cost[0].value);
        } catch (error) {
            // console.log(error);
        }
    }

    let getService = () => {
        getCost()
        // console.log(onCost.current.value)
    }

    let getCart = async () => {
        try {
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/cart/data-cart`, {
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            setDataCart(response.data.data)
            // console.log(response.data.data)

            let sum = 0
            response.data.data.forEach(e =>
                sum += e.qty * e.product_detail.price)
            setTotalPrice(sum)
        } catch (error) {

        }
    }

    let continueOrder = async () => {
        try {
            if (onCourier.current.value == "choose" || onCost.current.value == "chooseService") throw { message: "Please choose your shipping courier" }

            setPaymentInfoModal(!paymentInfoModal)
        } catch (error) {
            if (!error.response) {
                toast.error(error.message)
            } else {
                toast.error(error.response.data.message)
            }
        }

    }

    let newOrder = async () => {
        try {

            let response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/transaction/createOrder`, { ongkir: priceShipping, receiver: !checkValue ? initialName : selectedName, address: !checkValue ? initialUserAddress : selectedUserAddress, subdistrict: !checkValue ? initialSubdistrict : selectedSubdistrict, city: !checkValue ? initialCity : selectedCity, province: !checkValue ? initialProvince : selectedProvince, courier: `${onCourier.current.value},${costShipping[onCost.current.value.split(",")[1]].description}`, user_id: dataCart[0].user_id, phone_number: !checkValue ? initialNumber : selectedNumber, user_name: !checkValue ? initialName : selectedName, cart: dataCart, user_address_id: !checkValue ? initialID : selectedID }, {
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            // console.log(response)

            navigate(`/shipping/success?id=${response.data.data.id}`)
            // props.func.setItemCart([])
            // setDataCart([])
        } catch (error) {
            if (!error.response) {
                toast.error(error.message)
            } else {
                toast.error(error.response.data.message)
            }
        }
    }

    useEffect(() => {
        getAllAddress()
        getDataProvince()
        props.func.notRegister()
        getCart()
        //   getCost()
    }, [])


    return (
        <>
            <div className="pt-20 flex flex-col md:px-5">
                <div className='font-bold text-3xl flex justify-start py-5 px-3 md:px-0'>
                    Shipping
                </div>
                <div className='flex flex-col md:flex-row md:justify-around'>
                    <div className='flex justify-end md:w-1/2 lg:w-2/3 md:mr-3 lg:mr-5'>
                        <div className='flex-col items-end w-full'>
                            <div className='flex-col items-end border mb-5 md:mb-0'>
                                <div className='flex justify-between border-b-2 py-3 px-3'>
                                    <div className='flex items-center font-bold text-xl'>
                                        Shipping Address
                                    </div>
                                </div>
                                <div className='p-2'>
                                    <div className=''>
                                        <div className=''>
                                            {checkValue ?
                                                <div>
                                                    <div className='text-lg px-4 font-bold pt-3'>
                                                        {selectedName}
                                                    </div>
                                                    <div className='text-md px-4'>
                                                        {selectedNumber}
                                                    </div>
                                                    <div className='text-md px-4'>
                                                        {selectedUserAddress}
                                                    </div>
                                                    <div className='text-md px-4'>
                                                        {selectedProvince}, {selectedSubdistrict}, {selectedCity}
                                                    </div>

                                                </div>
                                                : checkValue ? valueDefault.map((value, index) => {
                                                    return (
                                                        <div>
                                                            <div className='text-lg px-4 font-bold pt-3'>
                                                                {value.value == 1 ? value.receiver_name : null}
                                                            </div>
                                                            <div className='text-md px-4'>
                                                                {value.value == 1 ? value.phone_number : null}
                                                            </div>
                                                            <div className='text-md px-4'>
                                                                {value.value == 1 ? value.user_address : null}
                                                            </div>
                                                            <div className='text-md px-4'>
                                                                {/* {initialProvince? `${initialProvince},` : null} {initialSubdistrict? `${initialSubdistrict},`: null} {initialCity} */}
                                                            </div>
                                                        </div>

                                                    )
                                                })
                                                    :
                                                    <div>
                                                        <div className='text-lg px-4 font-bold pt-3'>
                                                            {initialName}
                                                        </div>
                                                        <div className='text-md px-4'>
                                                            {initialNumber}
                                                        </div>
                                                        <div className='text-md px-4'>
                                                            {initialUserAddress}
                                                        </div>
                                                        <div className='text-md px-4'>
                                                            {initialProvince ? `${initialProvince},` : null} {initialSubdistrict ? `${initialSubdistrict},` : null} {initialCity}
                                                        </div>
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                    <div className=''>
                                        <>
                                            {initialProvince ?
                                                <div className='flex justify-start p-3'>
                                                    <Button onClick={() => setShowAddress(!showAddress)} className="text-white border-solid rounded-sm hover:text-black hover:border-black bg-neutral-900 hover:bg-white">
                                                        Change Another Address
                                                    </Button>
                                                </div>
                                                :
                                                <div className='flex justify-center p-3'>
                                                    <Button onClick={() => setShow(!show)} className="text-white border rounded-sm hover:text-black border-black hover:border-black bg-neutral-900 hover:bg-white">
                                                        Add Address
                                                    </Button>
                                                </div>}
                                            <Modal
                                                show={showAddress}
                                                size="3xl"
                                                popup={true}
                                                onClose={() => setShowAddress(!showAddress)}
                                            >
                                                <Modal.Header />
                                                <Modal.Body>
                                                    <div className='text-lg md:text-2xl font-bold flex justify-center py-5'>
                                                        Choose Your Address
                                                    </div>
                                                    <div className=''>
                                                        <>
                                                            <div className='flex justify-center p-3'>
                                                                <Button onClick={() => setShow(!show)} className="text-white border rounded-sm hover:border-black hover:text-black border-black bg-neutral-900 hover:bg-white w-[640px]">
                                                                    Add New Address
                                                                </Button>
                                                            </div>
                                                            <Modal
                                                                show={show}
                                                                size="md"
                                                                popup={true}
                                                                onClose={() => setShow(!show)}
                                                            >
                                                                <Modal.Header />
                                                                <Modal.Body>
                                                                    <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                                                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center">
                                                                            Add New Address
                                                                        </h3>
                                                                        <div>
                                                                            <div className="mb-2 block">
                                                                                <Label
                                                                                    value="Receiver Name"
                                                                                />
                                                                            </div>
                                                                            <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black' ref={onReceiver_name}
                                                                                id="Receiver Name"
                                                                                placeholder="Name"
                                                                                required={true}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <div className="mb-2 block">
                                                                                <Label
                                                                                    value="Address"
                                                                                />
                                                                            </div>
                                                                            <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black' ref={onUser_address}
                                                                                id="Address"
                                                                                placeholder="Jl. xxx xxx"
                                                                                required={true}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <div className="mb-2 block">
                                                                                <Label
                                                                                    value="Province"
                                                                                />
                                                                            </div>
                                                                            <select
                                                                                onChange={() => getDataCity()}
                                                                                ref={onProvince}
                                                                                id="province"
                                                                                className="w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black"
                                                                            >
                                                                                {arrProvince.map((value, index) => {
                                                                                    return <option value={`${value.province_id}, ${value.province}`}>{value.province}</option>;
                                                                                })}
                                                                            </select>
                                                                        </div>
                                                                        <div>
                                                                            <div className="mb-2 block">
                                                                                <Label
                                                                                    value="City"
                                                                                />
                                                                            </div>
                                                                            <select
                                                                                ref={onCity}
                                                                                // onChange={(e) => onChangeDestination(e.target.value)}
                                                                                id="city"
                                                                                className="w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black"
                                                                            >
                                                                                {arrCity.map((value, index) => {
                                                                                    return (
                                                                                        <option value={`${value.city_name},${value.city_id}`}>{value.city_name}</option>
                                                                                    );
                                                                                })}
                                                                            </select>
                                                                        </div>
                                                                        <div>
                                                                            <div className="mb-2 block">
                                                                                <Label
                                                                                    value="Subdisctrict"
                                                                                />
                                                                            </div>
                                                                            <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black' ref={onSubdistrict}
                                                                                id="Subdisctrict"
                                                                                placeholder="Subdistrict"
                                                                                required={true}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <div className="mb-2 block">
                                                                                <Label
                                                                                    value="Phone Number"
                                                                                />
                                                                            </div>
                                                                            <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black' ref={onPhone_number}
                                                                                id="Phone Number"
                                                                                placeholder="08xxxxxxx"
                                                                                required={true}
                                                                            />
                                                                        </div>
                                                                        <div className=" flex justify-center">
                                                                            <Button onClick={() => { postAddress() }} className='hover:border-black text-white border rounded-sm hover:text-black border-black bg-neutral-900 hover:bg-white w-[640px]'>
                                                                                Submit
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </Modal.Body>
                                                            </Modal>
                                                        </>
                                                    </div>
                                                    <div className='p-0 md:p-2'>
                                                        <div className='p-0 md:p-2 overflow-x-hidden h-96'>
                                                            {address.map((value, index) => {
                                                                return (
                                                                    <div className='p-2'>
                                                                        {value.value == 1 ?
                                                                            <button onClick={() => getSelected(value)} className='p-2 border w-full  hover:bg-neutral-700 hover:text-white hover:border-lg-white focus:bg-neutral-700 focus:text-white'>
                                                                                <div className='flex justify-between items-center'>
                                                                                    <div className=''>
                                                                                        <div className='text-base md:text-xl px-2 md:px-4 font-bold flex justify-start'>
                                                                                            {value.receiver_name}
                                                                                        </div>
                                                                                        <div className='text-xs md:text-base px-2 md:px-4 flex justify-start'>
                                                                                            {value.user.phone_number}
                                                                                        </div>
                                                                                        <div className='text-xs md:text-base px-2 md:px-4 flex text-start justify-start'>
                                                                                            {value.user_address}
                                                                                        </div>
                                                                                        <div className='text-xs md:text-base px-2 md:px-4 flex text-start justify-start'>
                                                                                            {value.province}, {value.subdistrict}, {value.city}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className=''>
                                                                                        <div className='border px-3 py-1 font-bold text-sm md:text-base'>
                                                                                            Default
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </button>
                                                                            :
                                                                            <button onClick={() => getSelected(value)} className='p-2 border w-full  hover:bg-neutral-700 hover:text-white focus:bg-neutral-700 focus:text-white'>
                                                                                <div className=''>
                                                                                    <div className='text-base md:text-xl px-2 md:px-4 font-bold flex justify-start'>
                                                                                        {value.receiver_name}
                                                                                    </div>
                                                                                    <div className='text-xs md:text-base px-2 md:px-4 flex text-start justify-start'>
                                                                                        {value.user.phone_number}
                                                                                    </div>
                                                                                    <div className='text-xs md:text-base px-2 md:px-4 flex text-start justify-start'>
                                                                                        {value.user_address}
                                                                                    </div>
                                                                                    <div className='text-xs md:text-base px-2 md:px-4 flex text-start justify-start'>
                                                                                        {value.province}, {value.subdistrict}, {value.city}
                                                                                    </div>
                                                                                </div>
                                                                            </button>
                                                                        }
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </Modal.Body>
                                            </Modal>
                                        </>
                                    </div>
                                </div>
                            </div>

                            <div className='block md:hidden w-full border h-max '>
                                <div className='flex justify-between border-b-2 py-3 px-3'>
                                    <div className='flex items-center font-bold'>
                                        Shipping Courier
                                    </div>
                                </div>
                                <div className='flex p-5'>
                                    <div className='grid gap-2 w-full'>
                                        <div className='font-bold'>
                                            Choose Courier
                                        </div>
                                        <select ref={onCourier} onChange={(e) => {
                                            getCost(e.target.value)

                                            onCost.current.value = "chooseService"
                                            setPriceShipping(0)
                                        }} className='rounded-sm w-full border border-black focus:ring-0 focus:ring-transparent focus:border focus:border-black'>
                                            <option value={"choose"}>Choose Shipping</option>
                                            <option value={"jne"}>JNE</option>
                                            <option value={"pos"}>POS</option>
                                            <option value={"tiki"}>Tiki</option>
                                        </select>
                                        <div className='font-bold'>
                                            Choose Service
                                        </div>
                                        <select ref={onCost} onChange={(e) => {
                                            getService(e.target.value)
                                            // setDisable(false)

                                        }} className='rounded-sm w-full border border-black focus:ring-0 focus:ring-transparent focus:border focus:border-black'>
                                            <option value={"chooseService"}>Choose Service</option>
                                            {costShipping.map((value, index) => {
                                                return (
                                                    <option value={`${value.service},${index}`}>{value.service}</option>

                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className='w-full border mt-5 rounded-sm mb-5 md:mb-0'>
                                <div className='font-bold py-5 border-b-2 px-4 text-xl'>
                                    Shipping from iFrit Warehouse
                                </div>
                                {
                                    dataCart.map((value, index) => {
                                        return (
                                            <div className='flex items-center justify-between px-4 pr-10'>
                                                <div className='flex items-center gap-4'>
                                                    <div className='w-20'>
                                                        <img src={require(`../../Assets/${value.product.product_images[0].img}`)} alt="...." />
                                                    </div>
                                                    <div>
                                                        <div className='font-bold'>
                                                            {value.product.name}, {value.product_detail.memory_storage} GB, {value.product_detail.color}
                                                        </div>
                                                        <div className='text-neutral-700'>
                                                            Qty : {value.qty} | Price : Rp. {(value.qty * value.product_detail.price).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className='md:w-1/2 lg:w-1/3 md:ml-2 lg:ml-0'>
                        <div className='hidden md:block w-full border h-max mb-5'>
                            <div className='flex justify-between border-b-2 py-3 px-3'>
                                <div className='flex items-center font-bold text-xl'>
                                    Shipping Courier
                                </div>
                            </div>
                            <div className='flex p-5'>
                                <div className='grid gap-2 w-full'>
                                    <div className='font-bold'>
                                        Choose Courier
                                    </div>
                                    <select ref={onCourier} onChange={(e) => {
                                        getCost(e.target.value)

                                        onCost.current.value = "chooseService"
                                        setPriceShipping(0)
                                    }} className='rounded-sm w-full border border-black focus:ring-0 focus:ring-transparent focus:border focus:border-black'>
                                        <option value={"choose"}>Choose Shipping</option>
                                        <option value={"jne"}>JNE</option>
                                        <option value={"pos"}>POS</option>
                                        <option value={"tiki"}>Tiki</option>
                                    </select>
                                    <div className='font-bold'>
                                        Choose Service
                                    </div>
                                    <select ref={onCost} onChange={(e) => {
                                        getService(e.target.value)
                                        // setDisable(false)
                                    }} className='rounded-sm w-full border border-black focus:ring-0 focus:ring-transparent focus:border focus:border-black'>
                                        <option value={"chooseService"}>Choose Service</option>
                                        {costShipping.map((value, index) => {
                                            return (
                                                <option value={`${value.service},${index}`}>{value.service}</option>

                                            )
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='w-full border h-max bg-white px-3 py-4'>
                            <div className='font-bold text-xl'>
                                Shopping Summary
                            </div>
                            <div className='flex justify-between pt-3 text-neutral-400'>
                                <div>
                                    Total Order
                                </div>
                                <div>
                                    Rp. {totalPrice.toLocaleString()}
                                </div>
                            </div>
                            <div className='flex justify-between pt-1 pb-5 text-neutral-400'>
                                <div>
                                    Shipping Order
                                </div>
                                <div className=' text-red-500'>
                                    Rp. {priceShipping.toLocaleString()}
                                </div>
                            </div>
                            <div className='flex justify-between py-3 text-lg font-bold border-t-2'>
                                <div className=''>
                                    Total Order
                                </div>
                                <div>
                                    Rp. {(totalPrice + priceShipping).toLocaleString()}
                                </div>
                            </div>
                            <button onClick={() => continueOrder()} className={`bg-black text-white font-bold w-full py-2 rounded-sm`}>
                                Buy
                            </button>
                            <Modal
                                show={paymentInfoModal}
                                onClose={() => setPaymentInfoModal(!paymentInfoModal)}
                                size='lg'
                            >
                                <Modal.Header>
                                    Payment Information
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="space-y-6">
                                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                            Your order has been successfully received. Please make payment immediately
                                        </p>
                                        <p className="text-lg font-bold leading-relaxed text-neutral-800 dark:text-gray-600 border-t-2 pt-7">
                                            Shopping Summary
                                        </p>
                                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                            <div className='flex justify-between'>
                                                <div>
                                                    Total Order ({dataCart.length} items)
                                                </div>
                                                <div>
                                                    Rp. {totalPrice.toLocaleString()}
                                                </div>
                                            </div>
                                            <div className='flex justify-between'>
                                                <div>
                                                    Shipping Order
                                                </div>
                                                <div>
                                                    Rp. {priceShipping.toLocaleString()}
                                                </div>
                                            </div>
                                        </p>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <div className='flex justify-between items-center w-full'>
                                        <div>
                                            <div>
                                                Total Payment
                                            </div>
                                            <div className='font-bold'>
                                                Rp. {(totalPrice + priceShipping).toLocaleString()}
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => {
                                                    setPaymentModal(!paymentModal)
                                                    setPaymentInfoModal(false)
                                                }}
                                                className='bg-black text-white px-4 py-2'>
                                                Payment
                                            </button>
                                            <Modal
                                                show={paymentModal}
                                                onClose={() => setPaymentModal(!paymentModal)}
                                                size='lg'
                                            >
                                                <Modal.Header>
                                                    Payment
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <div>
                                                        <div className='flex justify-between items-center'>
                                                            <p className="text-lg font-bold leading-relaxed text-neutral-800 dark:text-gray-600">
                                                                Payment Method
                                                            </p>
                                                            {/* <button className="text-sm font-bold leading-relaxed text-orange-400 dark:text-gray-400">
                                                                Change Payment
                                                            </button> */}
                                                        </div>
                                                        <div className='flex items-center py-5 px-7'>
                                                            <img src={`${process.env.REACT_APP_API_IMAGE_URL}Public/images/Bank_Central_Asia.webp`} alt='Logo BCA' className='w-2/12' />
                                                            <p className='ml-8 text-sm'>
                                                                BCA Virtual Account
                                                            </p>
                                                        </div>
                                                        <p className="text-lg font-bold leading-relaxed text-neutral-800 dark:text-gray-600 border-t-2 pt-7 mt-2">
                                                            Shopping Summary
                                                        </p>
                                                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 mb-64">
                                                            <p className='flex justify-between'>
                                                                <p>
                                                                    Total Order ({dataCart.length} items)
                                                                </p>
                                                                <p>
                                                                    Rp. {totalPrice.toLocaleString()}
                                                                </p>
                                                            </p>
                                                            <p className='flex justify-between'>
                                                                <p>
                                                                    Shipping Order
                                                                </p>
                                                                <p>
                                                                    Rp. {priceShipping.toLocaleString()}
                                                                </p>
                                                            </p>
                                                        </p>
                                                    </div>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <div className='flex justify-between items-center w-full'>
                                                        <div>
                                                            <div>
                                                                Total Payment
                                                            </div>
                                                            <div className='font-bold text-orange-400'>
                                                                Rp. {(totalPrice + priceShipping).toLocaleString()}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <button
                                                                onClick={() => {
                                                                    newOrder()
                                                                }}
                                                                className='bg-black text-white px-7 py-2'>
                                                                Payment
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Modal.Footer>
                                            </Modal>
                                        </div>
                                    </div>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>

                </div>
            </div>
            <Toaster
                toastOptions={{
                    success: {
                        duration: 10000
                    }
                }}
            />
        </>
    )
}