import React from 'react'
import {AiOutlinePlus} from 'react-icons/ai'

const ButtonWithIcon = ({handleClick, label}) => {
  return (
        <button onClick={handleClick} className='p-1 overflow-hidden flex justify-center items-center duration-300 hover:w-40 w-8 h-8 rounded-xl hover:bg-emerald-600 hover:text-white font-semibold text-black'>
        <div><AiOutlinePlus size={'22px'} /></div>
            <div className='overflow-hidden flex gap-3 ml-3 h-full'>
            <span>{label}</span>
        </div>
        </button>
  )
}

export default ButtonWithIcon