import { useSearchParams } from 'react-router-dom';
import { AnalyticsPanel } from './DashboardDetail/AnalyticsPanel';
import { MdOutlineKeyboardBackspace } from "react-icons/md";

export const AnalyticsStandalone = () => {
  const [searchParams] = useSearchParams();
  const apikey = searchParams.get('id');
  const projectName = searchParams.get('name') || 'Project';

  if (!apikey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-500">No project ID provided</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Header */}
      <header className="flex h-16 shrink-0 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 items-center sticky top-0 z-20">
        <div
          onClick={() => window.close()}
          className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer group shadow-sm active:scale-95 z-10"
          title="Close tab"
        >
          <MdOutlineKeyboardBackspace size={24} className="text-slate-600 group-hover:text-cyan-600 transition-colors" />
        </div>
        <h1 className="ml-4 text-xl font-black text-slate-900 tracking-tight">{projectName} <span className="text-cyan-600 font-bold">Analytics</span></h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-12 relative z-10">
        <AnalyticsPanel apikey={apikey} />
      </main>
    </div>
  );
};
