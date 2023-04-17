import axios from "axios"
import { useEffect, useRef, useState, useContext } from "react"
import {BsPencil,BsTrash,BsList} from 'react-icons/bs'
import {AiOutlineSetting} from 'react-icons/ai'
import { Modal, Button, TextInput, Label} from 'flowbite-react'
import toast,{ Toaster } from "react-hot-toast";
import AdminProducts from "./adminProducts"
import { Link, useParams } from "react-router-dom"
import { userData } from "../../data/userData"

export default function AdminCategoryProducts(){

    let {user} = useContext(userData)

    const {id} = useParams()

    let onPostCategory  = useRef()
    let onUpdateCategory  = useRef()

    const [coba , setCoba] = useState([])

    const [category, setCategory] = useState([])
    const [showCategory, setShowCategory] = useState(false)
    const [showAddCategory, setAddShowCategory] = useState(false)
    const [showEditCategory, setEditShowCategory] = useState(false)
    const [showDeleteCategory, setDeleteShowCategory] = useState(false)
    const [editId, setEditId] = useState("")
    const [editName, setEditName] = useState("")
    const [deleteName, setDeleteName] = useState("")
    const [deleteId, setDeleteId] = useState("")
    const [operId, setOperId] = useState(1)
    const [showProduct, setShowProduct] = useState([])
    const [showPagePro, setShowPagePro] = useState(1)

    let getCategory = async () => {
        try {
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/category`)
            setCategory(response.data.data)
        } catch (error) {
        }
    }

    let addCategory = async()=>{
        try {
            let inputCategory = onPostCategory.current.value
            let response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/product/post-category`,{name:inputCategory})
            setTimeout(() => {
                toast.success('Add Category Success', {
                    duration: 3000
                })
            }, 100)
            setAddShowCategory(false)
            setShowCategory(true)
            getCategory()
            onPostCategory.current.value = ""
        } catch (error) {
            setTimeout(() => {
                toast.error(error.response.data.message, {
                    duration: 3000
                })
            }, 100)
            onPostCategory.current.value = ""
        }
    }

    let updateCategory = (value, index)=>{
        try {
            // setEditId(Category[index].id);
            setEditId(category[index].id);
            let updateCategoryName = onUpdateCategory.current.value
            setEditName(value);
        } catch (error) {
            
        }
    }

    let updatePostCategory = async()=>{
        try {
            let updateCategoryName = onUpdateCategory.current.value
            let response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/product/edit-category`,{id:editId, name: updateCategoryName })
            setTimeout(() => {
                toast.success('Add Category Success', {
                    duration: 3000
                })
            }, 100)
            setEditShowCategory(false)
            getCategory()
            onUpdateCategory.current.value = ""
        } catch (error) {
            setTimeout(() => {
                toast.error(error.response.data.message, {
                    duration: 3000
                })
            }, 100)
        }
    }

    let deleteCategory = (value, index)=>{
        try {
            setDeleteName(value);
            setDeleteId(category[index].id);
        } catch (error) {
            
        }
    }

    
    let deletePostCategory = async()=>{
        try {
            let response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/product/delete-category`,{id:deleteId})
            setTimeout(() => {
                toast.success('Delete Category Success', {
                    duration: 3000
                })
            }, 100)
            setDeleteShowCategory(false)
            getCategory()
        } catch (error) {
            
        }
    }

    let getProduct = async(id)=>{
        try {
            // _pagePro = Number(_pagePro) + 1
            let {data} = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/products/${id}`)
            // let {data} = await axios.get(`http://localhost:8000/product/products/${id}?page=${_pagePro?_pagePro:showPagePro}`)
            // let {data} = await axios.get(`http://localhost:8000/product/${id}?page=${_page? _page:showPage}`)
            setShowProduct(data.data)
            // setShowPagePro({page: data.data.page, pages: data.data.pages, total: data.data.total})
            getProductDetail(id)
        } catch (error) {
        }
      }

      let getProductDetail = async(id)=>{
        try {
            let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/productdetail/${id}`)
            setCoba(response)
        } catch (error) {
        }
      }
    
    useEffect(() => {
        getCategory()
        // getProductDetail()
    }, [])
    

    return(
        <div className="p-5 flex flex-col gap-8 min-h-screen">
            <div className="text-2xl font-semibold">
                Products List
            </div>
            <div className="border rounded-sm flex justify-between w-full">
                <div className="flex gap-5 py-3 px-5 overflow-y-hidden">
                {category.map((value, index)=>{
                    return(
                        <Link to={`/admin/products/${value.id}`}>
                            <div className='gap-5 px-4 py-2 bg-stone-800 flex border-b-4 border-lime-300 rounded-md group'>                            
                                <div className='flex flex-col items-end'>
                                    <button onClick={()=>{getProduct(value.id);setOperId(value.id)}} className=" rounded text-white min-w-[100px] ">
                                        <p className='text-lg font-semibold'>{value.name} </p>
                                    </button>
                                </div>
                            </div>
                            {/* <button onClick={()=>{getProduct(value.id);setOperId(value.id)}} className="border border-gray-400 px-3 py-2 rounded hover:bg-neutral-700 hover:text-white focus:bg-neutral-700 focus:text-white min-w-[100px] ">
                                {value.name} 
                            </button> */}
                        </Link>
                    )
                })}
                </div>
                <div className="flex gap-5 py-3 px-5 justify-center">
                    {/* Category Setting */}
                    <>
                    {user.role == 1?
                        <div className='flex justify-center p-3'>
                            <button onClick={()=>setShowCategory(!showCategory)} className="flex items-center">
                                <BsList size={'25px'}/>
                            </button>
                        </div>:null
                    }
                        <div className="flex justify-center">
                        <Modal
                            show={showCategory}
                            size="2xl"
                            popup={true}
                            onClose={()=>setShowCategory(!showCategory)  }
                        >
                            <Modal.Header />
                            <Modal.Body>
                                <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center">
                                        Category Settings
                                    </h3>

                                    {/* Add Category */}
                                    
                                    <div className=" flex justify-center p-2">
                                        <Button onClick={()=>{setAddShowCategory(!showAddCategory)}} className='hover:border-black  border rounded-sm hover:text-black border-black bg-neutral-900 hover:bg-white w-[640px]'>                                                                                
                                            Add New Category
                                        </Button>
                                    </div>
                                    <Modal
                                        show={showAddCategory}
                                        size="2xl"
                                        popup={true}
                                        onClose={()=>setAddShowCategory(!showAddCategory)  }
                                    >
                                        <Modal.Header/>
                                        <Modal.Body>
                                            <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center">
                                                Add Category
                                            </h3>
                                            <div className="mb-2 block">
                                                <Label
                                                    value="Category Name"
                                                />
                                            </div>
                                            <input ref={onPostCategory} className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black' 
                                                id="Category Name"
                                                placeholder="Name"
                                                required={true}
                                            />
                                            <div className=" flex justify-center py-5">
                                                <Button onClick={()=>{addCategory()}} className='hover:border-black text-white border rounded-sm hover:text-black border-black bg-neutral-900 hover:bg-white w-[640px]'>                                                                                
                                                    Submit
                                                </Button>
                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                    {/* Add Category */}

                                    {/* All Category */}
                                    <div className="p-2 overflow-x-hidden h-96">
                                    {category.map((value, index)=>{
                                        return(
                                            <div className="p-2 flex">
                                                <div className="py-4 flex justify-between w-full border border-gray-400 px-3 rounded ">
                                                    <div className="font-bold text-center w-full">
                                                        {value.name} 
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <button onClick={()=>{updateCategory(value.name, index);setEditShowCategory(!showEditCategory)}} className="flex items-center"> 
                                                            <BsPencil size={'15px'}/>
                                                        </button>
                                                        <button onClick={()=>{deleteCategory(value.name, index);setDeleteShowCategory(!showDeleteCategory)}} className="flex items-center">
                                                            <BsTrash size={'15px'} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    </div>
                                    {/* All Category */}

                                    {/* Edit Category */}
                                    <Modal
                                        show={showEditCategory}
                                        size="xl"
                                        popup={true}
                                        onClose={()=>setEditShowCategory(!showEditCategory)  }
                                    >
                                    <Modal.Header/>
                                        <Modal.Body>
                                            <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center">
                                                Update Category
                                            </h3>
                                            <div className="mb-2 block">
                                                <Label
                                                    value="Category Name"
                                                />
                                            </div>
                                            <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black' 
                                                id="Category Name"
                                                placeholder={editName}
                                                required={true} disabled
                                                />
                                            <div className="mt-3 mb-2 block">
                                                <Label
                                                    value="New Category Name"
                                                />
                                            </div>
                                            <input ref={onUpdateCategory} className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black' 
                                                id="Category Name"
                                                placeholder="name"
                                                required={true}
                                                />
                                            <div className=" flex justify-center py-5">
                                                <Button onClick={()=>{updatePostCategory()}} className='hover:border-black text-white border rounded-sm hover:text-black border-black bg-neutral-900 hover:bg-white w-[640px]'>                                                                                
                                                    Submit
                                                </Button>
                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                    {/* Edit Category */}

                                    {/* Delete Category */}
                                    <Modal
                                        show={showDeleteCategory}
                                        size="sm"
                                        popup={true}
                                        onClose={()=>setDeleteShowCategory(!showDeleteCategory)  }
                                    >
                                    <Modal.Header/>
                                        <Modal.Body>
                                            <div className="flex-col">
                                                <div className="felx text-xl mb-10 font-bold text-gray-900 dark:text-white text-center gap-5">
                                                    Delete {deleteName} ?
                                                </div>
                                                <div className="flex justify-center gap-5">
                                                    <Button color="failure" onClick={()=>deletePostCategory()} className="w-[150px] h-[50px]">
                                                        <div className="text-xl font-bold">
                                                            Yes
                                                        </div>
                                                    </Button>
                                                    <Button onClick={()=>setDeleteShowCategory(!showDeleteCategory)} color="light" className="w-[150px] h-[50px]">
                                                        <div className="text-xl font-bold">
                                                            No
                                                        </div>
                                                    </Button>
                                                </div>
                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                    {/* Delete Category */}

                                </div>                                        
                            </Modal.Body>
                        </Modal>
                        </div>
                    </>
                    {/* Category Setting */}
                </div>
            </div>

            {/* Products */}
                <AdminProducts func={{getCategory, getProduct, getProductDetail}} data={{category, operId, showProduct, coba, showPagePro}}/>
            {/* Products */}
        </div>
    )
}