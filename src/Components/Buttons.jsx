
export const IceBlueButton = ({btnName,onclickFunc,btnClassName,shadowColor='shadow-cyan-400'}) => {
  return (
    <div className={`bg-transparent shadow ${shadowColor} w-fit h-10 rounded-4xl flex justify-center items-center px-10 cursor-pointer`} onClick={()=>onclickFunc()}>
        <h1 className={btnClassName}>{btnName}</h1>
    </div>
  )
}
