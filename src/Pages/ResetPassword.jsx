import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Check, AlertTriangle, Lock } from 'lucide-react';
import axios from 'axios';

const backend_url = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

export const ResetPassword = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({ new_password: '', confirm_password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!formData.new_password || !formData.confirm_password) {
      setError('Please fill in both fields');
      return;
    }
    if (formData.new_password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.new_password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${backend_url}/auth/forgot-password/reset`, {
        token,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password
      });
      setSuccess(true);
      if (res.data.redirect_url) {
        setRedirectUrl(res.data.redirect_url);
        setTimeout(() => {
          window.location.href = res.data.redirect_url;
        }, 3000);
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : detail?.message || 'Failed to reset password. The link may have expired.');
    }
    setLoading(false);
  };

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 relative overflow-hidden'>
      {/* Decorative background */}
      <div className='absolute inset-0 pointer-events-none'
        style={{ backgroundImage: 'radial-gradient(circle, rgba(79,70,229,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className='absolute w-96 h-96 rounded-full pointer-events-none opacity-10 blur-3xl'
        style={{ backgroundColor: '#4f46e5', top: '10%', left: '50%', transform: 'translateX(-50%)' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className='relative w-full max-w-sm mx-4 p-8 z-10 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl'
      >
        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='flex flex-col items-center justify-center py-6 text-center space-y-4'>
            <div className='w-16 h-16 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600'>
              <Check size={32} />
            </div>
            <div>
              <h2 className='text-lg font-bold text-slate-900'>Password Reset!</h2>
              <p className='text-sm mt-2 text-slate-500'>
                Your password has been reset successfully.
                {redirectUrl && ' Redirecting you back...'}
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            <div className='flex flex-col items-center mb-7 text-center'>
              <div className='w-14 h-14 flex items-center justify-center mb-4 rounded-2xl bg-indigo-100 text-indigo-600 border border-indigo-200/50'>
                <Lock size={24} />
              </div>
              <h1 className='font-bold text-xl tracking-tight text-slate-900'>Reset Password</h1>
              <p className='text-xs mt-1.5 text-slate-400'>Enter your new password below</p>
            </div>

            {error && (
              <div className='flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200/50 rounded-xl'>
                <AlertTriangle size={14} className='text-red-500 flex-shrink-0' />
                <p className='text-red-600 text-xs'>{error}</p>
              </div>
            )}

            <div className='space-y-4'>
              <div className='space-y-2 text-left'>
                <label className='text-[11px] font-bold uppercase tracking-wider block text-slate-400'>New Password</label>
                <div className='relative'>
                  <input
                    name='new_password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    value={formData.new_password}
                    onChange={handleChange}
                    className='w-full px-4 py-3 text-sm outline-none border border-slate-200 rounded-xl bg-white text-slate-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all'
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors'>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className='space-y-2 text-left'>
                <label className='text-[11px] font-bold uppercase tracking-wider block text-slate-400'>Confirm Password</label>
                <div className='relative'>
                  <input
                    name='confirm_password'
                    type={showConfirm ? 'text' : 'password'}
                    placeholder='••••••••'
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className='w-full px-4 py-3 text-sm outline-none border border-slate-200 rounded-xl bg-white text-slate-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all'
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors'>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {formData.new_password && formData.confirm_password && formData.new_password !== formData.confirm_password && (
                <p className='text-xs text-amber-500 flex items-center gap-1'>
                  <AlertTriangle size={12} /> Passwords don't match
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-3 font-bold text-sm text-white rounded-xl transition-all relative overflow-hidden ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98] hover:shadow-lg'
                }`}
                style={{ backgroundColor: '#4f46e5', boxShadow: '0 10px 25px -5px rgba(79,70,229,0.4)' }}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
