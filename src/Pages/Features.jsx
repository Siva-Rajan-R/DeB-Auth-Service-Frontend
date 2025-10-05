import { FeaturesCard } from '../Components/FeaturesCard'
import OTL from '../assets/lotties/Login and Sign up.json'
import Lottie from 'lottie-react'
import { featuresCardDatas } from '../Constants/index'


export const FeaturesPage = () => {

  return (
    <div className='mx-3 mt-30 w-full' id='features'>

          {/* for feature title */}
          <div className='w-full flex justify-start items-start'>
              <h1 className='w-fit text-4xl bg-linear-to-r from-purple-200 via-purple-300 to-purple-800 bg-clip-text text-transparent font-semibold rounded-1xl px-2 pb-2 border-b-2 border-purple-300 rounded'>
                Features
              </h1>
          </div>
          {/* end */}

          {/* this is for feature container */}
          <div className='flex w-full justify-center items-center mt-8'>
            <div className='flex mt-8 w-fit h-100 border-l-2 border-r-2 border-purple-400 rounded-2xl'>

              {/* this is for vertical feature card */}
              <div className='shadow shadow-purple-300 w-90 h-90 ml-10 mt-5 rounded-2xl p-5'>
                <div className='h-40 flex justify-center items-center w-full'>
                  <Lottie animationData={OTL} sizes='500px' ></Lottie>
                </div>
                <div className='w-60 h-40 flex flex-col justify-center'>
                  <h1 className="font-bold text-1xl bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 bg-clip-text text-transparent">One-Time Login URL</h1>
                  <h3 className='text-purple-100 mt-2'>
                   After receiving the API key, a unique login link is generated — valid only once to ensure security.
                  </h3>
                </div>
              </div>
              {/* end */}

              {/* this is for horizontal feature card */}
              <div className='w-full h-full grid grid-cols-2 max-md:grid-cols-2 ml-15 items-center'>
                  {
                    featuresCardDatas.map((data,index)=>(
                      <FeaturesCard key={index} title={data.title} description={data.desc} imageUrl={data.imageUrl} lottieUrl={data.lottieUrl}></FeaturesCard>
                    ))
                  }
              </div>
              {/* end */}

            </div>
          </div>
        {/* end */}

      </div>
  )
}
