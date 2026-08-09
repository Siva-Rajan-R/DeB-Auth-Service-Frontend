import Security from '../assets/lotties/SECURITY.json'
import Oauth from '../assets/lotties/Cybersecurity.json'
import Keys from '../assets/lotties/keys.json'

export const authFLowSteps=[
    {
        'title':'API Key → One-Time Login Form',
        'subTitle':`When a client wants to start the authentication process, it sends its API Key to the server.
                    The server validates this key and responds with a secure, one-time login URL.
                    This ensures that only valid API key holders can initiate the flow.`

    },
    {
        'title':'User Signs In',
        'subTitle':`Once the user opens the login page, they can sign in using multiple options such as:

                    OTP-based login (mobile or email verification)
                    Social logins like Google, Facebook, or GitHub

                    After successful login, the server generates a temporary authorization code that will be used in the next step.`

    },
    {
        'title':'Redirect',
        'subTitle':`The server then redirects the user back to the client's registered redirect URL.
        During this redirect, the authorization code is securely attached as a query parameter.
        This code is short-lived and valid only for a single exchange.`

    },
    {
        'title':'Code Exchange',
        'subTitle':`The client now takes the received authorization code and sends it along with its Client Secret to the server. The server verifies both values. If valid → the server issues a JWT Access Token. If invalid → the server denies access with an error.
        This step ensures that only trusted clients can exchange codes for tokens.`

    },
    {
        'title':'User Info',
        'subTitle':`With the valid JWT Access Token, the client can now call the /userinfo endpoint.
        The server decodes the token, validates it, and returns user profile details such as: User ID, Name, Email`

    },

]

export const DialogContents={

    'secretsRevokeContent': (
        <div className="flex flex-col items-center justify-center space-y-4 px-6 py-4">
            {/* Icon */}
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-300 to-blue-500 shadow-md shadow-blue-400">
            <span className="text-white text-2xl">♻️</span>
            </div>
    
            {/* Description */}
            <p className="text-white text-center text-md leading-relaxed font-semibold">
            This action will <span className="text-blue-400 font-bold">Regenerate</span> your API key.  
            Your current key will be invalid, and a new one will be issued immediately.
            </p>
    
            {/* Warning Box */}
            <div className="w-full border border-blue-400 rounded-lg p-3 bg-blue-900/30 text-sm text-blue-300 text-center shadow-md">
            ⚡ Update all your apps and services with the new API key, as the old one will stop working.
            </div>
        </div>
    ),

    'SecretsRemoveContent': (
        <div className="flex flex-col items-center justify-center space-y-4 px-6 py-4">
            {/* Icon */}
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-300 to-purple-500 shadow-md shadow-purple-400">
            <span className="text-white text-2xl">⚠️</span>
            </div>

            {/* Description */}
            <p className="text-white text-center text-md leading-relaxed font-semibold">
            This action is <span className="text-red-400 font-bold">Irreversible</span>.  
            Removing your API key will immediately disable all apps and services using it.
            </p>

            {/* Warning Box */}
            <div className="w-full border border-red-400 rounded-lg p-3 bg-red-900/30 text-sm text-red-300 text-center shadow-md">
            ⚡ Ensure you have generated a new key before removing the old one.
            </div>
        </div>
    )
}


export const featuresCardDatas=[
    {'title':'Multiple Sign-In Options','desc':'OTP, Google, Facebook, GitHub — users can sign in their way.','imageUrl':'/social_links.png','lottieUrl':null},
    {'title':'Secure JWT Delivery','desc':'Client secret swap → JWT issued with full profile info.','imageUrl':null,'lottieUrl':Security},
    {'title':'Multiple API Keys & Configs','desc':'Create different API keys with custom login options — OTP, Google, Facebook, GitHub','imageUrl':null,'lottieUrl':Keys},
    {'title':'OAuth-Like Simplicity','desc':'Works just like OAuth — login, redirect, code exchange, and user info. Simple and secure.','imageUrl':null,'lottieUrl':Oauth}
]


export const navigationTexts = [
    { navName: 'Home', href: 'home' },
    { navName: 'Features', href: 'features' },
    { navName: 'Auth-Flow', href: 'auth-flow' },
    { navName: 'Pricing', href: 'pricing' },
    { navName: 'Know-Us', href: 'know-us' }
];

export const docsNavTexts=[
    { id: 'endpoints', label: 'Endpoints', icon: '🔌' },
    { id: 'examples', label: 'Examples', icon: '💻' },
    { id: 'token-info', label: 'Token', icon: '🔑' },
    { id: 'guidelines', label: 'Guide', icon: '🛡️' }
];


export const codeExamples = {
    javascript: {
      code: `// Step 1: Get Sign-in & Sign-up URLs with optional additional_infos
async function getAuthUrls(apiKey, additionalInfos = {}) {
  const response = await fetch('/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apikey: apiKey,
      additional_infos: additionalInfos // Stored securely and returned in JWT
    })
  });
  const data = await response.json();
  // Returns: { signin_url: "...", signup_url: "..." }
  return data;
}

// Step 2: Extract token_id from redirect URL
function getTokenIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('token_id');
}

// Step 3: Swap token_id + client_secret for JWT Access Token
async function exchangeTokenIdForJWT(tokenId, apiKey, clientSecret) {
  const response = await fetch('/auth/authenticated-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token_id: tokenId,
      client_id: apiKey,
      client_secret: clientSecret
    })
  });
  const data = await response.json();
  return data.token; // Returns final JWT token containing user profile & additional_infos
}

// 2FA TOTP Setup & Verification (Scoped per Product Client ID)
async function setup2FA(clientId, clientSecret, userEmail) {
  return await fetch('/auth/2fa/setup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      email: userEmail
    })
  }).then(r => r.json()); // Returns: { success: true, secret: "...", provisioning_uri: "...", qr_code_base64: "data:image/png;base64,..." }
}

async function verify2FA(clientId, clientSecret, userEmail, code) {
  return await fetch('/auth/2fa/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      email: userEmail,
      code: code
    })
  }).then(r => r.json()); // Returns: { success: true, message: "Verification successful" }
}`,
      filename: 'dauth-client.js',
      language: 'javascript'
    },

    python: {
      code: `import requests

class DAuthClient:
    def __init__(self, api_key: str, client_secret: str, base_url: str = "http://127.0.0.1:8000"):
        self.api_key = api_key
        self.client_secret = client_secret
        self.base_url = base_url.rstrip("/")
    
    def get_auth_urls(self, additional_infos: dict = None) -> dict:
        """Step 1: Get Sign-in & Sign-up URLs with optional additional_infos"""
        payload = {"apikey": self.api_key}
        if additional_infos:
            payload["additional_infos"] = additional_infos
        res = requests.post(f"{self.base_url}/auth", json=payload)
        return res.json() # {"signin_url": "...", "signup_url": "..."}
    
    def exchange_token_id(self, token_id: str) -> dict:
        """Step 3: Exchange token_id + client secret for JWT"""
        res = requests.post(
            f"{self.base_url}/auth/authenticated-user",
            json={
                "token_id": token_id,
                "client_id": self.api_key,
                "client_secret": self.client_secret
            }
        )
        return res.json() # Returns {"token": "eyJhbG..."}

    def setup_2fa(self, email: str):
        """Initiate 2FA setup & generate QR Code data URL"""
        return requests.post(
            f"{self.base_url}/auth/2fa/setup",
            json={
                "client_id": self.api_key,
                "client_secret": self.client_secret,
                "email": email
            }
        ).json() # Returns {"secret": "...", "qr_code_base64": "data:image/png;base64,..."}

    def verify_2fa(self, email: str, code: str):
        """Verify 2FA TOTP code for product domain"""
        return requests.post(
            f"{self.base_url}/auth/2fa/verify",
            json={
                "client_id": self.api_key,
                "client_secret": self.client_secret,
                "email": email,
                "code": code
            }
        ).json()

# Usage Example
client = DAuthClient(api_key="DeB-xxxxxxxx", client_secret="your_client_secret")
urls = client.get_auth_urls(additional_infos={"role": "admin", "tenant": "acme"})
print(f"Direct user to signin: {urls['signin_url']}")`,
      filename: 'dauth_client.py',
      language: 'python'
    },

    dart: {
      code: `import 'dart:convert';
import 'package:http/http.dart' as http;

class DAuthService {
  final String apiKey;
  final String clientSecret;
  final String baseUrl;

  DAuthService({
    required this.apiKey,
    required this.clientSecret,
    this.baseUrl = 'http://127.0.0.1:8000',
  });

  /// Step 1: Get Sign-in & Sign-up URLs
  Future<Map<String, dynamic>> getAuthUrls({Map<String, dynamic>? additionalInfos}) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'apikey': apiKey,
        if (additionalInfos != null) 'additional_infos': additionalInfos,
      }),
    );
    return jsonDecode(response.body);
  }

  /// Step 3: Swap token_id + clientSecret for JWT Token
  Future<Map<String, dynamic>> exchangeTokenId(String tokenId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/authenticated-user'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'token_id': tokenId,
        'client_id': apiKey,
        'client_secret': clientSecret,
      }),
    );
    return jsonDecode(response.body);
  }

  /// 2FA Setup
  Future<Map<String, dynamic>> setup2FA(String email) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/2fa/setup'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'client_id': apiKey,
        'client_secret': clientSecret,
        'email': email,
      }),
    );
    return jsonDecode(response.body);
  }

  /// 2FA Verification
  Future<Map<String, dynamic>> verify2FA(String email, String code) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/2fa/verify'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'client_id': apiKey,
        'client_secret': clientSecret,
        'email': email,
        'code': code,
      }),
    );
    return jsonDecode(response.body);
  }
}`,
      filename: 'dauth_service.dart',
      language: 'dart'
    },

    curl: {
      code: `# 1. Get Sign-in & Sign-up URLs with additional_infos
curl -X POST "http://127.0.0.1:8000/auth" \\
  -H "Content-Type: application/json" \\
  -d '{
    "apikey": "DeB-pCRP-C07EthcUz8VjKL-4AUOpVhZBkEpZfqDFOmdhzk",
    "additional_infos": {
      "role": "admin",
      "tenant_id": "tenant_987"
    }
  }'

# 2. Swap token_id + Client ID + Client Secret for JWT Token
curl -X POST "http://127.0.0.1:8000/auth/authenticated-user" \\
  -H "Content-Type: application/json" \\
  -d '{
    "token_id": "token_id_from_redirect",
    "client_id": "DeB-pCRP-C07EthcUz8VjKL-4AUOpVhZBkEpZfqDFOmdhzk",
    "client_secret": "your_client_secret"
  }'

# 3. 2FA Setup (Generates secret & QR code image Base64)
curl -X POST "http://127.0.0.1:8000/auth/2fa/setup" \\
  -H "Content-Type: application/json" \\
  -d '{
    "client_id": "DeB-pCRP-C07EthcUz8VjKL-4AUOpVhZBkEpZfqDFOmdhzk",
    "client_secret": "your_client_secret",
    "email": "user@example.com"
  }'

# 4. 2FA Verification
curl -X POST "http://127.0.0.1:8000/auth/2fa/verify" \\
  -H "Content-Type: application/json" \\
  -d '{
    "client_id": "DeB-pCRP-C07EthcUz8VjKL-4AUOpVhZBkEpZfqDFOmdhzk",
    "client_secret": "your_client_secret",
    "email": "user@example.com",
    "code": "123456"
  }'`,
      filename: 'dauth_requests.sh',
      language: 'bash'
    }
};



export const DashboardDatas=[
  {'logoUrl':"",title:"",authType:"Oauth 2.0",authMethods:['Google',"Github"],authId:""}
]