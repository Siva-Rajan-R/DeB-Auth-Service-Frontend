import Lottie from 'lottie-react'

export const FeaturesCard = ({title,description,imageUrl,lottieUrl}) => {
  return (
    <div className='w-100 max-sm:w-full max-lg:w-90 h-40 max-sm:h-30 max-lg:h-30 rounded-2xl flex justify-between max-sm:scale-100 max-lg:scale-80 p-2'>
        <div className='w-40 h-40 max-sm:w-30 max-sm:h-30 max-lg:w-30 max-lg:h-30 flex justify-center items-center rounded-2xl overflow-hidden'>
            {imageUrl!=null ? <img src={imageUrl} alt="" className='rounded-2xl object-cover'/> : <Lottie animationData={lottieUrl} className="w-full h-full mix-blend-multiply" />}
        </div>
        <div className='w-60 h-40 max-sm:w-70 max-lg:w-70 max-sm:h-30 max-lg:h-30 flex flex-col justify-center pl-3'>
            <h1 className="font-extrabold text-base text-slate-900 tracking-tight">{title}</h1>
            <h3 className='text-slate-600 mt-1.5 text-xs leading-relaxed font-normal'>{description}</h3>
        </div>
    </div>
  )
}

