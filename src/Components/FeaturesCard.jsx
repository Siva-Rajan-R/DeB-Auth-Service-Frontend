import Lottie from 'lottie-react'

export const FeaturesCard = ({title,description,imageUrl,lottieUrl}) => {
  return (
    <div className='shadow shadow-purple-300 w-100 h-40 rounded-2xl flex justify-between'>
        <div className='w-40 h-40 flex justify-center rounded-2xl'>
            {imageUrl!=null ?<img src={imageUrl} alt="" className='rounded-2xl'/> : <Lottie animationData={lottieUrl}></Lottie>}
        </div>
        <div className='w-60 h-40 flex flex-col justify-center pl-2'>
            <h1 className="font-bold text-1xl bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 bg-clip-text text-transparent">{title}</h1>
            <h3 className='text-purple-100 mt-2'>{description}</h3>
        </div>
    </div>
  )
}

