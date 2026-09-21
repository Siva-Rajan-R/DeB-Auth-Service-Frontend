import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNetworkCalls } from '../../Utils/NetworkCalls';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { format, subMonths } from 'date-fns';
import { Calendar, CreditCard, Activity, Zap, ChevronDown, Check, ShieldAlert, FileClock, Search, Filter, Mail, Phone } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const AnalyticsPanel = ({ apikey }) => {
  const [data, setData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [ipAbuse, setIpAbuse] = useState([]);
  const [userOtpAbuse, setUserOtpAbuse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  // Audit Logs Filter States
  const [searchIdentifier, setSearchIdentifier] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [methodDropdownOpen, setMethodDropdownOpen] = useState(false);
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);
  const methodDropdownRef = useRef(null);
  const eventDropdownRef = useRef(null);

  // OTP Breakdown States (Backend paginated)
  const [rightCardTab, setRightCardTab] = useState('ip'); // 'ip' | 'user'
  const [otpItems, setOtpItems] = useState([]);
  const [otpPage, setOtpPage] = useState(1);
  const [otpHasMore, setOtpHasMore] = useState(true);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingMoreOtp, setLoadingMoreOtp] = useState(false);
  const [otpSearch, setOtpSearch] = useState('');
  
  const { call } = useNetworkCalls();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (methodDropdownRef.current && !methodDropdownRef.current.contains(e.target)) {
        setMethodDropdownOpen(false);
      }
      if (eventDropdownRef.current && !eventDropdownRef.current.contains(e.target)) {
        setEventDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDateParams = () => {
    if (isCustomRange && startDate && endDate) {
      return `&start_date=${format(startDate, 'yyyy-MM-dd')}&end_date=${format(endDate, 'yyyy-MM-dd')}`;
    } else if (selectedMonth && selectedMonth !== 'overall') {
      return `&month=${selectedMonth}`;
    }
    return '';
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    let path = `/analytics/${apikey}`;
    if (isCustomRange && startDate && endDate) {
      path += `?start_date=${format(startDate, 'yyyy-MM-dd')}&end_date=${format(endDate, 'yyyy-MM-dd')}`;
    } else {
      path += `?month=${selectedMonth === 'overall' ? '' : selectedMonth}`;
    }
    const res = await call({ method: 'GET', path, withCred: true });
    if (res) setData(res);
    setLoading(false);
  };

  const fetchLogs = async (pageNum = 1, isAppend = false) => {
    if (isAppend) {
      setLoadingMore(true);
    } else {
      setLoadingLogs(true);
    }

    let path = `/analytics/${apikey}/logs?page=${pageNum}&limit=20${getDateParams()}`;
    if (searchIdentifier.trim()) {
      path += `&identifier=${encodeURIComponent(searchIdentifier.trim())}`;
    }
    if (methodFilter && methodFilter !== 'ALL') {
      path += `&method=${encodeURIComponent(methodFilter)}`;
    }
    if (eventFilter && eventFilter !== 'ALL') {
      path += `&event_type=${encodeURIComponent(eventFilter)}`;
    }

    const logsRes = await call({ method: 'GET', path, withCred: true });
    if (logsRes && logsRes.logs) {
      if (isAppend) {
        setLogs(prev => [...prev, ...logsRes.logs]);
      } else {
        setLogs(logsRes.logs);
        if (logsRes.ip_abuse) setIpAbuse(logsRes.ip_abuse);
        if (logsRes.user_otp_abuse) setUserOtpAbuse(logsRes.user_otp_abuse);
      }
      setPage(pageNum);
      setHasMore(logsRes.has_more ?? false);
    }

    setLoadingLogs(false);
    setLoadingMore(false);
  };

  const fetchOtpBreakdown = async (pageNum = 1, isAppend = false) => {
    if (isAppend) {
      setLoadingMoreOtp(true);
    } else {
      setLoadingOtp(true);
    }

    let path = `/analytics/${apikey}/otp-breakdown?by=${rightCardTab}&page=${pageNum}&limit=20${getDateParams()}`;
    if (otpSearch.trim()) {
      path += `&search=${encodeURIComponent(otpSearch.trim())}`;
    }

    const res = await call({ method: 'GET', path, withCred: true });
    if (res && res.items) {
      if (isAppend) {
        setOtpItems(prev => [...prev, ...res.items]);
      } else {
        setOtpItems(res.items);
      }
      setOtpPage(pageNum);
      setOtpHasMore(res.has_more ?? false);
    }

    setLoadingOtp(false);
    setLoadingMoreOtp(false);
  };

  const refreshAllData = () => {
    fetchAnalytics();
    fetchLogs(1, false);
    fetchOtpBreakdown(1, false);
  };

  useEffect(() => {
    if (apikey && !isCustomRange) {
      refreshAllData();
    }
  }, [apikey, selectedMonth, isCustomRange]);

  // Trigger backend filtered fetch with debounce for search
  useEffect(() => {
    if (!apikey) return;
    const timer = setTimeout(() => {
      fetchLogs(1, false);
    }, 300);
    return () => clearTimeout(timer);
  }, [apikey, searchIdentifier, methodFilter, eventFilter]);

  // Trigger backend OTP breakdown fetch when tab/search changes
  useEffect(() => {
    if (!apikey) return;
    const timer = setTimeout(() => {
      fetchOtpBreakdown(1, false);
    }, 300);
    return () => clearTimeout(timer);
  }, [apikey, rightCardTab, otpSearch]);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < 40) {
      if (hasMore && !loadingMore && !loadingLogs) {
        fetchLogs(page + 1, true);
      }
    }
  };

  const handleOtpScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < 40) {
      if (otpHasMore && !loadingMoreOtp && !loadingOtp) {
        fetchOtpBreakdown(otpPage + 1, true);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-cyan-200 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Format data for Recharts
  const methodData = data?.methods ? Object.keys(data.methods).map(key => ({
    name: key,
    count: data.methods[key]
  })) : [];

  const dailyData = data?.daily ? Object.keys(data.daily).sort().map(date => ({
    date: date.slice(8, 10), // just the day
    requests: data.daily[date].total_requests || 0,
    sms: data.daily[date].sms_otp_count || 0
  })) : [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-20">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-cyan-600" size={18} /> Overview
          </h2>
          <p className="text-xs text-slate-500">Track your authentication requests and OTP usage.</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Custom Date Range Inputs */}
          {isCustomRange && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mr-2 z-50">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="dd-MM-yyyy"
                placeholderText="dd-mm-yyyy"
                className="text-sm bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 outline-none focus:border-cyan-500 shadow-sm w-[110px]"
              />
              <span className="text-slate-400 text-sm">to</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="dd-MM-yyyy"
                placeholderText="dd-mm-yyyy"
                className="text-sm bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 outline-none focus:border-cyan-500 shadow-sm w-[110px]"
              />
              <button 
                onClick={refreshAllData}
                disabled={!startDate || !endDate}
                className="ml-1 bg-cyan-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:bg-cyan-700 disabled:opacity-50"
              >
                Apply
              </button>
            </motion.div>
          )}

          {/* Custom Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 shadow-sm transition-all text-sm font-semibold text-slate-700 min-w-[140px] justify-between"
            >
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-cyan-500" />
                {isCustomRange ? 'Custom Range' : selectedMonth === 'overall' ? 'Overall' : selectedMonth === format(new Date(), 'yyyy-MM') ? 'This Month' : 'Last Month'}
              </div>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50"
              >
                {[
                  { value: 'overall', label: 'Overall' },
                  { value: format(new Date(), 'yyyy-MM'), label: 'This Month' },
                  { value: format(subMonths(new Date(), 1), 'yyyy-MM'), label: 'Last Month' },
                  { value: 'custom', label: 'Custom Range...' }
                ].map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => {
                      if (opt.value === 'custom') {
                        setIsCustomRange(true);
                      } else {
                        setIsCustomRange(false);
                        setSelectedMonth(opt.value);
                      }
                      setIsDropdownOpen(false);
                    }}
                    className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    {opt.label}
                    {((!isCustomRange && selectedMonth === opt.value) || (isCustomRange && opt.value === 'custom')) && (
                      <Check size={16} className="text-cyan-600" />
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap size={16} className="text-cyan-600" /> Total Auth Requests
            </div>
            <div className="text-4xl font-black text-slate-900">{data?.total_requests || 0}</div>
          </div>
          <div className="text-xs text-slate-400 mt-2 font-medium">
            {data?.auth_quota === 'Unlimited' ? 'Unlimited Quota' : `${Math.max(0, (data?.auth_quota || 2100) - (data?.total_requests || 0))} requests remaining`}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <CreditCard size={16} className="text-cyan-600" /> SMS OTPs Sent
          </div>
          <div className="text-4xl font-black text-slate-900">{data?.sms_otp_count || 0}</div>
          <div className="text-xs text-slate-400 mt-2 font-medium">Billed at ₹0.40 per SMS</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-600 to-sky-500 rounded-2xl p-6 text-white shadow-md">
          <div className="text-sm font-bold text-cyan-200 uppercase tracking-wider mb-2">
            Top Auth Method
          </div>
          <div className="text-3xl font-black capitalize">
            {methodData.length > 0 ? methodData.sort((a,b) => b.count - a.count)[0].name : 'N/A'}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Daily Traffic */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Daily Traffic</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="requests" name="Auth Requests" stroke="var(--accent-cyan)" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="sms" name="SMS OTPs" stroke="var(--accent-emerald)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Methods Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Methods Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={methodData} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" name="Logins" fill="var(--accent-cyan)" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Logs and Security Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Audit Logs Table */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
              <FileClock className="text-cyan-500" size={16} /> Recent Audit Logs
            </h3>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
            {/* Search Identifier */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search email / phone / ID..."
                value={searchIdentifier}
                onChange={(e) => setSearchIdentifier(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>

            {/* Method Filter — Custom Dropdown */}
            <div className="relative" ref={methodDropdownRef}>
              <button
                onClick={() => { setMethodDropdownOpen(o => !o); setEventDropdownOpen(false); }}
                className="w-full flex items-center justify-between gap-2 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 hover:border-cyan-400 focus:border-cyan-500 transition-all shadow-sm"
              >
                <span>{methodFilter === 'ALL' ? 'All Methods' : methodFilter}</span>
                <ChevronDown size={13} className={`text-slate-400 transition-transform duration-200 ${methodDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {methodDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute top-full left-0 mt-1.5 w-full min-w-[160px] z-50 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/60 overflow-hidden"
                >
                  {['ALL', 'otp-email', 'otp-phone', 'github', 'google', ...Array.from(new Set(logs.map(l => l.method).filter(Boolean)))]
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .map(m => (
                      <button
                        key={m}
                        onClick={() => { setMethodFilter(m); setMethodDropdownOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors ${
                          methodFilter === m
                            ? 'bg-cyan-50 text-cyan-700'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span>{m === 'ALL' ? 'All Methods' : m}</span>
                        {methodFilter === m && <Check size={12} className="text-cyan-600" />}
                      </button>
                    ))}
                </motion.div>
              )}
            </div>

            {/* Event Filter — Custom Dropdown */}
            <div className="relative" ref={eventDropdownRef}>
              <button
                onClick={() => { setEventDropdownOpen(o => !o); setMethodDropdownOpen(false); }}
                className="w-full flex items-center justify-between gap-2 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 hover:border-cyan-400 focus:border-cyan-500 transition-all shadow-sm"
              >
                <span>{eventFilter === 'ALL' ? 'All Events' : eventFilter}</span>
                <ChevronDown size={13} className={`text-slate-400 transition-transform duration-200 ${eventDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {eventDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute top-full left-0 mt-1.5 w-full min-w-[180px] z-50 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/60 overflow-hidden"
                >
                  {['ALL', 'LOGIN_SUCCESS', 'OTP_REQUESTED', 'LOGIN_FAILED', ...Array.from(new Set(logs.map(l => l.event_type).filter(Boolean)))]
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .map(ev => (
                      <button
                        key={ev}
                        onClick={() => { setEventFilter(ev); setEventDropdownOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors ${
                          eventFilter === ev
                            ? 'bg-cyan-50 text-cyan-700'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span>{ev === 'ALL' ? 'All Events' : ev}</span>
                        {eventFilter === ev && <Check size={12} className="text-cyan-600" />}
                      </button>
                    ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Fixed Height Scrollable Table Container with Infinite Scroll */}
          <div 
            onScroll={handleScroll}
            className="overflow-y-auto h-[360px] border border-slate-100 rounded-xl relative custom-scrollbar"
          >
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase bg-slate-100/90 backdrop-blur-sm text-slate-600 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Identifier</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3 text-center">Count</th>
                </tr>
              </thead>
              <tbody>
                {loadingLogs ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading audit logs...</span>
                      </div>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400 text-sm">
                      No audit logs match the current backend filters.
                    </td>
                  </tr>
                ) : (
                  logs.map((log, i) => (
                    <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-xs">{new Date(log.timestamp * 1000).toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{log.ip_address}</td>
                      <td className="px-4 py-3"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">{log.method}</span></td>
                      <td className="px-4 py-3 truncate max-w-[150px] font-medium text-slate-800" title={log.identifier}>{log.identifier}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          log.event_type.includes('SUCCESS') ? 'bg-blue-50 text-blue-600 border border-emerald-200/50' :
                          log.event_type.includes('FAILED') ? 'bg-red-50 text-red-600 border border-red-200/50' :
                          'bg-cyan-50 text-cyan-600 border border-cyan-200/50'
                        }`}>
                          {log.event_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {log.count > 1 || (log.count === 1 && log.method && log.method.includes('otp')) ? (
                          <span className="bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full text-xs font-bold">
                            {log.count || 1}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
                {loadingMore && (
                  <tr>
                    <td colSpan="6" className="text-center py-3 bg-slate-50 text-slate-500 text-xs font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading more logs...</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* IP Tracking / OTP Breakdown by Identifier */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
              <ShieldAlert className="text-red-500" size={16} /> OTP Breakdown
            </h3>
            {/* View Switcher */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
              <button
                onClick={() => setRightCardTab('ip')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                  rightCardTab === 'ip' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                By IP
              </button>
              <button
                onClick={() => setRightCardTab('user')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                  rightCardTab === 'user' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                By User
              </button>
            </div>
          </div>

          {/* Mini Search Input for OTP Breakdown */}
          <div className="relative mb-3">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={rightCardTab === 'ip' ? "Filter by IP..." : "Filter by email / phone..."}
              value={otpSearch}
              onChange={(e) => setOtpSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-slate-700"
            />
          </div>

          {/* Fixed Height Content with Infinite Scroll */}
          <div 
            onScroll={handleOtpScroll}
            className="overflow-y-auto h-[340px] pr-1 custom-scrollbar"
          >
            {loadingOtp ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm gap-2">
                <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading breakdown...</span>
              </div>
            ) : otpItems.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">No OTP breakdown data found.</div>
            ) : (
              <div className="space-y-2">
                {otpItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                    {rightCardTab === 'ip' ? (
                      <div className="font-mono text-xs font-semibold text-slate-700">{item.key}</div>
                    ) : (
                      <div className="flex items-center gap-2 overflow-hidden mr-2">
                        {item.key.includes('@') ? (
                          <Mail size={14} className="text-cyan-500 flex-shrink-0" />
                        ) : (
                          <Phone size={14} className="text-blue-500 flex-shrink-0" />
                        )}
                        <span className="text-xs font-semibold text-slate-800 truncate" title={item.key}>
                          {item.key}
                        </span>
                      </div>
                    )}
                    <div className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${
                      rightCardTab === 'ip'
                        ? item.count > 10 ? 'bg-red-100 text-red-600' : item.count > 5 ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-600'
                        : 'bg-cyan-100 text-cyan-700'
                    }`}>
                      {item.count} {rightCardTab === 'ip' ? (item.count === 1 ? 'hit' : 'hits') : 'OTPs'}
                    </div>
                  </div>
                ))}

                {loadingMoreOtp && (
                  <div className="py-2 text-center text-slate-500 text-xs font-medium flex items-center justify-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading more...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};
