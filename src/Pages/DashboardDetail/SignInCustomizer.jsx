import { useState } from 'react';
import { useAuthConfigStore } from '../../Store/useAuthConfigStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw, ChevronDown, ChevronUp, Type, Layers, MousePointer2,
  LayoutTemplate, ImageIcon, Code2
} from 'lucide-react';
import Select from 'react-select';

// ─── Primitive: Color picker row ─────────────────────────────────────────────
const ColorRow = ({ label, storeKey }) => {
  const { uiConfig, updateUIConfig } = useAuthConfigStore();
  return (
    <div className='flex items-center justify-between py-2 group/color'>
      <span className='text-[var(--text-muted)] text-[13px] font-medium group-hover/color:text-[var(--text-main)] transition-colors'>{label}</span>
      <div className='flex items-center gap-3 bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-xl px-3 py-1.5 cursor-pointer hover:border-indigo-500/30 hover:bg-[var(--bg-card)] transition-all shadow-sm'>
        <input
          type='color'
          value={uiConfig[storeKey]?.startsWith('rgba') ? '#ffffff' : (uiConfig[storeKey] || '#ffffff')}
          onChange={(e) => updateUIConfig(storeKey, e.target.value)}
          className='w-5 h-5 rounded-lg cursor-pointer border-0 bg-transparent p-0 flex-shrink-0'
        />
        <span className='text-[var(--text-dim)] text-[11px] font-mono uppercase tracking-widest w-[80px] truncate group-hover/color:text-indigo-400 transition-colors'>
          {uiConfig[storeKey]}
        </span>
      </div>
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
                ? 'bg-indigo-500 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5'
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
        <span className='px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-bold rounded-lg shadow-sm'>
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
      ? 'bg-[var(--bg-card)] border-[var(--border-active)] shadow-xl shadow-indigo-500/5' 
      : 'bg-transparent border-[var(--border-glass)] hover:border-[var(--border-active)] hover:bg-[var(--bg-surface)]'
  }`}>
    <button
      onClick={() => toggleSection(sectionKey)}
      className='w-full flex items-center justify-between px-5 py-4 transition-colors group/sec'
    >
      <div className='flex items-center gap-3'>
        <div className={`p-2.5 rounded-xl transition-all shadow-sm ${
          openSections[sectionKey] 
            ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' 
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
        <ChevronDown size={18} className={openSections[sectionKey] ? 'text-indigo-500' : 'text-[var(--text-dim)]'} />
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

// ─── react-select theme-aware styles ───────────────────────────────────────────
const selectStyles = {
  control: (b, s) => ({
    ...b, 
    backgroundColor: 'var(--bg-deep)', 
    borderColor: s.isFocused ? 'var(--accent-indigo)' : 'var(--border-glass)', 
    borderRadius: '0.75rem',
    minHeight: '42px', 
    boxShadow: 'none', 
    transition: 'all 0.2s ease',
    '&:hover': { borderColor: 'var(--accent-indigo)' },
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
    backgroundColor: s.isSelected ? 'var(--accent-indigo)' : s.isFocused ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
    color: s.isSelected ? '#000000' : 'var(--text-main)', 
    fontSize: '0.8125rem', 
    fontWeight: '700',
    cursor: 'pointer',
    padding: '10px 14px',
    borderRadius: '0.5rem',
    '&:active': { backgroundColor: 'var(--accent-indigo)' },
  }),
  singleValue: (b) => ({ ...b, color: 'var(--text-main)', fontSize: '0.8125rem', fontWeight: '700' }),
  input: (b) => ({ ...b, color: 'var(--text-main)' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (b) => ({ ...b, color: 'var(--text-dim)', padding: '0 12px' }),
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
    colors: true,
    typography: false,
    shape: false,
    buttons: false,
    layout: false,
    background: false,
    css: false,
  });

  const toggleSection = (key) =>
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className='space-y-4'>

      {/* 1. Branding */}
      <Section title='Branding' icon={<LayoutTemplate size={20} />} sectionKey='branding' openSections={openSections} toggleSection={toggleSection}>
        <div className='space-y-5'>
          <div className='space-y-2'>
            <label className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest block'>Brand Name</label>
            <input
              type='text'
              value={uiConfig.brand_name}
              onChange={(e) => updateUIConfig('brand_name', e.target.value)}
              className='w-full bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl px-4 py-3 text-[var(--text-main)] text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-[var(--bg-surface)] transition-all placeholder-[var(--text-dim)] font-bold shadow-inner'
              placeholder='Your Brand Name'
            />
          </div>
          <div className='space-y-2'>
            <label className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest block'>Brand Logo URL</label>
            <input
              type='text'
              value={uiConfig.brand_logo}
              onChange={(e) => updateUIConfig('brand_logo', e.target.value)}
              className='w-full bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl px-4 py-3 text-[var(--text-main)] text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-[var(--bg-surface)] transition-all placeholder-[var(--text-dim)] font-bold shadow-inner'
              placeholder='https://example.com/logo.png'
            />
          </div>
        </div>
      </Section>

      {/* 2. Colors */}
      <Section title='Colors' icon={<Layers size={20} />} sectionKey='colors' openSections={openSections} toggleSection={toggleSection}>
        <div className='divide-y divide-[var(--border-glass)] bg-[var(--bg-deep)]/20 rounded-2xl border border-[var(--border-glass)] px-4'>
          <ColorRow label='Screen Background' storeKey='screen_bg_color' />
          <ColorRow label='Card Background'   storeKey='login_card_bg_color' />
          <ColorRow label='Primary Button'    storeKey='primary_color' />
          <ColorRow label='Text Color'        storeKey='text_color' />
        </div>
      </Section>

      {/* 3. Typography */}
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

      {/* 4. Shape & Card */}
      <Section title='Shape & Card' icon={<Layers size={20} />} sectionKey='shape' openSections={openSections} toggleSection={toggleSection}>
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

      {/* 5. Buttons & Inputs */}
      <Section title='Buttons & Inputs' icon={<MousePointer2 size={20} />} sectionKey='buttons' openSections={openSections} toggleSection={toggleSection}>
        <div className='space-y-5'>
          <OptionGroup
            label='Button Style'
            storeKey='button_style'
            options={[{ value: 'filled', label: 'Filled' }, { value: 'outlined', label: 'Outlined' }, { value: 'ghost', label: 'Ghost' }]}
          />
          <OptionGroup
            label='Input Style'
            storeKey='input_style'
            options={[{ value: 'filled', label: 'Filled' }, { value: 'outlined', label: 'Outlined' }]}
          />
          <ColorRow label='Input Border Color' storeKey='input_border_color' />
        </div>
      </Section>

      {/* 6. Layout */}
      <Section title='Layout' icon={<LayoutTemplate size={20} />} sectionKey='layout' openSections={openSections} toggleSection={toggleSection}>
        <div className='space-y-5'>
          <OptionGroup
            label='Logo Position'
            storeKey='logo_position'
            options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]}
          />
          <OptionGroup
            label='Social Button Layout'
            storeKey='social_layout'
            options={[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }, { value: 'compact', label: 'Compact' }]}
          />
        </div>
      </Section>

      {/* 7. Background */}
      <Section title='Background' icon={<ImageIcon size={20} />} sectionKey='background' openSections={openSections} toggleSection={toggleSection}>
        <div className='space-y-4'>
          <OptionGroup
            label='Pattern'
            storeKey='bg_pattern'
            options={[
              { value: 'solid', label: 'Solid' },
              { value: 'dots', label: 'Dots' },
              { value: 'diagonal', label: 'Lines' },
              { value: 'gradient', label: 'Gradient' },
            ]}
          />
          {uiConfig.bg_pattern === 'gradient' && (
            <div className='space-y-3 pt-4 border-t border-[var(--border-glass)]'>
              <ColorRow label='Gradient Start'  storeKey='gradient_start' />
              <ColorRow label='Gradient End'    storeKey='gradient_end' />
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
        </div>
      </Section>

      {/* 8. Custom CSS */}
      <Section title='Custom CSS' icon={<Code2 size={20} />} sectionKey='css' openSections={openSections} toggleSection={toggleSection}>
        <div className='space-y-3'>
          <p className='text-[var(--text-dim)] text-[11px] font-bold uppercase tracking-widest'>Injected directly into preview</p>
          <textarea
            value={uiConfig.custom_css}
            onChange={(e) => updateUIConfig('custom_css', e.target.value)}
            rows={7}
            placeholder={'/* Your custom CSS */\n.auth-card { ... }'}
            className='w-full bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-[1.5rem] px-5 py-4 text-indigo-500/90 text-xs font-mono focus:outline-none focus:border-indigo-500/40 focus:bg-[var(--bg-surface)] transition-all resize-none placeholder-[var(--text-dim)] custom-scrollbar shadow-inner'
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
