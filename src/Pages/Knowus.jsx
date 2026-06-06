import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export const KnowusPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const xLeft = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const xRight = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const yCenter = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <div ref={containerRef} className="mx-3 max-sm:mx-0 mt-30 max-sm:mt-15 w-full relative z-10 px-4" id="know-us">
      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="w-full flex justify-center items-center flex-col text-center"
      >
        <h1 className="text-4xl max-sm:text-2xl font-extrabold text-slate-800 tracking-tight">
          Trust & Reliability
        </h1>
        <p className="mt-4 text-slate-500 max-w-2xl text-lg">
          We built DeB-Auth to be the simplest, most secure authentication system available. Here's why developers trust us.
        </p>
      </motion.div>

      {/* Responsive container */}
      <div className="w-full mt-12 rounded-2xl flex flex-row max-sm:flex-col max-lg:flex-col max-sm:gap-10 max-lg:gap-10 overflow-hidden py-4">
        
        {/* Section 1 - Slides from left */}
        <motion.div 
          style={{ x: xLeft }}
          className="ml-10 max-sm:ml-0 max-lg:ml-0 w-full border border-slate-200/80 rounded-2xl px-6 py-6 bg-white/70 backdrop-blur-xl shadow-lg shadow-slate-200/50"
        >
          <h1 className="text-2xl max-sm:text-xl font-extrabold text-indigo-600">Why Choose Us</h1>
          <div className="ml-5 mt-5 max-sm:ml-3">
            <ul className="list-disc list-outside space-y-3 text-slate-600">
              <li>
                <span className="font-bold text-slate-800">Zero Fluff, Maximum Security</span> → One-time login URLs ensure every session starts fresh and safe.
              </li>
              <li>
                <span className="font-bold text-slate-800">Speed That Matches Your Workflow</span> → Grab an API key, and you’re ready to roll. No long setup.
              </li>
              <li>
                <span className="font-bold text-slate-800">Built for Modern Apps</span> → Supports both OTP and social logins out of the box.
              </li>
              <li>
                <span className="font-bold text-slate-800">JWT-Powered Trust</span> → Every successful exchange ends with a JWT carrying verified user info.
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Section 2 - Slides from bottom/center */}
        <motion.div 
          style={{ y: yCenter }}
          className="ml-10 max-sm:ml-0 max-lg:ml-0 w-full border border-slate-200/80 rounded-2xl px-6 py-6 bg-white/70 backdrop-blur-xl shadow-lg shadow-slate-200/50"
        >
          <h1 className="text-2xl max-sm:text-xl font-extrabold text-indigo-600">What Makes Us Different</h1>
          <div className="ml-5 mt-5 max-sm:ml-3">
            <ul className="list-disc list-outside space-y-3 text-slate-600">
              <li>
                <span className="font-bold text-slate-800">One-Time Login Flow</span> → Unlike others, every login link is valid only once. No chance of replay attacks.
              </li>
              <li>
                <span className="font-bold text-slate-800">Multiple API Keys</span> → Tailor login methods (OTP, Google, Facebook, GitHub) per key.
              </li>
              <li>
                <span className="font-bold text-slate-800">OAuth-Like but Cleaner</span> → Familiar flow (login → redirect → code exchange → JWT), without the heavy baggage.
              </li>
              <li>
                <span className="font-bold text-slate-800">Made for Devs Who Ship Fast</span> → Minimal learning curve, maximum output.
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Section 3 - Slides from right */}
        <motion.div 
          style={{ x: xRight }}
          className="ml-10 max-sm:ml-0 max-lg:ml-0 w-200 max-sm:w-full max-lg:w-full border border-slate-200/80 rounded-2xl px-6 py-6 bg-white/70 backdrop-blur-xl shadow-lg shadow-slate-200/50"
        >
          <h1 className="text-2xl max-sm:text-xl font-extrabold text-indigo-600">Our Promise</h1>
          <div className="ml-5 mt-5 max-sm:ml-3">
            <ul className="list-disc list-outside space-y-3 text-slate-600">
              <li>
                <span className="font-bold text-slate-800">Security that’s airtight.</span> We handle the hard stuff so you don't have to.
              </li>
              <li>
                <span className="font-bold text-slate-800">Speed that’s unmatched.</span> From zero to authenticated in under 5 minutes.
              </li>
              <li>
                <span className="font-bold text-slate-800">Tools that are dev-first.</span> Simple APIs, clear docs, and no vendor lock-in.
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
      {/* End main container */}
    </div>
  )
}
