import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const CreateNewCard = ({ heading = 'Create your first Auth System', onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      onClick={onClick}
      className='group flex flex-col items-center justify-center gap-6 border-2 border-dashed border-[var(--border-glass)] hover:border-indigo-500/50 rounded-[2.5rem] p-12 cursor-pointer transition-all duration-500 hover:bg-indigo-500/5 backdrop-blur-xl relative overflow-hidden shadow-sm hover:shadow-2xl shadow-indigo-500/10'
    >
      <div className='absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
      
      <div className='w-20 h-20 rounded-2xl bg-indigo-500/10 group-hover:bg-indigo-500/20 group-hover:scale-110 flex items-center justify-center transition-all duration-500 border border-indigo-500/20 group-hover:border-indigo-500/40 relative z-10'>
        <PlusCircle size={36} className='text-indigo-400' />
      </div>
      
      <div className='text-center relative z-10'>
        <h2 className='text-[var(--text-main)] font-bold text-xl group-hover:text-indigo-400 transition-colors leading-tight'>{heading}</h2>
        <p className='text-[var(--text-muted)] text-sm mt-3 font-medium max-w-[200px] mx-auto'>Deploy a new auth environment in seconds.</p>
      </div>

      <div className='absolute bottom-4 right-4 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors'>
        <PlusCircle size={64} strokeWidth={1} />
      </div>
    </motion.div>
  );
};
