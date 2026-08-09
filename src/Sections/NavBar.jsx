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

  const urlUserName = params.get('name');
  const urlUserProfile = params.get('profile');
  const urlUserEmail = params.get('email');
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  const getCleanName = (nameVal, emailVal) => {
    if (nameVal && nameVal !== 'null' && nameVal !== 'undefined' && nameVal !== 'None' && nameVal.trim() !== '') {
      if (nameVal.includes('@')) {
        return nameVal.split('@')[0];
      }
      return nameVal.trim();
    }
    if (emailVal && emailVal !== 'null' && emailVal !== 'undefined' && emailVal !== 'None' && emailVal.trim() !== '') {
      const parts = emailVal.split('@');
      if (parts[0]) return parts[0];
    }
    return '';
  };

  const effectiveName = getCleanName(urlUserName, urlUserEmail);

  if ((effectiveName || accessToken) && Cookies.get('isInitiated') === 'true'){
    if (effectiveName) Cookies.set('user_name', effectiveName);
    if (urlUserEmail) Cookies.set('user_email', urlUserEmail);
    if (urlUserProfile && urlUserProfile !== 'null' && urlUserProfile !== 'undefined' && urlUserProfile !== 'None') {
      Cookies.set('user_profile', urlUserProfile);
    }
    if (accessToken) Cookies.set('access_token', accessToken);
    if (refreshToken) Cookies.set('refresh_token', refreshToken);
    Cookies.remove('isInitiated');
  }


  const login = async ()=>{
      setLoading(true)
      const res=await call({method:'GET',path:'/user/auth',withCred:false})
      if (res){
        Cookies.set('isInitiated',true)
        const targetUrl = res.signin_url || res.login_url || res.data?.signin_url || res.data?.login_url;
        if (targetUrl) {
            window.location.href = targetUrl;
        } else {
            console.error("Login failed, unexpected response:", res);
            window.location.href = "/?debug=" + encodeURIComponent(JSON.stringify(res));
        }
      }
      setLoading(false)
    }
  
    const logout = async ()=>{
        console.log("Inside Logout");
      
        Cookies.remove('user_name')
        Cookies.remove('user_email')
        Cookies.remove('user_profile')
        Cookies.remove('access_token')
        Cookies.remove('refresh_token')
        setIsLoggedIn(false)
    }


  // Intersection observer for nav highlight
  useEffect(() => {
    const currentName = Cookies.get('user_name');
    const currentEmail = Cookies.get('user_email');

    // Auto-clean bad cookie if set to 'None' or invalid
    const cleaned = getCleanName(currentName, currentEmail);
    if (cleaned && cleaned !== currentName) {
      Cookies.set('user_name', cleaned);
    }

    if (Cookies.get('access_token') && Cookies.get('refresh_token')){
      setIsLoggedIn(true);
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

  const cookieName = Cookies.get('user_name');
  const cookieEmail = Cookies.get('user_email');
  const displayName = getCleanName(cookieName, cookieEmail) || 'User';

  const getInitials = (name) => {
    if (!name || name === 'User') return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const storedProfile = Cookies.get('user_profile');
  const hasValidProfileImg = storedProfile && storedProfile !== 'null' && storedProfile !== 'undefined' && storedProfile !== 'None' && storedProfile.trim() !== '';

  return (
    <div className="w-full sticky top-3 z-[100] bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-200/40 mb-6">
      <div className="flex justify-between items-center px-6 py-3.5 w-full" id="home">
        {/* Title & Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <img src="/dauth_logo.png" alt="DAuth Logo" className="h-9 w-auto object-contain drop-shadow-sm transition-transform group-hover:scale-105" />
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            DAuth
          </h1>
        </div>

        {/* Navigation links */}
        <div className='bg-slate-100/80 backdrop-blur-md border border-slate-200/80 h-11 px-6 rounded-full flex items-center gap-6 max-sm:hidden max-lg:hidden shadow-inner'>
          {navigationTexts.map((nav, index) => {
            const isActive = curNavName === nav.navName;
            return (
              <a
                key={index}
                href={`#${nav.href}`}
                className={`font-semibold text-sm transition-all duration-300 ${
                  isActive 
                    ? 'text-indigo-600 font-extrabold border-b-2 border-indigo-600 pb-0.5' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={(event) => handleNavClick(event, nav.navName)}
              >
                {nav.navName}
              </a>
            );
          })}
        </div>

        {/* Right side buttons */}
        <div className="flex justify-end items-center gap-3 max-sm:mx-2">
          {isLoggedIn ? (
            <>
              {/* Profile */}
              <div ref={profileRef} className="relative">
                {/* Avatar Button */}
                <div
                  onClick={() => setShowProfileCard(prev => !prev)}
                  className="w-10 h-10 rounded-full border border-slate-300 cursor-pointer flex justify-center items-center overflow-hidden shadow-sm hover:border-slate-400 transition-all select-none bg-slate-100"
                  title={displayName}
                >
                  {hasValidProfileImg && !isImgError ? (
                    <img
                      src={storedProfile}
                      alt="profile"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <span className="font-extrabold text-base text-slate-800">
                      {getInitials(displayName)}
                    </span>
                  )}
                </div>

                {/* Dropdown Menu */}
                {showProfileCard && (
                  <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-[1000] backdrop-blur-2xl">
                    <p className="text-slate-800 text-xs font-semibold mb-3 truncate">
                      👋 Hi, <span className="text-indigo-700 font-extrabold">{displayName}</span>
                    </p>
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => {
                          setShowProfileCard(false);
                          navigate('/dashboard');
                        }}
                        className="text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-medium transition-colors flex items-center gap-2"
                      >
                        📊 Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileCard(false);
                          logout();
                        }}
                        className="text-left px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-medium transition-colors flex items-center gap-2"
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
                btnClassName={'text-sm font-bold'}
                onclickFunc={() => { window.open('/auth-docs', '_blank') }}
                btnDivClassName={"max-sm:hidden max-lg:hidden"}
              />
            </>
          ) : (
            <>
              <IceBlueButton 
                btnName={isLoading ? <Lottie animationData={Loading} className='w-16'/> : 'Sign-In'} 
                btnClassName={'text-sm font-bold'} 
                btnDivClassName={"max-sm:p-2"} 
                onclickFunc={() => login()}
              />
              <IceBlueButton 
                btnName={'Get Started'} 
                btnDivClassName={"max-sm:hidden max-lg:hidden"} 
                btnClassName={'text-sm font-bold'} 
                onclickFunc={() => { window.open('/auth-docs', '_blank') }} 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

