import { useEffect, useState, useContext, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { userData } from '../../data/userData'
import Loading from '../loading/loading'
import { AiOutlinePlus } from 'react-icons/ai'
import { Modal, Button, Label } from 'flowbite-react'
import { toast, Toaster } from "react-hot-toast";
import { AiOutlineLoading3Quarters, AiOutlineSearch } from 'react-icons/ai'
import '@lottiefiles/lottie-player'

export default function Warehouse() {
    let { user } = useContext(userData)
    let navigate = useNavigate()
    let [disable, setDisable] = useState(false)
    let inputSearch = useRef()

    let [show, setShow] = useState(false), [show2, setShow2] = useState(false)
    let onProvince = useRef(), changeProvince = useRef()
    let onCity = useRef(), changeCity = useRef()
    let onSubdistrict = useRef(), onSubdistrictC = useRef()
    let WH_address = useRef(), WH_addressC = useRef()

    let [dataWH, setDataWH] = useState({
        wh: [], total_pages: 0, total_count: 0, loading: true, page: 1, page_size: 0
    }), [chosenWH, setChosenWH] = useState({})

    const [arrProvince, setArrProvince] = useState([]), [changeP, setChangeP] = useState([])
    const [arrCity, setArrCity] = useState([]), [changeC, setChangeC] = useState([])

    let getDataWH = async (page, inputSearch) => {
        let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/warehouse/allWh?page=${page}&inputSearch=${inputSearch}`)
        setDataWH({
            ...dataWH, wh: response.data.data.getWH, total_pages: response.data.data.total_pages,
            total_count: response.data.data.total_count, loading: false, page, choice: 1, pop: false, page_size: response.data.data.page_size
        })
    }
    let postAddress = async () => {
        try {
            if (onProvince.current.value == 'Please Select Province' || onCity.current.value === 'Please Select City') throw { message: 'Incomplete Input' }
            let inputProvince = onProvince.current.value.split(", ")[1]
            let inputWH_Address = WH_address.current.value
            let inputCity = onCity.current.value.split(",")[1]
            let inputSubdistrict = onSubdistrict.current.value
            if (!inputSubdistrict || !inputWH_Address) throw { message: 'Incomplete Input' }
            let response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/warehouse/addWH`, { province: inputProvince, city: inputCity, subdistrict: inputSubdistrict, address: inputWH_Address, city_id: onCity.current.value.split(",")[0], province_id: onProvince.current.value.split(", ")[0] })
            toast('processing..')
            setShow(!show)
            setDataWH({ ...dataWH, pop: false })
            setTimeout(() => {
                toast.success(response.data.message)
            }, 2000)
            setTimeout(() => {
                window.location.reload(false)
            }, 2000)

        } catch (error) {
            setDisable(false)
            toast.error(error.message)
        } finally {
            setDisable(false)
            onProvince.current.value = 'Please Select Province'
            onCity.current.value = 'Please Select City'
            onSubdistrict.current.value = ''
            WH_address.current.value = ''
        }
    }

    let updateWH = async () => {
        try {
            let inputProvince = changeProvince == 'Please Select Province' ? chosenWH.province : changeProvince.current.value.split(", ")[1]

            let inputWH_Address = WH_addressC.current.value ? WH_addressC.current.value : chosenWH.address

            let inputCity = changeCity.current.value == 'Please Select City' ? chosenWH.city : changeCity.current.value.split(",")[1]

            let inputSubdistrict = onSubdistrictC.current.value ? onSubdistrictC.current.value : chosenWH.subdistrict

            let inputCity_id = changeCity.current.value == 'Please Select City' ? chosenWH.city_id : changeCity.current.value.split(",")[0]

            let inputProvince_id = changeProvince.current.value == 'Please Select Province' ? chosenWH.province_id : changeProvince.current.value.split(", ")[0]


            let response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/warehouse/updateWH`, { id: chosenWH.id, province: inputProvince, city: inputCity, subdistrict: inputSubdistrict, address: inputWH_Address, city_id: inputCity_id, province_id: inputProvince_id })

            setDataWH({ ...dataWH, pop: false })
            toast.success(response.data.message)
            setShow2(!show2)
            setTimeout(() => {
                toast('wait..')
            }, 2000)
            setTimeout(() => {
                window.location.reload(false)
            }, 2000)

        } catch (error) {
            setDisable(false)
            toast.error(error.message)
        } finally {
            setDisable(false)
            changeProvince.current.value = 'Please Select Province'
            changeCity.current.value = 'Please Select City'
            onSubdistrict.current.value = ''
            WH_address.current.value = ''
        }
    }

    let getDataProvince = async () => {
        try {
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/rajaongkir/province`, {
                headers: {
                    key: "767e2faef8f409adc96f179e3a949442",
                }
            });
            setChangeP(response.data.data)
            setArrProvince(response.data.data);
        } catch (error) {
        }
    };

    let getDataCityforChange = async () => {
        try {
            let data = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/rajaongkir/city?province_id=${changeProvince.current.value.split(",")[0]}`, {
                headers: {
                    key: "767e2faef8f409adc96f179e3a949442",
                },
            });
            setChangeC(data.data.data.results)
        } catch (error) {
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
        }
    };

    let deleteWH = async () => {
        let response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/warehouse/deleteWH`, { id: chosenWH.id })

        toast.success(response.data.message)
        setShow2(!show2)
        setDataWH({ ...dataWH, pop: false })
        setTimeout(() => {
            toast('Wait..')
        }, 2000)
        setTimeout(() => {
            window.location.reload(false)
        }, 2000)
    }


    useEffect(() => {
        getDataWH(1, '')
        getDataProvince()
    }, [])

    return (
        user ?
            user.role ?
                user.role == 1 ?
                    <div className="p-5 flex flex-col gap-8 min-h-screen lg:pt-2 pt-24">
                        <div className='flex flex-col gap-1'>
                            <div className="text-2xl font-semibold">
                                Warehouse List
                            </div>
                            <div className='text-sm text-gray-400 '>{dataWH.total_count} warehouse found</div>

                        </div>
                        <div className='bg-stone-800 text-white px-6 py-5 border-y-4 border-violet-500 rounded-md'>
                            <div className='flex justify-between mb-5 items-center'>

                                <div className='w-1/2'>
                                    <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                        </div>
                                        <input ref={inputSearch} type="search" id="default-search" className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search by province or city or subdistrict" required />
                                        <button onClick={() => {
                                            setDataWH({ ...dataWH, loading: true })
                                            getDataWH(1, inputSearch.current.value)
                                        }} className="text-white absolute right-2.5 bottom-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                                    </div>
                                </div>


                                <button onClick={() => setShow(!show)} className='p-1 overflow-hidden flex items-center duration-300 hover:w-56 w-8 h-8 rounded-xl hover:bg-emerald-600 hover:text-white font-semibold text-white'>
                                    <div><AiOutlinePlus size={'22px'} /></div>
                                    <div className='overflow-hidden flex gap-3 ml-3 h-full'>
                                        <div>Add</div> <div> New</div> <div> Warehouse</div>
                                    </div>
                                </button>
                                <Modal

                                    show={show}
                                    size="md"
                                    popup={true}
                                    onClose={() =>disable?null:setShow(!show)}
                                >
                                    <Modal.Header />
                                    <Modal.Body>
                                        <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                                            <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center">
                                                Add New Warehouse
                                            </h3>

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
                                                >   <option value={null}>Please Select Province</option>
                                                    {arrProvince.map((value, index) => {
                                                        return <option value={`${value.province_id}, ${value.province}`}>{value.province}</option>;
                                                    })}
                                                </select>
                                            </div>
                                            {
                                                arrCity.length > 0 ?
                                                    <div>
                                                        <div className="mb-2 block">
                                                            <Label
                                                                value="City"
                                                            />
                                                        </div>
                                                        <select
                                                            ref={onCity}

                                                            id="city"
                                                            className="w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black"
                                                        >   <option value={null}>Please Select City</option>
                                                            {arrCity.map((value, index) => {
                                                                return (
                                                                    <option value={`${value.city_id},${value.city_name}`}>{value.city_name}</option>
                                                                );
                                                            })}
                                                        </select>
                                                    </div>
                                                    : null
                                            }
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
                                                        value="Address"
                                                    />
                                                </div>
                                                <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black' ref={WH_address}
                                                    id="Address"
                                                    placeholder="Jalan xxx xxx"
                                                    required={true}
                                                />
                                            </div>

                                            <div className=" flex justify-center">
                                                <Button onClick={() => {
                                                    setDataWH({ ...dataWH, pop: true, choice: 3 })
                                                }} className='hover:border-black text-white border rounded-sm hover:text-black border-black bg-neutral-900 hover:bg-white w-[640px]'>
                                                    Submit
                                                </Button>
                                            </div>

                                        </div>
                                    </Modal.Body>
                                </Modal>



                            </div>
                            <Modal className='overflow-scroll pt-96'
                                show={show2}
                                size="md"
                                popup={true}
                                onClose={() =>disable?null:setShow2(!show2)}
                            >
                                <Modal.Header />
                                <Modal.Body>
                                    <div className="space-y-2 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center">
                                            Change WH Address
                                        </h3>

                                        <div>
                                            <div className="mb-2 block">
                                                <Label
                                                    value="Province WH before"
                                                />
                                            </div>
                                            <input disabled={true} type="text" className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black' placeholder={chosenWH.province} />
                                        </div>



                                        <div>
                                            <div className="mb-2 block">
                                                <Label
                                                    value="City WH before"
                                                />
                                            </div>
                                            <input disabled={true} type="text" className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black' placeholder={chosenWH.city} />
                                        </div>


                                        <div>
                                            <div className="mb-2 block">
                                                <Label
                                                    value="Subdistrict WH before"
                                                />
                                            </div>
                                            <input disabled={true} type="text" className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black' placeholder={chosenWH.subdistrict} />
                                        </div>


                                        <div>
                                            <div className="mb-2 block">
                                                <Label
                                                    value="WH Address before"
                                                />
                                            </div>
                                            <input disabled={true} type="text" className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black' placeholder={chosenWH.address} />
                                        </div>

                                        <div>
                                            <div className="mt-8 block mb-2">
                                                <Label
                                                    value="Province"
                                                />
                                            </div>
                                            <select
                                                onChange={() => getDataCityforChange()}
                                                ref={changeProvince}
                                                id="province"
                                                className="w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black"
                                            >   <option>Please Select Province</option>
                                                {changeP.map((value, index) => {
                                                    return <option value={`${value.province_id}, ${value.province}`}>{value.province}</option>;
                                                })}
                                            </select>
                                        </div>

                                        <div>
                                            <div className=" block mb-2">
                                                <Label
                                                    value="City"
                                                />
                                            </div>
                                            <select

                                                ref={changeCity}
                                                id="city"
                                                className="w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black"
                                            >               <option>Please Select City</option>
                                                {changeC.map((value, index) => {
                                                    return (
                                                       <option value={`${value.city_id}, ${value.city_name}`}>{value.city_name}</option>
                                                    );
                                                })}
                                            </select>
                                        </div>

                                        <div>
                                            <div className=" block mb-2">
                                                <Label
                                                    value="Subdisctrict"
                                                />
                                            </div>
                                            <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black' ref={onSubdistrictC}
                                                id="Subdisctrict"
                                                placeholder="Subdistrict"
                                                required={true}
                                            />
                                        </div>

                                        <div>
                                            <div className="block mb-2">
                                                <Label
                                                    value="WH Address"
                                                />
                                            </div>
                                            <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black' ref={WH_addressC}
                                                id="Address"
                                                placeholder="Jalan xxx xxx"
                                                required={true}
                                            />
                                        </div>



                                        <div className=" flex justify-center pt-10">
                                            <Button disabled={disable} onClick={() => {
                                                setDataWH({ ...dataWH, pop: true, choice: 1 })
                                            }} className='hover:border-black text-white border rounded-sm hover:text-black border-black bg-neutral-900 hover:bg-white w-[640px]'>
                                                Submit
                                            </Button>
                                        </div>

                                        <div className=" flex justify-center pt-5">
                                            <Button disabled={disable} onClick={() => setDataWH({ ...dataWH, pop: true, choice: 2 })} className='hover:border-white text-white border rounded-sm bg-red-700 hover:bg-red-500 w-[640px]'>
                                                Delete Warehouse
                                            </Button>
                                        </div>
                                    </div>
                                </Modal.Body>
                            </Modal>

                            {
                                dataWH.wh.length > 0 ?
                                    <>


                                        <div className="relative overflow-x-auto shadow-md  sm:rounded-lg">
                                            <table className="w-full text-sm text-center border border-violet-500 text-gray-500 dark:text-gray-400">
                                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                    <tr>
                                                        <th className="px-6 py-4">
                                                            No
                                                        </th>
                                                        <th className="px-6 py-4">
                                                            Province
                                                        </th>
                                                        <th className="px-6 py-4">
                                                            City
                                                        </th>
                                                        <th className="px-6 py-4">
                                                            Subdistrict
                                                        </th>
                                                        <th className="px-6 py-4">
                                                            Address
                                                        </th>
                                                        <th className="px-6 py-4">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        dataWH.loading ?
                                                            <tr className='border-violet-500 bg-stone-800 border-b dark:bg-gray-900 dark:border-gray-700 text-slate-200'>
                                                                <td className="px-6 py-4 text-center">
                                                                    <AiOutlineLoading3Quarters className='animate-spin' size={'20px'} />
                                                                </td>
                                                                <td className="px-6 py-4 text-center">
                                                                    <AiOutlineLoading3Quarters className='animate-spin' size={'20px'} />
                                                                </td>
                                                                <td className="px-6 py-4 text-center">
                                                                    <AiOutlineLoading3Quarters className='animate-spin' size={'20px'} />
                                                                </td>
                                                                <td className="px-6 py-4 text-center">
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
                                                            dataWH.wh.map((item, index) => {
                                                                return (
                                                                    <tr className='border-violet-500 bg-stone-800 border-b dark:bg-gray-900 dark:border-gray-700 text-slate-200'>
                                                                        <td className="px-6 py-4">
                                                                            {dataWH.page_size * (dataWH.page - 1) + index + 1}
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            {item.province}
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            {item.city}
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            {item.subdistrict}
                                                                        </td> <td className="px-6 py-4">
                                                                            {item.address}
                                                                        </td>

                                                                        <td className="px-6 py-4">
                                                                            <button onClick={() => {
                                                                                setChosenWH(item)
                                                                                setShow2(!show2)
                                                                            }} className="font-medium text-violet-500 dark:text-blue-500 hover:underline">Edit</button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}

                                                </tbody>
                                            </table>
                                        </div>
                                        <div className='flex justify-center pt-3 pb-4 gap-2'>
                                            <button
                                                disabled={(dataWH.page - 1) == 0 || dataWH.loading}
                                                onClick={() => {
                                                    setDataWH({ ...dataWH, loading: true })
                                                    getDataWH(dataWH.page - 1, inputSearch.current.value)
                                                }} className='font-semibold rounded-l-lg px-4 hover:bg-black hover:text-white'>
                                                Previous
                                            </button>
                                            <div>
                                                Page {dataWH.page} of {dataWH?.total_pages}
                                            </div>
                                            <button
                                                disabled={(dataWH.page + 1) > dataWH.total_pages || dataWH.loading}
                                                onClick={() => {
                                                    setDataWH({ ...dataWH, loading: true })
                                                    getDataWH(dataWH.page + 1, inputSearch.current.value)
                                                }} className='font-semibold rounded-r-lg px-7 hover:bg-black hover:text-white'>
                                                Next
                                            </button>
                                        </div>
                                    </>
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

                            <Modal

                                show={dataWH.pop}
                                size="md"
                                popup={true}
                                onClose={() =>disable?null:setDataWH({ ...dataWH, pop: false })}
                            >
                                <Modal.Header />


                                <Modal.Body>
                                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                        <div className="flex flex-col items-center justify-center">

                                            <lottie-player
                                                autoplay
                                                loop
                                                mode="normal"
                                                src="https://assets3.lottiefiles.com/packages/lf20_q4wbz787.json"
                                                style={{ width: "200px" }}    ></lottie-player>



                                            <h3 className="mb-5 mt-4 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                {
                                                    dataWH.choice == 1 ?
                                                        'Are you sure to update?'
                                                        :
                                                        dataWH.choice == 2 ?
                                                            'Delete this warehouse?'
                                                            :
                                                            'Add new warehouse?'
                                                }
                                            </h3>
                                            <div className='flex gap-3'>
                                                <button
                                                    disabled={disable}
                                                    onClick={() => {
                                                        setDisable(true)
                                                        dataWH.choice == 1 ? updateWH() : dataWH.choice == 2 ? deleteWH() : postAddress()
                                                    }} data-modal-hide="popup-modal" type="button" className={`text-white ${dataWH.choice == 1 ? 'bg-green-500 hover:bg-green-700' : dataWH.choice == 2 ? 'bg-red-600 hover:bg-red-800' : 'bg-blue-500 hover:bg-blue-600'} focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2`}>
                                                    {
                                                        dataWH.choice == 1 ?
                                                            'Yes, update' :
                                                            dataWH.choice == 2 ?
                                                                'Yes, delete!' :
                                                                'Yes, add'
                                                    }
                                                </button>
                                                <button disabled={disable} onClick={() => setDataWH({ ...dataWH, pop: false })} data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</button>
                                            </div>

                                        </div>
                                    </div>
                                </Modal.Body>

                            </Modal>
                        </div>




                        {/* box */}
                    </div>
                    : navigate('*')
                :
                navigate('*')
            :
            <Loading />
    )
}