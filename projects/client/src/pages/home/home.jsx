import { Carousel } from "flowbite-react"
import "@lottiefiles/lottie-player";

import Carousel1 from './../../Assets/carousel1.jpg'
import Carousel2 from './../../Assets/carousel2.jpg'
import Carousel3 from './../../Assets/carousel3.jpg'
import Carousel4 from './../../Assets/carousel4.jpg'
import Carousel5 from './../../Assets/carousel5.jpg'
import Carousel6 from './../../Assets/carousel6.jpg'

import Banner1 from './../../Assets/banner1.jpg'
import Banner2 from './../../Assets/banner2.jpg'
import Banner3 from './../../Assets/banner3.jpg'

import Discount from "../../components/homeUser/discount/discount"

export default function Home() {
    return (
        <>
            <div className="flex justify-center content-center pt-20">
                <div className="h-[180px] md:h-[400px] lg:h-[900px] w-full">
                    <Carousel leftControl=" "
                        rightControl=" ">
                        <img src={Carousel1} alt='...' />
                        <img src={Carousel6} alt='...' />
                        <img src={Carousel2} alt='...' />
                        <img src={Carousel3} alt='...' />
                        <img src={Carousel4} alt='...' />
                        <img src={Carousel5} alt='...' />
                    </Carousel>
                </div>
            </div>
            {/* <div className="mt-10">
                <div className="grid md:justify-center lg:justify-center grid-cols-3 md:grid-cols-3 lg:grid-cols-3 px-5 md:px-10 lg:px-80 gap-10">
                    <button>
                        <img src={Banner1} alt='...' />
                    </button>
                    <button>
                        <img src={Banner3} alt='...' />
                    </button>
                    <button className="">
                        <img src={Banner2} alt='...' />
                    </button>
                </div>
            </div> */}
            {/* <div className="flex justify-center mt-10">
                <lottie-player
                    autoplay
                    loop
                    mode="normal"
                    src="https://assets5.lottiefiles.com/private_files/lf30_6t1tjl3b.json"
                    style={{ width: "1300px" }}
                ></lottie-player>
            </div> */}
            {/* <div>
                <Discount />
            </div> */}
        </>
    )
}