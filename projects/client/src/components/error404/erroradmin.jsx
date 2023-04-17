
export default function ErrorAdmin() {
    return (

        <div className='flex flex-col relative items-center justify-center h-full mt-20'>

            <lottie-player
                autoplay
                loop
                mode="normal"
                src="https://assets5.lottiefiles.com/packages/lf20_9Fhz02H45R.json"
                style={{ width: "300px" }}    >
            </lottie-player>

            <div className='text-2xl absolute mt-60 font-semibold'>
           PAGE NOT FOUND
            </div>
        </div>
    )
}