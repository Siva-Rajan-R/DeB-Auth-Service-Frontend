import { useEffect, useState } from 'react'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { Sun, Moon } from 'lucide-react';
import { useAuthConfigStore } from '../Store/useAuthConfigStore';

export const DashBoardNavBar = ({actions}) => {
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useAuthConfigStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Sync theme attribute on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div
      className={`w-full transition-all duration-500 sticky top-0 z-50 ${
        scrolled 
          ? 'backdrop-blur-xl bg-[var(--bg-navbar)] border-b border-[var(--border-glass)] shadow-2xl' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1600px] mx-auto flex justify-between items-center px-6 py-4 w-full">
        <div className='flex justify-center items-center gap-x-4'>
          <div 
            onClick={()=>{window.location.href="/"}}
            className='p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 transition-all cursor-pointer group'
          >
            <MdOutlineKeyboardBackspace 
              size={24} 
              className='text-slate-400 group-hover:text-indigo-400 transition-colors' 
            />
          </div>
          <div className='flex flex-col'>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[var(--text-main)] to-[var(--text-muted)] bg-clip-text text-transparent leading-tight">
              DeB-Auth
            </h1>
            <span className='text-[10px] uppercase tracking-[0.2em] text-indigo-500/80 font-bold'>Platform Control</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {actions?.map((e, i)=>(
            <button
              key={i}
              onClick={e.onClick}
              className='px-5 py-2.5 rounded-xl bg-indigo-500 text-slate-950 text-sm font-bold hover:bg-indigo-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all active:scale-95'
            >
              {e.btnName}
            </button>
          ))}
          
          <div className='flex items-center gap-2 bg-white/5 border border-white/10 p-1 rounded-xl'>
            <button
              onClick={toggleTheme}
              className='p-2 rounded-lg transition-all hover:bg-white/10 text-[var(--text-main)] active:scale-90'
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className='w-px h-4 bg-white/10 mx-1' />
            <button
              onClick={() => window.open('/auth-docs', '_blank')}
              className='px-4 py-2 text-[var(--text-main)] text-sm font-semibold hover:bg-white/10 rounded-lg transition-all max-sm:hidden'
            >
              Docs
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
