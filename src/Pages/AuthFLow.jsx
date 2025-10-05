import Lottie from 'lottie-react'
import WorkFlowLottie from '../assets/lotties/Artboard 1.json'
import { authFLowSteps } from '../Constants/index'

export const AuthFLowPage = () => {
    
    return (
        <div id='auth-flow'>
            <div className='ml-5 w-full flex flex-col mt-30'>
            {/* for title */}
                <div className='w-full flex justify-start items-start'>
                    <h1 className='w-fit text-4xl bg-linear-to-r from-purple-200 via-purple-300 to-purple-800 bg-clip-text text-transparent font-semibold rounded-1xl px-2 pb-2 border-b-2 border-purple-300 rounded'>
                        Auth Flow
                    </h1>
                </div>
            {/* end */}
            <div className="w-full h-100 mt-10">
                <div className='w-full h-100 flex'>
                    <div className='w-200 h-100 relative'>
                        <Lottie animationData={WorkFlowLottie} className="w-full h-full" />
                        <div className='bg-black w-30 h-10 absolute bottom-0 right-0'></div>
                    </div>

                    <div className='h-full w-fit overflow-y-scroll scrollbar-hide'>
                        {
                            authFLowSteps.map((step,index)=>(
                            <div key={index}>
                                <h1 className="bg-linear-to-r from-purple-300 via-purple-400 to-purple-800 bg-clip-text text-transparent font-bold text-2xl">
                                    {step.title}
                                </h1>
                                <h4 className='text-purple-100 mt-2 mb-5'>
                                    {step.subTitle}
                                </h4>
                            </div>
                            ))
                        }
                        
                    </div>
                    
                </div>
                
            </div>
        </div>
        </div>
    )
}
