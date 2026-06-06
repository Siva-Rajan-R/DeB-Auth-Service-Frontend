
export const IceBlueButton = ({btnName,onclickFunc,btnClassName,btnDivClassName,shadowColor='shadow-indigo-300'}) => {
  return (
    <div className={`bg-indigo-600 shadow-md ${shadowColor} w-fit h-10 rounded-4xl flex justify-center items-center px-8 cursor-pointer hover:bg-indigo-700 transition-colors ${btnDivClassName}`} onClick={()=>onclickFunc()}>
        <h1 className={`text-white ${btnClassName}`}>{btnName}</h1>
    </div>
  )
}
