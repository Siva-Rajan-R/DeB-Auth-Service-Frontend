import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { codeExamples } from '../Constants/index';
import { DocsNavigation } from '../Sections/DocsNavBar';

export const AuthDocs = () => {
  const [activeTab, setActiveTab] = useState('javascript');
  const [copiedCode, setCopiedCode] = useState('');

  const copyToClipboard = (code, language) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(language);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const CodeEditor = ({ code, language, filename }) => (
    <div className="bg-gray-900 rounded-lg border border-gray-500 overflow-hidden shadow-lg">
      {/* Editor Header */}
      <div className="flex items-center justify-between bg-gray-900 px-3 sm:px-4 py-2 border-b border-white/30">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-cyan-200 text-xs sm:text-sm font-medium">{filename}</span>
        </div>
        <button
          onClick={() => copyToClipboard(code, language)}
          className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs sm:text-sm transition-colors"
        >
          {copiedCode === language ? (
            <>
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Code Content with Syntax Highlighter */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={codeExamples[language].language}
          style={atomDark}
          customStyle={{
            margin: 0,
            padding: '0.75rem sm:1rem',
            background: '#1a202c',
            fontSize: '0.75rem sm:0.875rem',
            lineHeight: '1.4'
          }}
          showLineNumbers={true}
          lineNumberStyle={{
            color: '#6B7280',
            minWidth: '2em'
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-cyan-100 p-4 sm:p-6 font-sans">
      {/* Navigation */}
      <DocsNavigation/>

      {/* Header */}
      <header className="text-center mb-8 sm:mb-16">
        <div className="inline-block bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 border-b-2">
          <div className="bg-black px-4 py-2 sm:px-6 sm:py-3 rounded">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              DeB-Auth-Docs
            </h1>
          </div>
        </div>
        <p className="text-base sm:text-lg md:text-xl text-cyan-200 max-w-2xl mx-auto px-2">
          Secure OAuth 2.0 Implementation with JWT Tokens. Assign API Key & Client Secret once, get seamless authentication.
        </p>
      </header>

      <div className="max-w-6xl mx-auto lg:ml-0 xl:ml-32">
        {/* API Endpoints */}
        <section id="endpoints" className="mb-12 sm:mb-16 scroll-mt-20">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              API Endpoints
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mt-2 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-cyan-800/30 shadow-lg">
              <div className="flex items-center mb-3 sm:mb-4">
                <span className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-bold mr-3 sm:mr-4">POST</span>
                <code className="text-cyan-200 text-sm sm:text-lg font-mono bg-gray-700 px-2 sm:px-3 py-1 rounded">/auth</code>
              </div>
              <p className="text-cyan-200 mb-4 sm:mb-6 text-sm sm:text-base">Returns one-time login URL for user authentication. Valid for 5 minutes.</p>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-cyan-800/50">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h4 className="text-cyan-300 font-semibold text-sm sm:text-base">Request Body</h4>
                    <button 
                      onClick={() => copyToClipboard(`{
                        "apikey": "DeB-xxxxxxxxxxxxxapikey",
                      }`, 'login-request')}
                      className="text-xs bg-cyan-700 hover:bg-cyan-600 px-2 py-1 rounded transition-colors"
                    >
                      {copiedCode === 'login-request' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    language="json"
                    style={atomDark}
                    customStyle={{
                      margin: 0,
                      padding: '0.75rem sm:1rem',
                      background: '#111827',
                      fontSize: '0.7rem sm:0.75rem',
                      borderRadius: '0.375rem'
                    }}
                  >
                    {`{
  "apikey": "DeB-xxxxxxxxxxxxxapikey",
}`}
                  </SyntaxHighlighter>
                </div>
                
                <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-purple-800/50">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h4 className="text-cyan-300 font-semibold text-sm sm:text-base">Response</h4>
                    <button 
                      onClick={() => copyToClipboard(`{
                        "login_url": "https://auth.debuggers.com/auth/login/unique-session-id",,
                      }`, 'otl-response')}
                      className="text-xs bg-purple-700 hover:bg-purple-600 px-2 py-1 rounded transition-colors"
                    >
                      {copiedCode === 'otl-response' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    language="json"
                    style={atomDark}
                    customStyle={{
                      margin: 0,
                      padding: '0.75rem sm:1rem',
                      background: '#111827',
                      fontSize: '0.7rem sm:0.75rem',
                      borderRadius: '0.375rem'
                    }}
                  >
                    {`{
  "login_url": "https://auth.debuggers.com/auth/login/unique-session-id",
}`}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-purple-800/30 shadow-lg">
              <div className="flex items-center mb-3 sm:mb-4">
                <span className="bg-yellow-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-bold mr-3 sm:mr-4">POST</span>
                <code className="text-cyan-200 text-sm sm:text-lg font-mono bg-gray-700 px-2 sm:px-3 py-1 rounded">/token</code>
              </div>
              <p className="text-cyan-200 mb-4 sm:mb-6 text-sm sm:text-base">Exchange authorization code for JWT token. Requires client secret.</p>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-cyan-800/50">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h4 className="text-cyan-300 font-semibold text-sm sm:text-base">Request Body</h4>
                    <button 
                      onClick={() => copyToClipboard(`{
                        "code": "authorization_code",
                        "client_secret": "your_client_secret"
                      }`, 'token-request')}
                      className="text-xs bg-cyan-700 hover:bg-cyan-600 px-2 py-1 rounded transition-colors"
                    >
                      {copiedCode === 'token-request' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    language="json"
                    style={atomDark}
                    customStyle={{
                      margin: 0,
                      padding: '0.75rem sm:1rem',
                      background: '#111827',
                      fontSize: '0.7rem sm:0.75rem',
                      borderRadius: '0.375rem'
                    }}
                  >
                    {`{
  "code": "authorization_code",
  "client_secret": "your_client_secret"
}`}
                  </SyntaxHighlighter>
                </div>
                
                <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-purple-800/50">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h4 className="text-cyan-300 font-semibold text-sm sm:text-base">Response</h4>
                    <button 
                      onClick={() => copyToClipboard(`{
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        "expiresIn": 3600,
                        "tokenType": "Bearer"
                      }`, 'token-response')}
                      className="text-xs bg-purple-700 hover:bg-purple-600 px-2 py-1 rounded transition-colors"
                    >
                      {copiedCode === 'token-response' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    language="json"
                    style={atomDark}
                    customStyle={{
                      margin: 0,
                      padding: '0.75rem sm:1rem',
                      background: '#111827',
                      fontSize: '0.7rem sm:0.75rem',
                      borderRadius: '0.375rem'
                    }}
                  >
                    {`{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}`}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section id="examples" className="mb-12 sm:mb-16 scroll-mt-20">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Implementation Examples
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mt-2 rounded-full"></div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-cyan-800/30 shadow-lg overflow-hidden">
            {/* Tab Headers - Scrollable on mobile */}
            <div className="flex overflow-x-auto border-b border-cyan-800/30 bg-gray-900/50 scrollbar-hide">
              {Object.entries(codeExamples).map(([lang, { filename }]) => (
                <button
                  key={lang}
                  className={`px-4 sm:px-6 py-3 sm:py-4 font-medium capitalize border-b-2 transition-all flex-shrink-0 ${
                    activeTab === lang 
                      ? 'border-cyan-400 text-cyan-300 bg-gray-800' 
                      : 'border-transparent text-cyan-200 hover:bg-gray-700/50 hover:text-cyan-300'
                  }`}
                  onClick={() => setActiveTab(lang)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm sm:text-base">{lang}</span>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">{filename.split('.').pop()}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Tab Content */}
            <div className="p-0">
              <CodeEditor 
                code={codeExamples[activeTab].code} 
                language={activeTab}
                filename={codeExamples[activeTab].filename}
              />
            </div>
          </div>
        </section>

        {/* JWT Token Information */}
        <section id="token-info" className="mb-12 sm:mb-16 scroll-mt-20">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              JWT Token Information
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mt-2 rounded-full"></div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl border border-purple-800/30 shadow-lg">
            <p className="text-cyan-200 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg">
              The JWT token returned after successful authentication contains user information and is used for subsequent API requests.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-cyan-800/50">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h4 className="text-cyan-300 font-semibold text-base sm:text-lg">JWT Payload Structure</h4>
                  <button 
                    onClick={() => copyToClipboard(`{
                      "iss": "your-auth-service",
                      "sub": "user_12345",
                      "aud": "your-api",
                      "exp": 1672531200,
                      "iat": 1672527600,
                      "email": "user@example.com",
                      "name": "John Doe",
                      "roles": ["user", "premium"]
                    }`, 'jwt-payload')}
                    className="text-xs sm:text-sm bg-cyan-700 hover:bg-cyan-600 px-2 sm:px-3 py-1 rounded transition-colors"
                  >
                    {copiedCode === 'jwt-payload' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <SyntaxHighlighter
                  language="json"
                  style={atomDark}
                  customStyle={{
                    margin: 0,
                    padding: '0.75rem sm:1rem',
                    background: '#111827',
                    fontSize: '0.7rem sm:0.75rem',
                    borderRadius: '0.5rem'
                  }}
                >
                  {`{
  "iss": "DeB-Auth-Service",
  "exp": 1672531200,
  "iat": 1672527600,
  "email": "user@example.com",
  "name": "John Doe",
  "profile_picture":"https://user-profile/" || "null | None"
}`}
                </SyntaxHighlighter>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h4 className="text-cyan-300 font-semibold text-base sm:text-lg mb-2 sm:mb-3">Standard Claims</h4>
                  <ul className="text-cyan-200 space-y-2 text-sm sm:text-base">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                      <code className="bg-gray-700 px-2 py-1 rounded mr-2 text-xs">iss</code> - Token issuer
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <code className="bg-gray-700 px-2 py-1 rounded mr-2 text-xs">exp</code> - Expiration time (For 1-hour)
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <code className="bg-gray-700 px-2 py-1 rounded mr-2 text-xs">iat</code> - Issued at time
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-cyan-300 font-semibold text-base sm:text-lg mb-2 sm:mb-3">Custom Claims</h4>
                  <ul className="text-cyan-200 space-y-2 text-sm sm:text-base">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                      <code className="bg-gray-700 px-2 py-1 rounded mr-2 text-xs">email</code> - User's email address
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                      <code className="bg-gray-700 px-2 py-1 rounded mr-2 text-xs">name</code> - User's full name
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <code className="bg-gray-700 px-2 py-1 rounded mr-2 text-xs">profile_picture</code> - User's Profile Picture
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Notes */}
        <section id="guidelines" className="mb-12 sm:mb-16 scroll-mt-20">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Security Guidelines
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mt-2 rounded-full"></div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-purple-900/20 p-4 sm:p-6 md:p-8 rounded-xl border border-cyan-800/30 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  icon: "🔒",
                  title: "HTTPS Only",
                  description: "Always use HTTPS in production to protect API keys and tokens"
                },
                {
                  icon: "🚫",
                  title: "Secure Storage",
                  description: "Never expose client secrets in client-side code"
                },
                {
                  icon: "💾",
                  title: "Safe Storage",
                  description: "Store API keys and tokens securely, not in version control"
                },
                {
                  icon: "⏰",
                  title: "Token Expiration",
                  description: "Implement proper token expiration and refresh mechanisms"
                },
                {
                  icon: "✅",
                  title: "Server Validation",
                  description: "Validate JWT tokens on the server side for all protected endpoints"
                },
                {
                  icon: "🔄",
                  title: "Regular Rotation",
                  description: "Regularly rotate API keys and client secrets"
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 sm:p-4 bg-black/30 rounded-lg border border-cyan-800/20">
                  <span className="text-xl sm:text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <h4 className="text-cyan-300 font-semibold mb-1 text-sm sm:text-base">{item.title}</h4>
                    <p className="text-cyan-200 text-xs sm:text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 sm:py-8 border-t border-cyan-800/30 mt-8 sm:mt-12">
        <p className="text-cyan-300 text-sm sm:text-base">Authentication API Documentation • v2.0</p>
        <p className="text-cyan-200/70 text-xs sm:text-sm mt-2">Secure, scalable authentication for your applications</p>
      </footer>
    </div>
  );
};