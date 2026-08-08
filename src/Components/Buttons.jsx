
export const IceBlueButton = ({btnName,onclickFunc,btnClassName,btnDivClassName,shadowColor='shadow-cyan-500/25'}) => {
  return (
    <div className={`bg-gradient-to-r from-[#00d2e5] to-teal-400 hover:from-[#00c0d3] hover:to-teal-500 shadow-md ${shadowColor} hover:shadow-cyan-400/40 w-fit h-10 rounded-full flex justify-center items-center px-7 cursor-pointer active:scale-95 transition-all duration-300 ${btnDivClassName}`} onClick={()=>onclickFunc && onclickFunc()}>
        <span className={`text-slate-950 font-extrabold tracking-tight ${btnClassName}`}>{btnName}</span>
    </div>
  )
}
