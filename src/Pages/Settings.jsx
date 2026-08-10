import React, { useState, useEffect } from 'react';
import { useNetworkCalls } from '../Utils/NetworkCalls';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, AlertTriangle, ShieldAlert, CreditCard, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '../Store/useToastStore';

export const SettingsPage = () => {
  const { call } = useNetworkCalls();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('billing');
  
  // Billing State
  const [billingName, setBillingName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [loadingSave, setLoadingSave] = useState(false);
  
  // Danger Zone State
  const [deleteReason, setDeleteReason] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = input reason, 2 = verify OTP
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await call({ method: 'GET', path: '/user/profile', withCred: true });
      if (res) {
        setBillingName(res.billing_name || '');
        setBillingAddress(res.billing_address || '');
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setLoadingSave(true);
    const res = await call({ 
      method: 'POST', 
      path: '/user/profile/update', 
      withCred: true,
      data: { billing_name: billingName, billing_address: billingAddress }
    });
    if (res) {
      useToastStore.getState().addToast('Settings saved successfully', 'success');
    }
    setLoadingSave(false);
  };

  const handleRequestDelete = async () => {
    if (!deleteReason || deleteReason.length < 10) {
      useToastStore.getState().addToast('Please provide a brief reason (min 10 characters)', 'error');
      return;
    }
    setLoadingDelete(true);
    const res = await call({
      method: 'POST',
      path: '/user/delete/request-otp',
      withCred: true,
      data: { reason: deleteReason }
    });
    if (res) {
      useToastStore.getState().addToast('OTP sent to your email', 'success');
      setStep(2);
    }
    setLoadingDelete(false);
  };

  const handleVerifyDelete = async () => {
    if (!otp) return;
    setLoadingDelete(true);
    const res = await call({
      method: 'POST',
      path: '/user/delete/verify',
      withCred: true,
      data: { otp }
    });
    if (res) {
      useToastStore.getState().addToast(res.message || 'Account successfully deleted.', 'success');
      // Trigger logout
      const logoutRes = await call({method: 'GET', path: '/user/auth/logout', withCred: true});
      if (logoutRes) {
        navigate('/');
      } else {
        navigate('/');
      }
    }
    setLoadingDelete(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full pb-24 relative z-10 min-h-full overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-main)] mb-2 flex items-center gap-3">
          <SettingsIcon size={32} className="text-[var(--accent-cyan)]" /> Settings
        </h1>
        <p className="text-[var(--text-muted)] text-sm md:text-base">
          Manage your billing profile, application preferences, and account settings.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('billing')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
              activeTab === 'billing' ? 'bg-cyan-50 text-cyan-700 shadow-sm border border-cyan-100' : 'text-slate-500 hover:bg-slate-50 border border-transparent'
            }`}
          >
            <CreditCard size={18} /> Billing Profile
          </button>
          
          <button
            onClick={() => setActiveTab('danger')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
              activeTab === 'danger' ? 'bg-red-50 text-red-700 shadow-sm border border-red-100' : 'text-slate-500 hover:bg-slate-50 border border-transparent'
            }`}
          >
            <ShieldAlert size={18} /> Danger Zone
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 md:p-8 min-h-[400px]">
          {activeTab === 'billing' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Billing Information</h2>
              <p className="text-sm text-slate-500 mb-6">This information will be displayed on your invoices and receipts.</p>
              
              <div className="space-y-5 max-w-md">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Billing Name</label>
                  <input
                    type="text"
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                    placeholder="e.g. Acme Corporation"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Billing Address</label>
                  <textarea
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    rows={4}
                    placeholder="Full company address..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all text-slate-700 resize-none"
                  />
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={loadingSave}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 w-full mt-4"
                >
                  {loadingSave ? <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span> : <><Save size={18} /> Save Settings</>}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'danger' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-xl font-bold text-red-600 mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
                <AlertTriangle size={20} /> Delete Account
              </h2>
              
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-8">
                <h3 className="text-red-800 font-bold mb-2">Warning: Irreversible Action</h3>
                <p className="text-red-600/80 text-sm">
                  Deleting your account will permanently wipe all your projects, API keys, active subscriptions, and user authentication logs. This action cannot be undone.
                </p>
              </div>

              {step === 1 ? (
                <div className="space-y-4 max-w-md">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Why are you leaving?</label>
                  <textarea
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    rows={3}
                    placeholder="Please tell us why you are deleting your account..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-slate-700 resize-none"
                  />
                  <button
                    onClick={handleRequestDelete}
                    disabled={loadingDelete}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2 w-full"
                  >
                    {loadingDelete ? 'Processing...' : 'Request Deletion OTP'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-w-md animate-fade-in-up">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Enter Verification Code</label>
                  <p className="text-xs text-slate-500 mb-2">We sent a 6-digit code to your email. Enter it below to confirm deletion.</p>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-slate-700 text-center text-xl tracking-widest font-mono font-bold"
                    maxLength={6}
                  />
                  <button
                    onClick={handleVerifyDelete}
                    disabled={loadingDelete}
                    className="px-6 py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 w-full"
                  >
                    {loadingDelete ? 'Deleting...' : 'Permanently Delete Account'}
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    className="w-full text-center text-sm font-bold text-slate-500 hover:text-slate-700 mt-4"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
