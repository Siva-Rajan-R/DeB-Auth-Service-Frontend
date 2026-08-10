import Lottie from 'lottie-react'

export const FeaturesCard = ({title, description, imageUrl, lottieUrl}) => {
  return (
    <div className='w-full min-h-[110px] rounded-2xl flex flex-row items-center gap-4 p-1'>
        <div className='w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex justify-center items-center rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 p-1'>
            {imageUrl != null ? (
              <img src={imageUrl} alt={title} className='rounded-xl object-contain w-full h-full' />
            ) : (
              <Lottie animationData={lottieUrl} className="w-full h-full mix-blend-multiply" />
            )}
        </div>
        <div className='flex-1 flex flex-col justify-center'>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight leading-snug">{title}</h3>
            <p className='text-slate-600 mt-1 text-xs leading-relaxed font-normal'>{description}</p>
        </div>
    </div>
  )
}
