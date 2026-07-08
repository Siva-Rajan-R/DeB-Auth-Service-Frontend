import { AdminPanel } from './DashboardDetail/AdminPanel';

export const AdminPageStandalone = () => {
  return (
    <div className='w-full min-h-screen bg-[var(--bg-deep)] p-4 md:p-8 flex flex-col'>
      <div className='max-w-7xl mx-auto w-full flex-1 flex flex-col'>
        <AdminPanel />
      </div>
    </div>
  );
};
