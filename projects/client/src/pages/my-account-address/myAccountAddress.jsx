import { useContext, useEffect, useRef, useState } from "react"
import { userData } from "../../data/userData"
import { BsTelephone } from "react-icons/bs"
import { MdOutlineEdit, MdOutlineDelete } from 'react-icons/md'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

import { Button, Modal, Label, TextInput, Textarea } from "flowbite-react"
import axios from "axios"

import { toast, Toaster } from 'react-hot-toast'

import Loading from "../../components/loading/loading"

export default function MyAccountAddress() {

    let province = useRef()
    let provinceAdd = useRef()

    const { user, setUser } = useContext(userData)

    const [modal, setModal] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalDelete, setModalDelete] = useState(false)

    const [profile, setProfile] = useState({
        name: '',
        address: '',
        phone_number: '',
        province: [],
        provinceEdit: [],
        city: [],
        cityEdit: [],
        subdistrict: '',
        selectedProvince: '',
        selectedCity: '',
        subdistrict: ''
    })
    // console.log(profile)

    const [disable, setDisable] = useState(false)

    const [addressDB, setAddressDB] = useState([])

    const [choosenUser, setChoosenUser] = useState({})

    const [userToDelete, setUserToDelete] = useState({})

    const [changeMainAddress, setChangeMainAddress] = useState({})

    const [profileDB, setProfileDB] = useState({
        name: '',
        name: '',
        address: '',
        phone_number: '',
        province: '',
        city: '',
        subdistrict: '',
    })

    let getProvince = async () => {
        try {
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/rajaongkir/province`, {
                headers: {
                    key: "8d832179b0e66fb5dea1f75c477eca34"
                }
            })
            // console.log(response.data.data)
            setProfile({ ...profile, province: response.data.data, provinceEdit: response.data.data })

        } catch (error) {

        }
    }

    let getCity = async (input) => {
        try {
            // console.log(input.split(',')[2])

            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/rajaongkir/city?province_id=${input.split(',')[0]}`, {
                headers: {
                    key: "8d832179b0e66fb5dea1f75c477eca34"
                }
            })
            // console.log(response.data.data.results)
            if (input.split(',')[2] == 'Edit') {
                setProfile({ ...profile, cityEdit: response.data.data.results })
            } else {
                setProfile({ ...profile, city: response.data.data.results })
            }


        } catch (error) {
            // console.log(error)
        }
    }

    let getAddressUser = async () => {
        try {
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/shipping`, {
                headers: {
                    "token": localStorage.getItem('token')
                }
            })
            // console.log(response.data.data)
            setAddressDB(response.data.data)
        } catch (error) {
            // console.log(error)
        }
    }

    let updateAddressUser = async () => {
        try {

            if (isNaN(choosenUser.phone_number)) throw { message: "Please input a number" }

            if (choosenUser.phone_number.length < 8 || choosenUser.phone_number.length > 13) throw { message: 'Please input your valid phone number' }

            let response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/update-user_address`, {
                id: choosenUser.id,
                receiver_name: choosenUser.receiver_name,
                user_address: choosenUser.user_address,
                phone_number: choosenUser.phone_number,
                province: province.current.value.split(',')[1],
                city: choosenUser.city,
                subdistrict: choosenUser.subdistrict
            })
            // console.log(response)
            getAddressUser()

            toast.success('Update Address Success!', {
                style: {
                    background: "black",
                    color: 'white'
                }
            })

            setTimeout(() => {
                toast('Loading...', {
                    duration: 1000
                })
            }, 2000)

            setTimeout(() => {
                window.location.reload(false)
            }, 3000)


        } catch (error) {
            // console.log(error)
            if (!error.response) {
                toast.error(error.message)
            } else {
                toast.error(error.response.data.message)
            }
        }
    }

    let deleteAddressUser = async () => {
        try {
            // console.log(userToDelete.id)
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/delete-address`, { id: userToDelete.id })

            toast.success('Delete Address Success')

            setModalDelete(false)

            getAddressUser()
        } catch (error) {

        }
    }

    let changeMain = async (value) => {
        try {
            // console.log(value)
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/change-main`, {
                id: value.id, user_id: value.user_id
            })

            toast('Loading...', {
                duration: 700
            })

            setTimeout(() => {
                window.location.reload(false)
            }, 500)
        } catch (error) {

        }
    }

    let onSubmit = async () => {
        try {
            // console.log(provinceAdd.current.value.split(',')[1])
            if (!profile.name || !profile.phone_number || !profile.address || !provinceAdd.current.value.split(',')[1] || !profile.selectedCity.split(',')[1] || !profile.subdistrict) throw { message: "Please fill the data" }

            if (isNaN(profile.phone_number)) throw { message: "Please input a number" }

            if (profile.phone_number.length < 8 || profile.phone_number.length > 13) throw { message: 'Please input your valid phone number' }

            setDisable(true)
            toast('Loading...', {
                duration: 1000
            })
            let response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/add-address`, {
                user_id: user.id,
                receiver_name: profile.name,
                phone_number: profile.phone_number,
                user_address: profile.address,
                province: provinceAdd.current.value.split(',')[1],
                province_id: provinceAdd.current.value.split(',')[0],
                city: profile.selectedCity.split(',')[1],
                city_id: profile.selectedCity.split(',')[0],
                subdistrict: profile.subdistrict
            })
            getAddressUser()

            toast.success('Add Address Success!', {
                style: {
                    background: "black",
                    color: 'white'
                }
            })

            // setTimeout(() => {
            //     // setModal(false)
            //     toast('Loading...', {
            //         duration: 2500
            //     })
            // }, 2000)

            setTimeout(() => {
                window.location.reload(false)
            }, 1000)

            // setModal(false)

        } catch (error) {
            // console.log(error)
            if (!error.response) {
                toast.error(error.message)
            } else {
                toast.error(error.response.data.message)
            }
        } finally {
            setDisable(false)
        }
    }

    useEffect(() => {
        getProvince()
        getAddressUser()
    }, [])

    return (
            <>
                <div className={addressDB.length > 2 ? 'max-h-max' : 'h-screen'}>
                    {
                        addressDB.length === 0 ?
                            <>
                                <div className="border-2 rounded-sm">
                                    <div className="border-b-2 text-2xl font-bold px-5 py-2">
                                        Add Address
                                    </div>
                                    <div className="px-5 py-5">
                                        <div className="flex justify-center">
                                            <button onClick={() => setModal(!modal)} className="rounded-sm text-base font-semibold px-3 py-1 bg-neutral-900 text-neutral-100 hover:text-neutral-900 hover:bg-neutral-100 border border-black focus:ring-0 focus:ring-transparent">
                                                + Add Address
                                            </button>
                                            <Modal
                                                show={modal}
                                                size="xl"
                                                popup={true}
                                                onClose={() => setModal(!modal)}
                                            >
                                                <Modal.Header />
                                                <Modal.Body>
                                                    <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center">
                                                            Add New Address
                                                        </h3>
                                                        <div>
                                                            <div>
                                                                <div className="mb-2 block">
                                                                    <Label
                                                                        value="Name"
                                                                    />
                                                                </div>
                                                                <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm'
                                                                    id="Name"
                                                                    placeholder="Name"
                                                                    required={true}
                                                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="mb-2 block">
                                                                    <Label
                                                                        value="Address"
                                                                    />
                                                                </div>
                                                                <textarea
                                                                    className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm'
                                                                    id="Address"
                                                                    placeholder="Jl. xxx xxx"
                                                                    required={true}
                                                                    type="text"
                                                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="mb-2 block">
                                                                    <Label
                                                                        value="Phone Number"
                                                                    />
                                                                </div>
                                                                <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm'
                                                                    id="Phone Number"
                                                                    placeholder="08xxxxxxx"
                                                                    required={true}
                                                                    onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="mb-2 block">
                                                                    <Label
                                                                        value="Province"
                                                                    />
                                                                </div>
                                                                <select
                                                                    id="province"
                                                                    className="w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm"
                                                                    ref={provinceAdd}
                                                                    onChange={(e) => getCity(e.target.value)}
                                                                >
                                                                    <option>---Select Province---</option>
                                                                    {
                                                                        profile.province.map((value, index) => {
                                                                            return (
                                                                                <option key={index} value={`${value.province_id},${value.province},Add`}>{value.province}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <div className="mb-2 block">
                                                                    <Label
                                                                        value="City"
                                                                    />
                                                                </div>
                                                                <select
                                                                    id="city"
                                                                    className="w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm"
                                                                    onChange={(e) => {
                                                                        setProfile({ ...profile, selectedCity: e.target.value })
                                                                    }}
                                                                >
                                                                    <option>---Select City---</option>
                                                                    {
                                                                        profile.city.map((value, index) => {
                                                                            return (
                                                                                <option key={index} value={`${value.city_id},${value.city_name}`}>{value.city_name}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <div className="mb-2 block">
                                                                    <Label
                                                                        value="Subdisctrict"
                                                                    />
                                                                </div>
                                                                <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm'
                                                                    id="Subdisctrict"
                                                                    placeholder="Subdistrict"
                                                                    required={true}
                                                                    onChange={(e) => setProfile({ ...profile, subdistrict: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className=" flex justify-center">
                                                            <Button
                                                                className='hover:border-black text-white border rounded-sm hover:text-black border-black bg-neutral-900 hover:bg-white w-96 focus:ring-0 focus:ring-transparent'
                                                                onClick={() => onSubmit()}
                                                                disabled={disable}
                                                            >
                                                                Submit
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Modal.Body>
                                            </Modal>
                                        </div>
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                <div className="border-2 border-black rounded-sm">
                                    <div className="border-b-2 border-black text-lg md:text-xl lg:text-2xl font-semibold px-5 py-2 bg-neutral-200">
                                        Main Address
                                    </div>
                                    {
                                        addressDB.map((value, index) => {
                                            return (
                                                value.value === 1 ?
                                                    <div className="px-5 py-2">
                                                        <div className="font-bold">{value.receiver_name}</div>
                                                        <div>{value.user_address}</div>
                                                        <div>{`${value.subdistrict}, ${value.city}, ${value.province}`}</div>
                                                        <div className="flex items-center"><BsTelephone className="mr-2" />{value.phone_number}</div>
                                                        <button onClick={() => {
                                                            setModalEdit(!modalEdit)
                                                            setChoosenUser(value)
                                                        }} value={value} className="flex items-center bg-gray-400 text-white hover:bg-gray-300 mb-3 px-4 mt-3 mr-2 rounded-sm"><MdOutlineEdit className="mr-2" />Edit</button>
                                                        <Modal
                                                            show={modalEdit}
                                                            size="xl"
                                                            popup={true}
                                                            onClose={() => setModalEdit(!modalEdit)}
                                                        >
                                                            <Modal.Header />
                                                            <Modal.Body>
                                                                <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                                                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center">
                                                                        Edit Address
                                                                    </h3>
                                                                    <div>
                                                                        <div>
                                                                            <div className="mb-2 block">
                                                                                <Label
                                                                                    value="Name"
                                                                                />
                                                                            </div>
                                                                            <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm'
                                                                                id="Name"
                                                                                placeholder={choosenUser.receiver_name}
                                                                                required={true}
                                                                                onChange={(e) => setChoosenUser({ ...choosenUser, receiver_name: e.target.value })}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <div className="mb-2 block">
                                                                                <Label
                                                                                    value="Address"
                                                                                />
                                                                            </div>
                                                                            <textarea
                                                                                className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm'
                                                                                id="Address"
                                                                                placeholder={choosenUser.user_address}
                                                                                required={true}
                                                                                type="text"
                                                                                onChange={(e) => setChoosenUser({ ...choosenUser, user_address: e.target.value })}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <div className="mb-2 block">
                                                                                <Label
                                                                                    value="Phone Number"
                                                                                />
                                                                            </div>
                                                                            <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm'
                                                                                id="Phone Number"
                                                                                placeholder={choosenUser.phone_number}
                                                                                required={true}
                                                                                onChange={(e) => setChoosenUser({ ...choosenUser, phone_number: e.target.value })}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <div className="mb-2 block">
                                                                                <Label
                                                                                    value="Province"
                                                                                />
                                                                            </div>
                                                                            <select
                                                                                id="province"
                                                                                className="w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm"
                                                                                ref={province}
                                                                                onChange={(e) => getCity(e.target.value)}
                                                                            >
                                                                                <option>{choosenUser.province ? choosenUser.province : "---Select Province---"}</option>
                                                                                {
                                                                                    profile.provinceEdit.map((value, index) => {
                                                                                        return (
                                                                                            <option key={index} value={`${value.province_id},${value.province},Edit`}>{value.province}</option>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </select>
                                                                        </div>
                                                                        <div>
                                                                            <div className="mb-2 block">
                                                                                <Label
                                                                                    value="City"
                                                                                />
                                                                            </div>
                                                                            <select
                                                                                id="city"
                                                                                className="w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm"
                                                                                onChange={(e) => {
                                                                                    setChoosenUser({ ...choosenUser, city_id: e.target.value.split(',')[0], city: e.target.value.split(',')[1] })
                                                                                }}
                                                                            >
                                                                                <option>{choosenUser.city ? choosenUser.city : "---Select City---"}</option>
                                                                                {
                                                                                    profile.cityEdit.map((value, index) => {
                                                                                        return (
                                                                                            <option key={index} value={`${value.city_id},${value.city_name}`}>{value.city_name}</option>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </select>
                                                                        </div>
                                                                        <div>
                                                                            <div className="mb-2 block">
                                                                                <Label
                                                                                    value="Subdisctrict"
                                                                                />
                                                                            </div>
                                                                            <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm'
                                                                                id="Subdisctrict"
                                                                                placeholder={choosenUser.subdistrict}
                                                                                required={true}
                                                                                onChange={(e) => setChoosenUser({ ...choosenUser, subdistrict: e.target.value })}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className=" flex justify-center">
                                                                        <Button
                                                                            className='hover:border-black text-white border rounded-sm hover:text-black border-black bg-neutral-900 hover:bg-white w-96 focus:ring-0 focus:ring-transparent'
                                                                            onClick={() => updateAddressUser()}
                                                                            disabled={profile.disable}
                                                                        >
                                                                            Submit
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </Modal.Body>
                                                        </Modal>
                                                    </div>
                                                    :
                                                    null
                                            )
                                        })
                                    }

                                </div>
                                <div className="border-2 mt-5 rounded-sm">
                                    <div className="border-b-2 text-lg md:text-xl lg:text-2xl font-semibold px-5 py-2 flex justify-between items-center ">
                                        Additional Address
                                        <div>
                                            <button onClick={() => setModal(!modal)} className="rounded-sm text-sm md:text-base font-semibold px-3 bg-neutral-900 text-neutral-100 hover:text-neutral-900 hover:bg-neutral-100 border border-black focus:ring-0 focus:ring-transparent">
                                                + Add Address
                                            </button>
                                            <Modal
                                                show={modal}
                                                size="xl"
                                                popup={true}
                                                onClose={() => setModal(!modal)}
                                            >
                                                <Modal.Header />
                                                <Modal.Body>
                                                    <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center">
                                                            Add New Address
                                                        </h3>
                                                        <div>
                                                            <div>
                                                                <div className="mb-2 block">
                                                                    <Label
                                                                        value="Name"
                                                                    />
                                                                </div>
                                                                <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm'
                                                                    id="Name"
                                                                    placeholder="Name"
                                                                    required={true}
                                                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="mb-2 block">
                                                                    <Label
                                                                        value="Address"
                                                                    />
                                                                </div>
                                                                <textarea
                                                                    className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm'
                                                                    id="Address"
                                                                    placeholder="Jl. xxx xxx"
                                                                    required={true}
                                                                    type="text"
                                                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="mb-2 block">
                                                                    <Label
                                                                        value="Phone Number"
                                                                    />
                                                                </div>
                                                                <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm'
                                                                    id="Phone Number"
                                                                    placeholder="08xxxxxxx"
                                                                    required={true}
                                                                    onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="mb-2 block">
                                                                    <Label
                                                                        value="Province"
                                                                    />
                                                                </div>
                                                                <select
                                                                    id="province"
                                                                    className="w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm"
                                                                    ref={provinceAdd}
                                                                    onChange={(e) => getCity(e.target.value)}
                                                                >
                                                                    <option>---Select Province---</option>
                                                                    {
                                                                        profile.province.map((value, index) => {
                                                                            return (
                                                                                <option key={index} value={`${value.province_id},${value.province},Add`}>{value.province}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <div className="mb-2 block">
                                                                    <Label
                                                                        value="City"
                                                                    />
                                                                </div>
                                                                <select
                                                                    id="city"
                                                                    className="w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm"
                                                                    onChange={(e) => {
                                                                        setProfile({ ...profile, selectedCity: e.target.value })
                                                                    }}
                                                                >
                                                                    <option>---Select City---</option>
                                                                    {
                                                                        profile.city.map((value, index) => {
                                                                            return (
                                                                                <option key={index} value={`${value.city_id},${value.city_name}`}>{value.city_name}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <div className="mb-2 block">
                                                                    <Label
                                                                        value="Subdisctrict"
                                                                    />
                                                                </div>
                                                                <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm'
                                                                    id="Subdisctrict"
                                                                    placeholder="Subdistrict"
                                                                    required={true}
                                                                    onChange={(e) => setProfile({ ...profile, subdistrict: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className=" flex justify-center">
                                                            <Button
                                                                className='hover:border-black text-white border rounded-sm hover:text-black border-black bg-neutral-900 hover:bg-white w-96 focus:ring-0 focus:ring-transparent'
                                                                onClick={() => onSubmit()}
                                                                disabled={disable}
                                                            >
                                                                Submit
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Modal.Body>
                                            </Modal>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 ">
                                        {
                                            addressDB.map((value, index) => {
                                                return (
                                                    value.value === 0 ?
                                                        <div className="px-5 py-2">
                                                            <div className="font-bold">{value.receiver_name}</div>
                                                            <div>{value.user_address}</div>
                                                            <div>{`${value.subdistrict}, ${value.city}, ${value.province}`}</div>
                                                            <div className="flex items-center"><BsTelephone className="mr-2" />{value.phone_number}</div>
                                                            <button onClick={() => changeMain(value)} value={value} className="py-2 font-bold px-3">
                                                                <li>Set as Main Address</li>
                                                            </button>
                                                            <div className="flex mb-3 ">
                                                                <button onClick={() => {
                                                                    setModalEdit(!modalEdit)
                                                                    setChoosenUser(value)
                                                                }} value={value} className="flex items-center bg-gray-400 text-white hover:bg-gray-300 px-4 mt-3 mr-2 rounded-sm"><MdOutlineEdit className="mr-2" />Edit</button>
                                                                <Modal
                                                                    show={modalEdit}
                                                                    size="xl"
                                                                    popup={true}
                                                                    onClose={() => setModalEdit(!modalEdit)}
                                                                >
                                                                    <Modal.Header />
                                                                    <Modal.Body>
                                                                        <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8 ">
                                                                            <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center">
                                                                                Edit Address
                                                                            </h3>
                                                                            <div className="">
                                                                                <div>
                                                                                    <div className="mb-2 block">
                                                                                        <Label
                                                                                            value="Name"
                                                                                        />
                                                                                    </div>
                                                                                    <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm'
                                                                                        id="Name"
                                                                                        placeholder={choosenUser.receiver_name}
                                                                                        required={true}
                                                                                        onChange={(e) => setChoosenUser({ ...choosenUser, receiver_name: e.target.value })}
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <div className="mb-2 block">
                                                                                        <Label
                                                                                            value="Address"
                                                                                        />
                                                                                    </div>
                                                                                    <textarea
                                                                                        className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm'
                                                                                        id="Address"
                                                                                        placeholder={choosenUser.user_address}
                                                                                        required={true}
                                                                                        type="text"
                                                                                        onChange={(e) => setChoosenUser({ ...choosenUser, user_address: e.target.value })}
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <div className="mb-2 block">
                                                                                        <Label
                                                                                            value="Phone Number"
                                                                                        />
                                                                                    </div>
                                                                                    <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm'
                                                                                        id="Phone Number"
                                                                                        placeholder={choosenUser.phone_number}
                                                                                        required={true}
                                                                                        onChange={(e) => setChoosenUser({ ...choosenUser, phone_number: e.target.value })}
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <div className="mb-2 block">
                                                                                        <Label
                                                                                            value="Province"
                                                                                        />
                                                                                    </div>
                                                                                    <select
                                                                                        id="province"
                                                                                        className="w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm"
                                                                                        ref={province}
                                                                                        onChange={(e) => { getCity(e.target.value)}}
                                                                                    >
                                                                                        <option>{choosenUser.province ? choosenUser.province : "---Select Province---"}</option>
                                                                                        {
                                                                                            profile.provinceEdit.map((value, index) => {
                                                                                                return (
                                                                                                    <option key={index} value={`${value.province_id},${value.province},Edit`}>{value.province}</option>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </select>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="mb-2 block">
                                                                                        <Label
                                                                                            value="City"
                                                                                        />
                                                                                    </div>
                                                                                    <select
                                                                                        id="city"
                                                                                        className="w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm"
                                                                                        onChange={(e) => {
                                                                                            setChoosenUser({ ...choosenUser, city_id: e.target.value.split(',')[0], city: e.target.value.split(',')[1] })
                                                                                        }}
                                                                                    >
                                                                                        <option>{choosenUser.city ? choosenUser.city : "---Select City---"}</option>
                                                                                        {
                                                                                            profile.cityEdit.map((value, index) => {
                                                                                                return (
                                                                                                    <option key={index} value={`${value.city_id},${value.city_name}`}>{value.city_name}</option>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </select>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="mb-2 block">
                                                                                        <Label
                                                                                            value="Subdisctrict"
                                                                                        />
                                                                                    </div>
                                                                                    <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black rounded-sm'
                                                                                        id="Subdisctrict"
                                                                                        placeholder={choosenUser.subdistrict}
                                                                                        required={true}
                                                                                        onChange={(e) => setChoosenUser({ ...choosenUser, subdistrict: e.target.value })}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div className=" flex justify-center">
                                                                                <Button
                                                                                    className='hover:border-black text-white border rounded-sm hover:text-black border-black bg-neutral-900 hover:bg-white w-96 focus:ring-0 focus:ring-transparent'
                                                                                    onClick={() => updateAddressUser()}
                                                                                    disabled={profile.disable}
                                                                                >
                                                                                    Submit
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </Modal.Body>
                                                                </Modal>
                                                                <button onClick={() => {
                                                                    setModalDelete(!modalDelete)
                                                                    setUserToDelete(value)
                                                                }} value={value.id} className="flex items-center bg-gray-400 text-white hover:bg-gray-300 px-4 mt-3 mr-2 rounded-sm"><MdOutlineDelete className="mr-2" />Delete</button>
                                                                <Modal
                                                                    show={modalDelete}
                                                                    size="md"
                                                                    popup={true}
                                                                    onClose={() => setModalDelete(!modalDelete)}
                                                                >
                                                                    <Modal.Header />
                                                                    <Modal.Body>
                                                                        <div className="text-center">
                                                                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                                                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                                                Are you sure you want to delete this address?
                                                                            </h3>
                                                                            <div className="flex justify-center gap-4">
                                                                                <Button
                                                                                    color="failure"
                                                                                    onClick={() => deleteAddressUser()}
                                                                                    className="focus:ring-0 focus:ring-transparent"
                                                                                >
                                                                                    Yes, I'm sure
                                                                                </Button>
                                                                                <Button
                                                                                    color="gray"
                                                                                    onClick={() => setModalDelete(false)}
                                                                                >
                                                                                    No, cancel
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </Modal.Body>
                                                                </Modal>
                                                            </div>
                                                        </div>
                                                        :
                                                        null
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </>
                    }
                </div>
                <Toaster />
            </>
    )
}