import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNetworkCalls } from '../Utils/NetworkCalls';
import { FileText, Calendar, IndianRupee, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const { call } = useNetworkCalls();

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      const res = await call({ method: 'GET', path: '/billing/invoices', withCred: true });
      if (res) {
        setInvoices(res);
      }
      setLoading(false);
    };
    fetchInvoices();
  }, []);

  const pendingInvoices = invoices.filter(inv => inv.status === 'pending');
  const completedInvoices = invoices.filter(inv => inv.status === 'completed');

  const displayedInvoices = activeTab === 'pending' ? pendingInvoices : completedInvoices;

  return (
    <div className="w-full flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent-cyan)]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="flex-1 px-4 md:px-12 py-8 md:py-12 relative z-10 max-w-5xl mx-auto w-full">
        
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--text-main)] tracking-tight mb-4">
            Billing & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-sky-400">Invoices</span>
          </h1>
          <p className="text-slate-500 text-lg">Manage your SMS OTP usage and subscription payments.</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'pending' ? 'border-cyan-600 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Clock size={18} className={activeTab === 'pending' ? 'text-cyan-600' : ''} />
            Pending ({pendingInvoices.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'completed' ? 'border-cyan-600 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <CheckCircle2 size={18} className={activeTab === 'completed' ? 'text-cyan-600' : ''} />
            Completed ({completedInvoices.length})
          </button>
        </div>

        {/* Invoice List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-cyan-200 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : displayedInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No {activeTab} invoices</h3>
            <p className="text-slate-500 text-sm mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {displayedInvoices.map((invoice, i) => (
                <motion.div
                  key={invoice._id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="flex gap-4 items-start">
                    <div className={`p-3 rounded-xl flex-shrink-0 ${activeTab === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">{invoice.description || 'Monthly Usage'}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(invoice.created_at).toLocaleDateString()}</span>
                        {invoice.razorpay_order_id && <span className="text-slate-400">Order: {invoice.razorpay_order_id}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t border-slate-100 md:border-0 pt-4 md:pt-0">
                    <div className="text-right">
                      <div className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">Amount</div>
                      <div className="text-xl font-black text-slate-900 flex items-center">
                        <IndianRupee size={18} /> {invoice.amount}
                      </div>
                    </div>
                    
                    {activeTab === 'pending' && (
                      <button className="bg-slate-900 hover:bg-cyan-600 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm">
                        Pay Now
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
};
