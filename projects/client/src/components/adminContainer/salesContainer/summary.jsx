import Loading from '../../core/loading'

export default function Summary(data) {
    return (
        <div className="w-full h-full">
            <div className='flex justify-between w-full'>
                <div className=' flex flex-col gap-2'>
                    <div className='text-xl font-semibold mb-3'>
                        Selling
                    </div>
                    <div>
                        1. All Items from All Warehouse
                    </div>
                    <div>
                        2. Shipping service
                    </div>
                    <div>
                        3. Discount Item
                    </div>
                    <div>
                        4. Returned Item
                    </div>

                </div>

                <div className='flex flex-col items-end gap-2'>
                    <div className='text-xl font-semibold mb-5'>
                        In IDR
                    </div>
                    <div>
                        { (data.data.total).toLocaleString()}
                    </div>
                    <div>
                        {(data.data.ongkir).toLocaleString()}
                    </div>
                    <div>
                        {(data.data.discount).toLocaleString()}
                    </div>
                    <div>
                        0
                    </div>

                </div>
            </div>

            <hr className='border-1 my-4 border-slate-200 w-full' />

            <div className='flex justify-between w-full text-lg mb-20 font-semibold'>
                <div>
                    Net Sales
                </div>
                <div>
                    { (data.data.total + data.data.ongkir - data.data.discount).toLocaleString()}
                </div>
            </div>
            <div className='flex justify-between w-full'>
                <div className=' flex flex-col gap-2'>
                    <div className='text-xl font-semibold mb-3'>
                       Properties
                    </div>
                    <div>
                        1. All Transaction
                    </div>
                    <div>
                        2. All Items Sold
                    </div>
                   

                </div>

                <div className='flex flex-col items-end gap-2'>
                    <div className='text-xl font-semibold mb-5'>
                        In Items
                    </div>
                   <div>
                    {data.data.transaction}
                   </div>
                   <div>
                    {data.data.qty}
                   </div>

                </div>
            </div>
            {/* ini summary bangsat */}
        </div>
    )
}