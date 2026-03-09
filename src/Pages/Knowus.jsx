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
        <div className="ml-10 max-sm:ml-0 max-lg:
        .1.1.1..  .1. 1.. font-bold text-purple-300"><h1>Why Choose DeB-Auth-Service?</h1>
          <div className="ml-5 mt-5 max-sm:ml-3">
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>
                <span className="font-bold max-sm:font-semibold text-purple-100">Zero-Trust Security Architecture:</span> Our single-use login URLs ensure that every authentication session starts with a fresh, cryptographically unique handshake to prevent session hijacking.
              </li>
              <li>
                <span className="font-bold max-sm:font-semibold text-purple-100">Rapid API Integration</span> Eliminate complex setups. Generate a secure API Key and deploy production-ready authentication in under five minutes.
              </li>
              <li>
                <span className="font-bold max-sm:font-semibold text-purple-100">Universal Auth Support</span> Out-of-the-box compatibility for Passwordless OTP, Google OAuth2, GitHub, and Facebook social logins.
              </li>
              <li>
                <span className="font-bold max-sm:font-semibold text-purple-100">Cryptographically Verified JWTs</span> Every successful authentication exchange concludes with a signed JSON Web Token (JWT), providing trusted user metadata for your application.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 2 */}
        <div className="ml-10 max-sm:ml-0 max-lg:ml-0 w-full border-l-2 border-r-2 border-purple-400 rounded-xl px-3">
          <h1 className="text-2xl max-sm:text-xl font-bold text-purple-300">What Makes Us Different?</h1>
          <div className="ml-5 mt-5 max-sm:ml-3">
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>
                <span className="font-bold max-sm:font-semibold text-purple-100">Replay Attack Protection</span> Unlike standard persistent login forms, our One-Time Login Flow invalidates links immediately after use, neutralizing replay attack vectors
              </li>
              <li>
                <span className="font-bold max-sm:font-semibold text-purple-100">Granular API Configuration</span> Manage multiple API Keys with custom security configurations—tailor specific login methods (OTP vs. Social) per environment or project.
              </li>
              <li>
                <span className="font-bold max-sm:font-semibold text-purple-100">Lightweight OAuth2 Implementation</span>Experience a familiar Authorization Code Grant flow (Login → Redirect → Code Exchange → JWT) without the heavy infrastructure baggage.
              </li>
              <li>
                <span className="font-bold max-sm:font-semibold text-purple-100">Developer-First (DX) Focused</span> Built for developers who ship fast. Minimal learning curve with clean API endpoints and OIDC-compliant responses.
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
