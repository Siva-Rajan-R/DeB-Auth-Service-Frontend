import Security from '../assets/lotties/SECURITY.json'
import Oauth from '../assets/lotties/Cybersecurity.json'
import Keys from '../assets/lotties/keys.json'

export const authFLowSteps=[
    {
        'title':'API Key → Authorization:',
        'subTitle':`Initialize the flow with a validated API Key. We respond with a secure, one-time login URL for your users.`

    },
    {
        'title':'Verified User Sign-In:',
        'subTitle':`Users authenticate via Social OAuth or Email/SMS OTP. Upon success, a short-lived authorization code is generated.`

    },
    {
        'title':'Secure Code Exchange:',
        'subTitle':`Swap the authorization code and client secret for a production-ready JWT. This follows the standard OAuth2 Authorization Code flow.`

    },
    {
        'title':'The Token Swap',
        'subTitle':`The client application exchanges the received authorization code and Client Secret for a secure JWT Access Token. This server-to-server handshake ensures that only verified, trusted clients can access user data. Our system implements a strict OAuth2 exchange flow to prevent token theft and unauthorized access..`

    },
    {
        'title':'User Info',
        'subTitle':`Once the client possesses a valid JWT Bearer Token, it can query the /userinfo endpoint. Our server decodes the OIDC-compliant token, validates the signature, and returns a JSON object containing verified User Claims such as User ID, Name, and Email for seamless profile synchronization.`

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
    {'title':'Multiple Sign-In Options','desc':'Native support for Passwordless OTP, Google OAuth, and GitHub Login. Switch between providers with a simple configuration change.','imageUrl':'/social_links.png','lottieUrl':null},
    {'title':'Secure JWT Delivery','desc':'FastAPI-powered token generation. We issue Pydantic-validated JWTs (JSON Web Tokens) containing verified user profile metadata.','imageUrl':null,'lottieUrl':Security},
    {'title':'Multiple API Keys & Configs','desc':'Manage unique API configurations for development, staging, and production environments with ease.','imageUrl':null,'lottieUrl':Keys},
    {'title':'OAuth-Like Simplicity','desc':'A familiar OAuth2 Authorization Code flow. Integrate secure login, redirect, and code exchange into your app in under 5 minutes.','imageUrl':null,'lottieUrl':Oauth}
]


export const navigationTexts = [
    { navName: 'Home', href: 'home' },
    { navName: 'Features', href: 'features' },
    { navName: 'Auth-Flow', href: 'auth-flow' },
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
      code: `// Step 1: Get login URL
async function getLoginUrl(apiKey) {
  const response = await fetch(\`/auth?apiKey=\${apiKey}\`);
  const data = await response.json();
  return data.loginUrl;
}

// Step 2: Handle redirect and get code from URL
function getCodeFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
}

// Step 3: Exchange code for JWT token
async function exchangeCodeForToken(code, clientSecret) {
  const response = await fetch('/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: code,
      client_secret: clientSecret
    })
  });
  
  const data = await response.json();
  return data.token; // JWT token
}

// Step 4: Use JWT token for authenticated requests
function getUserInfo(token) {
  return fetch('/user', {
    headers: {
      'Authorization': \`Bearer \${token}\`
    }
  });
}`,
      filename: 'auth.js',
      language: 'javascript'
    },

    python: {
      code: `import requests
import json

class AuthClient:
    def __init__(self, api_key, client_secret):
        self.api_key = api_key
        self.client_secret = client_secret
        self.base_url = "https://api.yourservice.com"
    
    def get_login_url(self):
        """Step 1: Get one-time login URL"""
        response = requests.get(
            f"{self.base_url}/auth",
            params={"apiKey": self.api_key}
        )
        return response.json()["loginUrl"]
    
    def exchange_code_for_token(self, code):
        """Step 3: Exchange authorization code for JWT token"""
        response = requests.post(
            f"{self.base_url}/token",
            json={
                "code": code,
                "client_secret": self.client_secret
            }
        )
        return response.json()["token"]
    
    def get_user_info(self, token):
        """Step 4: Get user info using JWT token"""
        response = requests.get(
            f"{self.base_url}/user",
            headers={"Authorization": f"Bearer {token}"}
        )
        return response.json()

# Usage example
client = AuthClient("your_api_key", "your_client_secret")
login_url = client.get_login_url()
print(f"Login URL: {login_url}")

# After user redirects with code
code = "authorization_code_from_redirect"
token = client.exchange_code_for_token(code)
user_info = client.get_user_info(token)`,
      filename: 'auth_client.py',
      language: 'python'
    },

    dart: {
      code: `import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  final String apiKey;
  final String clientSecret;
  final String baseUrl = 'https://api.yourservice.com';
  
  AuthService({required this.apiKey, required this.clientSecret});
  
  // Step 1: Get login URL
  Future<String> getLoginUrl() async {
    final response = await http.get(
      Uri.parse('\$baseUrl/auth?apiKey=\$apiKey')
    );
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['loginUrl'];
    } else {
      throw Exception('Failed to get login URL');
    }
  }
  
  // Step 3: Exchange code for JWT token
  Future<String> exchangeCodeForToken(String code) async {
    final response = await http.post(
      Uri.parse('\$baseUrl/token'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'code': code,
        'client_secret': clientSecret
      }),
    );
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['token'];
    } else {
      throw Exception('Failed to exchange code for token');
    }
  }
  
  // Step 4: Get user info with JWT token
  Future<Map<String, dynamic>> getUserInfo(String token) async {
    final response = await http.get(
      Uri.parse('\$baseUrl/user'),
      headers: {'Authorization': 'Bearer \$token'},
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to get user info');
    }
  }
}

// Usage in Flutter
void authenticateUser() async {
  final authService = AuthService(
    apiKey: 'your_api_key',
    clientSecret: 'your_client_secret'
  );
  
  try {
    final loginUrl = await authService.getLoginUrl();
    // Launch URL in webview
    // After redirect, extract code from URL
    final code = 'authorization_code_from_redirect';
    final token = await authService.exchangeCodeForToken(code);
    final userInfo = await authService.getUserInfo(token);
    print('User: \$userInfo');
  } catch (e) {
    print('Authentication failed: \$e');
  }
}`,
      filename: 'auth_service.dart',
      language: 'dart'
    },

    curl: {
      code: `# Step 1: Get login URL
curl -X GET "https://api.yourservice.com/auth?apiKey=your_api_key_here"

# Response: 
# {
#   "loginUrl": "https://auth.yourservice.com/login/unique-session-id",
#   "expiresIn": 300
# }

# Step 2: User signs in via the login URL (manual step)

# Step 3: Exchange code for token
curl -X POST "https://api.yourservice.com/token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "code": "authorization_code_from_redirect",
    "client_secret": "your_client_secret"
  }'

# Response:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "expiresIn": 3600,
#   "tokenType": "Bearer"
# }

# Step 4: Use JWT token to get user info
curl -X GET "https://api.yourservice.com/user" \\
  -H "Authorization: Bearer your_jwt_token_here"`,
      filename: 'auth_requests.sh',
      language: 'bash'
    }
};

