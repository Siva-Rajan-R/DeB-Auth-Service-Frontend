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
    {'title':'Multiple Sign-In Options','desc':'OTP, Google, Facebook, GitHub — users can sign in their way.','imageUrl':'src/assets/images/social_links.png','lottieUrl':null},
    {'title':'Secure JWT Delivery','desc':'Client secret swap → JWT issued with full profile info.','imageUrl':null,'lottieUrl':Security},
    {'title':'Multiple API Keys & Configs','desc':'Create different API keys with custom login options — OTP, Google, Facebook, GitHub','imageUrl':null,'lottieUrl':Keys},
    {'title':'OAuth-Like Simplicity','desc':'Works just like OAuth — login, redirect, code exchange, and user info. Simple and secure.','imageUrl':null,'lottieUrl':Oauth}
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

