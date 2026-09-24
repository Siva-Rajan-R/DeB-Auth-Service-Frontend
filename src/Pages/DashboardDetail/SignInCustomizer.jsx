import { useState } from 'react';
import { useAuthConfigStore } from '../../Store/useAuthConfigStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw, ChevronDown, ChevronUp, Type, Layers, MousePointer2,
  LayoutTemplate, ImageIcon, Code2, Sparkles, Check, Upload, FileImage
} from 'lucide-react';
import Select from 'react-select';
import axios from 'axios';
import { APP_CONFIG } from '../../config';


const rgbaToHex = (color) => {
  if (!color) return '#ffffff';
  if (color.startsWith('#')) return color.slice(0, 7);
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (match) {
    const r = Math.min(255, parseInt(match[1])).toString(16).padStart(2, '0');
    const g = Math.min(255, parseInt(match[2])).toString(16).padStart(2, '0');
    const b = Math.min(255, parseInt(match[3])).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return '#ffffff';
};

// ─── Primitive: Color picker row ─────────────────────────────────────────────
const ColorRow = ({ label, storeKey }) => {
  const { uiConfig, updateUIConfig } = useAuthConfigStore();
  const hexVal = rgbaToHex(uiConfig[storeKey]);

  return (
    <div className='flex items-center justify-between py-2 group/color'>
      <span className='text-[var(--text-muted)] text-[13px] font-medium group-hover/color:text-[var(--text-main)] transition-colors'>{label}</span>
      <label className='flex items-center gap-3 bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-xl px-3 py-1.5 cursor-pointer hover:border-cyan-500/30 hover:bg-[var(--bg-card)] transition-all shadow-sm'>
        <input
          type='color'
          value={hexVal}
          onChange={(e) => updateUIConfig(storeKey, e.target.value)}
          className='w-5 h-5 rounded-lg cursor-pointer border-0 bg-transparent p-0 flex-shrink-0'
        />
        <span className='text-[var(--text-dim)] text-[11px] font-mono uppercase tracking-widest w-[80px] truncate group-hover/color:text-cyan-600 transition-colors'>
          {uiConfig[storeKey] || hexVal}
        </span>
      </label>
    </div>
  );
};

// ─── Primitive: Segmented option group ───────────────────────────────────────
const OptionGroup = ({ label, options, storeKey }) => {
  const { uiConfig, updateUIConfig } = useAuthConfigStore();
  return (
    <div className='space-y-2'>
      {label && <label className='text-slate-500 text-[11px] font-bold uppercase tracking-widest block'>{label}</label>}
      <div className='flex gap-2 p-1 bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-xl'>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateUIConfig(storeKey, opt.value)}
            className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${
              uiConfig[storeKey] === opt.value
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-deep)]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Primitive: Slider row ────────────────────────────────────────────────────
const SliderRow = ({ label, storeKey, min, max, unit = '' }) => {
  const { uiConfig, updateUIConfig } = useAuthConfigStore();
  return (
    <div className='space-y-3'>
      <div className='flex justify-between items-center'>
        <label className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest'>{label}</label>
        <span className='px-2.5 py-1 bg-cyan-50 border border-cyan-200 text-cyan-500 text-[10px] font-bold rounded-lg shadow-sm'>
          {uiConfig[storeKey]}{unit}
        </span>
      </div>
      <input
        type='range'
        min={min}
        max={max}
        value={uiConfig[storeKey]}
        onChange={(e) => updateUIConfig(storeKey, Number(e.target.value))}
        className='w-full h-1.5 rounded-full cursor-pointer appearance-none bg-[var(--bg-deep)] accent-indigo-500 hover:accent-indigo-400 transition-all border border-[var(--border-glass)] shadow-inner'
      />
    </div>
  );
};

// ─── Primitive: Collapsible section card ─────────────────────────────────────
const Section = ({ title, icon, sectionKey, openSections, toggleSection, children }) => (
  <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
    openSections[sectionKey] 
      ? 'bg-[var(--bg-card)] border-[var(--border-active)] shadow-xl shadow-cyan-500/5' 
      : 'bg-transparent border-[var(--border-glass)] hover:border-[var(--border-active)] hover:bg-[var(--bg-surface)]'
  }`}>
    <button
      onClick={() => toggleSection(sectionKey)}
      className='w-full flex items-center justify-between px-5 py-4 transition-colors group/sec'
    >
      <div className='flex items-center gap-3'>
        <div className={`p-2.5 rounded-xl transition-all shadow-sm ${
          openSections[sectionKey] 
            ? 'bg-cyan-50 text-cyan-500 border border-cyan-200' 
            : 'bg-[var(--bg-surface)] text-[var(--text-dim)] group-hover/sec:text-[var(--text-main)] border border-[var(--border-glass)]'
        }`}>
          {icon || <LayoutTemplate size={20} />}
        </div>
        <h3 className={`font-bold text-sm tracking-tight transition-colors ${
          openSections[sectionKey] ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)] group-hover/sec:text-[var(--text-main)]'
        }`}>
          {title}
        </h3>
      </div>
      <div className={`transition-transform duration-500 ${openSections[sectionKey] ? 'rotate-180' : ''}`}>
        <ChevronDown size={18} className={openSections[sectionKey] ? 'text-cyan-500' : 'text-[var(--text-dim)]'} />
      </div>
    </button>
    <AnimatePresence>
      {openSections[sectionKey] && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className='px-5 pb-6 space-y-5 border-t border-[var(--border-glass)]'>
            <div className='pt-5'>{children}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// ─── Component: Logo Uploader Widget ─────────────────────────────────────────
const LogoUploader = () => {
  const { updateUIConfig } = useAuthConfigStore();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setSuccess(false);

    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be under 2MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (uiConfig.brand_logo) {
      formData.append('old_logo_url', uiConfig.brand_logo);
    }

    setUploading(true);
    try {
      const backendUrl = APP_CONFIG.BACKEND_URL;
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('access_token='))
        ?.split('=')[1];

      const res = await axios.post(`${backendUrl}/user/secrets/upload-logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: true,
      });

      if (res.data.logo_url) {
        updateUIConfig('brand_logo', res.data.logo_url);
        setSuccess(true);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to upload image. Ensure server configuration is active.';
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='space-y-2.5 pt-1'>
      <label className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest block'>Or Upload File</label>
      <div className='flex items-center gap-3'>
        <label className='flex items-center gap-2 px-4 py-2 bg-cyan-50 border border-cyan-200 text-cyan-600 hover:bg-cyan-50 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 flex-shrink-0'>
          <Upload size={14} />
          <span>{uploading ? 'Uploading...' : 'Choose Image'}</span>
          <input
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            disabled={uploading}
            className='hidden'
          />
        </label>
        <span className='text-[10px] text-[var(--text-dim)] font-medium truncate max-w-[180px]'>
          Max 2MB (PNG, JPG, SVG, WEBP)
        </span>
      </div>

      {error && (
        <p className='text-red-400 text-[10px] font-bold mt-1.5 pl-1 leading-relaxed'>{error}</p>
      )}
      {success && (
        <p className='text-blue-600 text-[10px] font-bold mt-1.5 pl-1 flex items-center gap-1'><Check size={11} /> Logo uploaded & applied successfully!</p>
      )}
    </div>
  );
};


// ─── react-select theme-aware styles ───────────────────────────────────────────
const selectStyles = {
  control: (b, s) => ({
    ...b, 
    backgroundColor: 'var(--bg-deep)', 
    borderColor: s.isFocused ? 'var(--accent-cyan)' : 'var(--border-glass)', 
    borderRadius: '0.75rem',
    minHeight: '42px', 
    boxShadow: 'none', 
    transition: 'all 0.2s ease',
    '&:hover': { borderColor: 'var(--accent-cyan)' },
  }),
  menu: (b) => ({ 
    ...b, 
    backgroundColor: 'var(--bg-card)', 
    borderRadius: '1rem', 
    border: '1px solid var(--border-glass)',
    backdropFilter: 'blur(16px)',
    overflow: 'hidden',
    boxShadow: 'var(--glass-shadow)',
    padding: '4px',
  }),
  option: (b, s) => ({
    ...b, 
    backgroundColor: s.isSelected ? 'var(--accent-cyan)' : s.isFocused ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
    color: s.isSelected ? '#000000' : 'var(--text-main)', 
    fontSize: '0.8125rem', 
    fontWeight: '700',
    cursor: 'pointer',
    padding: '10px 14px',
    borderRadius: '0.5rem',
    '&:active': { backgroundColor: 'var(--accent-cyan)' },
  }),
  singleValue: (b) => ({ ...b, color: 'var(--text-main)', fontSize: '0.8125rem', fontWeight: '700' }),
  input: (b) => ({ ...b, color: 'var(--text-main)' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (b) => ({ ...b, color: 'var(--text-dim)', padding: '0 12px' }),
};

// ─── Preset theme palette ─────────────────────────────────────────────────────
const PRESET_THEMES = [
  {
    key: 'cyber_cyan',
    label: 'Cyber Cyan',
    preview: ['#070b14', '#00d2e5', '#f8fafc'],
    config: {
      screen_bg_color: '#070b14',
      bg_type: 'gradient',
      gradient_start: '#070b14',
      gradient_mid: '#0d1728',
      gradient_end: '#131e32',
      gradient_direction: '135deg',
      bg_pattern: 'dots',
      login_card_bg_color: 'rgba(15, 23, 42, 0.85)',
      card_variant: 'glassmorphism',
      blur_amount: 24,
      border_width: 1,
      border_color: 'rgba(0, 210, 229, 0.25)',
      primary_color: '#00d2e5',
      btn_text_color: '#ffffff',
      text_color: '#ffffff',
      secondary_text_color: '#94a3b8',
      link_color: '#38bdf8',
      brand_text_color: '#ffffff',
      border_radius: 'rounded',
      shadow_intensity: 'lg',
      button_style: 'filled',
      input_style: 'outlined',
      input_border_color: 'rgba(255, 255, 255, 0.12)',
      provider_bg_color: 'rgba(255, 255, 255, 0.05)',
      provider_text_color: '#ffffff',
    },
  },
  {
    key: 'neon_pulse',
    label: 'Neon Pulse',
    preview: ['#09090b', '#a855f7', '#faf5ff'],
    config: {
      screen_bg_color: '#09090b',
      bg_type: 'gradient',
      gradient_start: '#09090b',
      gradient_mid: '#1a0b2e',
      gradient_end: '#2e1065',
      gradient_direction: '135deg',
      bg_pattern: 'dots',
      login_card_bg_color: 'rgba(18, 12, 32, 0.85)',
      card_variant: 'glassmorphism',
      blur_amount: 30,
      border_width: 1,
      border_color: 'rgba(168, 85, 247, 0.25)',
      primary_color: '#a855f7',
      btn_text_color: '#ffffff',
      text_color: '#faf5ff',
      secondary_text_color: '#c084fc',
      link_color: '#c084fc',
      brand_text_color: '#faf5ff',
      border_radius: 'rounded',
      shadow_intensity: 'lg',
      button_style: 'filled',
      input_style: 'outlined',
      input_border_color: 'rgba(168, 85, 247, 0.20)',
      provider_bg_color: 'rgba(168, 85, 247, 0.08)',
      provider_text_color: '#faf5ff',
    },
  },
  {
    key: 'deep_indigo',
    label: 'Deep Indigo',
    preview: ['#090d16', '#6366f1', '#e0e7ff'],
    config: {
      screen_bg_color: '#090d16',
      bg_type: 'gradient',
      gradient_start: '#090d16',
      gradient_mid: '#141936',
      gradient_end: '#1e1b4b',
      gradient_direction: '135deg',
      bg_pattern: 'diagonal',
      login_card_bg_color: 'rgba(15, 20, 48, 0.85)',
      card_variant: 'glassmorphism',
      blur_amount: 28,
      border_width: 1,
      border_color: 'rgba(99, 102, 241, 0.25)',
      primary_color: '#6366f1',
      btn_text_color: '#ffffff',
      text_color: '#e0e7ff',
      secondary_text_color: '#818cf8',
      link_color: '#818cf8',
      brand_text_color: '#e0e7ff',
      border_radius: 'rounded',
      shadow_intensity: 'lg',
      button_style: 'filled',
      input_style: 'outlined',
      input_border_color: 'rgba(99, 102, 241, 0.20)',
      provider_bg_color: 'rgba(99, 102, 241, 0.08)',
      provider_text_color: '#e0e7ff',
    },
  },
  {
    key: 'emerald',
    label: 'Emerald',
    preview: ['#03170e', '#10b981', '#ecfdf5'],
    config: {
      screen_bg_color: '#03170e',
      bg_type: 'gradient',
      gradient_start: '#03170e',
      gradient_mid: '#063321',
      gradient_end: '#064e3b',
      gradient_direction: '135deg',
      bg_pattern: 'dots',
      login_card_bg_color: 'rgba(4, 30, 20, 0.85)',
      card_variant: 'glassmorphism',
      blur_amount: 24,
      border_width: 1,
      border_color: 'rgba(16, 185, 129, 0.25)',
      primary_color: '#10b981',
      btn_text_color: '#ffffff',
      text_color: '#ecfdf5',
      secondary_text_color: '#6ee7b7',
      link_color: '#34d399',
      brand_text_color: '#ecfdf5',
      border_radius: 'rounded',
      shadow_intensity: 'md',
      button_style: 'filled',
      input_style: 'outlined',
      input_border_color: 'rgba(16, 185, 129, 0.20)',
      provider_bg_color: 'rgba(16, 185, 129, 0.08)',
      provider_text_color: '#ecfdf5',
    },
  },
  {
    key: 'sunset_amber',
    label: 'Sunset Amber',
    preview: ['#140b05', '#f59e0b', '#fffbeb'],
    config: {
      screen_bg_color: '#140b05',
      bg_type: 'gradient',
      gradient_start: '#140b05',
      gradient_mid: '#291508',
      gradient_end: '#451a03',
      gradient_direction: '135deg',
      bg_pattern: 'dots',
      login_card_bg_color: 'rgba(28, 16, 8, 0.85)',
      card_variant: 'glassmorphism',
      blur_amount: 24,
      border_width: 1,
      border_color: 'rgba(245, 158, 11, 0.25)',
      primary_color: '#f59e0b',
      btn_text_color: '#111827',
      text_color: '#fffbeb',
      secondary_text_color: '#fcd34d',
      link_color: '#f59e0b',
      brand_text_color: '#fffbeb',
      border_radius: 'rounded',
      shadow_intensity: 'md',
      button_style: 'filled',
      input_style: 'outlined',
      input_border_color: 'rgba(245, 158, 11, 0.20)',
      provider_bg_color: 'rgba(245, 158, 11, 0.08)',
      provider_text_color: '#fffbeb',
    },
  },
  {
    key: 'luxury_pearl',
    label: 'Luxury Pearl',
    preview: ['#f1f5f9', '#0284c7', '#0f172a'],
    config: {
      screen_bg_color: '#f1f5f9',
      bg_type: 'gradient',
      gradient_start: '#f8fafc',
      gradient_mid: '#eef2f6',
      gradient_end: '#e2e8f0',
      gradient_direction: '135deg',
      bg_pattern: 'none',
      login_card_bg_color: '#ffffff',
      card_variant: 'normal',
      blur_amount: 0,
      border_width: 1,
      border_color: 'rgba(0, 0, 0, 0.08)',
      primary_color: '#0284c7',
      btn_text_color: '#ffffff',
      text_color: '#0f172a',
      secondary_text_color: '#64748b',
      link_color: '#0284c7',
      brand_text_color: '#0f172a',
      border_radius: 'rounded',
      shadow_intensity: 'lg',
      button_style: 'filled',
      input_style: 'outlined',
      input_border_color: 'rgba(0, 0, 0, 0.12)',
      provider_bg_color: 'rgba(0, 0, 0, 0.03)',
      provider_text_color: '#0f172a',
    },
  },
  {
    key: 'nordic_frost',
    label: 'Nordic Frost',
    preview: ['#e0eafc', '#2563eb', '#1e293b'],
    config: {
      screen_bg_color: '#e8eff7',
      bg_type: 'gradient',
      gradient_start: '#e0eafc',
      gradient_mid: '#cfdef3',
      gradient_end: '#e8eff7',
      gradient_direction: '135deg',
      bg_pattern: 'dots',
      login_card_bg_color: 'rgba(255, 255, 255, 0.90)',
      card_variant: 'glassmorphism',
      blur_amount: 24,
      border_width: 1,
      border_color: 'rgba(255, 255, 255, 0.80)',
      primary_color: '#2563eb',
      btn_text_color: '#ffffff',
      text_color: '#1e293b',
      secondary_text_color: '#64748b',
      link_color: '#2563eb',
      brand_text_color: '#1e293b',
      border_radius: 'rounded',
      shadow_intensity: 'lg',
      button_style: 'filled',
      input_style: 'outlined',
      input_border_color: 'rgba(37, 99, 235, 0.20)',
      provider_bg_color: 'rgba(255, 255, 255, 0.80)',
      provider_text_color: '#1e293b',
    },
  },
  {
    key: 'minimal_obsidian',
    label: 'Minimal Dark',
    preview: ['#09090b', '#ffffff', '#fafafa'],
    config: {
      screen_bg_color: '#09090b',
      bg_type: 'static',
      bg_pattern: 'none',
      login_card_bg_color: '#121215',
      card_variant: 'normal',
      blur_amount: 0,
      border_width: 1,
      border_color: 'rgba(255, 255, 255, 0.10)',
      primary_color: '#ffffff',
      btn_text_color: '#09090b',
      text_color: '#fafafa',
      secondary_text_color: '#a1a1aa',
      link_color: '#ffffff',
      brand_text_color: '#fafafa',
      border_radius: 'square',
      shadow_intensity: 'md',
      button_style: 'filled',
      input_style: 'outlined',
      input_border_color: 'rgba(255, 255, 255, 0.15)',
      provider_bg_color: 'rgba(255, 255, 255, 0.05)',
      provider_text_color: '#fafafa',
    },
  },
];

// ─── Quick Theme Picker ───────────────────────────────────────────────────────
const QuickThemes = () => {
  const { uiConfig, updateUIConfig } = useAuthConfigStore();
  const [appliedKey, setAppliedKey] = useState(null);

  const applyTheme = (theme) => {
    Object.entries(theme.config).forEach(([k, v]) => updateUIConfig(k, v));
    setAppliedKey(theme.key);
    setTimeout(() => setAppliedKey(null), 1500);
  };

  return (
    <div className='space-y-3'>
      <div className='grid grid-cols-4 gap-2'>
        {PRESET_THEMES.map((theme) => (
          <button
            key={theme.key}
            onClick={() => applyTheme(theme)}
            title={theme.label}
            className='relative group flex flex-col items-center gap-2 p-2.5 rounded-xl border transition-all hover:border-[var(--border-active)] hover:scale-[1.04] active:scale-95'
            style={{
              borderColor: appliedKey === theme.key ? theme.config.primary_color : 'var(--border-glass)',
              backgroundColor: appliedKey === theme.key ? `${theme.config.primary_color}15` : 'var(--bg-surface)',
            }}
          >
            {/* Color dots */}
            <div className='flex gap-1 items-center'>
              {theme.preview.map((c, i) => (
                <div key={i} className='w-4 h-4 rounded-full ring-1 ring-black/20 flex-shrink-0' style={{ backgroundColor: c }} />
              ))}
            </div>
            <span className='text-[10px] font-bold text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors leading-tight text-center'>{theme.label}</span>
            {/* Applied checkmark */}
            <AnimatePresence>
              {appliedKey === theme.key && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className='absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center'
                  style={{ backgroundColor: theme.config.primary_color }}
                >
                  <Check size={10} className='text-white' />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>
    </div>
  );
};

const FONT_OPTIONS = [
  { value: 'system',     label: 'System Default' },
  { value: 'Inter',      label: 'Inter' },
  { value: 'Roboto',     label: 'Roboto' },
  { value: 'Poppins',    label: 'Poppins' },
  { value: 'Nunito',     label: 'Nunito' },
  { value: 'Montserrat', label: 'Montserrat' },
];

// ─── Main component ───────────────────────────────────────────────────────────
export const SignInCustomizer = () => {
  const { uiConfig, updateUIConfig, resetToDefaults } = useAuthConfigStore();
  const [openSections, setOpenSections] = useState({
    branding: true,
    global_bg: false,
    card_bg: false,
    colors: true,
    typography: false,
    shape: false,
    buttons: false,
    layout: false,
    css: false,
  });

  const toggleSection = (key) =>
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className='space-y-4'>

      {/* 0. Quick Themes */}
      <div className='rounded-2xl border border-orange-200 bg-amber-500/5 p-4 space-y-3'>
        <div className='flex items-center gap-2 mb-1'>
          <img src='/dauth_logo.png' alt='DAuth' className='w-4 h-4 object-contain' />
          <h3 className='text-sm font-bold text-[var(--text-main)]'>Quick Themes</h3>
        </div>
        <QuickThemes />
      </div>

      {/* 1. Branding */}
      <Section title='Branding' icon={<LayoutTemplate size={20} />} sectionKey='branding' openSections={openSections} toggleSection={toggleSection}>
        <div className='space-y-5'>
          <div className='space-y-2'>
            <label className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest block'>Brand Name</label>
            <input
              type='text'
              value={uiConfig.brand_name}
              onChange={(e) => updateUIConfig('brand_name', e.target.value)}
              className='w-full bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl px-4 py-3 text-[var(--text-main)] text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-[var(--bg-surface)] transition-all placeholder-[var(--text-dim)] font-bold shadow-inner'
              placeholder='Your Brand Name'
            />
          </div>
          <OptionGroup
            label='Logo Position'
            storeKey='logo_position'
            options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]}
          />
          <div className='space-y-2'>
            <label className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest block'>Brand Logo URL</label>
            <input
              type='text'
              value={uiConfig.brand_logo || ''}
              onChange={(e) => updateUIConfig('brand_logo', e.target.value)}
              className='w-full bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl px-4 py-3 text-[var(--text-main)] text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-[var(--bg-surface)] transition-all placeholder-[var(--text-dim)] font-bold shadow-inner'
              placeholder='https://example.com/logo.png'
            />
          </div>
          <LogoUploader />
        </div>
      </Section>

      {/* 2. Global Background */}
      <Section title='Global Background' icon={<ImageIcon size={20} />} sectionKey='global_bg' openSections={openSections} toggleSection={toggleSection}>
        <div className='space-y-4'>
          <OptionGroup
            label='Background Type'
            storeKey='bg_type'
            options={[{ value: 'static', label: 'Static' }, { value: 'gradient', label: 'Gradient' }]}
          />
          
          {uiConfig.bg_type === 'static' ? (
            <ColorRow label='Background Color' storeKey='screen_bg_color' />
          ) : (
            <div className='space-y-3 pt-2'>
              <ColorRow label='Gradient Start' storeKey='gradient_start' />
              <ColorRow label='Gradient Middle' storeKey='gradient_mid' />
              <ColorRow label='Gradient End' storeKey='gradient_end' />
              <OptionGroup
                label='Direction'
                storeKey='gradient_direction'
                options={[
                  { value: '45deg',  label: '↗ 45°' },
                  { value: '90deg',  label: '→ 90°' },
                  { value: '135deg', label: '↘ 135°' },
                  { value: '180deg', label: '↓ 180°' },
                ]}
              />
            </div>
          )}
          
          <div className='pt-2 border-t border-[var(--border-glass)]'>
            <OptionGroup
              label='Pattern Overlay'
              storeKey='bg_pattern'
              options={[
                { value: 'none', label: 'None' },
                { value: 'dots', label: 'Dots' },
                { value: 'diagonal', label: 'Lines' },
              ]}
            />
          </div>
        </div>
      </Section>

      {/* 3. Card Background */}
      <Section title='Card Background' icon={<Layers size={20} />} sectionKey='card_bg' openSections={openSections} toggleSection={toggleSection}>
        <div className='space-y-4'>
          <OptionGroup
            label='Card Variant'
            storeKey='card_variant'
            options={[
              { value: 'normal', label: 'Normal' },
              { value: 'neumorphism', label: 'Neumorphism' },
              { value: 'glassmorphism', label: 'Glassmorphism' }
            ]}
          />

          <OptionGroup
            label='Background Type'
            storeKey='card_bg_type'
            options={[{ value: 'static', label: 'Static' }, { value: 'gradient', label: 'Gradient' }]}
          />
          
          {uiConfig.card_bg_type === 'static' ? (
            <ColorRow label='Card Background Color' storeKey='login_card_bg_color' />
          ) : (
            <div className='space-y-3 pt-2'>
              <ColorRow label='Gradient Start' storeKey='card_gradient_start' />
              <ColorRow label='Gradient Middle' storeKey='card_gradient_mid' />
              <ColorRow label='Gradient End' storeKey='card_gradient_end' />
              <OptionGroup
                label='Direction'
                storeKey='card_gradient_direction'
                options={[
                  { value: '45deg',  label: '↗ 45°' },
                  { value: '90deg',  label: '→ 90°' },
                  { value: '135deg', label: '↘ 135°' },
                  { value: '180deg', label: '↓ 180°' },
                ]}
              />
            </div>
          )}

          <div className='pt-2 border-t border-[var(--border-glass)]'>
            <OptionGroup
              label='Pattern Overlay'
              storeKey='card_bg_pattern'
              options={[
                { value: 'none', label: 'None' },
                { value: 'dots', label: 'Dots' },
                { value: 'diagonal', label: 'Lines' },
              ]}
            />
          </div>
        </div>
      </Section>

      {/* 4. Colors & Text */}
      <Section title='Colors & Text' icon={<Layers size={20} />} sectionKey='colors' openSections={openSections} toggleSection={toggleSection}>
        <div className='divide-y divide-[var(--border-glass)] bg-[var(--bg-deep)]/20 rounded-2xl border border-[var(--border-glass)] px-4'>
          <ColorRow label='Brand Text Color'  storeKey='brand_text_color' />
          <ColorRow label='Main Text Color'   storeKey='text_color' />
          <ColorRow label='Secondary Text Color' storeKey='secondary_text_color' />
          <ColorRow label='Link Color'        storeKey='link_color' />
        </div>
      </Section>

      {/* 5. Typography */}
      <Section title='Typography' icon={<Type size={20} />} sectionKey='typography' openSections={openSections} toggleSection={toggleSection}>
        <div className='space-y-5'>
          <div className='space-y-2'>
            <label className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest block'>Font Family</label>
            <Select
              options={FONT_OPTIONS}
              value={FONT_OPTIONS.find((o) => o.value === uiConfig.font_family)}
              onChange={(opt) => updateUIConfig('font_family', opt.value)}
              styles={selectStyles}
              isSearchable={false}
              menuPosition='fixed'
            />
          </div>
          <OptionGroup
            label='Font Size'
            storeKey='font_size'
            options={[{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }]}
          />
        </div>
      </Section>

      {/* 6. Shape & Card Borders */}
      <Section title='Shape & Borders' icon={<Layers size={20} />} sectionKey='shape' openSections={openSections} toggleSection={toggleSection}>
        <div className='space-y-5'>
          <OptionGroup
            label='Border Radius'
            storeKey='border_radius'
            options={[{ value: 'square', label: 'Square' }, { value: 'rounded', label: 'Rounded' }, { value: 'pill', label: 'Pill' }]}
          />
          <OptionGroup
            label='Card Shadow'
            storeKey='shadow_intensity'
            options={[{ value: 'none', label: 'None' }, { value: 'sm', label: 'Soft' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Strong' }]}
          />
          <SliderRow label='Backdrop Blur' storeKey='blur_amount' min={0} max={40} unit='px' />
          <SliderRow label='Border Width'  storeKey='border_width' min={0} max={4}  unit='px' />
          <ColorRow  label='Border Color'  storeKey='border_color' />
        </div>
      </Section>

      {/* 7. Buttons & Inputs */}
      <Section title='Buttons & Inputs' icon={<MousePointer2 size={20} />} sectionKey='buttons' openSections={openSections} toggleSection={toggleSection}>
        <div className='space-y-5'>
          <OptionGroup
            label='Main Button Style'
            storeKey='button_style'
            options={[{ value: 'filled', label: 'Filled' }, { value: 'outlined', label: 'Outlined' }, { value: 'ghost', label: 'Ghost' }]}
          />
          <ColorRow label='Primary Button Color' storeKey='primary_color' />
          <ColorRow label='Button Text Color' storeKey='btn_text_color' />

          <div className='pt-3 border-t border-[var(--border-glass)] space-y-3'>
            <label className='text-slate-500 text-[11px] font-bold uppercase tracking-widest block'>Provider Buttons</label>
            <ColorRow label='Provider Background' storeKey='provider_bg_color' />
            <ColorRow label='Provider Text Color' storeKey='provider_text_color' />
          </div>

          <div className='pt-3 border-t border-[var(--border-glass)] space-y-3'>
            <OptionGroup
              label='Input Style'
              storeKey='input_style'
              options={[{ value: 'filled', label: 'Filled' }, { value: 'outlined', label: 'Outlined' }]}
            />
            <ColorRow label='Input Border Color' storeKey='input_border_color' />
          </div>
        </div>
      </Section>

      {/* 8. Layout */}
      <Section title='Layout' icon={<LayoutTemplate size={20} />} sectionKey='layout' openSections={openSections} toggleSection={toggleSection}>
        <div className='space-y-5'>
          <OptionGroup
            label='Social Button Layout'
            storeKey='social_layout'
            options={[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }, { value: 'compact', label: 'Compact' }]}
          />
        </div>
      </Section>

      {/* 9. Custom CSS */}
      <Section title='Custom CSS' icon={<Code2 size={20} />} sectionKey='css' openSections={openSections} toggleSection={toggleSection}>
        <div className='space-y-3'>
          <p className='text-[var(--text-dim)] text-[11px] font-bold uppercase tracking-widest'>Injected directly into preview</p>
          <textarea
            value={uiConfig.custom_css}
            onChange={(e) => updateUIConfig('custom_css', e.target.value)}
            rows={7}
            placeholder={'/* Your custom CSS */\n.auth-card { ... }'}
            className='w-full bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-[1.5rem] px-5 py-4 text-cyan-500/90 text-xs font-mono focus:outline-none focus:border-cyan-500/40 focus:bg-[var(--bg-surface)] transition-all resize-none placeholder-[var(--text-dim)] custom-scrollbar shadow-inner'
          />
        </div>
      </Section>

      {/* Reset */}
      <button
        onClick={resetToDefaults}
        className='w-full flex items-center justify-center gap-3 border border-[var(--border-glass)] hover:border-red-500/30 text-[var(--text-dim)] hover:text-red-400 rounded-2xl py-3.5 text-xs font-bold transition-all hover:bg-red-500/5 uppercase tracking-widest active:scale-95'
      >
        <RotateCcw size={16} />
        Reset Configuration
      </button>
    </div>
  );
};
