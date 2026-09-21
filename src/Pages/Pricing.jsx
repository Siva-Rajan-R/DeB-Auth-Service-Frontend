import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowLeft, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useToastStore } from '../Store/useToastStore';
import { useNetworkCalls } from '../Utils/NetworkCalls';

export const PricingPage = () => {
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);
  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error')
  };
  const { call } = useNetworkCalls();
  const [currentPlan, setCurrentPlan] = useState('Free');
  const [billingInfo, setBillingInfo] = useState(null);
  const [loading, setLoading] = useState(null);

  const apiKey = Cookies.get('selected_project_api_key') || Cookies.get('api_key') || 'default_key';

  useEffect(() => {
    fetchCurrentBilling();
  }, []);

  const fetchCurrentBilling = async () => {
    try {
      // Try /billing/subscription first (returns { plan, status, current_period_end })
      const subRes = await call({ method: 'GET', path: '/billing/subscription', withCred: true });
      if (subRes && (subRes.plan || subRes.current_plan)) {
        const plan = subRes.plan || subRes.current_plan;
        setCurrentPlan(plan);
      }

      // Also fetch billing info for detailed info
      const res = await call({ method: 'GET', path: `/billing/info?api_key=${apiKey}`, withCred: true });
      if (res && res.data) {
        setBillingInfo(res.data);
        // API returns `plan` field (not `current_plan`)
        const planFromInfo = res.data.plan || res.data.current_plan;
        if (planFromInfo) {
          setCurrentPlan(planFromInfo);
        }
      }
    } catch (err) {
      console.error("Failed to fetch billing info:", err);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (planName, amountInInr) => {
    setLoading(planName);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setLoading(null);
        return;
      }

      const orderRes = await call({
        method: 'POST',
        path: '/billing/create-order',
        data: { api_key: apiKey, plan_name: planName, amount: amountInInr },
        withCred: true
      });

      if (!orderRes || !orderRes.order_id) {
        toast.error(orderRes?.message || "Failed to create payment order");
        setLoading(null);
        return;
      }

      const options = {
        key: orderRes.razorpay_key,
        amount: orderRes.amount,
        currency: orderRes.currency,
        name: "DAuth",
        description: `Upgrade to ${planName} Plan`,
        order_id: orderRes.order_id,
        handler: async function (response) {
          try {
            const verifyRes = await call({
              method: 'POST',
              path: '/billing/verify-payment',
              data: {
                api_key: apiKey,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                plan_name: planName
              },
              withCred: true
            });

            if (verifyRes && verifyRes.success) {
              toast.success(`Successfully upgraded to ${planName} Plan!`);
              setCurrentPlan(planName);
              fetchCurrentBilling();
            } else {
              toast.error(verifyRes?.message || "Payment verification failed.");
            }
          } catch (err) {
            toast.error("Error verifying payment.");
          } finally {
            setLoading(null);
          }
        },
        prefill: {
          name: Cookies.get('user_name') || "",
          email: Cookies.get('user_email') || "",
        },
        theme: {
          color: "#00d2e5",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      toast.error("An error occurred starting payment.");
      setLoading(null);
    }
  };

  const handleDowngrade = async () => {
    if (confirm("Are you sure you want to downgrade to Community Free Plan?")) {
      setLoading('Community');
      try {
        const res = await call({
          method: 'POST',
          path: '/billing/downgrade',
          data: { api_key: apiKey, plan_name: 'Community' },
          withCred: true
        });

        if (res && res.success) {
          toast.success("Successfully downgraded to Community Plan.");
          setCurrentPlan('Community');
          fetchCurrentBilling();
        } else {
          toast.error(res?.message || "Failed to downgrade plan.");
        }
      } catch (err) {
        toast.error("Error downgrading plan.");
      } finally {
        setLoading(null);
      }
    }
  };

  const FeatureRow = ({ children, highlighted = false }) => (
    <li className="flex items-start gap-3">
      <Check size={18} className={`${highlighted ? 'text-cyan-200' : 'text-blue-500'} flex-shrink-0 mt-0.5`} />
      <span className={highlighted ? 'text-white' : 'text-slate-600'}>{children}</span>
    </li>
  );

  return (
    <div className="text-slate-900 font-sans">
      <main className="max-w-7xl mx-auto px-6 pt-10 pb-24 space-y-12">

        {/* Back Button Row */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
            <span>Current Plan:</span>
            <span className="px-3 py-1 bg-cyan-100 border border-cyan-200 text-cyan-800 rounded-full font-bold uppercase tracking-wider">
              {currentPlan}
            </span>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Flexible Plans for Every Stage
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Scale your authentication infrastructure seamlessly. Upgrade or downgrade anytime with instant authorization activation.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Community Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Community</h3>
                <p className="text-xs text-slate-500 min-h-[36px]">Perfect for personal projects and learning.</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-black text-slate-900">Free</span>
              </div>
              <button 
                onClick={handleDowngrade}
                disabled={loading === 'Community' || currentPlan === 'Community' || currentPlan === 'Free'}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-xs transition-colors mb-8 ${
                  currentPlan === 'Community' || currentPlan === 'Free' 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {currentPlan === 'Community' || currentPlan === 'Free' ? 'Current Plan' : loading === 'Community' ? 'Processing...' : 'Downgrade to Community'}
              </button>
              <ul className="space-y-3 text-xs">
                <FeatureRow>1 Project limit</FeatureRow>
                <FeatureRow>2,100 Auth Requests / mo</FeatureRow>
                <FeatureRow>All Authentication Providers</FeatureRow>
                <FeatureRow>Up to 2 Custom Signup Fields</FeatureRow>
                <FeatureRow>Email OTP Included</FeatureRow>
              </ul>
            </div>
          </motion.div>

          {/* Growth Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Growth</h3>
                <p className="text-xs text-slate-500 min-h-[36px]">For startups and growing applications.</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-black text-slate-900">₹499</span>
                <span className="text-slate-500 text-sm font-semibold">/mo</span>
              </div>
              <button 
                onClick={() => handleSubscribe('Growth', 499)}
                disabled={loading === 'Growth' || currentPlan === 'Growth'}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-colors mb-8 ${
                  currentPlan === 'Growth' 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
                }`}
              >
                {currentPlan === 'Growth' ? 'Current Plan' : loading === 'Growth' ? 'Processing...' : 'Subscribe Now'}
              </button>
              <ul className="space-y-3 text-xs">
                <FeatureRow>2 Projects</FeatureRow>
                <FeatureRow>13,500 Auth Requests / mo</FeatureRow>
                <FeatureRow>Full Brand Customization</FeatureRow>
                <FeatureRow>Up to 6 Custom Signup Fields</FeatureRow>
                <FeatureRow>Location-Based Access</FeatureRow>
              </ul>
            </div>
          </motion.div>

          {/* Scale Plan — HIGHLIGHTED MOST POPULAR (Screenshot requested) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-cyan-500 rounded-3xl p-8 border border-cyan-400 shadow-2xl shadow-cyan-500/30 flex flex-col justify-between relative transform lg:-translate-y-2 z-10"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-md">
              MOST POPULAR
            </div>
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Scale</h3>
                <p className="text-xs text-cyan-100 min-h-[36px]">For production apps with growing users.</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">₹999</span>
                <span className="text-cyan-100 text-sm font-semibold">/mo</span>
              </div>
              <button 
                onClick={() => handleSubscribe('Scale', 999)}
                disabled={loading === 'Scale' || currentPlan === 'Scale'}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-colors mb-8 ${
                  currentPlan === 'Scale' 
                    ? 'bg-cyan-700 text-cyan-200 cursor-not-allowed' 
                    : 'bg-white text-cyan-800 hover:bg-slate-100 shadow-md'
                }`}
              >
                {currentPlan === 'Scale' ? 'Current Plan' : loading === 'Scale' ? 'Processing...' : 'Subscribe Now'}
              </button>
              <ul className="space-y-3 text-xs text-white">
                <FeatureRow highlighted>3 Projects</FeatureRow>
                <FeatureRow highlighted>40,500 Auth Requests / mo</FeatureRow>
                <FeatureRow highlighted>Up to 12 Custom Signup Fields</FeatureRow>
                <FeatureRow highlighted>Priority Support</FeatureRow>
                <FeatureRow highlighted>All Growth Features</FeatureRow>
              </ul>
            </div>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col justify-between text-white"
          >
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                <p className="text-xs text-slate-400 min-h-[36px]">Custom infrastructure for organizations.</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">Custom</span>
              </div>
              <button 
                onClick={() => window.open('mailto:contact@debuggerstechnologies.com', '_blank')}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition-colors mb-8"
              >
                Contact Sales
              </button>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-3"><Check size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" /> Custom Request Limits</li>
                <li className="flex items-start gap-3"><Check size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" /> Dedicated Infrastructure</li>
                <li className="flex items-start gap-3"><Check size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" /> Unlimited Custom Fields</li>
                <li className="flex items-start gap-3"><Check size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" /> SLA & Priority Response</li>
              </ul>
            </div>
          </motion.div>

        </div>

        {/* Mobile SMS OTP Billing Card (Matching Screenshot) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-2xl text-cyan-600">
              <Smartphone size={28} />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900">Mobile SMS OTP Billing</h4>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                Email OTP is included at no additional cost across all plans. SMS OTP is billed separately on a pay-as-you-go basis and invoiced monthly.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 shrink-0">
            <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 border border-slate-200 rounded-lg text-slate-800">
              IN India
            </span>
            <span className="text-sm font-extrabold text-cyan-600">
              ₹0.40 per SMS OTP
            </span>
          </div>
        </div>

      </main>
    </div>
  );
};
