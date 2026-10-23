import { Link } from 'react-router-dom';

export const LandingFooter = () => {
  return (
    <footer className="text-slate-600 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
        
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/dauth_logo.png"
              alt="DAuth Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="text-xl font-black tracking-tight text-slate-900">DAuth</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm font-normal">
            Authentication without user lock-in. Developer-first authentication infrastructure for modern applications.
          </p>
          <div className="text-xs text-slate-500">
            A product from <a href="https://debuggerstechnologies.com" target="_blank" rel="noreferrer" className="text-slate-900 font-bold hover:underline hover:text-cyan-600">debuggerstechnologies.com</a>
          </div>
        </div>

        {/* Product Column */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Product</h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li><a href="#features" className="hover:text-cyan-600 transition-colors">Features</a></li>
            <li><a href="#auth-flow" className="hover:text-cyan-600 transition-colors">How It Works</a></li>
            <li><a href="#pricing" className="hover:text-cyan-600 transition-colors">Pricing</a></li>
            <li><a href="#use-cases" className="hover:text-cyan-600 transition-colors">Use Cases</a></li>
            <li><Link to="/contact" className="hover:text-cyan-600 transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Developers Column */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Developers</h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li><Link to="/auth-docs" className="hover:text-cyan-600 transition-colors">Documentation</Link></li>
            <li><Link to="/dashboard" className="hover:text-cyan-600 transition-colors">Dashboard Portal</Link></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Legal</h4>
          <ul className="space-y-2 text-xs font-medium">
            <li><Link to="/privacy" className="hover:text-cyan-600 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-cyan-600 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <div>© 2026 DAuth. All rights reserved.</div>
        <div>Your Users. Your Database. Your Authentication.</div>
      </div>
    </footer>
  );
};
