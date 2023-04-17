import axios from 'axios'
import { useEffect, useState } from 'react'

import { MdOutlineDelete } from 'react-icons/md'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { IoCartOutline } from 'react-icons/io5'
import { BsTrash } from 'react-icons/bs'

import { Modal, Button, Spinner } from 'flowbite-react'
import { toast, Toaster } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

import EmptyCart from './../../Assets/empty-cart.png'


export default function Cart(props) {

    const [productCart, setProductCart] = useState([])

    const [totalPrice, setTotalPrice] = useState(0)

    const [modalDelete, setModalDelete] = useState(false)

    const [cartToDelete, setCartToDelete] = useState({})

    const [loading, setLoading] = useState(false)

    const [loadingIndex, setLoadingIndex] = useState(0)

    let navigate = useNavigate()

    let getData = async () => {
        try {
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/cart/data-cart`, {
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            // console.log(response.data.data)
            setProductCart(response.data.data)

            let sum = 0
            response.data.data.forEach(e =>
                sum += e.qty * e.product_detail.price)
            setTotalPrice(sum)

            setLoading(false)

            // props.func.getCart()

        } catch (error) {
        }
    }

    let deleteCart = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/cart/delete-cart`, { id: cartToDelete.id })

            toast.success('Delete Product from Cart Success')

            getData()

            props.func.getCart()
        } catch (error) {
        }
    }

    let updateQty = async (input) => {
        try {

            let response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart`, { id: input.split(',')[1], type: input.split(',')[2], qtyx: input.split(',')[0] })

            getData()

        } catch (error) {
            setLoading(false)
            // console.log(error)
            if (!error.response) {
                toast.error(error.message)
            } else {
                toast.error(error.response.data.message)
            }
        }
    }

    let onSubmit = () => {
        try {
            productCart.forEach((value, index) => {
                if (value.product_detail.qty === 0) throw { message: `Product ${value.product.name}, ${value.product_detail.memory_storage} GB, ${value.product_detail.color} out of stock` }
                if (value.product_detail.qty < value.qty) throw { message: `Product ${value.product.name}, ${value.product_detail.memory_storage} GB, ${value.product_detail.color} has limited stocks` }
            })
            navigate('/shipping')

        } catch (error) {
            if (!error.response) {
                toast.error(error.message)
            } else {
                toast.error(error.response.data.message)
            }
        }
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <div className="pt-24 h-max">

                {
                    productCart.length !== 0 ?
                        <>
                            {/* // grid */}
                            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 md:justify-center px-5">
                                {/* Card Start */}
                                <div className="col-start-1 col-end-5 md:col-start-1 md:col-end-5 lg:col-start-3 lg:col-end-9 lg:mr-3">
                                    {
                                        productCart.map((value, index) => {
                                            return (
                                                <div className=' border my-3 rounded-sm'>
                                                    <div className="md:border-b-2">
                                                        {/* Content Start */}
                                                        <div className="flex justify-between p-3 h-max md:h-[100px]">
                                                            <div className="flex items-center w-full">
                                                                <div className="flex justify-center bg-red-400">
                                                                    <img src={`${process.env.REACT_APP_API_IMAGE_URL}Public/images/${value.product.product_images[0].img}`} alt="...." className='w-[60px]' />
                                                                </div>
                                                                <div className='text-sm'>
                                                                    <div className='font-semibold text-neutral-600'>
                                                                        {value.product.name}, {value.product_detail.memory_storage} GB, {value.product_detail.color}
                                                                    </div>
                                                                    <div className="font-bold">
                                                                        Price : Rp. {value.product_detail.price.toLocaleString()}
                                                                    </div>
                                                                    <div className="pt-3">
                                                                        Subtotal : Rp {(value.product_detail.price * value.qty).toLocaleString()}
                                                                    </div>
                                                                    <div className="flex md:hidden">
                                                                        {loading && loadingIndex == index ?
                                                                            <>
                                                                                <Spinner aria-label="Default status example" />
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <div className='border flex mt-3'>
                                                                                    <div className='text-xl flex justify-center items-center'>
                                                                                        <button
                                                                                            onClick={(e) => {
                                                                                                setLoading(true)
                                                                                                setLoadingIndex(index)
                                                                                                updateQty(e.target.value)
                                                                                            }}
                                                                                            value={`${value.qty},${value.id},-,${index}`}
                                                                                            className='w-8 h-8'>
                                                                                            -
                                                                                        </button>
                                                                                    </div>
                                                                                    <div className="col-span-2 border-x w-14 h-8 text-xs flex justify-center items-center ">
                                                                                        {value.qty}
                                                                                    </div>
                                                                                    <div className='text-xl flex justify-center items-center'>
                                                                                        <button
                                                                                            onClick={(e) => {
                                                                                                setLoading(true)
                                                                                                setLoadingIndex(index)
                                                                                                updateQty(e.target.value)
                                                                                            }}
                                                                                            value={`${value.qty},${value.id},+,${index}`}
                                                                                            className='w-8 h-8'>
                                                                                            +
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='mt-3 ml-5 flex justify-center items-center border rounded-sm'>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            setModalDelete(!modalDelete)
                                                                                            setCartToDelete(value)
                                                                                        }}
                                                                                        className='text-lg px-3 py-1'
                                                                                    >
                                                                                        <BsTrash />
                                                                                    </button>
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
                                                                                                    Are you sure you want to delete this product from cart?
                                                                                                </h3>
                                                                                                <div className="flex justify-center gap-4">
                                                                                                    <Button
                                                                                                        color="failure"
                                                                                                        onClick={() => {
                                                                                                            deleteCart()
                                                                                                            setModalDelete(false)
                                                                                                            props.data.setItemCart([])
                                                                                                        }}
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
                                                                            </>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="hidden md:flex gap-3">
                                                                {loading && loadingIndex == index ?
                                                                    <>
                                                                        <Spinner aria-label="Default status example" />
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <div className='text-xl'>
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    setLoading(true)
                                                                                    setLoadingIndex(index)
                                                                                    updateQty(e.target.value)
                                                                                }}
                                                                                value={`${value.qty},${value.id},-,${index}`}
                                                                                className='w-4'>
                                                                                -
                                                                            </button>
                                                                        </div>
                                                                        <div className="col-span-2 border w-8 h-8 text-xs flex justify-center items-center bg-slate-200 border-neutral-300 rounded-sm">
                                                                            {value.qty}
                                                                        </div>
                                                                        <div className='text-xl'>
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    setLoading(true)
                                                                                    setLoadingIndex(index)
                                                                                    updateQty(e.target.value)
                                                                                }}
                                                                                value={`${value.qty},${value.id},+,${index}`}
                                                                                className='w-4'>
                                                                                +
                                                                            </button>
                                                                        </div>
                                                                    </>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <button onClick={() => {
                                                            setModalDelete(!modalDelete)
                                                            setCartToDelete(value)
                                                        }}
                                                            value={value.id}
                                                            className='pl-5 py-3 text-sm text-gray-400 hover:text-gray-800 hidden md:block'>
                                                            Delete
                                                        </button>
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
                                                                        Are you sure you want to delete this product from cart?
                                                                    </h3>
                                                                    <div className="flex justify-center gap-4">
                                                                        <Button
                                                                            color="failure"
                                                                            onClick={() => {
                                                                                deleteCart()
                                                                                setModalDelete(false)
                                                                                props.data.setItemCart([])
                                                                            }}
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
                                            )
                                        })
                                    }
                                </div>
                                {/* Card End */}

                                <div className="hidden md:grid md:col-start-5 md:col-end-7 lg:col-start-9 lg:col-end-11 relative">
                                    <div className="px-5 sticky">
                                        <div className="font-bold text-xl py-4 border-b-2">
                                            Summary
                                        </div>
                                        <div className="py-4 flex justify-between">
                                            Total<span className="font-bold">Rp. {totalPrice.toLocaleString()}</span>
                                        </div>
                                        <button onClick={() => onSubmit()} className="bg-neutral-900 text-white w-full py-1 rounded-sm">
                                            BUY
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className='border-t-2 flex w-full justify-between bg-white z-10 fixed bottom-0 px-5 py-2 md:hidden'>
                                <div className="py-4">
                                    <span className='text-sm mr-1'>Total</span><span className="font-bold text-xl">Rp {totalPrice.toLocaleString()}</span>
                                </div>
                                <div className='flex items-center'>
                                    <button onClick={() => onSubmit()} className="bg-neutral-900 text-white px-7 py-1 rounded-sm">
                                        BUY
                                    </button>
                                </div>
                            </div>
                        </>
                        :
                        <div className='w-full flex flex-col items-center'>
                            <div className='flex flex-col items-center my-14'>
                                <img src={EmptyCart} />
                                <p className='text-xl font-semibold text-neutral-700 my-4'>
                                    You dont have any items in cart.
                                </p>
                                <button
                                    onClick={() => navigate('/')}
                                    className='bg-black px-10 py-2 text-white font-semibold'>
                                    Shop Now
                                </button>
                            </div>
                        </div>
                }
            </div>
            <Toaster />
        </>
    )
}