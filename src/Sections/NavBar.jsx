import { useEffect, useState, useRef, useContext } from 'react';
import { IceBlueButton } from '../Components/Buttons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNetworkCalls } from '../Utils/NetworkCalls';
import { AuthContext } from '../Contexts/UserContext';
import { navigationTexts } from '../Constants/index';
import { scrollToSection } from '../Utils/ScrollToSection';
import Loading from '../assets/lotties/Loading.json'
import Lottie from 'lottie-react';


export const NavBar = () => {
  
  const [curNavName, setCurNavName] = useState(navigationTexts[0].navName);
  const {call}=useNetworkCalls()

  const {isLoggedIn,setIsLoggedIn} = useContext(AuthContext); //context

  const [showProfileCard, setShowProfileCard] = useState(false);
  const [isLoading,setLoading]=useState(false)
  const [isImgError,setImageError]=useState(false)
  const [params]=useSearchParams()
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const userName=params.get('name')
  const userProfile=params.get('profile')
  console.log('is cookie initiated',Cookies.get('isInitiated'),params.size);
  
  if (userName!=null && userProfile!=null && Cookies.get('isInitiated')=='true'){
    Cookies.set('user_name',userName)
    Cookies.set('user_profile',userProfile)
    Cookies.remove('isInitiated')
  }


  const login = async ()=>{
      setLoading(true)
      // await new Promise((r) => setTimeout(r, 10000));
      const res=await call({method:'GET',path:'/user/auth',withCred:false})
      if (res){
        Cookies.set('isInitiated',true)
        window.location.href=res.login_url
      }
      setLoading(false)
    }
  
    const logout = async ()=>{
        const res=await call({method:'delete',path:'/user/logout'})
        if (res){
          Cookies.remove('user_name')
          Cookies.remove('user_profile')
          setIsLoggedIn(false)
        }
    }


  // Intersection observer for nav highlight
  useEffect(() => {
    console.log("your username from cookie : ",Cookies.get('user_name'));

    if (Cookies.get('user_name')!=null && Cookies.get('user_profile')){
      setIsLoggedIn(true)
    }

    if(params.size>0){
      window.location.href='/'
    }

    const sections = navigationTexts.map(nav => document.getElementById(nav.href));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const visibleSection = navigationTexts.find(nav => nav.href === entry.target.id);
            if (visibleSection) setCurNavName(visibleSection.navName);
          }
        });
      },
      { threshold: 0.6 }
    );
    sections.forEach(sec => sec && observer.observe(sec));
    return () => sections.forEach(sec => sec && observer.unobserve(sec));
  }, []);

  // Close profile dropdown if clicked outside
  useEffect(() => {
    const handler = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileCard(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // on click event for navbar names
  const handleNavClick = (event, navName) => {
    event.preventDefault();
    scrollToSection({sectionId:navName,canLowerCase:true, setActiveSection:setCurNavName})
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center m-3 pb-3 w-full" id="home">
        {/* Title */}
        <div>
          <h1 className="text-3xl bg-linear-to-r from-cyan-100 via-cyan-200 to-cyan-300 bg-clip-text text-transparent font-bold">
            DeB-Auth-System
          </h1>
        </div>

        {/* for navigation */}
            <div className='bg-transparent shadow shadow-cyan-400 w-100 h-15 rounded-2xl flex items-center justify-evenly'>
                {
                    navigationTexts.map((nav,index)=>{
                        return <a key={index} href={`#${nav.href}`} className={`font-semibold ${curNavName==nav.navName && 'border-b-3'} border-cyan-500 cursor-pointer text-[18px]`} onClick={(event)=>handleNavClick(event, nav.navName)}>{nav.navName}</a>
                    })
                }
            </div>

        {/* Right side buttons */}
        <div className=" w-100 h-15 rounded-2xl flex justify-evenly items-center">
          {isLoggedIn ? (
            <>
              {/* Profile */}
              <div 
                ref={profileRef}
                className="relative mr-3 w-12 h-12 rounded-full border-2 border-cyan-400 cursor-pointer flex justify-center items-center"
              >
                {isImgError === false ? (
                  <img
                    src={Cookies.get('user_profile')}
                    alt="profile"
                    className="rounded-full"
                    onClick={() => setShowProfileCard(prev => !prev)}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <h1
                    className="font-bold text-2xl bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 bg-clip-text text-transparent"
                    onClick={() => setShowProfileCard(prev => !prev)}
                  >
                    {Cookies.get('user_name').slice(0,2).toUpperCase()}
                  </h1>
                )}

                {/* Dropdown */}
                {showProfileCard && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-cyan-300 p-4 z-50">
                    <p className="text-gray-700 font-semibold mb-3">
                      👋 Hi, <span className="text-cyan-500">{Cookies.get('user_name')}</span>
                    </p>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="text-left px-3 py-2 rounded-lg hover:bg-cyan-50 text-gray-600 font-medium"
                      >
                        📊 Dashboard
                      </button>
                      <button
                        onClick={() => logout()}
                        className="text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-500 font-medium"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>


              {/* Always show Get Started */}
              <IceBlueButton
                btnName={'Get Started'}
                btnClassName={'text-[18px] font-semibold'}
                onclickFunc={() => { window.open('/auth-docs', '_blank') }}
              />
            </>
          ) : (
            <>
              <IceBlueButton btnName={isLoading ? <Lottie animationData={Loading} className='w-20'/>:'Sign-In'} btnClassName={'text-[18px] font-semibold'} onclickFunc={()=>login()}/>
              <IceBlueButton btnName={'Get Started'} btnClassName={'text-[18px] font-semibold'} onclickFunc={() => { window.open('/auth-docs', '_blank') }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
