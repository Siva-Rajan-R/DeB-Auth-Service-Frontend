import { useState, useEffect } from 'react';
import { useAuthConfigStore } from '../../Store/useAuthConfigStore';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';
import { BsMicrosoft } from 'react-icons/bs';
import { MdOutlineSms } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { Eye, EyeOff } from 'lucide-react';

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

// ─── Shared fake input ────────────────────────────────────────────────────────
const FInput = ({ label, type = 'text', placeholder, textColor, inputStyle, inputBorderColor, borderRadius }) => {
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
          type={isPass && !show ? 'password' : 'text'}
          placeholder={placeholder || label}
          readOnly
          className='w-full px-4 py-3 text-sm outline-none border transition-all duration-300'
          style={{
            borderRadius,
            backgroundColor: isFilled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
            borderColor: inputBorderColor || 'rgba(255,255,255,0.1)',
            color: `${textColor}`,
          }}
        />
        {isPass && (
          <button onClick={() => setShow((v) => !v)} className='absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-indigo-400 transition-colors'>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Shared styled button ─────────────────────────────────────────────────────
const FButton = ({ children, primary, textColor, buttonStyle, borderRadius, onClick }) => {
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
      className='w-full py-3 font-bold text-sm active:scale-[0.98] transition-all relative overflow-hidden group/btn'
      style={{ borderRadius, ...(styles[buttonStyle] || styles.filled) }}
    >
      <span className='relative z-10'>{children}</span>
      {buttonStyle === 'filled' && (
        <div className='absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity' />
      )}
    </button>
  );
};

// ─── Social button — list variant ────────────────────────────────────────────
const SocialButton = ({ method, textColor, borderRadius, onClick }) => (
  <button
    onClick={onClick}
    className='w-full flex items-center justify-center gap-3 border py-3 text-sm font-bold hover:bg-white/5 transition-all group/social'
    style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: textColor, borderRadius }}
  >
    <span className='text-lg transition-transform group-hover/social:scale-110' style={{ color: PROVIDER_META[method.id]?.color }}>
      {PROVIDER_META[method.id]?.icon}
    </span>
    <span>Continue with {PROVIDER_META[method.id]?.label}</span>
  </button>
);

// ─── Social button — grid variant ────────────────────────────────────────────
const SocialIcon = ({ method, textColor, borderRadius }) => (
  <div
    title={PROVIDER_META[method.id]?.label}
    className='w-14 h-14 border flex items-center justify-center text-2xl cursor-pointer hover:opacity-80 transition-all group/soc shadow-sm'
    style={{ backgroundColor: 'transparent', borderColor: `${textColor}20`, color: PROVIDER_META[method.id]?.color, borderRadius }}
  >
    <span className='group-hover/soc:scale-110 transition-transform'>{PROVIDER_META[method.id]?.icon}</span>
  </div>
);

// ─── Social button — compact variant ─────────────────────────────────────────
const SocialCompact = ({ method, textColor }) => (
  <div
    title={PROVIDER_META[method.id]?.label}
    className='w-10 h-10 border flex items-center justify-center text-base cursor-pointer hover:opacity-80 transition-all rounded-xl group/soc shadow-sm'
    style={{ backgroundColor: 'transparent', borderColor: `${textColor}20`, color: PROVIDER_META[method.id]?.color }}
  >
    <span className='group-hover/soc:scale-110 transition-transform'>{PROVIDER_META[method.id]?.icon}</span>
  </div>
);

// ─── Render social methods based on layout preference ────────────────────────
const SocialMethods = ({ methods, socialLayout, textColor, borderRadius, onSelect }) => {
  if (!methods.length) return null;
  
  // Auto-switch to grid if there are 2 or more methods
  const effectiveLayout = methods.length >= 2 ? 'grid' : socialLayout;

  if (effectiveLayout === 'grid') {
    return (
      <div className='flex justify-center gap-2.5 flex-wrap'>
        {methods.map((m) => <SocialIcon key={m.id} method={m} textColor={textColor} borderRadius={borderRadius} />)}
      </div>
    );
  }
  if (effectiveLayout === 'compact') {
    return (
      <div className='flex justify-center gap-2'>
        {methods.map((m) => <SocialCompact key={m.id} method={m} textColor={textColor} />)}
      </div>
    );
  }
  // list (default)
  return (
    <div className='space-y-2'>
      {methods.map((m) => (
        <SocialButton key={m.id} method={m} textColor={textColor} borderRadius={borderRadius} onClick={onSelect} />
      ))}
    </div>
  );
};

// ─── OTP flow ─────────────────────────────────────────────────────────────────
const OTPFlow = ({ primary, textColor, buttonStyle, inputStyle, inputBorderColor, borderRadius }) => {
  const [step, setStep] = useState(0);
  return (
    <AnimatePresence mode='wait'>
      {step === 0 ? (
        <motion.div key='otp-email' initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className='space-y-3'>
          <FInput label='Email Address' type='email' placeholder='you@example.com' textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius} />
          <FButton primary={primary} textColor={textColor} buttonStyle={buttonStyle} borderRadius={borderRadius} onClick={() => setStep(1)}>Send OTP</FButton>
        </motion.div>
      ) : (
        <motion.div key='otp-code' initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className='space-y-3'>
          <p className='text-xs text-center' style={{ color: `${textColor}60` }}>Enter the 6-digit code sent to your email</p>
          <div className='flex gap-2 justify-center'>
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className='w-10 h-12 flex items-center justify-center text-lg font-mono border'
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: `${textColor}50`, borderRadius }}>_</div>
            ))}
          </div>
          <FButton primary={primary} textColor={textColor} buttonStyle={buttonStyle} borderRadius={borderRadius}>Verify OTP</FButton>
          <button onClick={() => setStep(0)} className='w-full text-xs transition-colors' style={{ color: `${textColor}40` }}>← Back</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Password form ────────────────────────────────────────────────────────────
const PasswordForm = ({ primary, textColor, label = 'Sign In', buttonStyle, inputStyle, inputBorderColor, borderRadius, showForgotPassword }) => (
  <div className='space-y-3'>
    <FInput label='Email' type='email' placeholder='you@example.com' textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius} />
    <FInput label='Password' type='password' placeholder='••••••••' textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius} />
    <FButton primary={primary} textColor={textColor} buttonStyle={buttonStyle} borderRadius={borderRadius}>{label}</FButton>
    {showForgotPassword && (
      <p className='text-center text-xs pt-1 cursor-pointer hover:underline' style={{ color: primary }}>Forgot password?</p>
    )}
  </div>
);

// ─── Signup flow ──────────────────────────────────────────────────────────────
const SignupFlow = ({ enabledMethods, signupFields, primary, textColor, buttonStyle, inputStyle, inputBorderColor, borderRadius, socialLayout }) => {
  const [authDone, setAuthDone] = useState(false);
  const [step, setStep] = useState(0);
  const perPage = 4;
  const totalSteps = Math.max(1, Math.ceil(signupFields.length / perPage));
  const visibleFields = signupFields.slice(step * perPage, (step + 1) * perPage);
  const isLastStep = step === totalSteps - 1;

  const hasPwd = enabledMethods.some((m) => m.id === 'password');
  const hasOTP = enabledMethods.some((m) => m.id === 'otp');
  const socialMethods = enabledMethods.filter((m) => m.id !== 'password' && m.id !== 'otp');
  const sharedProps = { primary, textColor, buttonStyle, inputStyle, inputBorderColor, borderRadius };

  if (!authDone) {
    return (
      <div className='space-y-3'>
        {hasPwd && (
          <>
            <FInput label='Email' type='email' placeholder='you@example.com' {...sharedProps} />
            <FInput label='Password' type='password' placeholder='Create a password' {...sharedProps} />
            <FButton {...sharedProps} onClick={() => setAuthDone(true)}>Continue with Password</FButton>
          </>
        )}
        {(socialMethods.length > 0 || hasOTP) && (
          <>
            {hasPwd && (
              <div className='relative flex items-center justify-center py-1'>
                <div className='absolute inset-0 flex items-center'><div className='w-full border-t' style={{ borderColor: `${textColor}15` }} /></div>
                <span className='relative px-3 text-xs' style={{ color: `${textColor}40` }}>or sign up with</span>
              </div>
            )}
            <SocialMethods methods={socialMethods} socialLayout={socialLayout} textColor={textColor} borderRadius={borderRadius} onSelect={() => setAuthDone(true)} />
            {hasOTP && (
              <button onClick={() => setAuthDone(true)} className='w-full flex items-center justify-center gap-2 border py-2.5 text-sm font-medium hover:opacity-80 transition-all'
                style={{ backgroundColor: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)', color: textColor, borderRadius }}>
                <span className='text-green-400'><MdOutlineSms /></span>
                Continue with OTP
              </button>
            )}
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
          {visibleFields.map((f) => <FInput key={f.id} label={f.label} type={f.type} textColor={textColor} inputStyle={inputStyle} inputBorderColor={inputBorderColor} borderRadius={borderRadius} />)}
        </motion.div>
      </AnimatePresence>
      <div className='flex gap-2 pt-1'>
        {step > 0 && (
          <button onClick={() => setStep((s) => s - 1)} className='px-4 py-2.5 text-sm font-medium border transition-colors'
            style={{ borderRadius, borderColor: `${textColor}20`, color: `${textColor}70`, backgroundColor: 'transparent' }}>Back</button>
        )}
        <FButton {...sharedProps} onClick={() => !isLastStep && setStep((s) => s + 1)}>
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
    screen_bg_color, login_card_bg_color, primary_color, text_color, brand_name, brand_logo,
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

  // Logo alignment classes
  const logoAlign = {
    left:   'items-start text-left',
    center: 'items-center text-center',
    right:  'items-end text-right',
  }[logo_position] || 'items-center text-center';

  const enabledMethods = authMethods.filter((m) => m.enabled);
  const hasPwd    = enabledMethods.some((m) => m.id === 'password');
  const hasOTP    = !hasPwd && enabledMethods.length === 1 && enabledMethods[0].id === 'otp';
  const socialOnly = enabledMethods.filter((m) => m.id !== 'password' && m.id !== 'otp');

  const sharedFormProps = {
    primary: primary_color, textColor: text_color,
    buttonStyle: button_style, inputStyle: input_style,
    inputBorderColor: input_border_color, borderRadius: btnRadius,
  };

  return (
    <div
      className='w-full h-full flex items-center justify-center overflow-auto relative transition-all duration-500'
      style={bgStyle}
    >
      {/* Background pattern overlay */}
      {bg_pattern === 'dots' && (
        <div className='absolute inset-0 pointer-events-none'
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      )}
      {bg_pattern === 'diagonal' && (
        <div className='absolute inset-0 pointer-events-none'
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)' }} />
      )}

      {/* Ambient glow */}
      <div
        className='absolute w-96 h-96 rounded-full pointer-events-none opacity-10 blur-3xl'
        style={{ backgroundColor: primary_color, top: '10%', left: '50%', transform: 'translateX(-50%)' }}
      />

      <motion.div
        key={`${activeMode}-${login_card_bg_color}-${primary_color}-${border_radius}`}
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
        {/* Custom CSS injection */}
        {custom_css && <style>{custom_css}</style>}

        {/* Brand */}
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
            {brand_name || 'Your Brand'}
          </h1>
          <p className='text-xs mt-1.5' style={{ color: `${text_color}50` }}>
            {activeMode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Form content */}
        {activeMode === 'signup' ? (
          <SignupFlow
            enabledMethods={enabledMethods} signupFields={signupFields}
            socialLayout={social_layout} {...sharedFormProps}
          />
        ) : hasOTP ? (
          <OTPFlow {...sharedFormProps} />
        ) : hasPwd ? (
          <>
            <PasswordForm {...sharedFormProps} label='Sign In' showForgotPassword={forgotPasswordEnabled} />
            {(socialOnly.length > 0 || enabledMethods.some((m) => m.id === 'otp')) && (
              <div className='mt-5'>
                <div className='relative flex items-center justify-center mb-4'>
                  <div className='absolute inset-0 flex items-center'><div className='w-full border-t' style={{ borderColor: `${text_color}10` }} /></div>
                  <span className='relative px-3 text-xs' style={{ color: `${text_color}35` }}>or</span>
                </div>
                <SocialMethods
                  methods={enabledMethods.filter((m) => m.id !== 'password')}
                  socialLayout={social_layout} textColor={text_color} borderRadius={btnRadius}
                />
              </div>
            )}
          </>
        ) : (
          <SocialMethods
            methods={enabledMethods} socialLayout={social_layout}
            textColor={text_color} borderRadius={btnRadius}
          />
        )}

        <p className='text-center text-xs mt-6' style={{ color: `${text_color}30` }}>
          {activeMode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <span className='cursor-pointer hover:underline' style={{ color: primary_color }}>
            {activeMode === 'signin' ? 'Sign up' : 'Sign in'}
          </span>
        </p>
      </motion.div>
    </div>
  );
};
