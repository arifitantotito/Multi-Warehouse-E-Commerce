import FooterPayment from '../../../Assets/footer-payment.webp'
import FooterShipping from '../../../Assets/footer-shipping.webp'
import FooterWarranty from '../../../Assets/footer-warranty.webp'
import FooterShipper from '../../../Assets/footer-shipper.webp'
import FooterService from '../../../Assets/footer-service.webp'
import FooterPromo from '../../../Assets/footer-promo.webp'

import { ImFacebook2, ImTwitter, ImYoutube, ImWhatsapp } from 'react-icons/im'
import { FaInstagram } from 'react-icons/fa'
import { MdOutlineCopyright } from 'react-icons/md'

export default function Footer() {
    return (
        <>
            <div className='bg-neutral-800 flex justify-center flex-col md:flex-row px-5 md:px-10 lg:px-20 py-6 mt-5'>
                <div className='flex items-center mr-5 my-3'>
                    <img src={FooterWarranty} className="mr-3 w-9 md:w-10 lg:w-12"/>
                    <div className='text-white text-sm lg:text-base'>
                        <p className='font-bold'>Official Warranty</p>
                        <p>Official Warrranty Product / TAM Warranty</p>
                    </div>
                </div>
                <div className='flex items-center mr-5 my-3'>
                    <img src={FooterService} className="mr-3 w-9 md:w-10 lg:w-12" />
                    <div className='text-white text-sm lg:text-base'>
                        <p className='font-bold'>Customer Service</p>
                        <p>Our Team is Ready to Help About Products</p>
                    </div>
                </div>
                <div className='flex items-center mr-5 my-3'>
                    <img src={FooterShipper} className="mr-3 w-9 md:w-10 lg:w-12" />
                    <div className='text-white text-sm lg:text-base'>
                        <p className='font-bold'>Delivery Service</p>
                        <p>Trusted Shipping And Security</p>
                    </div>
                </div>
                <div className='flex items-center my-3'>
                    <img src={FooterPromo} className="mr-3 w-9 md:w-10 lg:w-12" />
                    <div className='text-white text-sm lg:text-base'>
                        <p className='font-bold'>Shopping Benefit</p>
                        <p>Latest Promos and Info on Latest Gadget Products</p>
                    </div>
                </div>
            </div>

            <div className='bg-black flex items-center lg:justify-center flex-col lg:flex-row lg:px-10 gap-10 py-7 -z-10'>
                <p className='text-white text-sm font-semibold text-center lg:text-start'>
                    Start subscribing to the newsletter and get the latest information and promos
                </p>
                <div className='relative flex items-center'>
                    <input type='text' placeholder='Input your email' className='py-2 w-[350px] lg:w-[650px] border border-black focus:ring-0 focus:ring-transparent focus:border-black' />
                    <button className='absolute right-0 font-semibold border-l-2 h-5/6 px-5 text-sm'>
                        SEND
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 px-5 md:px-10 lg:px-60 lg:gap-10 pb-10 border-t h-max pt-5 bg-white inset-x-0 bottom-auto">
                <div className="">
                    <div className="text-lg font-semibold">
                      <img className='bg-black' src={`${process.env.REACT_APP_API_IMAGE_URL}Public/images/F_logo.png`} alt="" width={'80px'} />
                    </div>
                    <div className="text-neutral-800 text-sm">
                        <p className="leading-loose">
                            iFrit is a leading Apple Premium Reseller in Indonesia specializing in Apple products and a wide range of complementary accessories, software and other products.
                        </p>

                        <p className="mt-4 leading-loose">
                            If you would like assistance or have any feedback, please contact us:<br />
                            Hour 9:30 - 17:30 (Monday - Friday)<br />
                            Hour 9:30 - 15:00 (Saturday)<br />
                            Email : ifritcompany@gmail.com<br />
                            Phone : 1500372<br />
                            WA : 0812 9077 7722
                        </p>
                    </div>
                </div>
                <div className="">
                    <div className="text-base font-semibold">
                        Information
                    </div>
                    <button className="pt-2 text-gray-400 block">
                        About Us
                    </button>
                    <button className="pt-3 text-gray-400 block">
                        FAQ
                    </button>
                    <button className="pt-3 text-gray-400 block">
                        Privacy
                    </button>
                </div>
                <div className="">
                    <div className="text-base font-semibold">
                        Services
                    </div>
                    <button className="pt-2 text-gray-400 block">
                        How to Order
                    </button>
                    <button className="pt-3 text-gray-400 block">
                        How to Payment
                    </button>
                    <button className="pt-3 text-gray-400 block">
                        Shipping Information
                    </button>
                    <button className="pt-3 text-gray-400 block">
                        Order Trackking
                    </button>
                    <button className="pt-3 text-gray-400 block">
                        Transaction Cancellation
                    </button>
                </div>
                <div className="">
                    <div className="text-base font-semibold">
                        We Accept
                    </div>
                    <div className="pt-2 ">
                        <img src={FooterPayment}  className='w-2/3 md:w-full'/>
                    </div>
                    <div className="pt-3 text-base font-semibold">
                        Shipping Services
                    </div>
                    <div className="pt-2 ">
                        <img src={FooterShipping} />
                    </div>
                    <div className="pt-3 text-base font-semibold">
                        Find Us
                    </div>
                    <div className="pt-2 text-2xl flex gap-4">
                        <ImFacebook2 />
                        <ImTwitter />
                        <ImYoutube />
                        <FaInstagram />
                        <ImWhatsapp />
                    </div>
                </div>
            </div>
            <p className='bg-black flex text-white items-center text-[10px] lg:text-xs justify-center py-3'>
                COPYRIGHT <MdOutlineCopyright /> 2023 IFRIT. ALL RIGHTS RESERVED.
            </p>
        </>
    )
}