import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';
import { BsMicrosoft } from 'react-icons/bs';
import { MdOutlineSms } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { Eye, EyeOff, Check } from 'lucide-react';
import axios from 'axios';
import { UAParser } from 'ua-parser-js';

const backend_url = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

const PROVIDER_META = {
  password:  { icon: <RiLockPasswordLine />, label: 'Password',  color: '#22d3ee'  },
  google:    { icon: <FaGoogle   />,         label: 'Google',    color: '#ea4335'  },
  github:    { icon: <FaGithub   />,         label: 'GitHub',    color: '#e2e8f0'  },
  facebook:  { icon: <FaFacebook />,         label: 'Facebook',  color: '#1877f2'  },
  microsoft: { icon: <BsMicrosoft />,        label: 'Microsoft', color: '#00a4ef'  },
  otp:       { icon: <MdOutlineSms />,       label: 'OTP',       color: '#22c55e'  },
};

const FONT_MAP = {
  system:     'system-ui, sans-serif',
  Inter:      "'Inter', sans-serif",
  Roboto:     "'Roboto', sans-serif",
  Poppins:    "'Poppins', sans-serif",
  Nunito:     "'Nunito', sans-serif",
  Montserrat: "'Montserrat', sans-serif",
};
const FONT_SIZE_MAP = { sm: '0.8125rem', md: '0.875rem', lg: '1rem' };
const RADIUS_MAP    = { square: '0.5rem', rounded: '1.25rem', pill: '2rem' };
const SHADOW_MAP    = (primary) => ({
  none: 'none',
  sm:   '0 4px 16px rgba(0,0,0,0.3)',
  md:   `0 30px 60px rgba(0,0,0,0.5), 0 8px 32px ${primary}20`,
  lg:   `0 40px 80px rgba(0,0,0,0.7), 0 0 40px ${primary}30`,
});

const getDeviceFingerprintHeaders = () => {
  const parser = new UAParser();
  const result = parser.getResult();
  return {
    'x-device-browser': result.browser.name || 'Unknown',
    'x-device-os': result.os.name || 'Unknown',
    'x-device-type': result.device.type || 'Desktop',
    'user-agent': window.navigator.userAgent
  };
};

const FInput = ({ label, name, type = 'text', placeholder, textColor, inputStyle, inputBorderColor, borderRadius, value, onChange }) => {
  const [show, setShow] = useState(false);
  const isPass = type === 'password';
  const isFilled = inputStyle === 'filled';

  return (
    <div className='space-y-2 text-left'>
      {label && (
        <label className='text-[11px] font-bold uppercase tracking-wider block' style={{ color: `${textColor}70` }}>{label}</label>
      )}
      <div className='relative group/input'>
        <input
          name={name}
          type={isPass && !show ? 'password' : type}
          placeholder={placeholder || label}
          value={value || ''}
          onChange={onChange}
          className='w-full px-4 py-3 text-sm outline-none border transition-all duration-300'
          style={{
            borderRadius,
            backgroundColor: isFilled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
            borderColor: inputBorderColor || 'rgba(255,255,255,0.1)',
            color: `${textColor}`,
          }}
        />
        {isPass && (
          <button type="button" onClick={() => setShow((v) => !v)} className='absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-indigo-400 transition-colors'>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

const FButton = ({ children, primary, textColor, buttonStyle, borderRadius, onClick, disabled }) => {
  const styles = {
    filled:   { 
      backgroundColor: primary, 
      color: textColor, 
      border: 'none',
      boxShadow: `0 10px 25px -5px ${primary}40`,
    },
    outlined: { 
      backgroundColor: 'transparent', 
      color: primary, 
      border: `2px solid ${primary}`,
    },
    ghost:    { 
      backgroundColor: 'transparent', 
      color: primary, 
      border: 'none', 
      textDecoration: 'underline', 
      textUnderlineOffset: '4px',
      fontWeight: 'bold',
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 font-bold text-sm transition-all relative overflow-hidden group/btn ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}`}
      style={{ borderRadius, ...(styles[buttonStyle] || styles.filled) }}
    >
      <span className='relative z-10'>{children}</span>
      {buttonStyle === 'filled' && !disabled && (
        <div className='absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity' />
      )}
    </button>
  );
};

const SocialButton = ({ method, textColor, borderRadius, request_id }) => (
  <button
    onClick={() => window.location.href = `${backend_url}/auth/${method.id}/login/${request_id}`}
    className='w-full flex items-center justify-center gap-3 border py-3 text-sm font-bold hover:bg-white/5 transition-all group/social'
    style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: textColor, borderRadius }}
  >
    <span className='text-lg transition-transform group-hover/social:scale-110' style={{ color: PROVIDER_META[method.id]?.color }}>
      {PROVIDER_META[method.id]?.icon}
    </span>
    <span>Continue with {PROVIDER_META[method.id]?.label}</span>
  </button>
);

const SocialIcon = ({ method, borderRadius, request_id }) => (
  <div
    title={PROVIDER_META[method.id]?.label}
    onClick={() => window.location.href = `${backend_url}/auth/${method.id}/login/${request_id}`}
    className='w-12 h-12 border flex items-center justify-center text-xl cursor-pointer hover:bg-white/10 transition-all group/soc'
    style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: PROVIDER_META[method.id]?.color, borderRadius }}
  >
    <span className='group-hover/soc:scale-110 transition-transform'>{PROVIDER_META[method.id]?.icon}</span>
  </div>
);

const SocialMethods = ({ methods, socialLayout, textColor, borderRadius, request_id }) => {
  if (!methods.length) return null;
  if (socialLayout === 'grid') {
    return (
      <div className='flex justify-center gap-2.5 flex-wrap'>
        {methods.map((m) => <SocialIcon key={m.id} method={m} borderRadius={borderRadius} request_id={request_id} />)}
      </div>
    );
  }
  return (
    <div className='space-y-2'>
      {methods.map((m) => (
        <SocialButton key={m.id} method={m} textColor={textColor} borderRadius={borderRadius} request_id={request_id} />
      ))}
    </div>
  );
};

const OTPFlow = ({ request_id, onComplete, onSuccess, onBack, primary, textColor, buttonStyle, inputStyle, inputBorderColor, borderRadius }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ email: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSendOTP = async () => {
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${backend_url}/auth/login/otp`, {
        request_id,
        email: formData.email
      }, {
        headers: getDeviceFingerprintHeaders()
      });
      if (res.data.success) {
        setStep(1);
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (detail && detail.redirect_url) {
        window.location.href = detail.redirect_url;
        return;
      }
      setError(typeof detail === 'string' ? detail : detail?.message || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      setError('Please enter the OTP');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${backend_url}/auth/login/verify`, {
        request_id,
        otp: formData.otp
      }, {
        withCredentials: true,
        headers: getDeviceFingerprintHeaders()
      });
      
      if (res.data.next_step) {
        onComplete(res.data.next_step); // advances to additional fields
      } else if (res.data.redirect_url) {
        onSuccess(res.data.redirect_url, 'Sign in successful! Redirecting...');
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (detail && detail.redirect_url) {
        window.location.href = detail.redirect_url;
        return;
      }
      setError(typeof detail === 'string' ? detail : detail?.message || 'Failed to verify OTP');
    }
    setLoading(false);
  };

  return (
    <AnimatePresence mode='wait'>
      {step === 0 ? (
        <motion.div key='otp-email' initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className='space-y-3'>
          {error && <p className='text-red-400 text-xs text-center'>{error}</p>}
          <FInput label='Email Address' name='email' type='email' placeholder='you@example.com' textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius} value={formData.email} onChange={handleChange} />
          <FButton disabled={loading} primary={primary} textColor={textColor} buttonStyle={buttonStyle} borderRadius={borderRadius} onClick={handleSendOTP}>{loading ? 'Sending...' : 'Send OTP'}</FButton>
        </motion.div>
      ) : (
        <motion.div key='otp-code' initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className='space-y-3'>
          <p className='text-xs text-center' style={{ color: `${textColor}60` }}>Enter the 6-digit code sent to your email</p>
          {error && <p className='text-red-400 text-xs text-center'>{error}</p>}
          <FInput label='OTP' name='otp' placeholder='123456' textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius} value={formData.otp} onChange={handleChange} />
          <FButton disabled={loading} primary={primary} textColor={textColor} buttonStyle={buttonStyle} borderRadius={borderRadius} onClick={handleVerifyOTP}>{loading ? 'Verifying...' : 'Verify OTP'}</FButton>
          <button onClick={() => setStep(0)} className='w-full text-xs transition-colors mt-2' style={{ color: `${textColor}40` }}>← Back</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PasswordFlow = ({ request_id, onComplete, onSuccess, onBack, onForgotPassword, forgotPasswordEnabled, primary, textColor, buttonStyle, inputStyle, inputBorderColor, borderRadius }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${backend_url}/auth/login/password`, {
        request_id,
        email: formData.email,
        password: formData.password
      }, {
        withCredentials: true,
        headers: getDeviceFingerprintHeaders()
      });
      
      if (res.data.next_step) {
        onComplete(res.data.next_step);
      } else if (res.data.redirect_url) {
        onSuccess(res.data.redirect_url, 'Sign in successful! Redirecting...');
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (detail && detail.redirect_url) {
        window.location.href = detail.redirect_url;
        return;
      }
      setError(typeof detail === 'string' ? detail : detail?.message || 'Failed to authenticate');
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className='space-y-3'>
      {error && <p className='text-red-400 text-xs text-center'>{error}</p>}
      <FInput label='Email Address' name='email' type='email' placeholder='you@example.com' textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius} value={formData.email} onChange={handleChange} />
      <div className='relative'>
        <FInput label='Password' name='password' type={showPassword ? 'text' : 'password'} placeholder='••••••••' textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius} value={formData.password} onChange={handleChange} />
        <button 
          onClick={() => setShowPassword(!showPassword)}
          className='absolute right-3 top-9 text-gray-400 hover:text-white transition-colors'
          style={{ color: `${textColor}80` }}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      <FButton disabled={loading} primary={primary} textColor={textColor} buttonStyle={buttonStyle} borderRadius={borderRadius} onClick={handleLogin}>
        {loading ? 'Authenticating...' : 'Sign In'}
      </FButton>
      {forgotPasswordEnabled && (
        <button onClick={onForgotPassword} className='w-full text-xs transition-colors mt-1 hover:underline' style={{ color: primary }}>
          Forgot password?
        </button>
      )}
      <button onClick={onBack} className='w-full text-xs transition-colors mt-2' style={{ color: `${textColor}40` }}>← Back to options</button>
    </motion.div>
  );
};

const ForgotPasswordFlow = ({ request_id, onBack, primary, textColor, buttonStyle, inputStyle, inputBorderColor, borderRadius }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${backend_url}/auth/forgot-password/send`, {
        request_id,
        email
      }, {
        headers: getDeviceFingerprintHeaders()
      });
      if (res.data.success) {
        setSent(true);
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : detail?.message || 'Failed to send reset email');
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className='flex flex-col items-center justify-center py-6 text-center space-y-4'>
        <div className='w-14 h-14 rounded-full flex items-center justify-center' style={{ backgroundColor: `${primary}22`, color: primary }}>
          <Check size={28} />
        </div>
        <div>
          <h3 className='text-base font-bold' style={{ color: textColor }}>Check your email</h3>
          <p className='text-xs mt-2 leading-relaxed' style={{ color: `${textColor}60` }}>
            We've sent a password reset link to <strong style={{ color: `${textColor}90` }}>{email}</strong>. 
            The link will expire in 15 minutes.
          </p>
        </div>
        <button onClick={onBack} className='text-xs transition-colors mt-4 hover:underline' style={{ color: `${textColor}40` }}>← Back to sign in</button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className='space-y-3'>
      <p className='text-xs text-center mb-2' style={{ color: `${textColor}60` }}>Enter your email and we'll send you a link to reset your password.</p>
      {error && <p className='text-red-400 text-xs text-center'>{error}</p>}
      <FInput label='Email Address' name='email' type='email' placeholder='you@example.com' textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius} value={email} onChange={(e) => setEmail(e.target.value)} />
      <FButton disabled={loading} primary={primary} textColor={textColor} buttonStyle={buttonStyle} borderRadius={borderRadius} onClick={handleSend}>
        {loading ? 'Sending...' : 'Send Reset Link'}
      </FButton>
      <button onClick={onBack} className='w-full text-xs transition-colors mt-2' style={{ color: `${textColor}40` }}>← Back to sign in</button>
    </motion.div>
  );
};

const ProviderSelectionFlow = ({ enabledMethods, socialLayout, textColor, borderRadius, request_id, onSelectOTP, onSelectPassword }) => {
  const socialMethods = enabledMethods.filter((m) => m.id !== 'password' && m.id !== 'otp');
  const hasOTP = enabledMethods.some((m) => m.id === 'otp');

  return (
    <div className='space-y-3'>
      <SocialMethods methods={socialMethods} socialLayout={socialLayout} textColor={textColor} borderRadius={borderRadius} request_id={request_id} />
      {hasOTP && (
        <button onClick={onSelectOTP} className='w-full flex items-center justify-center gap-2 border py-3 text-sm font-bold hover:opacity-80 transition-all'
          style={{ backgroundColor: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)', color: textColor, borderRadius }}>
          <span className='text-green-400 text-lg'><MdOutlineSms /></span>
          Continue with OTP
        </button>
      )}
      {enabledMethods.some((m) => m.id === 'password') && (
        <button onClick={onSelectPassword} className='w-full flex items-center justify-center gap-2 border py-3 text-sm font-bold hover:opacity-80 transition-all'
          style={{ backgroundColor: 'rgba(59,130,246,0.08)', borderColor: 'rgba(59,130,246,0.2)', color: textColor, borderRadius }}>
          <span className='text-blue-400 text-lg'><RiLockPasswordLine /></span>
          Continue with Password
        </button>
      )}
    </div>
  );
};

const AdditionalFieldsFlow = ({ request_id, signupFields, onSuccess, primary, textColor, buttonStyle, inputStyle, inputBorderColor, borderRadius }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleComplete = async () => {
    // Basic validation
    const missing = signupFields.filter(f => f.required && !formData[f.name]);
    if (missing.length > 0) {
      setError(`Please fill all required fields.`);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${backend_url}/api/auth/request/signup/complete`, {
        request_id,
        custom_fields: formData
      }, {
        withCredentials: true,
        headers: getDeviceFingerprintHeaders()
      });
      if (res.data.redirect_url) {
        onSuccess(res.data.redirect_url, 'Sign up successful! Redirecting...');
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (detail && detail.redirect_url) {
        window.location.href = detail.redirect_url;
        return;
      }
      setError(typeof detail === 'string' ? detail : detail?.message || 'Failed to complete signup');
    }
    setLoading(false);
  };

  return (
    <div className='space-y-3'>
      <p className='text-xs text-center mb-4' style={{ color: `${textColor}80` }}>Just a few more details to complete your registration...</p>
      {error && <p className='text-red-400 text-xs text-center'>{error}</p>}
      
      {signupFields.map(f => (
        <FInput 
          key={f.name} 
          label={`${f.label || f.name} ${f.required ? '*' : ''}`} 
          name={f.name} 
          type={f.type || 'text'} 
          textColor={textColor} 
          inputStyle={inputStyle} 
          inputBorderColor={inputBorderColor} 
          borderRadius={borderRadius} 
          value={formData[f.name] || ''} 
          onChange={handleChange} 
        />
      ))}
      <div className='pt-2'>
        <FButton disabled={loading} primary={primary} textColor={textColor} buttonStyle={buttonStyle} borderRadius={borderRadius} onClick={handleComplete}>
          {loading ? 'Completing...' : 'Create Account'}
        </FButton>
      </div>
    </div>
  );
};

export const LoginPortal = () => {
  const { request_id, flow_type } = useParams();
  const [configData, setConfigData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState('provider_selection');
  const [successState, setSuccessState] = useState(null);

  const handleSuccessRedirect = (url, message) => {
    setSuccessState({ url, message });
    setTimeout(() => {
      window.location.href = url;
    }, 2000);
  };

  useEffect(() => {
    if (!request_id) {
      setError('Missing request_id in URL');
      setLoading(false);
      return;
    }
    const fetchConfig = async () => {
      try {
        const res = await axios.post(`${backend_url}/api/auth/request/${request_id}/init`, 
          { flow_type: flow_type || 'signin' }, 
          { 
            withCredentials: true,
            headers: getDeviceFingerprintHeaders()
          }
        );
        if (res.data.redirect_url) {
          window.location.href = res.data.redirect_url;
          return;
        }
        setConfigData(res.data);
      } catch (err) {
        const detail = err.response?.data?.detail;
        if (detail && detail.redirect_url) {
          window.location.href = detail.redirect_url;
          return;
        }
        setError(typeof detail === 'string' ? detail : detail?.message || 'Failed to initialize authentication flow');
      }
      setLoading(false);
    };
    fetchConfig();
  }, [request_id, flow_type]);

  useEffect(() => {
    const font_family = configData?.config?.ui?.font_family;
    if (!font_family || font_family === 'system') return;
    const id = `gfont-${font_family}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${font_family}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);
  }, [configData]);

  if (loading) {
    return (
      <div className='min-h-screen bg-slate-950 flex items-center justify-center'>
        <div className='w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4'>
        <div className='bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-sm text-center'>
          <h2 className='text-red-400 font-bold text-xl mb-2'>Authentication Error</h2>
          <p className='text-slate-400 text-sm'>{error}</p>
        </div>
      </div>
    );
  }

  if (!configData) return null;

  const { ui, branding } = configData.config;
  const { enabled_methods, signup_fields } = configData;

  const uiConfig = ui || {};
  const {
    screen_bg_color = '#000000',
    login_card_bg_color = '#ffffff14',
    primary_color = '#22d3ee',
    text_color = '#ffffff',
    brand_name,
    brand_logo,
    font_family = 'system',
    font_size = 'md',
    border_radius = 'rounded',
    shadow_intensity = 'md',
    blur_amount = 24,
    border_width = 1,
    border_color = 'rgba(255,255,255,0.10)',
    button_style = 'filled',
    input_style = 'outlined',
    input_border_color = 'rgba(255,255,255,0.12)',
    logo_position = 'center',
    social_layout = 'list',
    bg_pattern = 'dots',
    gradient_start = '#0f172a',
    gradient_end = '#1e1b4b',
    gradient_direction = '135deg',
    custom_css = '',
  } = uiConfig;

  const cardRadius   = RADIUS_MAP[border_radius] ?? RADIUS_MAP.rounded;
  const btnRadius    = RADIUS_MAP[border_radius] ?? RADIUS_MAP.rounded;
  const cardShadow   = SHADOW_MAP(primary_color)[shadow_intensity] ?? SHADOW_MAP(primary_color).md;
  const fontFamilyStr = FONT_MAP[font_family] ?? FONT_MAP.system;
  const fontSizeStr  = FONT_SIZE_MAP[font_size] ?? FONT_SIZE_MAP.md;

  const bgStyle = bg_pattern === 'gradient'
    ? { background: `linear-gradient(${gradient_direction}, ${gradient_start}, ${gradient_end})` }
    : { backgroundColor: screen_bg_color };

  const logoAlign = {
    left:   'items-start text-left',
    center: 'items-center text-center',
    right:  'items-end text-right',
  }[logo_position] || 'items-center text-center';

  const hasPwd    = enabled_methods.some((m) => m.id === 'password');

  const sharedFormProps = {
    primary: primary_color, textColor: text_color,
    buttonStyle: button_style, inputStyle: input_style,
    inputBorderColor: input_border_color, borderRadius: btnRadius,
  };

  return (
    <div
      className='min-h-screen w-full flex items-center justify-center overflow-auto relative transition-all duration-500'
      style={bgStyle}
    >
      {bg_pattern === 'dots' && (
        <div className='absolute inset-0 pointer-events-none'
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      )}
      {bg_pattern === 'diagonal' && (
        <div className='absolute inset-0 pointer-events-none'
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)' }} />
      )}

      <div
        className='absolute w-96 h-96 rounded-full pointer-events-none opacity-10 blur-3xl'
        style={{ backgroundColor: primary_color, top: '10%', left: '50%', transform: 'translateX(-50%)' }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className='relative w-full max-w-sm mx-4 p-8 z-10'
        style={{
          backgroundColor: login_card_bg_color,
          backdropFilter: `blur(${blur_amount}px)`,
          WebkitBackdropFilter: `blur(${blur_amount}px)`,
          border: `${border_width}px solid ${border_color}`,
          borderRadius: cardRadius,
          boxShadow: cardShadow,
          fontFamily: fontFamilyStr,
          fontSize: fontSizeStr,
        }}
      >
        {custom_css && <style>{custom_css}</style>}

        <div className={`flex flex-col mb-7 ${logoAlign}`}>
          {brand_logo ? (
            <img src={brand_logo} alt='logo' className='h-12 mb-3 object-contain rounded-xl' />
          ) : (
            <div
              className='w-12 h-12 flex items-center justify-center mb-3 text-2xl'
              style={{ backgroundColor: `${primary_color}22`, border: `1px solid ${primary_color}33`, borderRadius: cardRadius }}
            >
              {brand_name?.[0] || '✦'}
            </div>
          )}
          <h1 className='font-bold text-xl tracking-tight' style={{ color: text_color }}>
            {brand_name || branding || 'Your Brand'}
          </h1>
          <p className='text-xs mt-1.5' style={{ color: `${text_color}50` }}>
            {flow_type === 'signup' ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        {successState ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='flex flex-col items-center justify-center py-8 text-center space-y-4'>
            <div className='w-16 h-16 rounded-full flex items-center justify-center' style={{ backgroundColor: `${primary_color}22`, color: primary_color }}>
              <Check size={32} />
            </div>
            <div>
              <h2 className='text-lg font-bold' style={{ color: text_color }}>Success</h2>
              <p className='text-sm mt-1' style={{ color: `${text_color}80` }}>{successState.message}</p>
            </div>
          </motion.div>
        ) : currentStep === 'additional_fields' ? (
          <AdditionalFieldsFlow request_id={request_id} signupFields={signup_fields} onSuccess={handleSuccessRedirect} {...sharedFormProps} />
        ) : currentStep === 'otp_verification' ? (
          <OTPFlow request_id={request_id} onComplete={(ns) => setCurrentStep(ns)} onSuccess={handleSuccessRedirect} onBack={() => setCurrentStep('provider_selection')} {...sharedFormProps} />
        ) : currentStep === 'password_verification' ? (
          <PasswordFlow 
            request_id={request_id} 
            onComplete={(ns) => setCurrentStep(ns)} 
            onSuccess={handleSuccessRedirect} 
            onBack={() => setCurrentStep('provider_selection')} 
            onForgotPassword={() => setCurrentStep('forgot_password')}
            forgotPasswordEnabled={configData.config?.forgot_password_enabled !== false}
            {...sharedFormProps} 
          />
        ) : currentStep === 'forgot_password' ? (
          <ForgotPasswordFlow 
            request_id={request_id} 
            onBack={() => setCurrentStep('password_verification')} 
            {...sharedFormProps} 
          />
        ) : (
          <ProviderSelectionFlow
            enabledMethods={enabled_methods}
            socialLayout={social_layout}
            request_id={request_id}
            textColor={text_color}
            borderRadius={btnRadius}
            onSelectOTP={() => setCurrentStep('otp_verification')}
            onSelectPassword={() => setCurrentStep('password_verification')}
          />
        )}
      </motion.div>
    </div>
  );
};
