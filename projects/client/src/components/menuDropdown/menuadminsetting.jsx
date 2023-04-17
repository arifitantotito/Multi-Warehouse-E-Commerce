import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { Modal, Label, Button } from 'flowbite-react'
import { AiOutlineLoading3Quarters, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

export default function MenuAdminSetting(data) {
  let [dataEmptyWH, setDataEmptyWH] = useState([])
  let [visible, setVisible] = useState({
    check: false,
    disable: false,
    update: false,
    password: false,
    pop: false,
    choice: 1
  })

  let [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    gender: '',
    phone_number:"",
    location_warehouse_id: null,
    password: ''
  })

  let getEmptyWH = async () => {
    let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/warehouse/AvailableWH`)
    setDataEmptyWH(response.data.data)
  }

  let submit = async () => {
    try {
      if(profile.phone_number.length !=0){
        if (isNaN(profile.phone_number)) throw { message: 'phone number cannot be alphabet' }
        if (profile.phone_number.length < 8 || profile.phone_number.length > 13) throw { message: 'Please input valid phone number' }
      }
      if (profile.password.length < 8 && profile.password.length !=0) throw { message: 'Password at least has 8 characters' }
      
      let character = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
      if (!character.test(profile.password) && profile.password.length !=0) throw { message: 'Password must contains number' }

      let response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/admin/update`, profile)
      toast.success(response.data.message)
      setVisible({ ...visible, pop: false, disable: true })
      setTimeout(() => {
        window.location.reload(false)
      }, 2000)
    } catch (error) {
      console.log(error)
      setVisible({ ...visible, pop: false, disable: false })
      if (!error.response) {
        toast.error(error.message)
      } else {
        toast.error(error.response.data.message)
      }
    }

  }

  let deleteAdmin = async () => {
    let response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/admin/delete`, { id: profile.id })
    toast.success(response.data.message)
    setVisible({ ...visible, pop: false })
    setTimeout(() => {
      toast('Loading..')
      window.location.reload(false)
    }, 2000)
  }

  return (
    <div className="">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button
            onClick={() => {
              console.log(data.data.phone_number?'a':'b')
              setProfile({
                ...profile,
                id: data.data.id,
                name: data.data.name,
                email: data.data.email,
                gender: data.data.gender,
                phone_number: data.data.phone_number?data.data.phone_number:"",
                location_warehouse_id: data.data.location_warehouse_id,
                password: ''
              })
            }}
            className="inline-flex w-full justify-center rounded-md bg-stone-800 hover:bg-stone-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            Options
            <ChevronDownIcon
              className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute z-10 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item >
                {({ active }) => (
                  <button
                    onClick={() => {
                      getEmptyWH()

                      setVisible({ ...visible, update: visible.update ? false : true })
                    }}
                    className={`${active ? 'bg-violet-500 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <EditActiveIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    ) : (
                      <EditInactiveIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    )}
                    Edit
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setVisible({ ...visible, pop: true, choice: 2 })}
                    className={`${active ? 'bg-violet-500 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm `}
                  >
                    {active ? (
                      <DeleteActiveIcon
                        className="mr-2 h-5 w-5 text-violet-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <DeleteInactiveIcon
                        className="mr-2 h-5 w-5 text-violet-400"
                        aria-hidden="true"
                      />
                    )}
                    Delete
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      <Modal className='overflow-scroll pt-60'
        show={visible.update}
        size="lg"
        popup={true}
        onClose={() => visible.disable?null:setVisible({ ...visible, update: visible.update ? false : true })}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center">
              Change {data.data.name}'s Data
            </h3>

            <div>
              <div className="mb-2 block">
                <Label
                  value="Name Admin"
                />
              </div>
              <input onChange={(e) => setProfile({ ...profile, name: e.target.value })} className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black'
                id="name"
                maxlength="20"
                placeholder={data.data.name}
                required={true}
              />
              <div className={` text-sm text-gray-500 ml-1`}>
                cannot be more than 20 character
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  value="Email Admin"
                />
              </div>
              <input className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black' id="Address"
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder={data.data.email}
                required={true}
              />
            </div>

            <div className='flex gap-3'>
              <div className='w-1/5'>
                <div className="mb-2 block">
                  <Label
                    value="Gender"
                  />
                </div >
                <select className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black'
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  id="Gender"
                  placeholder={data.data.gender}
                  required={true}
                >
                  <option value={data.data.gender}>{data.data.gender}</option> <option value={data.data.gender == 'F' ? 'M' : 'F'}>{data.data.gender == 'F' ? 'M' : 'F'}</option>
                </select>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label
                    value="Phone Number"
                  />
                </div>
                <input
                  className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black' id="phone_number"
                  onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                  placeholder={data.data.phone_number ? data.data.phone_number : 'Empty..'}
                  name="phone"
                  maxLength={13}
                  required={true}
                />
              </div>
            </div>


            <div>
              <div className="mb-2 block">
                <Label
                  value="Warehouse"
                />
              </div>
              <select className='w-full py-2 px-2 border border-black focus:ring-transparent focus:border-black'
                onChange={(e) => setProfile({ ...profile, location_warehouse_id: e.target.value })}
                id="warehouse"
                required={true}
              >
                <option value={data.data?.location_warehouse}>{data.data.location_warehouse ? data.data.location_warehouse : 'Please select warehouse'}</option>
                {
                  dataEmptyWH.map((item, index) => <option value={item.id}>{item.city}</option>)
                }
              </select>
            </div>

            <div className="mt-5 flex items-center">
              <input onChange={() => setVisible({ ...visible, check: visible.check ? false : true })} id="black-checkbox" type="checkbox" value="" className="w-4 h-4 mr-2 text-black bg-gray-100 border-gray-300 rounded-sm focus:ring-transparent" />
              <p className="font-semibold">Change Password ?</p>
            </div>

            {
              visible.check ?
                <div>
                  <p className="font-semibold mb-3">Input New Password</p>
                  <div className="flex items-center relative">
                    <div className="flex items-center relative">
                      <input
                        onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                        maxLength={15}
                        type={visible.password ? 'text' : 'password'} placeholder="Input your password" className="focus:border-black focus:ring-transparent w-full" />
                      <button onClick={() => setVisible({ ...visible, password: visible.password ? false : true })} className="absolute right-3 text-xl" >{visible.password ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}</button>
                    </div>
                  </div>
                  <div className='flex flex-col gap-1 text-sm ml-1 text-red-500'>
                    <p className={`${profile.password.length>8 || profile.password.length==0?'hidden':''}`}>password at least has 8 character</p>
                    <p className={`${/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(profile.password) || profile.password.length == 0?'hidden':''}`}>password must contain number</p>
                  </div>
                </div>

                :
                null}

            <Button disabled={visible.disable} onClick={() => {
              setVisible({ ...visible, pop: true, choice: 1 })
            }} className='hover:border-black text-white border rounded-sm hover:text-black border-black bg-neutral-900 hover:bg-white w-full'>
              Submit
            </Button>

          </div>
        </Modal.Body>
      </Modal>

      <Modal

        show={visible.pop}
        size="md"
        popup={true}
        onClose={() =>  visible.disable?null:setVisible({ ...visible, pop: false })}
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
                  visible.choice == 1 ? 'Are you sure to update this admin?' : 'Are you sure want to delete this admin?'
                }
              </h3>
              <div className='flex gap-3'>
                <button
                  disabled={visible.disable}
                  onClick={() => {
                    setVisible({ ...visible, disable: true })
                    visible.choice == 1 ? submit() : deleteAdmin(data.data)
                  }} data-modal-hide="popup-modal" type="button" className={`text-white ${visible.choice == 1 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'} focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2`}>
                  {
                    visible.choice == 1 ? 'Yes, update' : 'Yes, delete'
                  }
                </button> 
                <button disabled={visible.disable} onClick={() => setVisible({ ...visible, pop: false })} data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</button>
              </div>

            </div>
          </div>
        </Modal.Body>

      </Modal>
    </div>
  )
}

function EditInactiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
    </svg>
  )
}

function EditActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
    </svg>
  )
}

function DeleteInactiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#A78BFA" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  )
}

function DeleteActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#C4B5FD" strokeWidth="2" />
    </svg>
  )
}