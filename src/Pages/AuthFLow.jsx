import Lottie from 'lottie-react'
import WorkFlowLottie from '../assets/lotties/Artboard 1.json'
import { authFLowSteps } from '../Constants/index'

export const AuthFLowPage = () => {
  return (
    <div id="auth-flow">
      <div className="ml-5 max-sm:ml-0 w-full flex flex-col mt-30 max-sm:mt-15 max-lg:mt-20">
        {/* Title */}
        <div className="w-full flex justify-start items-start">
          <h1 className="w-fit text-4xl max-sm:text-xl max-lg:text-2xl bg-linear-to-r from-purple-200 via-purple-300 to-purple-800 bg-clip-text text-transparent font-semibold rounded-1xl px-2 pb-2 border-b-2 border-purple-300 rounded">
            Auth Flow
          </h1>
        </div>
        {/* End Title */}

        {/* AuthFlow Container */}
        <div className="w-full h-100 max-sm:h-full max-lg:h-full mt-10">
          {/* ✅ Switch to vertical stacking on small screens */}
          <div className="w-full h-100 max-sm:h-full max-lg:h-full flex flex-row max-sm:flex-col max-lg:flex-col justify-center items-center gap-8">
            
            {/* AuthFlow Lottie */}
            <div className="w-200 h-100 relative max-sm:w-full max-lg:w-full max-sm:h-80 flex justify-center">
              <Lottie animationData={WorkFlowLottie} className="w-full h-full" />
              <div className='bg-black w-30 h-10 absolute bottom-0 right-0 max-sm:w-29 max-lg:w-52'></div>
            </div>
            {/* End Lottie */}

            {/* AuthFlow Explanation */}
            <div className="h-full w-fit overflow-y-scroll scrollbar-hide max-sm:overflow-visible max-sm:w-full max-sm:px-3">
              {authFLowSteps.map((step, index) => (
                <div key={index} className="mb-5">
                  <h1 className="bg-linear-to-r from-purple-300 via-purple-400 to-purple-800 bg-clip-text text-transparent font-bold text-2xl max-sm:text-lg">
                    {step.title}
                  </h1>
                  <h4 className="text-purple-100 mt-2">
                    {step.subTitle}
                  </h4>
                </div>
              ))}
            </div>
            {/* End Explanation */}

          </div>
        </div>
        {/* End of AuthFlow Container */}
      </div>
    </div>
  )
}
