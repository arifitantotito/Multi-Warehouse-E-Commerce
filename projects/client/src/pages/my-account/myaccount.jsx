import { Breadcrumb, Dropdown, Button } from "flowbite-react";
import { toast, Toaster } from "react-hot-toast";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { userData } from "../../data/userData";
import { useContext } from "react";
import Loading from "../../components/loading/loading";

export default function MyAccount() {
    let navigate = useNavigate()
    let { user, setUser } = useContext(userData)

    let logout = () => {
        toast('Logout..', {
            style: {
                backgroundColor: 'black',
                color: 'white'
            }
        })
        setTimeout(() => {
            navigate('/')
            setUser({
                id: null,
                username: null
            })
            localStorage.removeItem('token')

        }, 2000)
    }

    return (
        user ?
            user.id ?
                <>
                    <div className="pt-20 grid grid-cols-8 lg:grid-cols-10 gap-1 px-5 lg:px-24">

                        <div className="col-start-1 col-end-8 hidden lg:block lg:col-start-2 lg:col-end-9 py-3">
                            <Breadcrumb aria-label="Default breadcrumb example">
                                <Breadcrumb.Item>
                                    <Link to='/'>
                                        Home
                                    </Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Link to='/my-account'>
                                        My Account
                                    </Link>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>

                        <div className="col-start-1 col-end-9 hidden lg:block lg:col-start-2 lg:col-end-4 w-56">

                            <Link to='/my-account/information'>
                                <div className="border-b-2 border-gray-300 py-2 px-3">
                                    Account Information
                                </div>
                            </Link>

                            <Link to='/my-account/address'>
                                <div className="border-b-2 border-gray-300 py-2 px-3">
                                    Address
                                </div>
                            </Link>

                            <Link to='/my-account/history'>
                                <div className="border-b-2 border-gray-300 py-2 px-3">
                                    Transaction History
                                </div>
                            </Link>

                            <button onClick={() => logout()} className="px-3 text-red-600 text-left font-bold py-2 w-full border-b-2 border-gray-300 mb-5">
                                Logout
                            </button>

                        </div>

                        <div className="flex justify-center w-max lg:hidden">
                            <div className="ml-2 md:ml-10 my-5 flex justify-center text text-sm">
                                <Button.Group>
                                    <Button className="w-20 md:w-44" color="gray" onClick={() => navigate('/my-account')}>
                                        My Account
                                    </Button>
                                    <Button className="w-20 md:w-44" color="gray" onClick={() => navigate('/my-account/information')}>
                                        Account Information
                                    </Button>
                                    <Button className="w-20 py-3 md:py-0 md:w-44" color="gray" onClick={() => navigate('/my-account/address')}>
                                        Address
                                    </Button>
                                    <Button className="w-20 md:w-44" color="gray" onClick={() => navigate('/my-account/history')}>
                                        Transaction History
                                    </Button>
                                </Button.Group>
                            </div>
                        </div>

                        <div className="hidden">
                            <div className="my-5 flex text-sm">
                                <Dropdown
                                    label="My Account"
                                    inline={true}
                                >
                                    <Dropdown.Item onClick={() => navigate('/my-account')}>
                                        My Account
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => navigate('/my-account/information')}>
                                        Account Information
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => navigate('/my-account/address')}>
                                        Address
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => navigate('/my-account/history')}>
                                        Transaction History
                                    </Dropdown.Item>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="col-start-1 col-end-9 lg:col-start-4 lg:col-end-10">
                            <Outlet />
                        </div>
                    </div>
                    <Toaster />
                </>
                :
                navigate('/page-not-found')
            :
            <Loading />
    )
}