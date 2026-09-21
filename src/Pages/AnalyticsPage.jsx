import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNetworkCalls } from '../Utils/NetworkCalls';
import { AnalyticsPanel } from './DashboardDetail/AnalyticsPanel';
import {
  BarChart2, ArrowLeft, Search, Layers, Key, CheckCircle2, ChevronRight,
  ShieldCheck, Activity, Copy, Check, ChevronDown, ExternalLink, Sparkles
} from 'lucide-react';
import { RiLockPasswordLine } from 'react-icons/ri';
import { MdOutlineSms } from 'react-icons/md';
import { GoogleLogo, GithubLogo, FacebookLogo } from '../Components/BrandLogos';

export const AnalyticsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { call } = useNetworkCalls();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const selectedApikey = searchParams.get('id');
  const selectedProjectName = searchParams.get('name');

  // Fetch all user projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await call({ method: 'GET', path: '/user/secrets', withCred: true });
        if (res?.secrets) {
          setProjects(res.secrets);
        }
      } catch (err) {
        console.error('Failed to load projects for analytics:', err);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const handleSelectProject = (project) => {
    const name = project.configurations?.project_name || project.domain || 'Project';
    setSearchParams({ id: project.apikey, name });
    setIsSwitcherOpen(false);
  };

  const handleClearSelection = () => {
    setSearchParams({});
    setIsSwitcherOpen(false);
  };

  const copyApiKey = (key, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const currentProject = projects.find((p) => p.apikey === selectedApikey);
  const displayName = selectedProjectName || currentProject?.configurations?.project_name || currentProject?.domain || 'Project';

  const filteredProjects = projects.filter((p) => {
    const name = (p.configurations?.project_name || p.domain || '').toLowerCase();
    const key = (p.apikey || '').toLowerCase();
    const q = searchTerm.toLowerCase();
    return name.includes(q) || key.includes(q);
  });

  return (
    <div className="w-full flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden custom-scrollbar bg-[var(--bg-deep)] text-[var(--text-main)]">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-8%] right-[-5%] w-[40%] h-[40%] bg-cyan-200/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-8%] left-[-5%] w-[35%] h-[35%] bg-blue-200/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="flex-1 px-4 md:px-10 py-6 md:py-8 relative z-10 max-w-7xl mx-auto w-full">
        {selectedApikey ? (
          /* =========================================================================
             VIEW 2: FULL ANALYTICS FOR SELECTED PROJECT
             ========================================================================= */
          <div className="space-y-6">
            {/* Top Toolbar / Project Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-card)] border border-slate-200/80 rounded-2xl p-4 md:p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClearSelection}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 transition-all text-slate-700 shadow-sm active:scale-95 flex items-center gap-1.5 text-xs font-extrabold group"
                  title="Back to All Projects"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform text-cyan-600" />
                  <span className="hidden sm:inline">All Projects</span>
                </button>

                <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span>{displayName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300 text-[10px] font-black uppercase">
                        Analytics
                      </span>
                    </h1>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-mono font-bold text-slate-500">{selectedApikey}</span>
                    <button
                      onClick={(e) => copyApiKey(selectedApikey, e)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition-colors"
                      title="Copy API Key"
                    >
                      {copiedKey === selectedApikey ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Project Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSwitcherOpen(v => !v)}
                  className="w-full sm:w-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-cyan-400 text-xs font-bold text-slate-800 shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-cyan-600" />
                    <span>Switch Project</span>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${isSwitcherOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isSwitcherOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 space-y-1 max-h-72 overflow-y-auto custom-scrollbar"
                    >
                      <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Select Project ({projects.length})
                      </div>
                      {projects.map((p) => {
                        const pName = p.configurations?.project_name || p.domain || 'Project';
                        const isSelected = p.apikey === selectedApikey;
                        return (
                          <button
                            key={p.apikey}
                            onClick={() => handleSelectProject(p)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-bold transition-all ${
                              isSelected ? 'bg-cyan-50 text-cyan-900 border border-cyan-200 font-extrabold' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="truncate mr-2">
                              <span className="block truncate">{pName}</span>
                              <span className="text-[10px] font-mono text-slate-400 block truncate">{p.apikey}</span>
                            </div>
                            {isSelected && <Check size={14} className="text-cyan-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Embedded Full Analytics Panel */}
            <div className="bg-[var(--bg-card)] border border-slate-200/80 rounded-2xl p-4 md:p-8 shadow-sm">
              <AnalyticsPanel apikey={selectedApikey} />
            </div>
          </div>
        ) : (
          /* =========================================================================
             VIEW 1: ALL PROJECTS OVERVIEW HUB
             ========================================================================= */
          <div className="space-y-8">
            {/* Header Title Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Activity size={12} className="text-cyan-600" /> Live Analytics
                  </span>
                  <span className="text-xs font-extrabold text-slate-700">Insights & Metrics</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                  Auth Projects <span className="text-cyan-600">Analytics</span>
                </h1>
                <p className="text-xs md:text-sm text-slate-600 font-medium mt-1">
                  Select a project below to explore real-time authentication traffic, success rates, security logs, and user breakdowns.
                </p>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search project name or key..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-cyan-500 transition-all shadow-sm font-medium"
                />
              </div>
            </div>

            {/* Projects Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3">
                <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-600 rounded-full animate-spin" />
                <p className="text-xs font-bold text-slate-500 animate-pulse">Loading projects for analytics...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center mx-auto">
                  <BarChart2 size={26} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {searchTerm ? 'No matching projects found' : 'No Projects Created Yet'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {searchTerm ? 'Try searching with a different keyword.' : 'Create your first project to start monitoring authentication analytics.'}
                  </p>
                </div>
                {!searchTerm && (
                  <button
                    onClick={() => navigate('/dashboard-detail')}
                    className="neu-button-primary px-5 py-2.5 text-xs font-black shadow-md shadow-cyan-500/20"
                  >
                    + Create First Project
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.map((project, idx) => {
                  const pName = project.configurations?.project_name || project.domain || 'Untitled Project';
                  const methods = project.configurations?.auth_methods || [];
                  const enabledMethods = methods.filter((m) => m.enabled);
                  const brandLogo = project.configurations?.ui?.brand_logo;
                  const primaryColor = project.configurations?.ui?.primary_color || '#00a8e8';

                  return (
                    <motion.div
                      key={project.apikey}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.04 }}
                      onClick={() => handleSelectProject(project)}
                      className="bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-cyan-400/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                    >
                      {/* Top banner accent line */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="space-y-4">
                        {/* Project Brand & Status */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {brandLogo ? (
                              <img src={brandLogo} alt="Logo" className="w-10 h-10 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200" />
                            ) : (
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-sm"
                                style={{ backgroundColor: primaryColor }}
                              >
                                {pName[0] || 'D'}
                              </div>
                            )}
                            <div>
                              <h3 className="text-sm font-black text-slate-900 group-hover:text-cyan-700 transition-colors leading-tight">
                                {pName}
                              </h3>
                              <span className="text-[10px] font-bold text-slate-400">
                                {project.domain ? `${project.domain}` : 'Configured App'}
                              </span>
                            </div>
                          </div>

                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold">
                            <CheckCircle2 size={10} /> Active
                          </span>
                        </div>

                        {/* API Key Box */}
                        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <Key size={12} className="text-slate-400 shrink-0" />
                            <span className="font-mono text-[10px] font-bold text-slate-600 truncate">{project.apikey}</span>
                          </div>
                          <button
                            onClick={(e) => copyApiKey(project.apikey, e)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                            title="Copy API Key"
                          >
                            {copiedKey === project.apikey ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                          </button>
                        </div>

                        {/* Enabled Auth Methods Pills */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Auth Methods</span>
                          <div className="flex flex-wrap gap-1.5">
                            {enabledMethods.length > 0 ? (
                              enabledMethods.slice(0, 4).map((m) => (
                                <span
                                  key={m.id}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-extrabold capitalize border border-slate-200"
                                >
                                  {m.id === 'password' && <RiLockPasswordLine size={10} className="text-cyan-600" />}
                                  {m.id === 'google' && <GoogleLogo size={10} />}
                                  {m.id === 'github' && <GithubLogo size={10} />}
                                  {m.id === 'facebook' && <FacebookLogo size={10} />}
                                  {(m.id === 'otp' || m.id === 'email_otp' || m.id === 'mobile_otp') && <MdOutlineSms size={10} className="text-emerald-600" />}
                                  <span>{m.name || m.id}</span>
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">No methods enabled</span>
                            )}
                            {enabledMethods.length > 4 && (
                              <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">+{enabledMethods.length - 4} more</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bottom CTA */}
                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-600 group-hover:text-cyan-700">
                        <span>Inspect Analytics</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
