import { useState } from "react"
import Loading from "../../loading/loading"



export default function Category(data) {
    let [tugel, setTugel] = useState([false, false, false, false])

    let click = (index) => {
        setTugel(value => value.map((item, idx) => idx === index ? !item : item))
    }

    return (
                <div className="w-full h-full">
                    <div className="flex flex-col  w-full min-h-fit px-2 lg:px-9 pt-5 bg-stone-800 text-white rounded-md">
                        <div className="w-full flex flex-col mb-5 pb-2">
                            <div className="flex gap-6 lg:gap-0 items-center border-b pb-3 border-white ">
                                <div className="w-1/4  flex flex-col gap-1 text-start text-sm lg:text-lg ">
                                    Category
                                </div>
                                <div className="w-1/4 text-sm lg:text-lg ">
                                    Profit
                                </div>
                                <div className="w-2/4 text-start text-sm lg:text-lg ">
                                    Sold in percentage
                                </div>
                            </div>
                        </div>
                        {
                            data.data.category.map((item, index) => {
                                return (
                                    <div className="w-full flex flex-col mb-5 pb-2">
                                        <div className="flex items-center">
                                            <div className='lg:w-1/4 w-1/3 flex items-center'>
                                            <div className="w-max group  flex flex-col gap-1 text-start text-sm lg:text-lg ">
                                                {item.category}
                                                <hr className="w-0 group-hover:w-full group-hover:duration-500 h-0.5 bg-slate-300" />
                                            </div>
                                            </div>
                                            <div className="lg:w-1/4 w-1/3">
                                                Rp.{(item.totalC).toLocaleString()}
                                            </div>
                                            <div className="lg:w-2/4 w-1/3">
                                                <div className="flex justify-end mb-1">
                                                    <span className="text-sm font-medium text-blue-700 dark:text-white">{Math.floor(item.qty / (data.data.total_qty == 0 ? 1 : data.data.total_qty) * 100)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                                    <div className="bg-blue-600 h-2.5 rounded-full duration-300 ease-in" style={{ width: `${item.qty / (data.data.total_qty == 0 ? 1 : data.data.total_qty) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                    {/* konten luar */}
                </div>
    )
   
}