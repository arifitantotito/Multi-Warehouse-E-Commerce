import { Card } from "flowbite-react"
import iphonedisc from './../../../Assets/iphonedisc.jpg'
import "@lottiefiles/lottie-player";

export default function Discount() {
    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 px-5 md:px-10 lg:px-36 mt-10">
                <button className=" ">
                    <div className="">
                        <div className=''>
                            <div className='min-h-[5px] relative' >
                                <img src={iphonedisc} className='flex items-start min-w-[10px]' alt="hai" />
                                <div className="absolute w-[75px] md:w-[110px] lg:w-[120px] left-6 bottom-[30px] md:left-8 md:bottom-[40px] lg:bottom-[60px] lg:left-12">
                                    <lottie-player
                                        autoplay
                                        loop
                                        mode="normal"
                                        src="https://assets3.lottiefiles.com/packages/lf20_xchv8mlf.json"
                                        // style={{ width: "80px" }}
                                        speed="1"
                                    ></lottie-player>
                                </div>
                            </div>
                            <div className=''>
                                <div className="flex justify-center font-bold text-lg">
                                    iPhone 14 Pro
                                </div>
                                <div className="gap-1 flex-col justify-center text-sm">
                                    <div className='text-md'>
                                        <s>
                                            Rp 17.999.000
                                        </s>
                                    </div>
                                    <div className="text-red-600 font-bold text-lg">
                                        Rp. 20.000.000
                                    </div>
                                </div>
                                <div className='flex p-5 justify-center gap-3'>
                                    {/* {props.data.arrColor[index].map((val, idx) => {
                                        return (
                                            <div style={{ backgroundColor: `${val}` }} className={`w-4 h-4 border rounded-full`}></div>
                                        )
                                    })} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </button>
                
            </div>
        </div>
    )
}