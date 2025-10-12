export const KnowusPage = () => {
  return (
    <div className="mx-3 max-sm:mx-0 mt-30 max-sm:mt-15 w-full" id="know-us">
      {/* Title */}
      <div className="w-full flex justify-start items-start">
        <h1 className="w-fit text-4xl max-sm:text-xl max-lg:text-2xl bg-linear-to-r from-purple-200 via-purple-300 to-purple-800 bg-clip-text text-transparent font-semibold rounded-1xl px-2 pb-2 border-b-2 border-purple-300 rounded">
          Know Us
        </h1>
      </div>

      {/* ✅ Responsive container */}
      <div className="w-full mt-12 rounded-2xl flex flex-row max-sm:flex-col max-lg:flex-col max-sm:gap-10 max-lg:gap-10">
        
        {/* Section 1 */}
        <div className="ml-10 max-sm:ml-0 max-lg:ml-0 w-full border-l-2 border-r-2 border-purple-400 rounded-xl px-3">
          <h1 className="text-2xl max-sm:text-xl font-bold text-purple-300">Why Choose Us</h1>
          <div className="ml-5 mt-5 max-sm:ml-3">
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>
                <span className="font-bold max-sm:font-semibold text-purple-100">Zero Fluff, Maximum Security</span> → One-time login URLs ensure every session starts fresh and safe.
              </li>
              <li>
                <span className="font-bold max-sm:font-semibold text-purple-100">Speed That Matches Your Workflow</span> → Grab an API key, and you’re ready to roll. No long setup.
              </li>
              <li>
                <span className="font-bold max-sm:font-semibold text-purple-100">Built for Modern Apps</span> → Supports both OTP and social logins out of the box.
              </li>
              <li>
                <span className="font-bold max-sm:font-semibold text-purple-100">JWT-Powered Trust</span> → Every successful exchange ends with a JWT carrying verified user info.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 2 */}
        <div className="ml-10 max-sm:ml-0 max-lg:ml-0 w-full border-l-2 border-r-2 border-purple-400 rounded-xl px-3">
          <h1 className="text-2xl max-sm:text-xl font-bold text-purple-300">What Makes Us Different from Others</h1>
          <div className="ml-5 mt-5 max-sm:ml-3">
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>
                <span className="font-bold max-sm:font-semibold text-purple-100">One-Time Login Flow</span> → Unlike others, every login link is valid only once. No chance of replay attacks.
              </li>
              <li>
                <span className="font-bold max-sm:font-semibold text-purple-100">Multiple API Keys with Custom Configs</span> → Tailor login methods (OTP, Google, Facebook, GitHub) per key.
              </li>
              <li>
                <span className="font-bold max-sm:font-semibold text-purple-100">OAuth-Like but Cleaner</span> → Familiar flow (login → redirect → code exchange → JWT), without the heavy baggage.
              </li>
              <li>
                <span className="font-bold max-sm:font-semibold text-purple-100">Made for Devs Who Ship Fast</span> → Minimal learning curve, maximum output.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 3 */}
        <div className="ml-10 max-sm:ml-0 max-lg:ml-0 w-200 max-sm:w-full max-lg:w-full border-l-2 border-r-2 border-purple-400 rounded-xl px-3">
          <h1 className="text-2xl max-sm:text-xl font-bold text-purple-300">Our Promise</h1>
          <div className="ml-5 mt-5 max-sm:ml-3">
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>
                <span className="font-bold max-sm:font-semibold text-purple-100">Security that’s airtight</span>
              </li>
              <li>
                <span className="font-bold max-sm:font-semibold text-purple-100">Speed that’s unmatched</span>
              </li>
              <li>
                <span className="font-bold max-sm:font-semibold text-purple-100">Tools that are dev-first</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* End main container */}
    </div>
  )
}
