import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';
import { BsMicrosoft } from 'react-icons/bs';
import { MdOutlineSms } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { Eye, EyeOff, Check, Lock, AlertTriangle, ArrowLeft, RotateCcw, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { UAParser } from 'ua-parser-js';
import { APP_CONFIG } from '../config';
import { GoogleLogo, GithubLogo, FacebookLogo, MicrosoftLogo } from '../Components/BrandLogos';
import { useToastStore } from '../Store/useToastStore';

const backend_url = APP_CONFIG.BACKEND_URL;

const PROVIDER_META = {
  password:  { icon: <RiLockPasswordLine />, label: 'Password',  color: '#22d3ee'  },
  google:    { icon: <GoogleLogo size={18} />,    label: 'Google',    color: '#ea4335'  },
  github:    { icon: <GithubLogo size={18} />,    label: 'GitHub',    color: '#24292e'  },
  facebook:  { icon: <FacebookLogo size={18} />,  label: 'Facebook',  color: '#0866ff'  },
  microsoft: { icon: <MicrosoftLogo size={18} />, label: 'Microsoft', color: '#00a4ef'  },
  email_otp:  { icon: <MdOutlineSms />,       label: 'Email OTP',       color: '#22c55e'  },
  mobile_otp: { icon: <MdOutlineSms />,       label: 'Mobile OTP',      color: '#06b6d4'  },
  otp:       { icon: <MdOutlineSms />,       label: 'OTP',       color: '#22c55e'  },
};

const FONT_MAP = {
  system:     'system-ui, sans-serif',
  Inter:"'Inter', sans-serif",
  Roboto:"'Roboto', sans-serif",
  Poppins:"'Poppins', sans-serif",
  Nunito:"'Nunito', sans-serif",
  Montserrat:"'Montserrat', sans-serif",
};
const FONT_SIZE_MAP = { sm: '0.8125rem', md: '0.875rem', lg: '1rem' };
const TYPOGRAPHY_SCALE = {
  sm: {
    title: '1.1rem',
    subtitle: '0.7rem',
    label: '0.625rem',
    input: '0.8125rem',
    btn: '0.8125rem',
    footer: '0.7rem',
  },
  md: {
    title: '1.25rem',
    subtitle: '0.75rem',
    label: '0.6875rem',
    input: '0.875rem',
    btn: '0.875rem',
    footer: '0.75rem',
  },
  lg: {
    title: '1.45rem',
    subtitle: '0.875rem',
    label: '0.75rem',
    input: '1rem',
    btn: '1rem',
    footer: '0.875rem',
  },
};

const isLightColor = (color) => {
  if (!color) return false;
  if (color.startsWith('#')) {
    let hex = color.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    if (hex.length >= 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 128;
    }
  }
  if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g);
    if (match && match.length >= 3) {
      const yiq = (Number(match[0]) * 299 + Number(match[1]) * 587 + Number(match[2]) * 114) / 1000;
      return yiq >= 128;
    }
  }
  return false;
};

const getEffectiveCardBg = (bg, blur, variant) => {
  if (!bg) return 'rgba(255, 255, 255, 0.9)';
  if (bg.includes('gradient')) return bg;
  if (bg.startsWith('rgba') || bg.startsWith('hsla') || (bg.startsWith('#') && bg.length === 9)) {
    return bg;
  }
  if (blur > 0 || variant === 'glassmorphism') {
    if (bg.startsWith('#')) {
      let hex = bg.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, 0.82)`;
      }
    }
  }
  return bg;
};

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

// ─── Locked field badge ───────────────────────────────────────────────────────
const LockedBadge = ({ color }) => (
  <div
    className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold'
    style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40`, color }}
  >
    <Lock size={9} />
    locked
  </div>
);

// ─── Input field (supports locked / readonly mode) ────────────────────────────
const FInput = ({ label, name, type = 'text', placeholder, textColor, inputStyle, inputBorderColor, borderRadius, value, onChange, locked, primary, isCardLight = true }) => {
  const [show, setShow] = useState(false);
  const isPass = type === 'password';
  const isFilled = inputStyle === 'filled';

  const defaultBg = locked
    ? `${primary || '#22d3ee'}0a`
    : isFilled
      ? (isCardLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)')
      : 'transparent';

  const defaultBorder = inputBorderColor && inputBorderColor.trim() !== ''
    ? inputBorderColor
    : (isFilled ? (isCardLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)') : (isCardLight ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.18)'));

  const borderStyle = isFilled && (!inputBorderColor || inputBorderColor === 'transparent')
    ? (isCardLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)')
    : `${isFilled ? '1px' : '1.5px'} solid ${defaultBorder}`;

  return (
    <div className='space-y-1.5 text-left'>
      {label && (
        <label className='font-bold uppercase tracking-wider block' style={{ color: `${textColor}75`, fontSize: 'var(--card-label-size, 11px)' }}>{label}</label>
      )}
      <div className='relative group/input'>
        <input
          name={name}
          type={isPass && !show ? 'password' : type}
          placeholder={placeholder || label}
          value={value || ''}
          onChange={locked ? undefined : onChange}
          readOnly={locked}
          className={`w-full px-4 py-3 outline-none transition-all duration-300 ${locked ? 'cursor-not-allowed select-none' : ''}`}
          style={{
            borderRadius,
            backgroundColor: defaultBg,
            color: textColor,
            border: borderStyle,
            paddingRight: locked ? '90px' : isPass ? '42px' : '16px',
            fontSize: 'var(--card-input-size, 14px)',
          }}
        />
        {locked && <LockedBadge color={primary || '#22d3ee'} />}
        {isPass && !locked && (
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            className='absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors'
            style={{ color: `${textColor}60` }}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Primary action button ────────────────────────────────────────────────────
const FButton = ({ children, primary = '#0284c7', textColor, btnTextColor, buttonStyle = 'filled', borderRadius, onClick, disabled }) => {
  const pColor = primary || '#0284c7';
  const styles = {
    filled:   { backgroundColor: pColor, color: btnTextColor || '#ffffff', border: 'none', boxShadow: `0 8px 20px -4px ${pColor}40` },
    outlined: { backgroundColor: 'transparent', color: pColor, border: `2px solid ${pColor}`, boxShadow: 'none' },
    ghost:    { backgroundColor: 'transparent', color: pColor, border: 'none', textDecoration: 'underline', textUnderlineOffset: '4px', fontWeight: 'bold', boxShadow: 'none' },
  };
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 1, scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 font-bold relative overflow-hidden group/btn transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ borderRadius, fontSize: 'var(--card-btn-size, 14px)', ...(styles[buttonStyle] || styles.filled) }}
    >
      <span className='relative z-10'>{children}</span>
      {buttonStyle === 'filled' && <div className='absolute inset-0 bg-white/15 opacity-0 group-hover/btn:opacity-100 transition-opacity' />}
    </motion.button>
  );
};

// ─── Social provider buttons ──────────────────────────────────────────────────
const SocialButton = ({ method, textColor, borderRadius, auth_token, providerBgColor, providerTextColor, isCardLight }) => {
  const meta = PROVIDER_META[method.id?.toLowerCase()] || {};
  const defaultBg = isCardLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';
  const defaultBorder = isCardLight ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.10)';
  return (
    <button
      onClick={() => window.location.href = `${backend_url}/auth/${method.id}/login/${auth_token}`}
      className='w-full flex items-center justify-center gap-3 py-3 font-bold border transition-all hover:opacity-90 active:scale-[0.99] group/social shadow-sm'
      style={{
        backgroundColor: providerBgColor || defaultBg,
        borderColor: defaultBorder,
        color: providerTextColor || textColor,
        borderRadius,
        fontSize: 'var(--card-btn-size, 14px)'
      }}
    >
      <span className='text-lg transition-transform group-hover/social:scale-110 flex items-center justify-center' style={{ color: meta.color }}>
        {meta.icon}
      </span>
      <span>Continue with {meta.label || method.name || method.id}</span>
    </button>
  );
};

const SocialCompactButton = ({ method, textColor, borderRadius, auth_token, providerBgColor, providerTextColor, isSingle, isCardLight }) => {
  const meta = PROVIDER_META[method.id?.toLowerCase()] || {};
  const defaultBg = isCardLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';
  const defaultBorder = isCardLight ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.10)';
  return (
    <button
      onClick={() => window.location.href = `${backend_url}/auth/${method.id}/login/${auth_token}`}
      className={`flex items-center justify-center gap-2 py-2.5 px-3 font-semibold border transition-all hover:opacity-90 active:scale-[0.98] group/soc shadow-sm ${
        isSingle ? 'col-span-2' : ''
      }`}
      style={{
        backgroundColor: providerBgColor || defaultBg,
        borderColor: defaultBorder,
        color: providerTextColor || textColor,
        borderRadius,
        fontSize: 'var(--card-footer-size, 12px)',
      }}
    >
      <span className='text-base group-hover/soc:scale-110 transition-transform flex items-center justify-center' style={{ color: meta.color }}>
        {meta.icon}
      </span>
      <span className='truncate'>{meta.label || method.name || method.id}</span>
    </button>
  );
};

const SocialIcon = ({ method, borderRadius, auth_token, isCardLight }) => {
  const meta = PROVIDER_META[method.id?.toLowerCase()] || {};
  const defaultBg = isCardLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';
  const defaultBorder = isCardLight ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.08)';
  return (
    <div
      title={meta.label || method.name || method.id}
      onClick={() => window.location.href = `${backend_url}/auth/${method.id}/login/${auth_token}`}
      className='w-12 h-12 flex items-center justify-center text-xl cursor-pointer border hover:opacity-80 transition-all group/soc'
      style={{ backgroundColor: defaultBg, borderColor: defaultBorder, color: meta.color, borderRadius }}
    >
      <span className='group-hover/soc:scale-110 transition-transform'>{meta.icon}</span>
    </div>
  );
};

const SocialMethods = ({ methods, socialLayout, textColor, borderRadius, auth_token, providerBgColor, providerTextColor, isCardLight }) => {
  if (!methods.length) return null;
  if (socialLayout === 'grid') {
    return (
      <div className='flex justify-center gap-2.5 flex-wrap'>
        {methods.map(m => <SocialIcon key={m.id} method={m} borderRadius={borderRadius} auth_token={auth_token} isCardLight={isCardLight} />)}
      </div>
    );
  }
  if (socialLayout === 'compact') {
    return (
      <div className='grid grid-cols-2 gap-2'>
        {methods.map((m, idx) => (
          <SocialCompactButton
            key={m.id}
            method={m}
            textColor={textColor}
            borderRadius={borderRadius}
            auth_token={auth_token}
            providerBgColor={providerBgColor}
            providerTextColor={providerTextColor}
            isSingle={methods.length % 2 !== 0 && idx === methods.length - 1}
            isCardLight={isCardLight}
          />
        ))}
      </div>
    );
  }
  return (
    <div className='space-y-2'>
      {methods.map(m => (
        <SocialButton
          key={m.id}
          method={m}
          textColor={textColor}
          borderRadius={borderRadius}
          auth_token={auth_token}
          providerBgColor={providerBgColor}
          providerTextColor={providerTextColor}
          isCardLight={isCardLight}
        />
      ))}
    </div>
  );
};

// ─── OTP Flow — supports prefill + locked email + auto-send ──────────────────
const OTPFlow = ({
  request_id, onComplete, onSuccess, onBack,
  primary, textColor, btnTextColor, linkColor, buttonStyle, inputStyle, inputBorderColor, borderRadius,
  prefillEmail, lockedEmail, isCardLight,          // ← autofill props
  mode = 'email',
}) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ email: prefillEmail || '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const autoSentRef = useRef(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSendOTP = async (emailOverride) => {
    const identifier = emailOverride || formData.email;
    if (!identifier) { setError('Please enter your email address or mobile number'); return; }
    setError('');
    setLoading(true);
    try {
      const payload = { request_id };
      if (identifier.includes('@')) {
        payload.email = identifier;
      } else {
        payload.mobile_number = identifier;
      }
      const res = await axios.post(`${backend_url}/auth/login/otp`, payload, {
        headers: getDeviceFingerprintHeaders()
      });
      if (res.data.success) setStep(1);
    } catch (err) {
      const detail = err.response?.data?.detail;
      const statusCode = err.response?.status;
      const rawMsg = typeof detail === 'string' ? detail : detail?.message || detail?.msg || 'Failed to send OTP';
      const displayMsg = (typeof detail === 'object' && detail?.status_code)
        ? `[${detail.status_code}] ${rawMsg}`
        : (statusCode && statusCode !== 400 && statusCode !== 500)
          ? `[${statusCode}] ${rawMsg}`
          : rawMsg;

      useToastStore.getState().addToast(displayMsg, 'error');
      setError(displayMsg);

      if (detail && detail.redirect_url) {
        setTimeout(() => {
          window.location.href = detail.redirect_url;
        }, 1500);
        return;
      }
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) { setError('Please enter the OTP'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${backend_url}/auth/login/verify`, { request_id, otp: formData.otp }, {
        withCredentials: true,
        headers: getDeviceFingerprintHeaders()
      });
      if (res.data.next_step) onComplete(res.data.next_step);
      else if (res.data.redirect_url) onSuccess(res.data.redirect_url);
    } catch (err) {
      const detail = err.response?.data?.detail;
      const statusCode = err.response?.status;
      const rawMsg = typeof detail === 'string' ? detail : detail?.message || detail?.msg || 'Failed to verify OTP';
      const displayMsg = (typeof detail === 'object' && detail?.status_code)
        ? `[${detail.status_code}] ${rawMsg}`
        : (statusCode && statusCode !== 400 && statusCode !== 500)
          ? `[${statusCode}] ${rawMsg}`
          : rawMsg;

      useToastStore.getState().addToast(displayMsg, 'error');
      setError(displayMsg);

      if (detail && detail.redirect_url) {
        setTimeout(() => {
          window.location.href = detail.redirect_url;
        }, 1500);
        return;
      }
    }
    setLoading(false);
  };

  // Auto-send OTP when email is prefilled & locked
  useEffect(() => {
    if (lockedEmail && prefillEmail && !autoSentRef.current) {
      autoSentRef.current = true;
      handleSendOTP(prefillEmail);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence mode='wait'>
      {step === 0 ? (
        <motion.div key='otp-email' initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className='space-y-3'>
          {lockedEmail && prefillEmail && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className='flex items-center gap-2 text-xs py-2.5 px-3.5 rounded-xl font-medium'
              style={{ backgroundColor: `${primary}12`, border: `1px solid ${primary}30`, color: `${textColor}80` }}
            >
              <Lock size={11} style={{ color: primary }} />
              <span>OTP will be sent to <strong style={{ color: textColor }}>{prefillEmail}</strong></span>
            </motion.div>
          )}
          {error && <p className='text-red-400 text-xs text-center'>{error}</p>}
          <FInput
            label={mode === 'email' ? 'Email Address' : 'Mobile Number'} 
            name='email' 
            type={mode === 'email' ? 'email' : 'text'} 
            placeholder={mode === 'email' ? 'you@example.com' : '+919876543210'}
            textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius}
            isCardLight={isCardLight}
            value={formData.email} onChange={handleChange}
            locked={!!lockedEmail} primary={primary}
          />
          <FButton disabled={loading} primary={primary} textColor={textColor} btnTextColor={btnTextColor} buttonStyle={buttonStyle} borderRadius={borderRadius} onClick={() => handleSendOTP()}>
            {loading ? 'Sending OTP…' : 'Send OTP'}
          </FButton>
          {onBack && <button onClick={onBack} className='w-full text-xs transition-colors mt-2' style={{ color: `${textColor}60` }}>← Back to options</button>}
        </motion.div>
      ) : (
        <motion.div key='otp-code' initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className='space-y-3'>
          {/* Show where code was sent */}
          <div className='text-center'>
            <p className='text-xs' style={{ color: `${textColor}60` }}>
              A 6-digit code was sent to
            </p>
            <p className='text-sm font-bold mt-0.5' style={{ color: textColor }}>
              {formData.email}
            </p>
          </div>
          {error && <p className='text-red-400 text-xs text-center'>{error}</p>}
          <FInput
            label='OTP Code' name='otp' placeholder='123456'
            textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius}
            isCardLight={isCardLight}
            value={formData.otp} onChange={handleChange}
          />
          <FButton disabled={loading} primary={primary} textColor={textColor} btnTextColor={btnTextColor} buttonStyle={buttonStyle} borderRadius={borderRadius} onClick={handleVerifyOTP}>
            {loading ? 'Verifying…' : 'Verify OTP'}
          </FButton>
          <div className='flex items-center justify-between'>
            <button onClick={() => handleSendOTP()} className='text-xs hover:underline' style={{ color: linkColor || '#3b82f6' }}>
              Resend code
            </button>
            {!lockedEmail && (
              <button onClick={() => setStep(0)} className='text-xs transition-colors' style={{ color: `${textColor}60` }}>← Back</button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Password Flow — supports prefill + locked email ─────────────────────────
const PasswordFlow = ({
  request_id, onComplete, onSuccess, onBack, onForgotPassword, forgotPasswordEnabled,
  primary, textColor, btnTextColor, linkColor, buttonStyle, inputStyle, inputBorderColor, borderRadius,
  prefillEmail, lockedEmail, isCardLight,          // ← autofill & theme props
}) => {
  const [formData, setFormData] = useState({ email: prefillEmail || '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLogin = async () => {
    if (!formData.email || !formData.password) { setError('Please enter both email and password'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${backend_url}/auth/login/password`, {
        request_id, email: formData.email, password: formData.password
      }, { withCredentials: true, headers: getDeviceFingerprintHeaders() });
      if (res.data.next_step) onComplete(res.data.next_step);
      else if (res.data.redirect_url) onSuccess(res.data.redirect_url);
    } catch (err) {
      const detail = err.response?.data?.detail;
      const statusCode = err.response?.status;
      const rawMsg = typeof detail === 'string' ? detail : detail?.message || detail?.msg || 'Failed to authenticate';
      const displayMsg = (typeof detail === 'object' && detail?.status_code)
        ? `[${detail.status_code}] ${rawMsg}`
        : (statusCode && statusCode !== 400 && statusCode !== 500)
          ? `[${statusCode}] ${rawMsg}`
          : rawMsg;

      useToastStore.getState().addToast(displayMsg, 'error');
      setError(displayMsg);

      if (detail && detail.redirect_url) {
        setTimeout(() => {
          window.location.href = detail.redirect_url;
        }, 1500);
        return;
      }
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className='space-y-3'>
      {lockedEmail && prefillEmail && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className='flex items-center gap-2 text-xs py-2.5 px-3.5 rounded-xl font-medium'
          style={{ backgroundColor: `${primary}12`, border: `1px solid ${primary}30`, color: `${textColor}80` }}
        >
          <Lock size={11} style={{ color: primary }} />
          <span>Signing in as <strong style={{ color: textColor }}>{prefillEmail}</strong></span>
        </motion.div>
      )}
      {error && <p className='text-red-400 text-xs text-center'>{error}</p>}
      <FInput
        label='Email Address' name='email' type='email' placeholder='you@example.com'
        textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius}
        isCardLight={isCardLight}
        value={formData.email} onChange={handleChange}
        locked={!!lockedEmail} primary={primary}
      />
      <FInput
        label='Password' name='password' type='password' placeholder='••••••••'
        textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius}
        isCardLight={isCardLight}
        value={formData.password} onChange={handleChange}
      />
      <FButton disabled={loading} primary={primary} textColor={textColor} btnTextColor={btnTextColor} buttonStyle={buttonStyle} borderRadius={borderRadius} onClick={handleLogin}>
        {loading ? 'Authenticating…' : 'Sign In'}
      </FButton>
      {forgotPasswordEnabled && (
        <button onClick={onForgotPassword} className='w-full text-xs transition-colors mt-1 hover:underline' style={{ color: '#ef4444' }}>
          Forgot password?
        </button>
      )}
      {onBack && !lockedEmail && (
        <button onClick={onBack} className='w-full text-xs transition-colors mt-2' style={{ color: `${textColor}60` }}>← Back to options</button>
      )}
    </motion.div>
  );
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
const ForgotPasswordFlow = ({ request_id, onBack, primary, textColor, buttonStyle, inputStyle, inputBorderColor, borderRadius, prefillEmail, isCardLight }) => {
  const [email, setEmail] = useState(prefillEmail || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email) { setError('Please enter your email address'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${backend_url}/auth/forgot-password/send`, { request_id, email }, {
        headers: getDeviceFingerprintHeaders()
      });
      if (res.data.success) setSent(true);
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
            We've sent a password reset link to <strong style={{ color: `${textColor}90` }}>{email}</strong>.{' '}
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
      <FInput
        label='Email Address' name='email' type='email' placeholder='you@example.com'
        textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius}
        isCardLight={isCardLight}
        value={email} onChange={(e) => setEmail(e.target.value)}
      />
      <FButton disabled={loading} primary={primary} textColor={textColor} buttonStyle={buttonStyle} borderRadius={borderRadius} onClick={handleSend}>
        {loading ? 'Sending…' : 'Send Reset Link'}
      </FButton>
      <button onClick={onBack} className='w-full text-xs transition-colors mt-2' style={{ color: `${textColor}40` }}>← Back to sign in</button>
    </motion.div>
  );
};

// ─── Provider Selection Flow ──────────────────────────────────────────────────
const ProviderSelectionFlow = ({ enabledMethods, socialLayout, textColor, btnTextColor, borderRadius, auth_token, onSelectEmailOTP, onSelectMobileOTP, passwordForm, providerBgColor, providerTextColor, isCardLight }) => {
  const socialMethods = enabledMethods.filter(m => m.id !== 'password' && m.id !== 'email_otp' && m.id !== 'mobile_otp' && m.id !== 'otp');
  const hasEmailOTP = enabledMethods.some(m => m.id === 'email_otp' || m.id === 'otp');
  const hasMobileOTP = enabledMethods.some(m => m.id === 'mobile_otp');
  const hasPassword = enabledMethods.some(m => m.id === 'password');

  return (
    <div className='space-y-3'>
      <SocialMethods
        methods={socialMethods}
        socialLayout={socialLayout}
        textColor={textColor}
        borderRadius={borderRadius}
        auth_token={auth_token}
        providerBgColor={providerBgColor}
        providerTextColor={providerTextColor}
        isCardLight={isCardLight}
      />
      {socialMethods.length > 0 && (hasPassword || hasEmailOTP || hasMobileOTP) && (
        <div className='relative flex items-center justify-center py-2'>
          <div className='absolute inset-0 flex items-center'><div className='w-full border-t' style={{ borderColor: `${textColor}20` }} /></div>
          <span className='relative px-3 text-xs' style={{ color: `${textColor}60` }}>or continue with</span>
        </div>
      )}
      {hasEmailOTP && hasMobileOTP ? (
        <div className='space-y-2'>
          <p className='text-xs font-bold text-center uppercase tracking-wider' style={{ color: `${textColor}50` }}>
            Continue with OTP
          </p>
          <div className='flex gap-2.5'>
            <button onClick={onSelectEmailOTP} className='flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold border hover:opacity-80 transition-all'
              style={{ backgroundColor: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)', color: btnTextColor || textColor, borderRadius }}>
              <span className='text-blue-500 text-base'><MdOutlineSms /></span>
              Email
            </button>
            <button onClick={onSelectMobileOTP} className='flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold border hover:opacity-80 transition-all'
              style={{ backgroundColor: 'rgba(6,182,212,0.08)', borderColor: 'rgba(6,182,212,0.2)', color: btnTextColor || textColor, borderRadius }}>
              <span className='text-cyan-400 text-base'><MdOutlineSms /></span>
              Mobile
            </button>
          </div>
        </div>
      ) : hasEmailOTP ? (
        <button onClick={onSelectEmailOTP} className='w-full flex items-center justify-center gap-2 py-3 text-sm font-bold border hover:opacity-80 transition-all'
          style={{ backgroundColor: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)', color: btnTextColor || textColor, borderRadius }}>
          <span className='text-blue-500 text-lg'><MdOutlineSms /></span>
          Continue with OTP
        </button>
      ) : hasMobileOTP ? (
        <button onClick={onSelectMobileOTP} className='w-full flex items-center justify-center gap-2 py-3 text-sm font-bold border hover:opacity-80 transition-all'
          style={{ backgroundColor: 'rgba(6,182,212,0.08)', borderColor: 'rgba(6,182,212,0.2)', color: btnTextColor || textColor, borderRadius }}>
          <span className='text-cyan-400 text-lg'><MdOutlineSms /></span>
          Continue with OTP
        </button>
      ) : null}
      {enabledMethods.some(m => m.id === 'password') && (
        <div className="pt-2">
          {passwordForm}
        </div>
      )}
    </div>
  );
};

// ─── Additional Fields (signup completion) ────────────────────────────────────
const AdditionalFieldsFlow = ({ request_id, signupFields, onSuccess, primary, textColor, buttonStyle, inputStyle, inputBorderColor, borderRadius, isCardLight }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleComplete = async () => {
    const missing = signupFields.filter(f => f.required && !formData[f.name]);
    if (missing.length > 0) { setError('Please fill all required fields.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${backend_url}/api/auth/request/signup/complete`, { request_id, custom_fields: formData }, {
        withCredentials: true,
        headers: getDeviceFingerprintHeaders()
      });
      if (res.data.redirect_url) onSuccess(res.data.redirect_url);
    } catch (err) {
      const detail = err.response?.data?.detail;
      const statusCode = err.response?.status;
      const rawMsg = typeof detail === 'string' ? detail : detail?.message || detail?.msg || 'Failed to complete signup';
      const displayMsg = (typeof detail === 'object' && detail?.status_code)
        ? `[${detail.status_code}] ${rawMsg}`
        : (statusCode && statusCode !== 400 && statusCode !== 500)
          ? `[${statusCode}] ${rawMsg}`
          : rawMsg;

      useToastStore.getState().addToast(displayMsg, 'error');
      setError(displayMsg);

      if (detail && detail.redirect_url) {
        setTimeout(() => {
          window.location.href = detail.redirect_url;
        }, 1500);
        return;
      }
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
          name={f.name} type={f.type || 'text'}
          textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius}
          isCardLight={isCardLight}
          value={formData[f.name] || ''} onChange={handleChange}
        />
      ))}
      <div className='pt-2'>
        <FButton disabled={loading} primary={primary} textColor={textColor} buttonStyle={buttonStyle} borderRadius={borderRadius} onClick={handleComplete}>
          {loading ? 'Completing…' : 'Create Account'}
        </FButton>
      </div>
    </div>
  );
};

// ─── Main LoginPortal ─────────────────────────────────────────────────────────
const DEFAULT_CONFIG_FALLBACK = {
  config: {
    branding: 'DAuth',
    ui: {
      screen_bg_color: '#0f172a',
      login_card_bg_color: 'rgba(30, 41, 59, 0.7)',
      primary_color: '#3b82f6',
      text_color: '#ffffff',
      btn_text_color: '#ffffff',
      link_color: '#60a5fa',
      border_radius: 'rounded',
      shadow_intensity: 'md',
      blur_amount: 24,
      border_width: 1,
      border_color: 'rgba(255,255,255,0.10)',
      button_style: 'filled',
      input_style: 'outlined',
      input_border_color: 'rgba(255,255,255,0.12)',
      logo_position: 'center',
      social_layout: 'list',
      bg_pattern: 'dots',
      gradient_start: '#0f172a',
      gradient_end: '#1e1b4b',
      gradient_direction: '135deg',
    }
  },
  enabled_methods: ['password', 'google', 'github', 'otp', 'email_otp', 'mobile_otp'],
  signup_fields: []
};

export const LoginPortal = () => {
  const { request_id, flow_type } = useParams();
  const [searchParams] = useSearchParams();

  // ── Autofill params ─────────────────────────────────────────────────────────
  // Supported URL params:
  //   ?prefill_email=user@example.com   — pre-fill email field
  //   ?lock_method=otp|password         — force a specific auth method & lock email
  // Example:
  //   /auth/REQ_ID/signin?prefill_email=user@example.com&lock_method=otp
  const prefillEmail  = searchParams.get('prefill_email') || '';
  const prefillPhone  = searchParams.get('prefill_phone') || '';
  const lockMethod    = searchParams.get('lock_method') || '';   // 'otp' | 'password' | ''

  const [configData, setConfigData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redirectTarget, setRedirectTarget] = useState(null);
  const [countdown, setCountdown] = useState(4);
  const [currentStep, setCurrentStep] = useState('provider_selection');

  const rawMethods = configData?.config?.auth_methods || [];
  const isEmailOTPEnabled = rawMethods.some(m => (m.id === 'email_otp' || m.id === 'otp') && m.enabled);
  const isMobileOTPEnabled = rawMethods.some(m => m.id === 'mobile_otp' && m.enabled);
  const isPasswordEnabled = rawMethods.some(m => m.id === 'password' && m.enabled);

  const lockedEmail = !!(
    (prefillEmail && isEmailOTPEnabled && lockMethod === 'otp') ||
    (prefillPhone && isMobileOTPEnabled && lockMethod === 'otp') ||
    ((prefillEmail || prefillPhone) && lockMethod === 'password' && isPasswordEnabled)
  );

  const requestedOtpDisabled = !!(
    lockMethod === 'otp' && (
      (prefillEmail && !isEmailOTPEnabled) ||
      (prefillPhone && !isMobileOTPEnabled) ||
      (!prefillEmail && !prefillPhone && !isEmailOTPEnabled && !isMobileOTPEnabled)
    )
  );

  const handleReturn = useCallback((target = redirectTarget) => {
    if (!target || target === 'history_back') {
      if (window.history.length > 1) {
        window.history.back();
        return;
      }
      window.location.href = '/';
      return;
    }
    window.location.href = target;
  }, [redirectTarget]);

  const handleSuccessRedirect = (url) => {
    if (url) {
      window.location.href = url;
    }
  };

  const fetchConfig = useCallback(async (locationCoords = null) => {
    if (!request_id) { setError('Missing request_id in URL'); setLoading(false); return; }
    try {
      const payload = {
          flow_type: flow_type || 'signin',
          ...(prefillEmail ? { prefill_email: prefillEmail } : {}),
          ...(prefillPhone ? { prefill_phone: prefillPhone } : {}),
          ...(lockMethod ? { lock_method: lockMethod } : {}),
          ...(locationCoords || {})
      };
      const res = await axios.post(
        `${backend_url}/api/auth/request/${request_id}/init`,
        payload,
        { withCredentials: true, headers: getDeviceFingerprintHeaders() }
      );
      if (res.data.redirect_url) { window.location.href = res.data.redirect_url; return; }
      setConfigData(res.data);
      setError(null);
      setLoading(false);
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = typeof detail === 'string' ? detail : detail?.message || 'Failed to initialize authentication flow';
      
      if (msg === "Location permissions are required for authentication in this app.") {
        setLoading(true);
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              fetchConfig({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
            },
            (error) => {
              if (error.code === 1) {
                setError("Location access denied. Please allow location permissions in your browser's site settings (usually the lock icon in the URL bar) to authenticate.");
              } else {
                setError("Location access failed. This app requires location permissions to authenticate.");
              }
              setLoading(false);
            }
          );
        } else {
          setError("Geolocation is not supported by your browser.");
          setLoading(false);
        }
        return;
      }

      // Determine the origin / return destination
      let target = null;
      if (detail && detail.redirect_url) {
        target = detail.redirect_url;
      } else if (searchParams.get('return_url')) {
        target = searchParams.get('return_url');
      } else if (searchParams.get('redirect_url')) {
        target = searchParams.get('redirect_url');
      } else if (document.referrer && !document.referrer.includes(window.location.host)) {
        target = document.referrer;
      } else if (window.history.length > 1) {
        target = 'history_back';
      }

      setRedirectTarget(target);
      setError(msg);
      setCountdown(4);
      setLoading(false);
    }
  }, [backend_url, flow_type, lockMethod, prefillEmail, prefillPhone, request_id, searchParams]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Auto-redirect countdown on error
  useEffect(() => {
    if (!error || error.includes("location permissions")) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleReturn(redirectTarget);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [error, redirectTarget, handleReturn]);

  // Auto-navigate to locked method once config is loaded
  useEffect(() => {
    if (!configData || !lockMethod) return;
    if (lockMethod === 'otp') {
      if (prefillPhone && isMobileOTPEnabled) {
        setCurrentStep('mobile_otp_verification');
      } else if (isEmailOTPEnabled) {
        setCurrentStep('email_otp_verification');
      }
    } else if (lockMethod === 'password' && isPasswordEnabled) {
      setCurrentStep('password_verification');
    }
  }, [configData, lockMethod, isEmailOTPEnabled, isMobileOTPEnabled, isPasswordEnabled, prefillPhone]);

  // Load Google Font
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

  if (error) {
    const isLocationError = error.includes("location permissions");

    const handleRetryLocation = () => {
      setError(null);
      setLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            fetchConfig({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
          },
          (err) => {
            if (err.code === 1) {
              setError("Location access denied. Please allow location permissions in your browser's site settings (usually the lock icon in the URL bar) to authenticate.");
            } else {
              setError("Location access failed. This app requires location permissions to authenticate.");
            }
            setLoading(false);
          }
        );
      } else {
        setError("Geolocation is not supported by your browser.");
        setLoading(false);
      }
    };

    let targetLabel = "Application";
    try {
      if (redirectTarget && redirectTarget.startsWith('http')) {
        const parsed = new URL(redirectTarget);
        targetLabel = parsed.hostname;
      }
    } catch (_) {}

    return (
      <div className='min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0a0d14] text-white p-4'>
        {/* Subtle grid background */}
        <div
          className='absolute inset-0 pointer-events-none'
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className='absolute w-96 h-96 rounded-full pointer-events-none opacity-15 blur-3xl bg-red-500/30 top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2' />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className='relative w-full max-w-md mx-4 p-7 sm:p-8 z-10 rounded-3xl border border-red-500/20 bg-[#140f12]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(239,68,68,0.15)] text-center'
        >
          <div className='w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-500/20 to-orange-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400 shadow-inner'>
            <AlertTriangle size={30} className='animate-pulse' />
          </div>

          <h2 className='text-red-400 font-extrabold text-xl tracking-tight mb-2'>Authentication Error</h2>
          <p className='text-slate-300 text-xs sm:text-sm leading-relaxed mb-5'>{error}</p>

          {!isLocationError && (
            <div className='mb-6 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300/90 flex items-center justify-center gap-2'>
              <span className='w-2 h-2 rounded-full bg-red-400 animate-ping' />
              <span>Redirecting back in <strong className='text-white font-mono font-bold'>{countdown}s</strong>...</span>
            </div>
          )}

          <div className='space-y-2.5'>
            {isLocationError ? (
              <button 
                onClick={handleRetryLocation}
                className='bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all w-full shadow-lg shadow-red-500/20 active:scale-98 flex items-center justify-center gap-2'
              >
                <RotateCcw size={16} />
                <span>Retry Location Access</span>
              </button>
            ) : (
              <button 
                onClick={() => handleReturn(redirectTarget)}
                className='bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black py-3.5 px-5 rounded-2xl text-xs sm:text-sm transition-all w-full shadow-lg shadow-cyan-500/25 active:scale-98 flex items-center justify-center gap-2 group'
              >
                <ArrowLeft size={16} className='group-hover:-translate-x-1 transition-transform' />
                <span>Return to {targetLabel !== "Application" ? targetLabel : "Previous Page"}</span>
              </button>
            )}

            <button
              onClick={() => window.location.reload()}
              className='w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors'
            >
              Try Reloading
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const activeConfigData = configData || DEFAULT_CONFIG_FALLBACK;

  const { ui, branding } = activeConfigData.config || {};
  const { enabled_methods = ['password', 'google', 'github', 'otp'], signup_fields = [] } = activeConfigData;

  const uiConfig = ui || {};
  const {
    screen_bg_color = '#000000',
    login_card_bg_color = '#ffffff14',
    primary_color = '#22d3ee',
    text_color = '#ffffff',
    btn_text_color = '#ffffff',
    link_color = '#3b82f6',
    brand_name,
    brand_logo,
    brand_text_color,
    secondary_text_color,
    provider_bg_color,
    provider_text_color,
    font_family = 'system',
    font_size = 'md',
    border_radius = 'rounded',
    shadow_intensity = 'md',
    blur_amount = 24,
    border_width = 1,
    border_color = 'rgba(255,255,255,0.10)',
    card_variant,
    button_style = 'filled',
    input_style = 'outlined',
    input_border_color = 'rgba(255,255,255,0.12)',
    logo_position = 'center',
    social_layout = 'list',
    bg_type,
    bg_pattern = 'dots',
    gradient_start = '#0f172a',
    gradient_mid,
    gradient_end = '#1e1b4b',
    gradient_direction = '135deg',
    card_bg_type,
    card_bg_pattern,
    card_gradient_start,
    card_gradient_mid,
    card_gradient_end,
    card_gradient_direction,
    custom_css = '',
  } = uiConfig;

  // Typography Scaling & Font Family
  const typo = TYPOGRAPHY_SCALE[font_size] || TYPOGRAPHY_SCALE.md;
  const fontFamilyStr = FONT_MAP[font_family] ?? FONT_MAP.system;

  // Shape & Radii
  const cardRadius   = RADIUS_MAP[border_radius] ?? RADIUS_MAP.rounded;
  const btnRadius    = RADIUS_MAP[border_radius] ?? RADIUS_MAP.rounded;
  const cardShadow   = SHADOW_MAP(primary_color)[shadow_intensity] ?? SHADOW_MAP(primary_color).md;

  // Global Background style & adaptive pattern color
  const isGlobalGradient = bg_type === 'gradient' || bg_pattern === 'gradient'; // fallback for old pattern value
  const bgStyle = isGlobalGradient
    ? { background: `linear-gradient(${gradient_direction || '135deg'}, ${gradient_start || '#0f172a'}, ${gradient_mid ? gradient_mid + ', ' : ''}${gradient_end || '#1e1b4b'})` }
    : { backgroundColor: screen_bg_color || '#000000' };

  const activeScreenBg = isGlobalGradient ? (gradient_start || '#0f172a') : (screen_bg_color || '#000000');
  const screenIsLight = isLightColor(activeScreenBg);
  const bgDotColor = screenIsLight ? 'rgba(15, 23, 42, 0.18)' : 'rgba(255, 255, 255, 0.15)';
  const bgLineColor = screenIsLight ? 'rgba(15, 23, 42, 0.10)' : 'rgba(255, 255, 255, 0.08)';

  // Card Background style & blur translucency
  const isCardGradient = card_bg_type === 'gradient';
  const rawCardBg = isCardGradient
    ? `linear-gradient(${card_gradient_direction || '135deg'}, ${card_gradient_start || '#ffffff'}, ${card_gradient_mid ? card_gradient_mid + ', ' : ''}${card_gradient_end || '#f1f5f9'})`
    : (login_card_bg_color || '#ffffff14');

  // Border calculation
  const effectiveBorderWidth = border_width !== undefined && border_width !== null ? Number(border_width) : 1;
  const isCardLight = isLightColor(login_card_bg_color || '#ffffff');
  const fallbackBorderColor = isCardLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.2)';
  const effectiveBorderColor = border_color && border_color.trim() !== '' ? border_color : fallbackBorderColor;
  const cardBorderStyle = effectiveBorderWidth === 0 ? 'none' : `${effectiveBorderWidth}px solid ${effectiveBorderColor}`;

  // Card Variant Computation: normal vs neumorphism vs glassmorphism
  let finalCardBg = rawCardBg;
  let finalBackdropFilter = 'none';
  let finalShadow = cardShadow;
  let finalBorder = cardBorderStyle;

  if (card_variant === 'glassmorphism') {
    const rawBlur = Number(blur_amount ?? 20);
    const glassBlur = rawBlur > 0 ? rawBlur : 16;
    finalCardBg = getEffectiveCardBg(rawCardBg, glassBlur, 'glassmorphism');
    finalBackdropFilter = `blur(${glassBlur}px)`;
    finalShadow = shadow_intensity === 'none' ? 'none' : `0 20px 45px rgba(0,0,0,0.35), 0 0 20px ${primary_color}18`;
    finalBorder = cardBorderStyle;
  } else if (card_variant === 'neumorphism') {
    finalCardBg = rawCardBg;
    finalBackdropFilter = 'none';
    finalShadow = isCardLight
      ? '12px 12px 28px rgba(166, 175, 195, 0.5), -12px -12px 28px rgba(255, 255, 255, 0.9), inset 1px 1px 1px rgba(255, 255, 255, 0.6)'
      : '12px 12px 28px rgba(0, 0, 0, 0.7), -8px -8px 24px rgba(255, 255, 255, 0.04), inset 1px 1px 1px rgba(255, 255, 255, 0.05)';
    finalBorder = effectiveBorderWidth === 0
      ? 'none'
      : (border_color ? `${effectiveBorderWidth}px solid ${border_color}` : (isCardLight ? '1px solid rgba(255,255,255,0.7)' : '1px solid rgba(255,255,255,0.08)'));
  } else {
    // Normal variant
    finalCardBg = rawCardBg;
    const rawBlur = Number(blur_amount ?? 0);
    finalBackdropFilter = rawBlur > 0 ? `blur(${rawBlur}px)` : 'none';
    finalShadow = shadow_intensity === 'none' ? 'none' : cardShadow;
    finalBorder = cardBorderStyle;
  }

  // Card pattern adaptive color
  const cardPatternColor = isCardLight ? 'rgba(15, 23, 42, 0.15)' : 'rgba(255, 255, 255, 0.15)';

  const logoAlign = {
    left:   'items-start text-left',
    center: 'items-center text-center',
    right:  'items-end text-right',
  }[logo_position] || 'items-center text-center';

  const sharedFormProps = {
    primary: primary_color, textColor: text_color, btnTextColor: btn_text_color, linkColor: link_color,
    buttonStyle: button_style, inputStyle: input_style,
    inputBorderColor: input_border_color, borderRadius: btnRadius,
    providerBgColor: provider_bg_color, providerTextColor: provider_text_color,
    isCardLight,
    prefillEmail: prefillEmail || prefillPhone, lockedEmail,
  };

  // Title for locked-mode header
  const pageSubtitle = lockedEmail
    ? `Verify your identity`
    : flow_type === 'signup' ? 'Create your account' : 'Sign in to your account';

  return (
    <div
      className='min-h-screen w-full flex items-center justify-center overflow-auto relative transition-all duration-500'
      style={bgStyle}
    >
      {bg_pattern === 'dots' && (
        <div className='absolute inset-0 pointer-events-none'
          style={{ backgroundImage: `radial-gradient(circle, ${bgDotColor} 1.5px, transparent 1.5px)`, backgroundSize: '28px 28px' }} />
      )}
      {bg_pattern === 'diagonal' && (
        <div className='absolute inset-0 pointer-events-none'
          style={{ backgroundImage: `repeating-linear-gradient(45deg, ${bgLineColor} 0px, ${bgLineColor} 1px, transparent 1px, transparent 12px)` }} />
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
          background: finalCardBg,
          backdropFilter: finalBackdropFilter,
          WebkitBackdropFilter: finalBackdropFilter,
          border: finalBorder,
          borderRadius: cardRadius,
          boxShadow: finalShadow,
          fontFamily: fontFamilyStr,
          '--card-title-size': typo.title,
          '--card-subtitle-size': typo.subtitle,
          '--card-label-size': typo.label,
          '--card-input-size': typo.input,
          '--card-btn-size': typo.btn,
          '--card-footer-size': typo.footer,
        }}
      >
        {/* Card pattern overlay */}
        {card_bg_pattern === 'dots' && (
          <div className='absolute inset-0 pointer-events-none' style={{ borderRadius: cardRadius, backgroundImage: `radial-gradient(circle, ${cardPatternColor} 1.5px, transparent 1.5px)`, backgroundSize: '16px 16px' }} />
        )}
        {card_bg_pattern === 'diagonal' && (
          <div className='absolute inset-0 pointer-events-none' style={{ borderRadius: cardRadius, backgroundImage: `repeating-linear-gradient(45deg, ${cardPatternColor} 0px, ${cardPatternColor} 1px, transparent 1px, transparent 8px)` }} />
        )}

        {custom_css && <style>{custom_css}</style>}

        {/* Brand header */}
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
          <h1 className='font-bold tracking-tight' style={{ color: text_color, fontSize: 'var(--card-title-size, 1.25rem)' }}>
            {brand_name || branding || 'Your Brand'}
          </h1>
          <p className='mt-1.5' style={{ color: `${text_color}50`, fontSize: 'var(--card-subtitle-size, 0.75rem)' }}>{pageSubtitle}</p>
        </div>

        {requestedOtpDisabled && (
          <div className="mb-4 p-3 rounded-xl border text-xs font-semibold text-center"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
            Warning: The requested OTP authentication method is not enabled for this project.
          </div>
        )}

        {/* Flow content */}
        <div className='relative z-10'>
          <AnimatePresence mode='wait'>
            {currentStep === 'additional_fields' ? (
              <AdditionalFieldsFlow key='fields' request_id={request_id} signupFields={signup_fields} onSuccess={handleSuccessRedirect} {...sharedFormProps} />
            ) : currentStep === 'email_otp_verification' || currentStep === 'otp_verification' ? (
              <OTPFlow
                key='email-otp'
                mode='email'
                request_id={request_id}
                onComplete={ns => setCurrentStep(ns)}
                onSuccess={handleSuccessRedirect}
                onBack={lockedEmail ? null : () => setCurrentStep('provider_selection')}
                {...sharedFormProps}
              />
            ) : currentStep === 'mobile_otp_verification' ? (
              <OTPFlow
                key='mobile-otp'
                mode='mobile'
                request_id={request_id}
                onComplete={ns => setCurrentStep(ns)}
                onSuccess={handleSuccessRedirect}
                onBack={lockedEmail ? null : () => setCurrentStep('provider_selection')}
                {...sharedFormProps}
              />
            ) : currentStep === 'password_verification' ? (
              <PasswordFlow
                key='password'
                request_id={request_id}
                onComplete={ns => setCurrentStep(ns)}
                onSuccess={handleSuccessRedirect}
                onBack={lockedEmail ? null : () => setCurrentStep('provider_selection')}
                onForgotPassword={() => setCurrentStep('forgot_password')}
                forgotPasswordEnabled={configData?.config?.forgot_password_enabled !== false}
                {...sharedFormProps}
              />
            ) : currentStep === 'forgot_password' ? (
              <ForgotPasswordFlow
                key='forgot'
                request_id={request_id}
                onBack={() => setCurrentStep('password_verification')}
                prefillEmail={prefillEmail}
                {...sharedFormProps}
              />
            ) : (
              <ProviderSelectionFlow
                key='select'
                enabledMethods={enabled_methods}
                socialLayout={social_layout}
                auth_token={configData?.auth_token}
                textColor={text_color}
                btnTextColor={btn_text_color}
                borderRadius={btnRadius}
                providerBgColor={provider_bg_color}
                providerTextColor={provider_text_color}
                isCardLight={isCardLight}
                onSelectEmailOTP={() => setCurrentStep('email_otp_verification')}
                onSelectMobileOTP={() => setCurrentStep('mobile_otp_verification')}
                passwordForm={
                  <PasswordFlow
                    request_id={request_id}
                    onComplete={ns => setCurrentStep(ns)}
                    onSuccess={handleSuccessRedirect}
                    onForgotPassword={() => setCurrentStep('forgot_password')}
                    forgotPasswordEnabled={configData?.config?.forgot_password_enabled !== false}
                    prefillEmail={prefillEmail}
                    lockedEmail={lockedEmail}
                    {...sharedFormProps}
                  />
                }
              />
            )}
          </AnimatePresence>
        </div>

        {/* Sign in / Sign up switcher */}
        <p className='text-center mt-5' style={{ color: secondary_text_color || `${text_color}60`, fontSize: 'var(--card-footer-size, 0.75rem)' }}>
          {flow_type === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <a
            href={flow_type === 'signin' ? `/auth/request/${request_id}/signup` : `/auth/request/${request_id}/signin`}
            className='hover:underline font-bold transition-colors'
            style={{ color: link_color || '#38bdf8' }}
          >
            {flow_type === 'signin' ? 'Sign up' : 'Sign in'}
          </a>
        </p>
      </motion.div>
    </div>
  );
};
