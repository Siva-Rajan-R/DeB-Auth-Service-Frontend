import { useEffect, useState } from 'react'
import { IceBlueButton } from '../Components/Buttons'
import { MdOutlineKeyboardBackspace } from "react-icons/md";

export const DashBoardNavBar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10) // blur when user scrolls down 10px
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`w-full transition-all duration-300 sticky top-0 z-50 ${
        scrolled ? 'backdrop-blur-md bg-white/20 shadow-md rounded-b-2xl' : 'bg-transparent'
      }`}
    >
      <div className="flex justify-between items-center p-3 sm:p-4 w-full">
        {/* for title */}
        <div className='flex justify-center items-center gap-x-3 sm:gap-x-5'>
          <MdOutlineKeyboardBackspace 
            size={32} 
            className='sm:w-10 sm:h-10 text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors' 
            onClick={()=>{window.location.href="/"}}
          />
          <h1 className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-cyan-100 via-cyan-200 to-cyan-300 bg-clip-text text-transparent font-bold">
            DeB-Auth-Dashboard
          </h1>
        </div>

        {/* for signin and other buttons */}
        <div className="bg-transparent">
          <IceBlueButton
            btnName={'Docs'}
            btnClassName={'text-sm sm:text-base md:text-[18px] font-semibold px-5 max-sm:px-0'}
            btnDivClassName={'px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl'}
            onclickFunc={() => {
              window.open('/auth-docs', '_blank')
            }}
          />
        </div>
      </div>
    </div>
  )
}