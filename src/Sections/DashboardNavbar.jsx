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
      className={`w-full sticky top-0 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-md bg-white/20 shadow-md rounded-2xl' : 'bg-transparent'
      }`}
    >
      <div className="flex justify-between items-center m-3 pb-3 w-full">
        {/* for title */}
        <div className='flex justify-center items-center gap-x-5'>
          <MdOutlineKeyboardBackspace size={40} color='cyan' cursor={'pointer'} onClick={()=>{window.location.href="/"}}/>
          <h1 className="text-3xl bg-gradient-to-r from-cyan-100 via-cyan-200 to-cyan-300 bg-clip-text text-transparent font-bold">
            DeB-Auth-Dashboard
          </h1>
        </div>

        {/* for signin and other buttons */}
        <div className="bg-transparent w-100 h-15 rounded-2xl flex justify-evenly items-center">
          <IceBlueButton
            btnName={'Docs'}
            btnClassName={'text-[18px] font-semibold'}
            onclickFunc={() => {
              window.open('/auth-docs', '_blank')
            }}
          />
        </div>
      </div>
    </div>
  )
}
