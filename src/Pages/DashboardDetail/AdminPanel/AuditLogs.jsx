import { useState } from 'react';
import { Search, Filter, Download, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

export const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = mockLogs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='flex flex-col h-full space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-[var(--text-main)] font-bold text-lg mb-1'>Audit Logs</h3>
          <p className='text-[var(--text-muted)] text-xs font-medium'>Track system events, logins, and administrative actions.</p>
        </div>
        <button className='flex items-center gap-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] border border-[var(--border-glass)] hover:border-[var(--border-active)] text-[var(--text-main)] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm'>
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Toolbar */}
      <div className='flex gap-3'>
        <div className='relative flex-1 max-w-md'>
          <Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]' />
          <input 
            type='text' 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search logs by action or user...' 
            className='w-full bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-xl pl-10 pr-4 py-2.5 text-[var(--text-main)] text-sm focus:outline-none focus:border-indigo-500/50 shadow-inner placeholder-[var(--text-dim)]'
          />
        </div>
        <button className='flex items-center gap-2 bg-[var(--bg-deep)] border border-[var(--border-glass)] hover:border-indigo-500/50 text-[var(--text-dim)] hover:text-indigo-400 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm'>
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className='flex-1 bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl overflow-hidden flex flex-col shadow-sm'>
        <div className='overflow-x-auto flex-1 custom-scrollbar'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-[var(--bg-deep)]/50 border-b border-[var(--border-glass)] text-[10px] uppercase tracking-widest text-[var(--text-dim)] font-bold'>
                <th className='p-4 pl-6 whitespace-nowrap'>Event Time</th>
                <th className='p-4 whitespace-nowrap'>Action</th>
                <th className='p-4 whitespace-nowrap'>Actor</th>
                <th className='p-4 whitespace-nowrap'>IP Address</th>
                <th className='p-4 pr-6 text-right whitespace-nowrap'>Details</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[var(--border-glass)]'>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, i) => (
                  <tr key={i} className='hover:bg-[var(--bg-surface)]/50 transition-colors group'>
                    <td className='p-4 pl-6 whitespace-nowrap text-[11px] font-mono text-[var(--text-muted)]'>
                      {log.time}
                    </td>
                    <td className='p-4 whitespace-nowrap'>
                      <div className='flex items-center gap-2'>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(log.status)} shadow-[0_0_8px_currentColor] opacity-80`} />
                        <span className='text-[var(--text-main)] text-sm font-bold'>{log.action}</span>
                      </div>
                    </td>
                    <td className='p-4 whitespace-nowrap text-sm text-[var(--text-muted)] font-medium'>
                      {log.user}
                    </td>
                    <td className='p-4 whitespace-nowrap text-[11px] font-mono text-[var(--text-dim)]'>
                      {log.ip}
                    </td>
                    <td className='p-4 pr-6 text-right whitespace-nowrap'>
                      <button className='p-1.5 text-[var(--text-dim)] hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors'>
                        <FileText size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='5' className='p-8 text-center text-[var(--text-dim)] text-sm font-medium'>
                    No logs found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className='px-6 py-3 border-t border-[var(--border-glass)] bg-[var(--bg-navbar)] flex items-center justify-between flex-none'>
          <span className='text-[var(--text-dim)] text-[11px] font-medium'>Showing 1-{filteredLogs.length} of {mockLogs.length} events</span>
          <div className='flex items-center gap-2'>
            <button disabled className='p-1.5 rounded-lg border border-[var(--border-glass)] text-[var(--text-dim)] opacity-50 cursor-not-allowed'>
              <ChevronLeft size={16} />
            </button>
            <button className='p-1.5 rounded-lg border border-[var(--border-glass)] text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition-colors'>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'success': return 'text-emerald-500 bg-emerald-500';
    case 'warning': return 'text-amber-500 bg-amber-500';
    case 'error': return 'text-red-500 bg-red-500';
    case 'info': return 'text-indigo-500 bg-indigo-500';
    default: return 'text-[var(--text-dim)] bg-[var(--text-dim)]';
  }
};

const mockLogs = [
  { time: '2023-10-27 14:32:01', action: 'User Login', user: 'admin@debuggers.com', ip: '192.168.1.104', status: 'success' },
  { time: '2023-10-27 14:28:15', action: 'Failed Login Attempt', user: 'unknown', ip: '45.22.19.102', status: 'error' },
  { time: '2023-10-27 13:15:42', action: 'Role Created (Editor)', user: 'superadmin@debuggers.com', ip: '192.168.1.101', status: 'info' },
  { time: '2023-10-27 11:05:12', action: 'API Key Rolled', user: 'admin@debuggers.com', ip: '192.168.1.104', status: 'warning' },
  { time: '2023-10-26 16:45:33', action: 'User Deleted (john@test.com)', user: 'superadmin@debuggers.com', ip: '192.168.1.101', status: 'error' },
  { time: '2023-10-26 09:22:11', action: 'SSO Config Updated', user: 'admin@debuggers.com', ip: '192.168.1.104', status: 'info' },
  { time: '2023-10-25 18:30:00', action: 'User Login', user: 'jane.smith@debuggers.com', ip: '10.0.0.55', status: 'success' },
  { time: '2023-10-25 10:14:05', action: 'Password Policy Changed', user: 'superadmin@debuggers.com', ip: '192.168.1.101', status: 'warning' },
];
