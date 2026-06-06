import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_UI_CONFIG = {
  // Existing
  screen_bg_color: '#f9fafb',
  login_card_bg_color: '#ffffff',
  brand_logo: '',
  brand_name: 'De-Buggers',
  primary_color: '#4f46e5',
  text_color: '#111827',

  // Typography
  font_family: 'system',       // 'system'|'Inter'|'Roboto'|'Poppins'|'Nunito'|'Montserrat'
  font_size: 'md',             // 'sm'|'md'|'lg'

  // Shape & Card
  border_radius: 'rounded',    // 'square'|'rounded'|'pill'
  shadow_intensity: 'md',      // 'none'|'sm'|'md'|'lg'
  blur_amount: 24,             // 0–40 (px)
  border_width: 1,             // 0–4 (px)
  border_color: 'rgba(255,255,255,0.10)',

  // Button & Input
  button_style: 'filled',      // 'filled'|'outlined'|'ghost'
  input_style: 'outlined',     // 'filled'|'outlined'
  input_border_color: 'rgba(255,255,255,0.12)',

  // Layout
  logo_position: 'center',     // 'left'|'center'|'right'
  social_layout: 'list',       // 'grid'|'list'|'compact'

  // Background
  bg_pattern: 'dots',          // 'solid'|'dots'|'diagonal'|'gradient'
  gradient_start: '#0f172a',
  gradient_end: '#1e1b4b',
  gradient_direction: '135deg',// '45deg'|'90deg'|'135deg'|'180deg'

  // Custom CSS
  custom_css: '',
};

const DEFAULT_REDIRECT_URLS = {
  signin_success: '',
  signin_failure: '',
  signup_success: '',
  signup_failure: '',
};

// Password is the first/default method
const DEFAULT_AUTH_METHODS = [
  { id: 'password',  name: 'Password',  enabled: true  },
  { id: 'google',    name: 'Google',    enabled: false },
  { id: 'github',    name: 'GitHub',    enabled: false },
  { id: 'facebook',  name: 'Facebook',  enabled: false },
  { id: 'microsoft', name: 'Microsoft', enabled: false },
  { id: 'otp',       name: 'OTP',       enabled: false },
];

const DEFAULT_SIGNUP_FIELDS = [
  { id: 'field-username', label: 'Full Name',    name: 'fullname', type: 'text',   required: true  },
  { id: 'field-phone',    label: 'Phone Number', name: 'phone',    type: 'number', required: false },
];

const DEFAULT_ROLES = [
  { id: 'role-admin',      name: 'Admin',       isDefault: true },
  { id: 'role-user',       name: 'User',        isDefault: true },
  { id: 'role-superadmin', name: 'Super Admin', isDefault: true },
];

export const useAuthConfigStore = create(
  persist(
    (set, get) => ({
      hasUnsavedChanges: false,
      setHasUnsavedChanges: (val) => set({ hasUnsavedChanges: val }),
      projectName: 'Untitled Project',
      activeMode: 'signin',
      setActiveMode: (mode) => set({ activeMode: mode }),
      setProjectName: (name) => set({ projectName: name }),

      uiConfig: { ...DEFAULT_UI_CONFIG },
      updateUIConfig: (key, value) =>
        set((s) => ({ uiConfig: { ...s.uiConfig, [key]: value } })),

      authMethods: DEFAULT_AUTH_METHODS.map((m) => ({ ...m })),
      toggleAuthMethod: (id) => {
        const methods = get().authMethods;
        const enabledCount = methods.filter((m) => m.enabled).length;
        const target = methods.find((m) => m.id === id);
        if (target?.enabled && enabledCount <= 1) return;
        set((s) => ({
          authMethods: s.authMethods.map((m) =>
            m.id === id ? { ...m, enabled: !m.enabled } : m
          ),
        }));
      },
      reorderAuthMethods: (methods) => set({ authMethods: methods }),

      forgotPasswordEnabled: true,
      toggleForgotPassword: () =>
        set((s) => ({ forgotPasswordEnabled: !s.forgotPasswordEnabled })),

      signupFields: DEFAULT_SIGNUP_FIELDS.map((f) => ({ ...f })),
      addSignupField: () =>
        set((s) => ({
          signupFields: [
            ...s.signupFields,
            { id: `field-${Date.now()}`, label: 'New Field', name: 'new_field', type: 'text', required: false },
          ],
        })),
      removeSignupField: (id) =>
        set((s) => ({ signupFields: s.signupFields.filter((f) => f.id !== id) })),
      updateSignupField: (id, updates) =>
        set((s) => ({
          signupFields: s.signupFields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        })),
      reorderSignupFields: (fields) => set({ signupFields: fields }),

      sso: { enabled: false, domains: [] },
      toggleSSO: () => set((s) => ({ sso: { ...s.sso, enabled: !s.sso.enabled } })),
      addSSODomain: (domain) =>
        set((s) => ({
          sso: { ...s.sso, domains: [...s.sso.domains, { id: `d-${Date.now()}`, domain }] },
        })),
      removeSSODomain: (id) =>
        set((s) => ({
          sso: { ...s.sso, domains: s.sso.domains.filter((d) => d.id !== id) },
        })),

      // Redirect URLs
      redirectURLs: { ...DEFAULT_REDIRECT_URLS },
      updateRedirectURL: (key, value) =>
        set((s) => ({ redirectURLs: { ...s.redirectURLs, [key]: value } })),

      // Admin — Users
      adminUsers: [],
      setAdminUsers: (users) => set({ adminUsers: users }),
      addAdminUser: (user) =>
        set((s) => ({
          adminUsers: [...s.adminUsers, { ...user, id: `user-${Date.now()}` }],
        })),
      updateAdminUser: (id, updates) =>
        set((s) => ({
          adminUsers: s.adminUsers.map((u) => (u.id === id ? { ...u, ...updates } : u)),
        })),
      removeAdminUser: (id) =>
        set((s) => ({ adminUsers: s.adminUsers.filter((u) => u.id !== id) })),

      // Admin — Roles
      adminRoles: DEFAULT_ROLES.map((r) => ({ ...r })),
      setAdminRoles: (roles) => set({ adminRoles: roles }),
      addAdminRole: (name) =>
        set((s) => ({
          adminRoles: [...s.adminRoles, { id: `role-${Date.now()}`, name, isDefault: false }],
        })),
      updateAdminRole: (id, name) =>
        set((s) => ({
          adminRoles: s.adminRoles.map((r) => (r.id === id ? { ...r, name } : r)),
        })),
      removeAdminRole: (id) =>
        set((s) => ({
          adminRoles: s.adminRoles.filter((r) => r.id !== id || r.isDefault),
        })),

      theme: 'light',
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: next });
        document.documentElement.setAttribute('data-theme', next);
      },

      resetToDefaults: () =>
        set({
          projectName: 'Untitled Project',
          activeMode: 'signin',
          theme: 'light',
          uiConfig: { ...DEFAULT_UI_CONFIG },
          authMethods: DEFAULT_AUTH_METHODS.map((m) => ({ ...m })),
          forgotPasswordEnabled: true,
          signupFields: DEFAULT_SIGNUP_FIELDS.map((f) => ({ ...f })),
          sso: { enabled: false, domains: [] },
          redirectURLs: { ...DEFAULT_REDIRECT_URLS },
          adminUsers: [],
          adminRoles: DEFAULT_ROLES.map((r) => ({ ...r })),
        }),

      getExportConfig: () => {
        const { projectName, uiConfig, authMethods, forgotPasswordEnabled, signupFields, sso, redirectURLs } = get();
        return {
          project_name: projectName,
          ui: { ...uiConfig },
          auth_methods: authMethods.map(({ id, name, enabled }) => ({ id, name, enabled })),
          forgot_password_enabled: forgotPasswordEnabled,
          signup_fields: signupFields.map(({ label, name, type, required }) => ({ label, name, type, required })),
          sso: { enabled: sso.enabled, domains: sso.domains.map((d) => d.domain) },
          redirect_urls: { ...redirectURLs },
        };
      },
    }),
    { name: 'deb-auth-config' }
  )
);
