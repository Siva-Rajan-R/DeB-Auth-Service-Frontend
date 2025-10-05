
export const KnowusPage = () => {
  return (
    <div className='mx-3 mt-30 w-full' id='know-us'>
        <div className='w-full flex justify-start items-start'>
              <h1 className='w-fit text-4xl bg-linear-to-r from-purple-200 via-purple-300 to-purple-800 bg-clip-text text-transparent font-semibold rounded-1xl px-2 pb-2 border-b-2 border-purple-300 rounded'>
                Know Us
              </h1>
          </div>

          <div className='w-full mt-12 border-l-2 border-r-2 border-purple-400 rounded-2xl flex'>
            <div className='ml-10 w-full'>
                <h1 className='text-2xl font-bold text-purple-300'>Why Choose Us</h1>
                <div className='ml-5 mt-5'>
                <ul className="list-disc list-inside space-y-2 text-lg">
                    <li>
                    <span className="font-bold">Zero Fluff, Maximum Security</span> → One-time login URLs ensure every session starts fresh and safe.
                    </li>
                    <li>
                    <span className="font-bold">Speed That Matches Your Workflow</span> → Grab an API key, and you’re ready to roll. No long setup.
                    </li>
                    <li>
                    <span className="font-bold">Built for Modern Apps</span> → Supports both OTP and social logins out of the box.
                    </li>
                    <li>
                    <span className="font-bold">JWT-Powered Trust</span> → Every successful exchange ends with a JWT carrying verified user info.
                    </li>
                </ul>
                </div>
            </div>

            <div className='ml-10 w-full'>
                <h1 className='text-2xl font-bold text-purple-300'>What Makes Us Different from Others</h1>
                <div className='ml-5 mt-5'>
                <ul className="list-disc list-inside space-y-2 text-lg">
                    <li>
                    <span className="font-bold">One-Time Login Flow</span> → Unlike others, every login link is valid only once. No chance of replay attacks.
                    </li>
                    <li>
                    <span className="font-bold">Multiple API Keys with Custom Configs</span> → Tailor login methods (OTP, Google, Facebook, GitHub) per key.
                    </li>
                    <li>
                    <span className="font-bold">OAuth-Like but Cleaner</span> → Familiar flow (login → redirect → code exchange → JWT), without the heavy baggage.
                    </li>
                    <li>
                    <span className="font-bold">Made for Devs Who Ship Fast</span> → Minimal learning curve, maximum output.
                    </li>
                </ul>
                </div>
            </div>

            <div className='ml-10 w-200'>
                <h1 className='text-2xl font-bold text-purple-300'>Our Promise</h1>
                <div className='ml-5 mt-5'>
                <ul className="list-disc list-inside space-y-2 text-lg">
                    <li>
                    <span className="font-bold">Security that’s airtight</span>
                    </li>
                    <li>
                    <span className="font-bold">Speed that’s unmatched</span>
                    </li>
                    <li>
                    <span className="font-bold">Tools that are dev-first</span>
                    </li>
                </ul>
                </div>
            </div>
            
          </div>
    </div>
  )
}
