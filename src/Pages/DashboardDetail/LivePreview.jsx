import { useState, useEffect } from 'react';
import { useAuthConfigStore } from '../../Store/useAuthConfigStore';
import { motion, AnimatePresence } from 'framer-motion';
import { MdOutlineSms } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { Eye, EyeOff, Check, UserPlus2 } from 'lucide-react';
import { GoogleLogo, GithubLogo, FacebookLogo, MicrosoftLogo } from '../../Components/BrandLogos';

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

// ─── Shared fake input (read-only) ────────────────────────────────────────────
const FInput = ({ label, type = 'text', placeholder, textColor, inputStyle, inputBorderColor, borderRadius, value, onChange, isCardLight = true }) => {
  const [show, setShow] = useState(false);
  const isPass = type === 'password';
  const isFilled = inputStyle === 'filled';

  const defaultBg = isFilled
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
      <div className='relative'>
        <input
          type={isPass && !show ? 'password' : 'text'}
          placeholder={placeholder || label}
          readOnly
          value={value !== undefined ? value : ''}
          onChange={onChange}
          className='w-full px-4 py-3 outline-none transition-all duration-300'
          style={{
            borderRadius,
            backgroundColor: defaultBg,
            border: borderStyle,
            color: textColor,
            paddingRight: isPass ? '42px' : '16px',
            fontSize: 'var(--card-input-size, 14px)',
          }}
        />
        {isPass && (
          <button
            type='button'
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

// ─── Shared styled button ─────────────────────────────────────────────────────
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

// ─── Password form (for when password is the ONLY or first method) ────────────
const PasswordForm = ({ primary, textColor, btnTextColor, buttonStyle, inputStyle, inputBorderColor, borderRadius, showForgotPassword, onBack, isCardLight, submitText, onSubmit }) => (
  <motion.div key='pwd-form' initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className='space-y-3'>
    <FInput label='Email Address' type='email' placeholder='you@example.com' textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius} isCardLight={isCardLight} />
    <FInput label='Password' type='password' placeholder='••••••••' textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius} isCardLight={isCardLight} />
    <FButton primary={primary} textColor={textColor} btnTextColor={btnTextColor} buttonStyle={buttonStyle} borderRadius={borderRadius} onClick={onSubmit}>
      {submitText || 'Sign In'}
    </FButton>
    {showForgotPassword && (
      <p className='text-center pt-1 cursor-pointer hover:underline' style={{ color: '#ef4444', fontSize: 'var(--card-footer-size, 12px)' }}>Forgot password?</p>
    )}
    {onBack && (
      <button onClick={onBack} className='w-full transition-colors mt-1' style={{ color: `${textColor}60`, fontSize: 'var(--card-footer-size, 12px)' }}>← Back to options</button>
    )}
  </motion.div>
);

// ─── OTP form ────────────────────────────────────────────────────────────────
const OTPForm = ({ primary, textColor, btnTextColor, buttonStyle, inputStyle, inputBorderColor, borderRadius, onBack, mode = 'email', isCardLight, onVerify }) => {
  const [step, setStep] = useState(0);
  return (
    <AnimatePresence mode='wait'>
      {step === 0 ? (
        <motion.div key='otp-email' initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className='space-y-3'>
          <FInput 
            label={mode === 'email' ? 'Email Address' : 'Mobile Number'} 
            type={mode === 'email' ? 'email' : 'text'} 
            placeholder={mode === 'email' ? 'you@example.com' : '+919876543210'} 
            textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius} isCardLight={isCardLight}
          />
          <FButton primary={primary} textColor={textColor} btnTextColor={btnTextColor} buttonStyle={buttonStyle} borderRadius={borderRadius} onClick={() => setStep(1)}>Send OTP</FButton>
          {onBack && <button onClick={onBack} className='w-full transition-colors' style={{ color: `${textColor}60`, fontSize: 'var(--card-footer-size, 12px)' }}>← Back to options</button>}
        </motion.div>
      ) : (
        <motion.div key='otp-code' initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className='space-y-3'>
          <p className='text-center' style={{ color: `${textColor}60`, fontSize: 'var(--card-subtitle-size, 12px)' }}>
            Enter the 6-digit code sent to your {mode === 'email' ? 'email' : 'mobile number'}
          </p>
          <div className='flex gap-1 justify-center'>
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className='w-8 h-9 flex items-center justify-center font-mono'
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: `${textColor}50`, borderRadius, fontSize: 'var(--card-input-size, 14px)' }}>_</div>
            ))}
          </div>
          <FButton primary={primary} textColor={textColor} btnTextColor={btnTextColor} buttonStyle={buttonStyle} borderRadius={borderRadius} onClick={onVerify}>Verify OTP</FButton>
          <button onClick={() => setStep(0)} className='w-full transition-colors' style={{ color: `${textColor}60`, fontSize: 'var(--card-footer-size, 12px)' }}>← Back</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Social provider button (list layout) ────────────────────────────────────
const SocialBtn = ({ method, textColor, borderRadius, providerBgColor, providerTextColor, isCardLight, onClick }) => {
  const meta = PROVIDER_META[method.id?.toLowerCase()] || {};
  const defaultBg = isCardLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';
  const defaultBorder = isCardLight ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.10)';
  return (
    <button
      type='button'
      onClick={onClick}
      className='w-full flex items-center justify-center gap-3 py-3 font-bold border transition-all hover:opacity-90 active:scale-[0.99] group/social shadow-sm'
      style={{
        backgroundColor: providerBgColor || defaultBg,
        borderColor: defaultBorder,
        color: providerTextColor || (isCardLight ? '#0F172A' : textColor),
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

// ─── Social compact (2-column layout) ─────────────────────────────────────────
const SocialCompact = ({ methods, textColor, borderRadius, providerBgColor, providerTextColor, isCardLight, onClick }) => (
  <div className='grid grid-cols-2 gap-2'>
    {methods.map((m, idx) => {
      const meta = PROVIDER_META[m.id?.toLowerCase()] || {};
      const isSingle = methods.length % 2 !== 0 && idx === methods.length - 1;
      const defaultBg = isCardLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';
      const defaultBorder = isCardLight ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.10)';
      return (
        <button
          key={m.id}
          type='button'
          onClick={onClick}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 font-semibold border transition-all hover:opacity-90 active:scale-[0.98] group/soc shadow-sm ${
            isSingle ? 'col-span-2' : ''
          }`}
          style={{
            backgroundColor: providerBgColor || defaultBg,
            borderColor: defaultBorder,
            color: providerTextColor || (isCardLight ? '#0F172A' : textColor),
            borderRadius,
            fontSize: 'var(--card-footer-size, 12px)',
          }}
        >
          <span className='text-base group-hover/soc:scale-110 transition-transform flex items-center justify-center' style={{ color: meta.color }}>
            {meta.icon}
          </span>
          <span className='truncate'>{meta.label || m.name || m.id}</span>
        </button>
      );
    })}
  </div>
);

// ─── Social icon grid ─────────────────────────────────────────────────────────
const SocialGrid = ({ methods, textColor, borderRadius, providerBgColor, isCardLight, onClick }) => (
  <div className='flex justify-center gap-2.5 flex-wrap'>
    {methods.map(m => {
      const meta = PROVIDER_META[m.id?.toLowerCase()] || {};
      const defaultBg = isCardLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';
      const defaultBorder = isCardLight ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.08)';
      return (
        <div
          key={m.id}
          title={meta.label || m.name || m.id}
          onClick={onClick}
          className='w-12 h-12 flex items-center justify-center text-xl cursor-pointer hover:opacity-80 transition-all group/soc border'
          style={{ backgroundColor: providerBgColor || defaultBg, borderColor: defaultBorder, color: meta.color, borderRadius }}
        >
          <span className='group-hover/soc:scale-110 transition-transform'>{meta.icon}</span>
        </div>
      );
    })}
  </div>
);

// ─── Provider selection flow (exact match of real LoginPortal) ────────────────
const ProviderSelectionFlow = ({
  enabledMethods, socialLayout, textColor, btnTextColor, linkColor, borderRadius, primary,
  buttonStyle, inputStyle, inputBorderColor, showForgotPassword, providerBgColor, providerTextColor,
  isCardLight, submitText = 'Sign In', onAdvanceToFields
}) => {
  const [step, setStep] = useState('select'); // 'select' | 'password' | 'email_otp' | 'mobile_otp'

  const socialMethods = enabledMethods.filter(m => m.id !== 'password' && m.id !== 'email_otp' && m.id !== 'mobile_otp' && m.id !== 'otp');
  const hasPassword = enabledMethods.some(m => m.id === 'password');
  const hasEmailOTP = enabledMethods.some(m => m.id === 'email_otp' || m.id === 'otp');
  const hasMobileOTP = enabledMethods.some(m => m.id === 'mobile_otp');
  const sharedProps = { primary, textColor, btnTextColor, linkColor, buttonStyle, inputStyle, inputBorderColor, borderRadius, isCardLight };
  const defaultBg = isCardLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';
  const defaultBorder = isCardLight ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.10)';
  const resolvedProviderTextColor = providerTextColor || (isCardLight ? '#0F172A' : textColor);

  // Auto-advance if only one method
  useEffect(() => {
    if (enabledMethods.length === 1) {
      if (hasPassword) setStep('password');
      else if (hasEmailOTP) setStep('email_otp');
      else if (hasMobileOTP) setStep('mobile_otp');
    } else {
      setStep('select');
    }
  }, [enabledMethods.length, hasPassword, hasEmailOTP, hasMobileOTP]);

  return (
    <AnimatePresence mode='wait'>
      {step === 'password' ? (
        <PasswordForm
          key='password'
          {...sharedProps}
          submitText={submitText}
          onSubmit={onAdvanceToFields}
          showForgotPassword={showForgotPassword}
          onBack={enabledMethods.length > 1 ? () => setStep('select') : null}
        />
      ) : step === 'email_otp' ? (
        <OTPForm
          key='email_otp'
          mode='email'
          {...sharedProps}
          onVerify={onAdvanceToFields}
          onBack={enabledMethods.length > 1 ? () => setStep('select') : null}
        />
      ) : step === 'mobile_otp' ? (
        <OTPForm
          key='mobile_otp'
          mode='mobile'
          {...sharedProps}
          onVerify={onAdvanceToFields}
          onBack={enabledMethods.length > 1 ? () => setStep('select') : null}
        />
      ) : (
        <motion.div key='select' initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className='space-y-2.5'>
          {/* Social providers */}
          {socialMethods.length > 0 && (
            socialLayout === 'grid'
              ? <SocialGrid methods={socialMethods} textColor={textColor} borderRadius={borderRadius} providerBgColor={providerBgColor} isCardLight={isCardLight} onClick={onAdvanceToFields} />
              : socialLayout === 'compact'
                ? <SocialCompact methods={socialMethods} textColor={textColor} borderRadius={borderRadius} providerBgColor={providerBgColor} providerTextColor={providerTextColor} isCardLight={isCardLight} onClick={onAdvanceToFields} />
                : socialMethods.map(m => <SocialBtn key={m.id} method={m} textColor={textColor} borderRadius={borderRadius} providerBgColor={providerBgColor} providerTextColor={providerTextColor} isCardLight={isCardLight} onClick={onAdvanceToFields} />)
          )}
          {/* Divider if social AND (password or OTP) */}
          {socialMethods.length > 0 && (hasPassword || hasEmailOTP || hasMobileOTP) && (
            <div className='relative flex items-center justify-center py-2'>
              <div className='absolute inset-0 flex items-center'><div className='w-full border-t' style={{ borderColor: `${textColor}20` }} /></div>
              <span className='relative px-3 text-xs' style={{ color: `${textColor}60`, fontSize: 'var(--card-footer-size, 12px)' }}>or continue with</span>
            </div>
          )}
          {/* Email/Mobile OTP buttons */}
          {hasEmailOTP && hasMobileOTP ? (
            <div className='space-y-2'>
              <p className='font-bold text-center uppercase tracking-wider text-xs' style={{ color: `${textColor}50`, fontSize: 'var(--card-footer-size, 11px)' }}>
                Continue with OTP
              </p>
              <div className='flex gap-2'>
                <button onClick={() => setStep('email_otp')} className='flex-1 flex items-center justify-center gap-2 py-2.5 font-bold hover:opacity-80 transition-all border shadow-sm'
                  style={{ backgroundColor: providerBgColor || defaultBg, borderColor: defaultBorder, color: resolvedProviderTextColor, borderRadius, fontSize: 'var(--card-footer-size, 12px)' }}>
                  <span className='text-emerald-500 text-sm'><MdOutlineSms /></span>
                  Email
                </button>
                <button onClick={() => setStep('mobile_otp')} className='flex-1 flex items-center justify-center gap-2 py-2.5 font-bold hover:opacity-80 transition-all border shadow-sm'
                  style={{ backgroundColor: providerBgColor || defaultBg, borderColor: defaultBorder, color: resolvedProviderTextColor, borderRadius, fontSize: 'var(--card-footer-size, 12px)' }}>
                  <span className='text-cyan-500 text-sm'><MdOutlineSms /></span>
                  Mobile
                </button>
              </div>
            </div>
          ) : hasEmailOTP ? (
            <button onClick={() => setStep('email_otp')} className='w-full flex items-center justify-center gap-2.5 py-3 font-bold hover:opacity-80 transition-all border shadow-sm'
              style={{ backgroundColor: providerBgColor || defaultBg, borderColor: defaultBorder, color: resolvedProviderTextColor, borderRadius, fontSize: 'var(--card-btn-size, 14px)' }}>
              <span className='text-emerald-500 text-lg'><MdOutlineSms /></span>
              Continue with OTP
            </button>
          ) : hasMobileOTP ? (
            <button onClick={() => setStep('mobile_otp')} className='w-full flex items-center justify-center gap-2.5 py-3 font-bold hover:opacity-80 transition-all border shadow-sm'
              style={{ backgroundColor: providerBgColor || defaultBg, borderColor: defaultBorder, color: resolvedProviderTextColor, borderRadius, fontSize: 'var(--card-btn-size, 14px)' }}>
              <span className='text-cyan-500 text-lg'><MdOutlineSms /></span>
              Continue with OTP
            </button>
          ) : null}
          {/* Password form inline */}
          {hasPassword && (
            <div className="pt-2">
              <PasswordForm
                key='password-inline'
                {...sharedProps}
                submitText={submitText}
                onSubmit={onAdvanceToFields}
                showForgotPassword={showForgotPassword}
                onBack={null}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Additional Fields (exact mirror of real LoginPortal AdditionalFieldsFlow) ──
const AdditionalFieldsPreviewFlow = ({
  signupFields, primary, textColor, btnTextColor, buttonStyle, inputStyle, inputBorderColor,
  borderRadius, isCardLight, onBack
}) => {
  const [formData, setFormData] = useState({});

  const handleChange = (name, val) => {
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  if (!signupFields || signupFields.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className='text-center space-y-3 py-6'>
        <div className='w-12 h-12 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400'>
          <UserPlus2 size={24} />
        </div>
        <p className='font-semibold text-xs' style={{ color: textColor }}>No custom signup fields configured</p>
        <p className='text-xs leading-relaxed max-w-[240px] mx-auto' style={{ color: `${textColor}60` }}>
          Add custom fields in the <strong style={{ color: textColor }}>Fields</strong> tab to require extra information on signup.
        </p>
        {onBack && (
          <button
            type='button'
            onClick={onBack}
            className='text-xs transition-colors hover:underline pt-2 font-medium'
            style={{ color: `${textColor}80` }}
          >
            ← Back to signup options
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className='space-y-3'>
      <p className='text-xs text-center mb-4' style={{ color: `${textColor}80`, fontSize: 'var(--card-subtitle-size, 12px)' }}>
        Just a few more details to complete your registration...
      </p>

      {signupFields.map(f => {
        const fieldName = f.name || f.id;
        const fieldLabel = f.label || f.name || 'Field';
        const isRequired = !!f.required;

        if (f.type === 'boolean') {
          return (
            <label
              key={fieldName}
              className='flex items-center gap-3 p-3 border cursor-pointer select-none transition-all'
              style={{
                borderColor: inputBorderColor || (isCardLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)'),
                backgroundColor: isCardLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                borderRadius,
              }}
            >
              <input
                type="checkbox"
                name={fieldName}
                checked={!!formData[fieldName]}
                onChange={(e) => handleChange(fieldName, e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
              />
              <span className="text-xs font-medium" style={{ color: textColor, fontSize: 'var(--card-input-size, 14px)' }}>
                {fieldLabel} {isRequired && <span className="text-red-400">*</span>}
              </span>
            </label>
          );
        }

        return (
          <FInput
            key={fieldName}
            label={`${fieldLabel} ${isRequired ? '*' : ''}`}
            name={fieldName}
            type={f.type || 'text'}
            placeholder={f.placeholder || `Enter ${fieldLabel.toLowerCase()}`}
            textColor={textColor}
            inputStyle={inputStyle}
            inputBorderColor={inputBorderColor}
            borderRadius={borderRadius}
            isCardLight={isCardLight}
            value={formData[fieldName] || ''}
            onChange={(e) => handleChange(fieldName, e.target.value)}
          />
        );
      })}

      <div className='pt-2'>
        <FButton primary={primary} textColor={textColor} btnTextColor={btnTextColor} buttonStyle={buttonStyle} borderRadius={borderRadius}>
          Create Account
        </FButton>
      </div>

      {onBack && (
        <button
          type='button'
          onClick={onBack}
          className='w-full text-xs transition-colors mt-2 text-center hover:underline'
          style={{ color: `${textColor}60`, fontSize: 'var(--card-footer-size, 12px)' }}
        >
          ← Back to signup options
        </button>
      )}
    </motion.div>
  );
};

// ─── Signup flow (exact mirror of real LoginPortal signup architecture) ──────
const SignupFlow = ({
  enabledMethods, signupFields, primary, textColor, btnTextColor, linkColor,
  buttonStyle, inputStyle, inputBorderColor, borderRadius, socialLayout,
  providerBgColor, providerTextColor, isCardLight, activeTab
}) => {
  const [signupStep, setSignupStep] = useState('options'); // 'options' | 'fields'

  // Auto-switch to custom fields preview when developer is on the 'Fields' configuration tab
  useEffect(() => {
    if (activeTab === 'fields') {
      setSignupStep('fields');
    } else {
      setSignupStep('options');
    }
  }, [activeTab]);

  return (
    <div className='space-y-3'>
      {/* Sleek Step Switcher when custom fields exist */}
      {signupFields && signupFields.length > 0 && (
        <div className='flex items-center justify-center gap-1.5 pb-1'>
          <button
            type='button'
            onClick={() => setSignupStep('options')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all border ${
              signupStep === 'options'
                ? 'bg-blue-500/15 text-blue-400 border-blue-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/5'
            }`}
          >
            1. Auth Options
          </button>
          <span className='text-[10px] opacity-30'>•</span>
          <button
            type='button'
            onClick={() => setSignupStep('fields')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all border ${
              signupStep === 'fields'
                ? 'bg-blue-500/15 text-blue-400 border-blue-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/5'
            }`}
          >
            2. Custom Fields ({signupFields.length})
          </button>
        </div>
      )}

      <AnimatePresence mode='wait'>
        {signupStep === 'fields' ? (
          <AdditionalFieldsPreviewFlow
            key='signup-fields'
            signupFields={signupFields}
            primary={primary}
            textColor={textColor}
            btnTextColor={btnTextColor}
            buttonStyle={buttonStyle}
            inputStyle={inputStyle}
            inputBorderColor={inputBorderColor}
            borderRadius={borderRadius}
            isCardLight={isCardLight}
            onBack={() => setSignupStep('options')}
          />
        ) : (
          <ProviderSelectionFlow
            key='signup-options'
            enabledMethods={enabledMethods}
            socialLayout={socialLayout}
            textColor={textColor}
            btnTextColor={btnTextColor}
            linkColor={linkColor}
            borderRadius={borderRadius}
            primary={primary}
            buttonStyle={buttonStyle}
            inputStyle={inputStyle}
            inputBorderColor={inputBorderColor}
            showForgotPassword={false}
            submitText='Create Account'
            providerBgColor={providerBgColor}
            providerTextColor={providerTextColor}
            isCardLight={isCardLight}
            onAdvanceToFields={signupFields && signupFields.length > 0 ? () => setSignupStep('fields') : null}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main LivePreview ─────────────────────────────────────────────────────────
export const LivePreview = ({ activeTab }) => {
  const { uiConfig, authMethods, signupFields, activeMode, forgotPasswordEnabled } = useAuthConfigStore();
  const {
    screen_bg_color, login_card_bg_color, primary_color, text_color, btn_text_color, link_color, brand_name, brand_logo,
    brand_text_color, secondary_text_color, provider_bg_color, provider_text_color,
    font_family, font_size, border_radius, shadow_intensity, blur_amount, border_width, border_color,
    card_variant, button_style, input_style, input_border_color, logo_position, social_layout,
    bg_type, bg_pattern, gradient_start, gradient_mid, gradient_end, gradient_direction,
    card_bg_type, card_bg_pattern, card_gradient_start, card_gradient_mid, card_gradient_end, card_gradient_direction,
    custom_css,
  } = uiConfig;

  // Dynamically load Google Fonts
  useEffect(() => {
    if (!font_family || font_family === 'system') return;
    const id = `gfont-${font_family}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${font_family}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);
  }, [font_family]);

  // Typography Scaling & Font Family
  const typo = TYPOGRAPHY_SCALE[font_size] || TYPOGRAPHY_SCALE.md;
  const fontFamilyStr = FONT_MAP[font_family] ?? FONT_MAP.system;

  // Shape & Radii
  const cardRadius   = RADIUS_MAP[border_radius] ?? RADIUS_MAP.rounded;
  const btnRadius    = RADIUS_MAP[border_radius] ?? RADIUS_MAP.rounded;
  const cardShadow   = SHADOW_MAP(primary_color)[shadow_intensity] ?? SHADOW_MAP(primary_color).md;

  // Global Background style & adaptive pattern color
  const isGlobalGradient = bg_type === 'gradient' || bg_pattern === 'gradient';
  const bgStyle = isGlobalGradient
    ? { background: `linear-gradient(${gradient_direction || '135deg'}, ${gradient_start || '#0f172a'}, ${gradient_mid ? gradient_mid + ', ' : ''}${gradient_end || '#1e1b4b'})` }
    : { backgroundColor: screen_bg_color || '#f9fafb' };

  const activeScreenBg = isGlobalGradient ? (gradient_start || '#0f172a') : (screen_bg_color || '#f9fafb');
  const screenIsLight = isLightColor(activeScreenBg);
  const bgDotColor = screenIsLight ? 'rgba(15, 23, 42, 0.18)' : 'rgba(255, 255, 255, 0.15)';
  const bgLineColor = screenIsLight ? 'rgba(15, 23, 42, 0.10)' : 'rgba(255, 255, 255, 0.08)';

  // Card Background calculation & blur translucency
  const isCardGradient = card_bg_type === 'gradient';
  const rawCardBg = isCardGradient
    ? `linear-gradient(${card_gradient_direction || '135deg'}, ${card_gradient_start || '#ffffff'}, ${card_gradient_mid ? card_gradient_mid + ', ' : ''}${card_gradient_end || '#f1f5f9'})`
    : (login_card_bg_color || '#ffffff');

  const isCardLight = isLightColor(login_card_bg_color || '#ffffff');

  // Border calculation
  const effectiveBorderWidth = border_width !== undefined && border_width !== null ? Number(border_width) : 1;
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

  // Logo alignment
  const logoAlign = {
    left:   'items-start text-left',
    center: 'items-center text-center',
    right:  'items-end text-right',
  }[logo_position] || 'items-center text-center';

  const enabledMethods = authMethods.filter(m => m.enabled);

  const sharedFormProps = {
    primary: primary_color, textColor: text_color, btnTextColor: btn_text_color,
    buttonStyle: button_style, inputStyle: input_style,
    inputBorderColor: input_border_color, borderRadius: btnRadius,
    providerBgColor: provider_bg_color, providerTextColor: provider_text_color,
    isCardLight,
  };

  return (
    <div
      className='w-full h-full flex flex-col items-center overflow-y-auto overflow-x-hidden relative py-10 px-4 custom-scrollbar'
      style={bgStyle}
    >
      {/* Background pattern overlay */}
      {bg_pattern === 'dots' && (
        <div className='absolute inset-0 pointer-events-none'
          style={{ backgroundImage: `radial-gradient(circle, ${bgDotColor} 1.5px, transparent 1.5px)`, backgroundSize: '24px 24px' }} />
      )}
      {bg_pattern === 'diagonal' && (
        <div className='absolute inset-0 pointer-events-none'
          style={{ backgroundImage: `repeating-linear-gradient(45deg, ${bgLineColor} 0px, ${bgLineColor} 1px, transparent 1px, transparent 12px)` }} />
      )}

      {/* Ambient glow */}
      <div
        className='absolute w-48 h-48 rounded-full pointer-events-none opacity-15 blur-3xl'
        style={{ backgroundColor: primary_color, top: '5%', left: '50%', transform: 'translateX(-50%)' }}
      />

      <motion.div
        key={activeMode}
        initial={false}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className='relative w-full mx-auto my-auto p-8 z-10 shrink-0'
        style={{
          maxWidth: '384px',
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

        {/* Custom CSS injection */}
        {custom_css && <style>{custom_css}</style>}

        {/* Brand */}
        <div className={`relative flex flex-col mb-6 ${logoAlign}`}>
          {brand_logo ? (
            <img src={brand_logo} alt='logo' className='h-12 mb-3 object-contain rounded-xl' />
          ) : (
            <div
              className='w-12 h-12 flex items-center justify-center mb-3 text-2xl font-bold'
              style={{ backgroundColor: `${primary_color}22`, border: `1px solid ${primary_color}33`, borderRadius: cardRadius, color: primary_color }}
            >
              {brand_name?.[0] || '✦'}
            </div>
          )}
          <h1 className='font-bold tracking-tight' style={{ color: brand_text_color || text_color, fontSize: 'var(--card-title-size, 1.25rem)' }}>
            {brand_name || 'Your Brand'}
          </h1>
          <p className='mt-1.5' style={{ color: secondary_text_color || `${text_color}60`, fontSize: 'var(--card-subtitle-size, 0.75rem)' }}>
            {activeMode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Form content */}
        <div className='relative z-10'>
          {activeMode === 'signup' ? (
            <SignupFlow
              enabledMethods={enabledMethods}
              signupFields={signupFields}
              socialLayout={social_layout}
              activeTab={activeTab}
              {...sharedFormProps}
            />
          ) : (
            <ProviderSelectionFlow
              enabledMethods={enabledMethods}
              socialLayout={social_layout}
              showForgotPassword={forgotPasswordEnabled}
              submitText='Sign In'
              {...sharedFormProps}
            />
          )}

          {/* Sign in / Sign up switcher */}
          <p className='text-center mt-5' style={{ color: secondary_text_color || `${text_color}60`, fontSize: 'var(--card-footer-size, 0.75rem)' }}>
            {activeMode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <span
              onClick={() => useAuthConfigStore.getState().setActiveMode(activeMode === 'signin' ? 'signup' : 'signin')}
              className='cursor-pointer hover:underline font-bold transition-colors'
              style={{ color: link_color || '#3b82f6' }}
            >
              {activeMode === 'signin' ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
