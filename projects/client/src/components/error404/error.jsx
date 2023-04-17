import { useEffect } from "react"


export default function Error(props) {

    useEffect(() => {
        props.data.setConditionPage(true)
    }, [])
    return (
        <div className='flex flex-col relative items-center justify-center h-full py-20'>

            <lottie-player
                autoplay
                loop
                mode="normal"
                src="https://assets5.lottiefiles.com/packages/lf20_9Fhz02H45R.json"
                style={{ width: "400px" }}    >
            </lottie-player>

            <div className='text-2xl absolute mt-64 font-semibold'>
                PAGE NOT FOUND
            </div>
        </div>
    )
}