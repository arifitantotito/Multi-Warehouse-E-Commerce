import { Link, useNavigate } from "react-router-dom";
import { MdSearch, MdFavorite, MdShoppingBag, MdPerson, MdOutlineCancel } from 'react-icons/md'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useState, useEffect, useContext } from "react";
import { Tooltip } from "flowbite-react";
import axios from "axios";
import { userData } from "../../data/userData";
import { toast, Toaster } from "react-hot-toast";
import Loading from "../loading/loading";
import Sidebar from "../sidebarUser/sidebarUser";

export default function NavbarUser(props) {

    const [category, setCategory] = useState([])

    const [showSidebar, setShowSidebar] = useState(false)

    const { user, setUser } = useContext(userData)

    let navigate = useNavigate()

    let getCategory = async () => {
        try {
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/category`)
            // setCategory(data.data)
            setCategory(response.data.data)
        } catch (error) {
        }
    }

    useEffect(() => {
        getCategory()
        props.func.getCart()
    }, [])

    // if (!props.data.itemCart) {
    //     return (
    //         <>
    //             <Loading />
    //         </>
    //     )
    // }

    // if (!user) {
    //     return (
    //         <>
    //             <Loading />
    //         </>
    //     )
    // }


    return (
        <>
            <div className="flex justify-between px-5 md:px-10 lg:justify-around items-center bg-black text-white font-semibold fixed w-full z-20 h-20">
                <div className="items-center flex lg:hidden text-2xl z-10">
                    {showSidebar ?
                        <>
                            <button
                                onClick={() => setShowSidebar(!showSidebar)}
                            >
                                <MdOutlineCancel />
                            </button>
                            <div
                                className={`top-20 left-0 w-full z-20 md:w-80 border-t-2 border-white bg-black text-white fixed  h-full transition ease-in-out duration-300 overflow-x-hidden
                                ${showSidebar ? "transform translate-x-0 " : "transform translate-x-full"}`}
                            >
                                <div className="flex flex-col z-20">
                                    <Sidebar func={props.func} data={{ ...props.data, category, setShowSidebar }} />
                                </div>
                            </div>
                        </>
                        :
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                        >
                            <GiHamburgerMenu />
                        </button>
                    }
                </div>
                <div className="flex items-center gap-10">
                    <Link to='/'>
                        <button onClick={() => navigate('/')} className="w-fitobject-contain flex items-end">
                            <img src={`${process.env.REACT_APP_API_IMAGE_URL}Public/images/F_logo.png`} alt="" width={'80px'} />
                        </button>
                    </Link>
                    {category.map((value, index) => {
                        return (
                            <button className="hidden lg:block lg:px-3 hover:bg-neutral-500" onClick={() => {props.func.getProduct(value.id, undefined, 1);props.func.getColor(value.id)}}>
                                <Link to={`/product/${value.id}`}>
                                    <div className="group relative dropdown px-4 py-7 text-white  hover:text-neutral-900 cursor-pointer tracking-wide">
                                        <div>{value.name}</div>
                                        <div className="group-hover:block dropdown-menu absolute hidden h-auto">
                                            <ul className="mt-7 w-48 -ml-7 bg-white shadow py-5 px-3 bg-opacity-80 rounded-b">
                                                {value.products ? value.products.map((val, idx) => {
                                                    return (
                                                        <Link to={`/product/productdetail/${val.id}`}>
                                                            <li onClick={() => {
                                                                props.data.setMemory([])
                                                                props.data.setSelected(0)
                                                                props.data.setLoadingPage(true)
                                                                props.func.getProductDetail(val.id)
                                                            }} className="py-3">
                                                                <div className="block text-neutral-800 text-base text-left hover:text-neutral-500 cursor-pointer">
                                                                    {val.name}
                                                                </div>
                                                            </li>
                                                        </Link>
                                                    )
                                                })
                                                    : null}
                                            </ul>
                                        </div>
                                    </div>
                                </Link>
                            </button>
                        )
                    })}
                    <button className="hidden lg:block lg:px-3 hover:bg-neutral-500">
                        <div className="px-2 py-7 text-white  hover:text-neutral-900 cursor-pointer tracking-wide">
                            Event & Promo
                        </div>
                    </button>
                    <button className="hidden lg:block lg:px-3 hover:bg-neutral-500">
                        <div className="px-4 py-7 text-white  hover:text-neutral-900 cursor-pointer tracking-wide">
                            Business
                        </div>
                    </button>
                </div>
                <div className="flex items-center gap-5 text-2xl">
                    <button className="hidden lg:inline">
                        <Tooltip
                            content="Search"
                            placement="bottom"
                            className=" mt-6"
                        >
                            <MdSearch />
                        </Tooltip>
                    </button>
                    <button className="hidden lg:inline">
                        <Tooltip
                            content="Wishlist"
                            placement="bottom"
                            className=" mt-6"
                        >
                            <MdFavorite />
                        </Tooltip>
                    </button>
                    <button onClick={() => props.func.notRegister()}>
                        <Link to='/cart'>
                            <Tooltip
                                content="Cart"
                                placement="bottom"
                                className="mt-3 hidden lg:block"
                            >
                                <div className="relative px-3 py-3">
                                    <MdShoppingBag />
                                    {
                                        props.data.itemCart.length === 0 || !localStorage.getItem('token') ?
                                            null
                                            :
                                            <div className="bg-orange-500 w-5 h-5 rounded-full absolute top-1 right-0 text-xs justify-center flex items-center">{props.data.itemCart.length}</div>
                                    }
                                </div>
                            </Tooltip>
                        </Link>
                    </button>
                    {!localStorage.getItem('token') ?
                        <button onClick={() => navigate('/login')}
                            className="hidden lg:block">
                            <Tooltip
                                content="Login or Register"
                                placement="bottom"
                                className=" mt-6"
                            >
                                <div>
                                    <MdPerson />
                                </div>
                            </Tooltip>
                        </button>
                        :
                        <button onClick={() => navigate('/my-account')}
                            className="hidden lg:block">
                            <Tooltip
                                content="My Account"
                                placement="bottom"
                                className=" mt-6"
                            >
                                <div>
                                    <div className="flex items-center">
                                        <MdPerson />
                                        {/* <div className="text-lg ml-2">{user.username}</div> */}
                                    </div>
                                </div>
                            </Tooltip>
                        </button>
                    }
                </div>
            </div>
            {/* <Toaster /> */}
        </>
    )
}