import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_UI_CONFIG = {
  // Existing
  screen_bg_color: '#f9fafb',
  login_card_bg_color: '#ffffff',
  brand_logo: 'https://images.menukit.debuggers.co.in/dauth-logos/logo_1786212957.png',
  brand_name: 'DAuth',
  primary_color: '#00d2e5',
  text_color: '#111827',
  btn_text_color: '#ffffff',
  link_color: '#3b82f6',

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
  signin_verification: '',
  signup_success: '',
  signup_failure: '',
  signup_verification: '',
};

// Password is the first/default method
const DEFAULT_AUTH_METHODS = [
  { id: 'password',   name: 'Password',   enabled: true  },
  { id: 'google',     name: 'Google',     enabled: false },
  { id: 'github',     name: 'GitHub',     enabled: false },
  { id: 'facebook',   name: 'Facebook',   enabled: false },
  { id: 'microsoft',  name: 'Microsoft',  enabled: false, isLocked: true },
  { id: 'email_otp',  name: 'Email OTP',  enabled: false },
  { id: 'mobile_otp', name: 'Mobile OTP', enabled: false },
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
      // Hydrate entire store from a backend config object
      hydrateFromConfig: (apiConfig) => {
        const { project_name, ui, auth_methods, forgot_password_enabled, signup_fields, sso, redirect_urls, two_factor, location_based_auth } = apiConfig;

        set({
          projectName: project_name || 'Untitled Project',
          uiConfig: { ...DEFAULT_UI_CONFIG, ...(ui || {}) },
          authMethods: (() => {
            const loaded = auth_methods || [];
            const mapped = loaded.map((m) => {
              const isLocked = (m.id === 'microsoft') ? true : !!m.isLocked;
              return { 
                id: m.id, 
                name: m.name || m.id, 
                enabled: isLocked ? false : !!m.enabled,
                isLocked 
              };
            });
            const oldOtpObj = mapped.find(m => m.id === 'otp');
            const oldOtpEnabled = oldOtpObj ? !!oldOtpObj.enabled : false;
            
            DEFAULT_AUTH_METHODS.forEach(def => {
              if (!mapped.some(m => m.id === def.id)) {
                let enabled = def.enabled;
                if (def.id === 'email_otp' && oldOtpEnabled) {
                  enabled = true;
                }
                mapped.push({ ...def, enabled: def.isLocked ? false : enabled });
              }
            });
            return mapped;
          })(),
          forgotPasswordEnabled: forgot_password_enabled !== undefined ? forgot_password_enabled : true,
          signupFields: signup_fields?.length
            ? signup_fields.map((f, i) => ({ id: f.id || `field-${i}`, ...f }))
            : DEFAULT_SIGNUP_FIELDS.map((f) => ({ ...f })),
          sso: sso ? { enabled: false, isLocked: true, domains: (sso.domains || []).map((d, i) => typeof d === 'string' ? { id: `d-${i}`, domain: d } : d) } : { enabled: false, isLocked: true, domains: [] },
          redirectURLs: redirect_urls ? { ...DEFAULT_REDIRECT_URLS, ...redirect_urls } : { ...DEFAULT_REDIRECT_URLS },
          twoFactor: two_factor ? { enabled: !!two_factor.enabled } : { enabled: false },
          locationAuth: !!location_based_auth,
          hasUnsavedChanges: false,
        });
      },


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
        const target = methods.find((m) => m.id === id);
        if (target?.isLocked) return;
        const enabledCount = methods.filter((m) => m.enabled).length;
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

      sso: { enabled: false, isLocked: true, domains: [] },
      toggleSSO: () => set((s) => ({ sso: { ...s.sso, enabled: s.sso.isLocked ? false : !s.sso.enabled } })),
      addSSODomain: (domain) =>
        set((s) => ({
          sso: { ...s.sso, domains: s.sso.isLocked ? s.sso.domains : [...s.sso.domains, { id: `d-${Date.now()}`, domain }] },
        })),
      removeSSODomain: (id) =>
        set((s) => ({
          sso: { ...s.sso, domains: s.sso.isLocked ? s.sso.domains : s.sso.domains.filter((d) => d.id !== id) },
        })),

      twoFactor: { enabled: false },
      updateTwoFactor: (updates) => set((s) => ({ twoFactor: { ...s.twoFactor, ...updates } })),

      locationAuth: false,
      setLocationAuth: (val) => set({ locationAuth: val }),


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
          sso: { enabled: false, isLocked: true, domains: [] },
          twoFactor: { enabled: false },
          locationAuth: false,
          redirectURLs: { ...DEFAULT_REDIRECT_URLS },

          adminUsers: [],
          adminRoles: DEFAULT_ROLES.map((r) => ({ ...r })),
        }),

      getExportConfig: () => {
        const { projectName, uiConfig, authMethods, forgotPasswordEnabled, signupFields, sso, redirectURLs, twoFactor, locationAuth } = get();
        return {
          project_name: projectName,
          ui: { ...uiConfig },
          auth_methods: authMethods.map(({ id, name, enabled }) => ({ id, name, enabled })),
          forgot_password_enabled: forgotPasswordEnabled,
          signup_fields: signupFields.map(({ label, name, type, required }) => ({ label, name, type, required })),
          sso: { enabled: false, is_locked: true, domains: sso.domains.map((d) => d.domain) },
          two_factor: { enabled: twoFactor.enabled },
          location_based_auth: locationAuth,
          redirect_urls: { ...redirectURLs },
        };
      },
    }),
    { name: 'deb-auth-config' }
  )
);

