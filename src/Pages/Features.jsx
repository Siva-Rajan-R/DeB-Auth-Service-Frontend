import { FeaturesCard } from '../Components/FeaturesCard'
import OTL from '../assets/lotties/Login and Sign up.json'
import Lottie from 'lottie-react'
import { featuresCardDatas } from '../Constants/index'

export const FeaturesPage = () => {
  return (
    <div className="mx-3 max-sm:mx-0 mt-30 max-sm:mt-15 max-lg:mt-25 w-full" id="features">
      {/* Feature title */}
      <div className="w-full flex justify-start items-start">
        <h1 className="w-fit text-4xl max-sm:text-xl max-lg:text-2xl bg-linear-to-r from-purple-200 via-purple-300 to-purple-800 bg-clip-text text-transparent font-semibold rounded-1xl px-2 pb-2 border-b-2 border-purple-300 rounded">
          Features
        </h1>
      </div>

      {/* Feature container */}
      <div className="flex w-full justify-center items-center mt-8 max-sm:mt-2 max-lg:mt-5">
        {/* ✅ Fix: make it stack vertically on small screens */}
        <div className="flex max-lg:items-center flex-row max-sm:flex-col max-lg:flex-col mt-8 w-fit max-lg:w-full h-100 max-sm:h-full max-lg:h-full border-l-2 border-r-2 max-sm:border-0 border-purple-400 rounded-2xl">

          {/* Vertical feature card */}
          <div className="shadow shadow-purple-300 w-90 h-90 ml-10 max-lg:ml-0 mt-5 rounded-2xl p-5 max-sm:ml-0 max-sm:w-full max-sm:h-80">
            <div className="h-40 flex justify-center items-center w-full">
              <Lottie animationData={OTL} className='max-sm:w-60 max-lg:w-60' />
            </div>
            <div className="w-60 h-40 flex flex-col justify-center">
              <h1 className="font-bold text-1xl bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 bg-clip-text text-transparent">
                One-Time Login URL
              </h1>
              <h3 className="text-purple-100 mt-2">
                After receiving the API key, a unique login link is generated — valid only once to ensure security.
              </h3>
            </div>
          </div>

          {/* Horizontal feature cards */}
          <div className="w-full h-full grid grid-cols-2 max-sm:grid-cols-1 max-lg:grid-cols-2 ml-15 max-sm:ml-0 max-lg:ml-0 max-sm:gap-y-5 mt-5 max-sm:mt-8">
            {featuresCardDatas.map((data, index) => (
              <FeaturesCard
                key={index}
                title={data.title}
                description={data.desc}
                imageUrl={data.imageUrl}
                lottieUrl={data.lottieUrl}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
