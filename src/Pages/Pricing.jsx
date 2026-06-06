import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Check, X } from 'lucide-react'

export const PricingPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const tableY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <div ref={containerRef} className="mx-3 max-sm:mx-0 mt-30 max-sm:mt-15 max-lg:mt-25 w-full relative z-10" id="pricing">
      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="w-full flex justify-center items-center flex-col text-center"
      >
        <h1 className="text-4xl max-sm:text-2xl font-extrabold text-slate-800 tracking-tight">
          Pricing That Makes Sense. <span className="text-indigo-600">Free.</span>
        </h1>
        <p className="mt-4 text-slate-500 max-w-2xl text-lg">
          Why pay per active user? DeB-Auth is completely free and open-source. Stop worrying about monthly MAU limits and expensive tiers.
        </p>
      </motion.div>

      {/* Pricing Table */}
      <div className="flex w-full justify-center items-center mt-12 max-sm:mt-8 px-4">
        <motion.div 
          style={{ y: tableY }}
          className="w-full max-w-5xl bg-white/70 backdrop-blur-xl border border-slate-200/60 shadow-xl rounded-3xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-6 px-6 font-semibold text-slate-500 w-1/4">Features</th>
                  <th className="py-6 px-6 bg-indigo-50/50 w-1/4">
                    <div className="font-bold text-2xl text-indigo-600">DeB-Auth</div>
                    <div className="text-indigo-400 font-medium text-sm mt-1">$0 / Forever</div>
                  </th>
                  <th className="py-6 px-6 w-1/4">
                    <div className="font-bold text-xl text-slate-700">Auth0</div>
                    <div className="text-slate-500 font-medium text-sm mt-1">Free tier is limited</div>
                  </th>
                  <th className="py-6 px-6 w-1/4">
                    <div className="font-bold text-xl text-slate-700">Clerk</div>
                    <div className="text-slate-500 font-medium text-sm mt-1">Free tier is limited</div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-slate-600 text-sm">
                <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-700">Monthly Active Users</td>
                  <td className="py-4 px-6 bg-indigo-50/30 font-bold text-indigo-600">Unlimited</td>
                  <td className="py-4 px-6 text-slate-500">7,500 limit</td>
                  <td className="py-4 px-6 text-slate-500">10,000 limit</td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-700">Social Login Providers</td>
                  <td className="py-4 px-6 bg-indigo-50/30 font-bold text-indigo-600">Unlimited</td>
                  <td className="py-4 px-6 text-slate-500">Limited to 2</td>
                  <td className="py-4 px-6 text-slate-500">Unlimited</td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-700">Custom Branding</td>
                  <td className="py-4 px-6 bg-indigo-50/30 text-indigo-500"><Check size={20} /></td>
                  <td className="py-4 px-6 text-slate-400"><X size={20} /> <span className="text-xs ml-1">(Requires Pro)</span></td>
                  <td className="py-4 px-6 text-slate-500"><Check size={20} /></td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-700">One-Time Login URLs</td>
                  <td className="py-4 px-6 bg-indigo-50/30 text-indigo-500"><Check size={20} /></td>
                  <td className="py-4 px-6 text-slate-400"><X size={20} /></td>
                  <td className="py-4 px-6 text-slate-400"><X size={20} /></td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-700">Self-Hosted Option</td>
                  <td className="py-4 px-6 bg-indigo-50/30 text-indigo-500"><Check size={20} /></td>
                  <td className="py-4 px-6 text-slate-400"><X size={20} /></td>
                  <td className="py-4 px-6 text-slate-400"><X size={20} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
