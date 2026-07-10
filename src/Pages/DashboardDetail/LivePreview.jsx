import { useState, useEffect } from 'react';
import { useAuthConfigStore } from '../../Store/useAuthConfigStore';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';
import { BsMicrosoft } from 'react-icons/bs';
import { MdOutlineSms } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { Eye, EyeOff, Check } from 'lucide-react';

const PROVIDER_META = {
  password:  { icon: <RiLockPasswordLine />, label: 'Password',  color: '#22d3ee'  },
  google:    { icon: <FaGoogle   />,         label: 'Google',    color: '#ea4335'  },
  github:    { icon: <FaGithub   />,         label: 'GitHub',    color: '#e2e8f0'  },
  facebook:  { icon: <FaFacebook />,         label: 'Facebook',  color: '#1877f2'  },
  microsoft: { icon: <BsMicrosoft />,        label: 'Microsoft', color: '#00a4ef'  },
  email_otp:  { icon: <MdOutlineSms />,       label: 'Email OTP',       color: '#22c55e'  },
  mobile_otp: { icon: <MdOutlineSms />,       label: 'Mobile OTP',      color: '#06b6d4'  },
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

// ─── Shared fake input (read-only) ────────────────────────────────────────────
const FInput = ({ label, type = 'text', placeholder, textColor, inputStyle, inputBorderColor, borderRadius }) => {
  const [show, setShow] = useState(false);
  const isPass = type === 'password';
  const isFilled = inputStyle === 'filled';
  return (
    <div className='space-y-1.5 text-left'>
      {label && (
        <label className='text-[11px] font-bold uppercase tracking-wider block' style={{ color: `${textColor}70` }}>{label}</label>
      )}
      <div className='relative'>
        <input
          type={isPass && !show ? 'password' : 'text'}
          placeholder={placeholder || label}
          readOnly
          className='w-full px-3 py-2.5 text-sm outline-none border transition-all duration-300'
          style={{
            borderRadius,
            backgroundColor: isFilled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
            borderColor: inputBorderColor || 'rgba(255,255,255,0.1)',
            color: textColor,
          }}
        />
        {isPass && (
          <button onClick={() => setShow(v => !v)} className='absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-indigo-400 transition-colors'>
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Shared styled button ─────────────────────────────────────────────────────
const FButton = ({ children, primary, textColor, btnTextColor, buttonStyle, borderRadius, onClick }) => {
  const styles = {
    filled:   { backgroundColor: primary, color: btnTextColor || textColor, border: 'none', boxShadow: `0 10px 25px -5px ${primary}40` },
    outlined: { backgroundColor: 'transparent', color: primary, border: `2px solid ${primary}` },
    ghost:    { backgroundColor: 'transparent', color: primary, border: 'none', textDecoration: 'underline', textUnderlineOffset: '4px', fontWeight: 'bold' },
  };
  return (
    <button
      onClick={onClick}
      className='w-full py-2.5 font-bold text-sm active:scale-[0.98] transition-all relative overflow-hidden group/btn'
      style={{ borderRadius, ...(styles[buttonStyle] || styles.filled) }}
    >
      <span className='relative z-10'>{children}</span>
      {buttonStyle === 'filled' && <div className='absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity' />}
    </button>
  );
};

// ─── Password form (for when password is the ONLY or first method) ────────────
const PasswordForm = ({ primary, textColor, btnTextColor, buttonStyle, inputStyle, inputBorderColor, borderRadius, showForgotPassword, onBack }) => (
  <motion.div key='pwd-form' initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className='space-y-3'>
    <FInput label='Email Address' type='email' placeholder='you@example.com' textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius} />
    <FInput label='Password' type='password' placeholder='••••••••' textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius} />
    <FButton primary={primary} textColor={textColor} btnTextColor={btnTextColor} buttonStyle={buttonStyle} borderRadius={borderRadius}>Sign In</FButton>
    {showForgotPassword && (
      <p className='text-center text-xs pt-1 cursor-pointer hover:underline' style={{ color: '#ef4444' }}>Forgot password?</p>
    )}
    {onBack && (
      <button onClick={onBack} className='w-full text-xs transition-colors mt-1' style={{ color: `${textColor}60` }}>← Back to options</button>
    )}
  </motion.div>
);

// ─── OTP form ────────────────────────────────────────────────────────────────
const OTPForm = ({ primary, textColor, btnTextColor, buttonStyle, inputStyle, inputBorderColor, borderRadius, onBack, mode = 'email' }) => {
  const [step, setStep] = useState(0);
  return (
    <AnimatePresence mode='wait'>
      {step === 0 ? (
        <motion.div key='otp-email' initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className='space-y-3'>
          <FInput 
            label={mode === 'email' ? 'Email Address' : 'Mobile Number'} 
            type={mode === 'email' ? 'email' : 'text'} 
            placeholder={mode === 'email' ? 'you@example.com' : '+919876543210'} 
            textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius} 
          />
          <FButton primary={primary} textColor={textColor} btnTextColor={btnTextColor} buttonStyle={buttonStyle} borderRadius={borderRadius} onClick={() => setStep(1)}>Send OTP</FButton>
          {onBack && <button onClick={onBack} className='w-full text-xs transition-colors' style={{ color: `${textColor}60` }}>← Back to options</button>}
        </motion.div>
      ) : (
        <motion.div key='otp-code' initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className='space-y-3'>
          <p className='text-xs text-center' style={{ color: `${textColor}60` }}>
            Enter the 6-digit code sent to your {mode === 'email' ? 'email' : 'mobile number'}
          </p>
          <div className='flex gap-1 justify-center'>
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className='w-8 h-9 flex items-center justify-center text-sm font-mono border'
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: `${textColor}50`, borderRadius }}>_</div>
            ))}
          </div>
          <FButton primary={primary} textColor={textColor} btnTextColor={btnTextColor} buttonStyle={buttonStyle} borderRadius={borderRadius}>Verify OTP</FButton>
          <button onClick={() => setStep(0)} className='w-full text-xs transition-colors' style={{ color: `${textColor}60` }}>← Back</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Social provider button (list layout) ────────────────────────────────────
const SocialBtn = ({ method, textColor, borderRadius }) => (
  <button
    className='w-full flex items-center justify-center gap-2 border py-2.5 text-sm font-bold hover:bg-white/5 transition-all group/social'
    style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: textColor, borderRadius }}
  >
    <span className='text-base transition-transform group-hover/social:scale-110' style={{ color: PROVIDER_META[method.id]?.color }}>
      {PROVIDER_META[method.id]?.icon}
    </span>
    <span>Continue with {PROVIDER_META[method.id]?.label}</span>
  </button>
);

// ─── Social icon grid ─────────────────────────────────────────────────────────
const SocialGrid = ({ methods, textColor, borderRadius }) => (
  <div className='flex justify-center gap-2.5 flex-wrap'>
    {methods.map(m => (
      <div
        key={m.id}
        title={PROVIDER_META[m.id]?.label}
        className='w-12 h-12 border flex items-center justify-center text-xl cursor-pointer hover:opacity-80 transition-all group/soc'
        style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: PROVIDER_META[m.id]?.color, borderRadius }}
      >
        <span className='group-hover/soc:scale-110 transition-transform'>{PROVIDER_META[m.id]?.icon}</span>
      </div>
    ))}
  </div>
);

// ─── Provider selection flow (exact match of real LoginPortal) ────────────────
const ProviderSelectionFlow = ({ enabledMethods, socialLayout, textColor, btnTextColor, linkColor, borderRadius, primary, buttonStyle, inputStyle, inputBorderColor, showForgotPassword }) => {
  const [step, setStep] = useState('select'); // 'select' | 'password' | 'email_otp' | 'mobile_otp'

  const socialMethods = enabledMethods.filter(m => m.id !== 'password' && m.id !== 'email_otp' && m.id !== 'mobile_otp' && m.id !== 'otp');
  const hasPassword = enabledMethods.some(m => m.id === 'password');
  const hasEmailOTP = enabledMethods.some(m => m.id === 'email_otp' || m.id === 'otp');
  const hasMobileOTP = enabledMethods.some(m => m.id === 'mobile_otp');
  const sharedProps = { primary, textColor, btnTextColor, linkColor, buttonStyle, inputStyle, inputBorderColor, borderRadius };

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
          showForgotPassword={showForgotPassword}
          onBack={enabledMethods.length > 1 ? () => setStep('select') : null}
        />
      ) : step === 'email_otp' ? (
        <OTPForm
          key='email_otp'
          mode='email'
          {...sharedProps}
          onBack={enabledMethods.length > 1 ? () => setStep('select') : null}
        />
      ) : step === 'mobile_otp' ? (
        <OTPForm
          key='mobile_otp'
          mode='mobile'
          {...sharedProps}
          onBack={enabledMethods.length > 1 ? () => setStep('select') : null}
        />
      ) : (
        <motion.div key='select' initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className='space-y-2.5'>
          {/* Social providers */}
          {socialMethods.length > 0 && (
            socialLayout === 'grid'
              ? <SocialGrid methods={socialMethods} textColor={textColor} borderRadius={borderRadius} />
              : socialMethods.map(m => <SocialBtn key={m.id} method={m} textColor={textColor} borderRadius={borderRadius} />)
          )}
          {/* Divider if social AND password/otp */}
          {socialMethods.length > 0 && (hasPassword || hasEmailOTP || hasMobileOTP) && (
            <div className='relative flex items-center justify-center py-1'>
              <div className='absolute inset-0 flex items-center'><div className='w-full border-t' style={{ borderColor: `${textColor}15` }} /></div>
              <span className='relative px-3 text-xs' style={{ color: `${textColor}40` }}>or continue with</span>
            </div>
          )}
          {/* Email/Mobile OTP buttons */}
          {hasEmailOTP && hasMobileOTP ? (
            <div className='space-y-2'>
              <p className='text-xs font-bold text-center uppercase tracking-wider' style={{ color: `${textColor}50` }}>
                Continue with OTP
              </p>
              <div className='flex gap-2'>
                <button onClick={() => setStep('email_otp')} className='flex-1 flex items-center justify-center gap-2 border py-2.5 text-xs font-bold hover:opacity-80 transition-all'
                  style={{ backgroundColor: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)', color: btnTextColor || textColor, borderRadius }}>
                  <span className='text-green-400 text-sm'><MdOutlineSms /></span>
                  Email
                </button>
                <button onClick={() => setStep('mobile_otp')} className='flex-1 flex items-center justify-center gap-2 border py-2.5 text-xs font-bold hover:opacity-80 transition-all'
                  style={{ backgroundColor: 'rgba(6,182,212,0.08)', borderColor: 'rgba(6,182,212,0.2)', color: btnTextColor || textColor, borderRadius }}>
                  <span className='text-cyan-400 text-sm'><MdOutlineSms /></span>
                  Mobile
                </button>
              </div>
            </div>
          ) : hasEmailOTP ? (
            <button onClick={() => setStep('email_otp')} className='w-full flex items-center justify-center gap-2.5 border py-3 text-sm font-bold hover:opacity-80 transition-all'
              style={{ backgroundColor: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)', color: btnTextColor || textColor, borderRadius }}>
              <span className='text-green-400 text-lg'><MdOutlineSms /></span>
              Continue with OTP
            </button>
          ) : hasMobileOTP ? (
            <button onClick={() => setStep('mobile_otp')} className='w-full flex items-center justify-center gap-2.5 border py-3 text-sm font-bold hover:opacity-80 transition-all'
              style={{ backgroundColor: 'rgba(6,182,212,0.08)', borderColor: 'rgba(6,182,212,0.2)', color: btnTextColor || textColor, borderRadius }}>
              <span className='text-cyan-400 text-lg'><MdOutlineSms /></span>
              Continue with OTP
            </button>
          ) : null}
          {/* Password button */}
          {hasPassword && (
            <button
              onClick={() => setStep('password')}
              className='w-full flex items-center justify-center gap-2.5 border py-3 text-sm font-bold hover:opacity-80 transition-all'
              style={{ backgroundColor: 'rgba(59,130,246,0.08)', borderColor: 'rgba(59,130,246,0.2)', color: btnTextColor || textColor, borderRadius }}
            >
              <span className='text-blue-400 text-lg'><RiLockPasswordLine /></span>
              Continue with Password
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Signup flow ──────────────────────────────────────────────────────────────
const SignupFlow = ({ enabledMethods, signupFields, primary, textColor, buttonStyle, inputStyle, inputBorderColor, borderRadius, socialLayout }) => {
  const [authDone, setAuthDone] = useState(false);
  const [step, setStep] = useState(0);
  const perPage = 4;
  const totalSteps = Math.max(1, Math.ceil(signupFields.length / perPage));
  const visibleFields = signupFields.slice(step * perPage, (step + 1) * perPage);
  const isLastStep = step === totalSteps - 1;

  const hasPwd = enabledMethods.some(m => m.id === 'password');
  const hasEmailOTP = enabledMethods.some(m => m.id === 'email_otp' || m.id === 'otp');
  const hasMobileOTP = enabledMethods.some(m => m.id === 'mobile_otp');
  const socialMethods = enabledMethods.filter(m => m.id !== 'password' && m.id !== 'email_otp' && m.id !== 'mobile_otp' && m.id !== 'otp');
  const sharedProps = { primary, textColor, buttonStyle, inputStyle, inputBorderColor, borderRadius };

  if (!authDone) {
    return (
      <div className='space-y-2.5'>
        {hasPwd && (
          <>
            <FInput label='Email' type='email' placeholder='you@example.com' {...sharedProps} />
            <FInput label='Password' type='password' placeholder='Create a password' {...sharedProps} />
            <FButton {...sharedProps} onClick={() => setAuthDone(true)}>Continue with Password</FButton>
          </>
        )}
        {(socialMethods.length > 0 || hasEmailOTP || hasMobileOTP) && (
          <>
            {hasPwd && (
              <div className='relative flex items-center justify-center py-1'>
                <div className='absolute inset-0 flex items-center'><div className='w-full border-t' style={{ borderColor: `${textColor}15` }} /></div>
                <span className='relative px-3 text-xs' style={{ color: `${textColor}40` }}>or sign up with</span>
              </div>
            )}
            {socialMethods.length > 0 && (
              socialLayout === 'grid'
                ? <SocialGrid methods={socialMethods} textColor={textColor} borderRadius={borderRadius} />
                : socialMethods.map(m => <SocialBtn key={m.id} method={m} textColor={textColor} borderRadius={borderRadius} />)
            )}
            {hasEmailOTP && hasMobileOTP ? (
              <div className='space-y-1.5 w-full'>
                <p className='text-[10px] font-bold text-center uppercase tracking-wider' style={{ color: `${textColor}40` }}>
                  Sign up with OTP
                </p>
                <div className='flex gap-2'>
                  <button onClick={() => setAuthDone(true)} className='flex-1 flex items-center justify-center gap-2 border py-2.5 text-xs font-bold hover:opacity-80 transition-all'
                    style={{ backgroundColor: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)', color: textColor, borderRadius }}>
                    <span className='text-green-400 text-sm'><MdOutlineSms /></span>
                    Email
                  </button>
                  <button onClick={() => setAuthDone(true)} className='flex-1 flex items-center justify-center gap-2 border py-2.5 text-xs font-bold hover:opacity-80 transition-all'
                    style={{ backgroundColor: 'rgba(6,182,212,0.08)', borderColor: 'rgba(6,182,212,0.2)', color: textColor, borderRadius }}>
                    <span className='text-cyan-400 text-sm'><MdOutlineSms /></span>
                    Mobile
                  </button>
                </div>
              </div>
            ) : hasEmailOTP ? (
              <button onClick={() => setAuthDone(true)} className='w-full flex items-center justify-center gap-2.5 border py-2.5 text-sm font-bold hover:opacity-80 transition-all'
                style={{ backgroundColor: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)', color: textColor, borderRadius }}>
                <span className='text-green-400'><MdOutlineSms /></span>
                Continue with OTP
              </button>
            ) : hasMobileOTP ? (
              <button onClick={() => setAuthDone(true)} className='w-full flex items-center justify-center gap-2.5 border py-2.5 text-sm font-bold hover:opacity-80 transition-all'
                style={{ backgroundColor: 'rgba(6,182,212,0.08)', borderColor: 'rgba(6,182,212,0.2)', color: textColor, borderRadius }}>
                <span className='text-cyan-400'><MdOutlineSms /></span>
                Continue with OTP
              </button>
            ) : null}
          </>
        )}
      </div>
    );
  }

  if (signupFields.length === 0) {
    return (
      <div className='text-center space-y-3 py-4'>
        <div className='w-12 h-12 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center'>
          <span className='text-green-400 text-2xl'>✓</span>
        </div>
        <p className='text-sm' style={{ color: textColor }}>Almost done! Click below to complete.</p>
        <FButton {...sharedProps}>Create Account</FButton>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      <p className='text-xs text-center mb-2' style={{ color: `${textColor}50` }}>Just a few more details…</p>
      <AnimatePresence mode='wait'>
        <motion.div key={step} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className='space-y-3'>
          {visibleFields.map(f => <FInput key={f.id} label={f.label} type={f.type} {...sharedProps} />)}
        </motion.div>
      </AnimatePresence>
      <div className='flex gap-2 pt-1'>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className='px-4 py-2.5 text-sm font-medium border transition-colors'
            style={{ borderRadius, borderColor: `${textColor}20`, color: `${textColor}70`, backgroundColor: 'transparent' }}>Back</button>
        )}
        <FButton {...sharedProps} onClick={() => !isLastStep && setStep(s => s + 1)}>
          {isLastStep ? 'Create Account' : 'Next'}
        </FButton>
      </div>
      {totalSteps > 1 && (
        <div className='flex justify-center gap-1.5'>
          {Array(totalSteps).fill(0).map((_, i) => (
            <div key={i} className='w-1.5 h-1.5 rounded-full transition-all' style={{ backgroundColor: i === step ? primary : `${textColor}20` }} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main LivePreview ─────────────────────────────────────────────────────────
export const LivePreview = () => {
  const { uiConfig, authMethods, signupFields, activeMode, forgotPasswordEnabled } = useAuthConfigStore();
  const {
    screen_bg_color, login_card_bg_color, primary_color, text_color, btn_text_color, link_color, brand_name, brand_logo,
    font_family, font_size, border_radius, shadow_intensity, blur_amount, border_width, border_color,
    button_style, input_style, input_border_color, logo_position, social_layout,
    bg_pattern, gradient_start, gradient_end, gradient_direction, custom_css,
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

  // Derived values
  const cardRadius   = RADIUS_MAP[border_radius] ?? RADIUS_MAP.rounded;
  const btnRadius    = RADIUS_MAP[border_radius] ?? RADIUS_MAP.rounded;
  const cardShadow   = SHADOW_MAP(primary_color)[shadow_intensity] ?? SHADOW_MAP(primary_color).md;
  const fontFamilyStr = FONT_MAP[font_family] ?? FONT_MAP.system;
  const fontSizeStr  = FONT_SIZE_MAP[font_size] ?? FONT_SIZE_MAP.md;

  // Background style
  const bgStyle = bg_pattern === 'gradient'
    ? { background: `linear-gradient(${gradient_direction}, ${gradient_start}, ${gradient_end})` }
    : { backgroundColor: screen_bg_color };

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
  };

  return (
    <div
      className='w-full h-full flex items-start justify-center overflow-y-auto relative transition-all duration-500 py-8'
      style={bgStyle}
    >
      {/* Background pattern overlay */}
      {bg_pattern === 'dots' && (
        <div className='absolute inset-0 pointer-events-none'
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      )}
      {bg_pattern === 'diagonal' && (
        <div className='absolute inset-0 pointer-events-none'
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)' }} />
      )}

      {/* Ambient glow — smaller so it fits inside the preview panel */}
      <div
        className='absolute w-48 h-48 rounded-full pointer-events-none opacity-15 blur-3xl'
        style={{ backgroundColor: primary_color, top: '5%', left: '50%', transform: 'translateX(-50%)' }}
      />

      <motion.div
        key={`${activeMode}-${login_card_bg_color}-${primary_color}-${border_radius}`}
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className='relative w-full mx-4 p-6 z-10 flex-shrink-0'
        style={{
          maxWidth: '320px',
          backgroundColor: login_card_bg_color,
          backdropFilter: `blur(${Math.min(blur_amount, 20)}px)`,
          WebkitBackdropFilter: `blur(${Math.min(blur_amount, 20)}px)`,
          border: `${border_width}px solid ${border_color}`,
          borderRadius: cardRadius,
          boxShadow: shadow_intensity === 'none' ? 'none' : `0 20px 40px rgba(0,0,0,0.4), 0 0 20px ${primary_color}18`,
          fontFamily: fontFamilyStr,
          fontSize: fontSizeStr,
        }}
      >
        {/* Custom CSS injection */}
        {custom_css && <style>{custom_css}</style>}

        {/* Brand */}
        <div className={`flex flex-col mb-4 ${logoAlign}`}>
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
          <h1 className='font-bold text-xl tracking-tight' style={{ color: text_color }}>
            {brand_name || 'Your Brand'}
          </h1>
          <p className='text-xs mt-1.5' style={{ color: `${text_color}50` }}>
            {activeMode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Form content — exact match of real login page */}
        {activeMode === 'signup' ? (
          <SignupFlow
            enabledMethods={enabledMethods}
            signupFields={signupFields}
            socialLayout={social_layout}
            {...sharedFormProps}
          />
        ) : (
          <ProviderSelectionFlow
            enabledMethods={enabledMethods}
            socialLayout={social_layout}
            showForgotPassword={forgotPasswordEnabled}
            {...sharedFormProps}
          />
        )}

        {/* Sign in / Sign up switcher */}
        <p className='text-center text-xs mt-4' style={{ color: `${text_color}30` }}>
          {activeMode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <span className='cursor-pointer hover:underline' style={{ color: link_color || '#3b82f6' }}>
            {activeMode === 'signin' ? 'Sign up' : 'Sign in'}
          </span>
        </p>
      </motion.div>
    </div>
  );
};
