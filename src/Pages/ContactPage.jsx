import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, MapPin, Building, User, Send, CheckCircle2,
  HelpCircle, ArrowLeft, ExternalLink, ChevronDown, Clock,
  MessageSquare, ShieldCheck, Zap, Globe, Search
} from 'lucide-react';
import { APP_CONFIG } from '../config';

const backend_url = APP_CONFIG.BACKEND_URL;

// Country list
const COUNTRIES = [
  'India', 'United States', 'United Arab Emirates', 'United Kingdom',
  'Singapore', 'Australia', 'Canada', 'Germany', 'Saudi Arabia', 'Qatar',
  'Oman', 'Kuwait', 'Malaysia', 'Other Country'
];

// Indian States
const INDIAN_STATES = [
  'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Telangana', 'Delhi',
  'Kerala', 'Gujarat', 'Uttar Pradesh', 'West Bengal', 'Rajasthan',
  'Andhra Pradesh', 'Madhya Pradesh', 'Punjab', 'Haryana', 'Bihar',
  'Odisha', 'Goa', 'Assam', 'Other State'
];

// District mapping for key states
const STATE_DISTRICTS = {
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli (Trichy)', 'Salem',
    'Tirunelveli', 'Erode', 'Tiruppur', 'Vellore', 'Thanjavur', 'Dindigul',
    'Chengalpattu', 'Kanchipuram', 'Virudhunagar', 'Tenkasi', 'Kanyakumari',
    'Other District'
  ],
  'Karnataka': [
    'Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Mangaluru', 'Hubballi-Dharwad',
    'Belagavi', 'Kalaburagi', 'Udupi', 'Shivamogga', 'Tumakuru', 'Other District'
  ],
  'Maharashtra': [
    'Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Thane', 'Nashik',
    'Navi Mumbai', 'Chhatrapati Sambhajinagar', 'Kolhapur', 'Other District'
  ],
  'Telangana': [
    'Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Rangareddy',
    'Medchal-Malkajgiri', 'Other District'
  ],
  'Delhi': [
    'Central Delhi', 'New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Other District'
  ],
  'Kerala': [
    'Kochi / Ernakulam', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam',
    'Palakkad', 'Kannur', 'Alappuzha', 'Kottayam', 'Other District'
  ],
  'Gujarat': [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar', 'Other District'
  ],
  'Uttar Pradesh': [
    'Noida / Gautam Buddha Nagar', 'Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Ghaziabad', 'Other District'
  ],
  'West Bengal': [
    'Kolkata', 'Howrah', 'North 24 Parganas', 'South 24 Parganas', 'Siliguri', 'Other District'
  ],
  'Andhra Pradesh': [
    'Visakhapatnam', 'Vijayawada / NTR', 'Guntur', 'Tirupati', 'Nellore', 'Kurnool', 'Other District'
  ]
};

// Searchable Custom Select Component
const CustomSelect = ({ options, value, onChange, placeholder = 'Select option' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const selectRef = useRef(null);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    return options.filter((opt) => opt.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 px-3.5 rounded-xl border border-slate-300 bg-white flex items-center justify-between text-xs font-medium text-slate-800 shadow-xs cursor-pointer hover:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
      >
        <span className={value ? 'text-slate-900 font-semibold' : 'text-slate-400'}>
          {value || placeholder}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-600' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-56"
          >
            {options.length > 5 && (
              <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <Search size={13} className="text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
                  autoFocus
                />
              </div>
            )}
            <div className="overflow-y-auto flex-1 py-1 custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400">No options found</div>
              ) : (
                filteredOptions.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`px-3 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      value === opt ? 'bg-cyan-50 text-cyan-800 font-black' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt}</span>
                    {value === opt && <CheckCircle2 size={13} className="text-cyan-600" />}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ContactPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    businessName: '',
    country: 'India',
    state: 'Tamil Nadu',
    district: 'Chennai',
    customDistrict: '',
    enquiryType: 'Book a Demo',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Country change
  const handleCountryChange = (newCountry) => {
    setFormData((prev) => ({
      ...prev,
      country: newCountry,
      state: newCountry === 'India' ? prev.state || 'Tamil Nadu' : '',
      district: newCountry === 'India' ? STATE_DISTRICTS[prev.state || 'Tamil Nadu']?.[0] || 'Chennai' : '',
      customDistrict: ''
    }));
  };

  // Handle State change
  const handleStateChange = (newState) => {
    const defaultDistrict = STATE_DISTRICTS[newState]?.[0] || 'Other District';
    setFormData((prev) => ({
      ...prev,
      state: newState,
      district: defaultDistrict,
      customDistrict: ''
    }));
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('Please enter your mobile or phone number.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg('Please enter your work email address.');
      return;
    }

    const resolvedDistrict = formData.country === 'India'
      ? (formData.district === 'Other District' ? formData.customDistrict.trim() || 'Other' : formData.district)
      : (formData.customDistrict.trim() || 'International');

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        business_name: formData.businessName.trim(),
        country: formData.country,
        state: formData.country === 'India' ? formData.state : '',
        district: resolvedDistrict,
        enquiry_type: formData.enquiryType,
        message: formData.message.trim()
      };

      const res = await fetch(`${backend_url}/contact/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to submit enquiry. Please try again.');
      }

      setSubmitted(true);
    } catch (err) {
      // Graceful fallback: even if offline, simulate success for demo or show clear feedback
      console.error('Contact submit error:', err);
      setErrorMsg(err.message || 'Unable to submit enquiry right now. Please message us directly on WhatsApp or Email.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      businessName: '',
      country: 'India',
      state: 'Tamil Nadu',
      district: 'Chennai',
      customDistrict: '',
      enquiryType: 'Book a Demo',
      message: ''
    });
    setSubmitted(false);
    setErrorMsg('');
  };

  const currentDistricts = useMemo(() => {
    return STATE_DISTRICTS[formData.state] || ['Other District'];
  }, [formData.state]);

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-main)] font-sans antialiased selection:bg-cyan-500/20 selection:text-cyan-900 pb-24">
      
      {/* Decorative Glow Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-cyan-200/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-blue-200/20 blur-[140px] rounded-full" />
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#e8ecf4]/90 backdrop-blur-xl border-b border-slate-300/70 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 px-3 rounded-xl text-slate-700 hover:text-slate-900 bg-white/70 hover:bg-white border border-slate-300/60 shadow-xs transition-all flex items-center gap-2 text-xs font-bold"
              title="Return to Home"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
            <div className="h-4 w-px bg-slate-300" />
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-sm">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <img src="/dauth_logo.png" alt="DAuth Logo" className="w-5 h-5 object-contain" />
                </div>
              </div>
              <span className="text-base font-black text-slate-900 tracking-tight">DAuth</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/auth-docs"
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-white/60 hover:bg-white border border-slate-300/50 transition-colors shadow-xs"
            >
              Documentation
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl text-xs font-black bg-cyan-600 text-white hover:bg-cyan-700 transition-all shadow-md shadow-cyan-600/20 active:scale-95"
            >
              Console
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 pt-10 sm:pt-14 px-4 sm:px-6 max-w-6xl mx-auto">
        
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Zap size={14} className="text-cyan-600" />
            <span>We&apos;re here to help you scale</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Get in Touch | Book a Demo
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-medium">
            Have questions about DAuth architecture? Want a personalized live walkthrough of our non-custodial authentication pipeline, verification webhooks, and TOTP 2FA? Submit your enquiry below and our platform specialist will reach out promptly.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Contact Cards, Assurance & FAQs (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Direct Cards */}
            <div className="space-y-3.5">
              
              {/* Email Card */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-start gap-3.5 transition-transform hover:-translate-y-0.5">
                <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
                  <Mail size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-black text-slate-900">Email Support</h4>
                  <p className="text-xs text-slate-500 mt-0.5 mb-1.5 font-medium">
                    For enterprise onboarding, business queries & technical architecture.
                  </p>
                  <a
                    href="mailto:debuggerstechs@gmail.com"
                    className="text-cyan-700 font-bold text-sm hover:underline block truncate"
                  >
                    debuggerstechs@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone / WhatsApp Card */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-start gap-3.5 transition-transform hover:-translate-y-0.5">
                <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100">
                  <Phone size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-black text-slate-900">Call / WhatsApp</h4>
                  <p className="text-xs text-slate-500 mt-0.5 mb-1.5 font-medium">
                    Available Monday to Saturday, 9:00 AM – 7:00 PM IST.
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href="tel:+918248692839"
                      className="text-emerald-700 font-bold text-sm hover:underline"
                    >
                      +91 8248692839
                    </a>
                    <span className="text-slate-300">•</span>
                    <a
                      href="https://wa.me/918248692839?text=Hi%20DAuth%20Team,%20I%20would%20like%20to%20learn%20more%20about%20DAuth."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 transition-colors"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Turnaround Alert */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-900 text-xs font-medium">
                <Clock size={16} className="shrink-0 text-amber-600" />
                <span>
                  <strong>Quick Turnaround:</strong> Our dedicated onboarding managers respond within 2 business hours.
                </span>
              </div>
            </div>

            {/* Registered Office Card */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-cyan-50 text-cyan-700 rounded-xl flex items-center justify-center border border-cyan-100">
                  <Building size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Registered Office</h4>
                  <a
                    href="https://debuggerstechnologies.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-700 font-bold hover:underline inline-flex items-center gap-1 group"
                  >
                    <span>Debuggers Technologies</span>
                    <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium pl-1">
                2/483-D Shai Harni Towers, Vasugi Nagar Murugan kovil street, Perungudi, Madurai 625022, Tamil Nadu, India.
              </p>
            </div>

            {/* What Happens Next Card */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-3">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck size={16} className="text-cyan-600" />
                What happens after you submit?
              </h4>
              <div className="space-y-2.5 text-xs text-slate-600 font-medium">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-800 font-black flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <span>
                    <strong>Instant Review:</strong> Our engineering team reviews your authentication requirements, user volume, and webhook targets.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-800 font-black flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <span>
                    <strong>Guided Technical Walkthrough:</strong> We show you how to configure custom branding, token payloads, and 2FA scoping for your domain.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-800 font-black flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <span>
                    <strong>Sandbox Access:</strong> You receive test credentials and quick integration guidelines to test authentication in minutes.
                  </span>
                </div>
              </div>
            </div>

            {/* FAQs Box */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-3">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <HelpCircle size={16} className="text-slate-400" />
                Frequently Asked Questions
              </h4>
              <div className="space-y-3 text-xs text-slate-600 font-medium">
                <div className="border-b border-slate-100 pb-2">
                  <p className="font-bold text-slate-900">Do I have to migrate my users to your database?</p>
                  <p className="text-slate-500 mt-0.5">
                    No! DAuth is non-custodial. Your users, passwords, and records remain entirely inside your own database.
                  </p>
                </div>
                <div className="border-b border-slate-100 pb-2">
                  <p className="font-bold text-slate-900">How long does integration take?</p>
                  <p className="text-slate-500 mt-0.5">
                    Most applications integrate in under 10 minutes using standard OAuth redirect flows and REST API endpoints — no client SDKs or heavy libraries required.
                  </p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Can I whitelabel the login portal?</p>
                  <p className="text-slate-500 mt-0.5">
                    Yes! You can customize card colors, gradients, logos, input styles, fonts, and custom CSS live from the dashboard.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Form (7 cols, sticky on lg) */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200">
            
            {submitted ? (
              <div className="text-center py-12 px-4 space-y-6 animate-in fade-in zoom-in-95 duration-400">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                  <CheckCircle2 size={44} className="stroke-[2.5]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">Enquiry Received!</h3>
                  <p className="text-slate-600 max-w-md mx-auto text-sm leading-relaxed font-medium">
                    Thank you <strong className="text-slate-900 font-bold">{formData.name}</strong>! Your demo and consultation request has been sent directly to our product engineering team at <span className="text-cyan-700 font-bold">debuggerstechs@gmail.com</span>.
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    We will call or email you at <strong className="text-slate-800">{formData.phone}</strong> shortly.
                  </p>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-600 text-white font-black text-xs hover:bg-cyan-700 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Submit Another Enquiry
                  </button>
                  <button
                    onClick={() => navigate('/auth-docs')}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
                  >
                    Explore Documentation
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <h3 className="text-xl font-black text-slate-900">Enquiry & Demo Request</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Fill in your project details and our team will get back to you with custom demo access.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2">
                    <span className="shrink-0 text-base">⚠️</span>
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Interest selection pills */}
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    I am interested in:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      'Book a Demo',
                      'Enterprise & High Volume',
                      'Custom Webhooks',
                      'General Enquiry'
                    ].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, enquiryType: type }))}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center cursor-pointer ${
                          formData.enquiryType === type
                            ? 'bg-cyan-50 border-cyan-500 text-cyan-800 ring-1 ring-cyan-400 font-black'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Phone */}
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="John Doe"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all placeholder:text-slate-400 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all placeholder:text-slate-400 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Email & Business */}
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                      Work Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="john@example.com"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all placeholder:text-slate-400 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                      Company / App Name <span className="text-slate-400 font-normal lowercase">(optional)</span>
                    </label>
                    <div className="relative">
                      <Building size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, businessName: e.target.value }))}
                        placeholder="e.g. Acme Corp, FinTech App"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all placeholder:text-slate-400 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Box with Country, State, District */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-800 uppercase tracking-wider">
                    <MapPin size={14} className="text-cyan-600" />
                    <span>Location Details</span> <span className="text-rose-500">*</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Country</label>
                      <CustomSelect
                        options={COUNTRIES}
                        value={formData.country}
                        onChange={handleCountryChange}
                        placeholder="Select Country"
                      />
                    </div>

                    {formData.country === 'India' && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">State</label>
                        <CustomSelect
                          options={INDIAN_STATES}
                          value={formData.state}
                          onChange={handleStateChange}
                          placeholder="Select State"
                        />
                      </div>
                    )}

                    {formData.country === 'India' ? (
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">District / City</label>
                        <CustomSelect
                          options={currentDistricts}
                          value={formData.district}
                          onChange={(d) => setFormData((prev) => ({ ...prev, district: d }))}
                          placeholder="Select District"
                        />
                        {formData.district === 'Other District' && (
                          <div className="mt-1.5">
                            <input
                              type="text"
                              value={formData.customDistrict}
                              onChange={(e) => setFormData((prev) => ({ ...prev, customDistrict: e.target.value }))}
                              placeholder="Please enter your specific district / city name"
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-cyan-500 outline-none bg-white font-medium"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">City / Province / Region</label>
                        <div className="relative">
                          <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={formData.customDistrict}
                            onChange={(e) => setFormData((prev) => ({ ...prev, customDistrict: e.target.value }))}
                            placeholder="e.g. Dubai, London, New York"
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:border-cyan-500 outline-none font-medium"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                    How can we help? <span className="text-slate-400 font-normal lowercase">(optional message)</span>
                  </label>
                  <div className="relative">
                    <MessageSquare size={15} className="absolute left-3 top-2.5 text-slate-400" />
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Tell us about your tech stack, user scale, verification requirements, or questions..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all placeholder:text-slate-400 resize-none font-medium"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-sm shadow-md shadow-cyan-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Submit Enquiry | Book Demo</span>
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

        </div>

      </main>

    </div>
  );
};
