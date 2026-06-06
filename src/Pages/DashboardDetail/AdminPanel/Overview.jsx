import { useAuthConfigStore } from '../../../Store/useAuthConfigStore';
import { Users, Shield, Globe, Activity, TrendingUp, UserCheck, ShieldAlert } from 'lucide-react';

export const Overview = () => {
  const { adminUsers, adminRoles, sso } = useAuthConfigStore();

  const activeUsers = adminUsers.filter((u) => u.status === 'active').length;
  const ssoDomains = sso.domains.length;

  return (
    <div className='space-y-6 max-w-5xl mx-auto'>
      <div className='mb-6'>
        <h3 className='text-[var(--text-main)] font-bold text-lg mb-1'>Dashboard Overview</h3>
        <p className='text-[var(--text-muted)] text-xs font-medium'>A high-level summary of your authentication infrastructure.</p>
      </div>

      {/* Metrics Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <MetricCard
          icon={<Users />}
          title='Total Users'
          value={adminUsers.length}
          trend='+12%'
          trendUp={true}
          colorClass='text-blue-500'
          bgClass='bg-blue-500/10'
        />
        <MetricCard
          icon={<UserCheck />}
          title='Active Users'
          value={activeUsers}
          trend='+5%'
          trendUp={true}
          colorClass='text-emerald-500'
          bgClass='bg-emerald-500/10'
        />
        <MetricCard
          icon={<Shield />}
          title='Defined Roles'
          value={adminRoles.length}
          trend='Stable'
          trendUp={true}
          colorClass='text-purple-500'
          bgClass='bg-purple-500/10'
        />
        <MetricCard
          icon={<Globe />}
          title='SSO Domains'
          value={ssoDomains}
          trend={sso.enabled ? 'Active' : 'Disabled'}
          trendUp={sso.enabled}
          colorClass={sso.enabled ? 'text-indigo-500' : 'text-[var(--text-dim)]'}
          bgClass={sso.enabled ? 'bg-indigo-500/10' : 'bg-[var(--bg-deep)]'}
        />
      </div>

      {/* System Status & Recent Activity */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* System Health */}
        <div className='lg:col-span-1 bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl p-5 shadow-sm h-fit'>
          <h4 className='text-[var(--text-main)] font-bold text-sm mb-4 flex items-center gap-2'>
            <Activity size={16} className='text-emerald-500' /> System Health
          </h4>
          <div className='space-y-4'>
            <HealthItem label='Auth API' status='Operational' color='bg-emerald-500' />
            <HealthItem label='Database' status='Operational' color='bg-emerald-500' />
            <HealthItem label='Email Service' status='Degraded' color='bg-amber-500' />
            <HealthItem label='SSO Provider' status={sso.enabled ? 'Operational' : 'Disabled'} color={sso.enabled ? 'bg-emerald-500' : 'bg-[var(--text-dim)]'} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className='lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl p-5 shadow-sm'>
          <h4 className='text-[var(--text-main)] font-bold text-sm mb-4 flex items-center gap-2'>
            <TrendingUp size={16} className='text-purple-500' /> Recent Activity
          </h4>
          <div className='space-y-4'>
            {mockActivities.map((activity, i) => (
              <div key={i} className='flex gap-4 items-start pb-4 border-b border-[var(--border-glass)] last:border-0 last:pb-0'>
                <div className={`p-2 rounded-xl shrink-0 ${activity.iconBg} ${activity.iconColor}`}>
                  {activity.icon}
                </div>
                <div>
                  <p className='text-[var(--text-main)] text-sm font-medium'>{activity.action}</p>
                  <p className='text-[var(--text-dim)] text-[11px] font-medium mt-1'>{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon, title, value, trend, trendUp, colorClass, bgClass }) => (
  <div className='bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl p-5 shadow-sm flex flex-col justify-between'>
    <div className='flex items-center justify-between mb-4'>
      <div className={`p-2.5 rounded-xl ${bgClass} ${colorClass}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${trendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[var(--bg-deep)] text-[var(--text-dim)]'}`}>
        {trend}
      </span>
    </div>
    <div>
      <h5 className='text-[var(--text-dim)] text-[11px] font-bold uppercase tracking-widest mb-1'>{title}</h5>
      <p className='text-[var(--text-main)] font-extrabold text-3xl'>{value}</p>
    </div>
  </div>
);

const HealthItem = ({ label, status, color }) => (
  <div className='flex items-center justify-between'>
    <span className='text-[var(--text-muted)] text-xs font-medium'>{label}</span>
    <div className='flex items-center gap-2'>
      <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_${color}] opacity-80`} />
      <span className='text-[var(--text-main)] text-xs font-bold'>{status}</span>
    </div>
  </div>
);

const mockActivities = [
  {
    action: 'New role "Editor" created',
    user: 'admin@debuggers.com',
    time: '10 mins ago',
    icon: <Shield size={16} />,
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
  },
  {
    action: 'User "Jane Doe" added to system',
    user: 'admin@debuggers.com',
    time: '2 hours ago',
    icon: <UserCheck size={16} />,
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
  },
  {
    action: 'Multiple failed login attempts detected',
    user: 'System',
    time: '5 hours ago',
    icon: <ShieldAlert size={16} />,
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
  },
  {
    action: 'SSO configuration updated',
    user: 'superadmin@debuggers.com',
    time: '1 day ago',
    icon: <Globe size={16} />,
    iconBg: 'bg-indigo-500/10',
    iconColor: 'text-indigo-500',
  },
];
