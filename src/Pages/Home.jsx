import { NavBar } from '../Sections/NavBar'
import { Hero } from '../Sections/Hero'
import { FeaturesPage } from './Features'
import { AuthFLowPage } from './AuthFLow'
import { KnowusPage } from './Knowus'

export const HomePage = () => {
  return (
    <>
    <div className='mx-12 pb-20'>
        <NavBar></NavBar> 
        <Hero></Hero> 
        <FeaturesPage></FeaturesPage>
        <AuthFLowPage></AuthFLowPage>
        <KnowusPage></KnowusPage>
    </div>
        
    </>
  )
}
