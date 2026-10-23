import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_UI_CONFIG = {
  // Brand & General
  brand_logo: 'https://images.menukit.debuggers.co.in/dauth-logos/logo_1786212957.png',
  brand_name: 'DAuth',
  brand_text_color: '#ffffff',
  primary_color: '#00d2e5',
  text_color: '#ffffff',
  secondary_text_color: '#94a3b8',
  btn_text_color: '#ffffff',
  link_color: '#38bdf8',

  // Typography
  font_family: 'Inter',        // 'system'|'Inter'|'Roboto'|'Poppins'|'Nunito'|'Montserrat'
  font_size: 'md',             // 'sm'|'md'|'lg'

  // Shape & Card
  border_radius: 'rounded',    // 'square'|'rounded'|'pill'
  shadow_intensity: 'lg',      // 'none'|'sm'|'md'|'lg'
  blur_amount: 24,             // 0–40 (px)
  border_width: 1,             // 0–4 (px)
  border_color: 'rgba(0, 210, 229, 0.25)',
  card_variant: 'glassmorphism', // 'normal'|'neumorphism'|'glassmorphism'

  // Button & Input
  button_style: 'filled',      // 'filled'|'outlined'|'ghost'
  input_style: 'outlined',     // 'filled'|'outlined'
  input_border_color: 'rgba(255, 255, 255, 0.12)',
  provider_bg_color: 'rgba(255, 255, 255, 0.05)',
  provider_text_color: '#ffffff',

  // Layout
  logo_position: 'center',     // 'left'|'center'|'right'
  social_layout: 'list',       // 'grid'|'list'|'compact'

  // Global Background
  bg_type: 'gradient',         // 'static'|'gradient'
  bg_pattern: 'dots',          // 'none'|'dots'|'diagonal'
  screen_bg_color: '#070b14',
  gradient_start: '#070b14',
  gradient_mid: '#0d1728',
  gradient_end: '#131e32',
  gradient_direction: '135deg',

  // Card Background
  card_bg_type: 'static',      // 'static'|'gradient'
  card_bg_pattern: 'none',     // 'none'|'dots'|'diagonal'
  login_card_bg_color: 'rgba(15, 23, 42, 0.85)',
  card_gradient_start: 'rgba(15, 23, 42, 0.90)',
  card_gradient_mid: 'rgba(15, 23, 42, 0.80)',
  card_gradient_end: 'rgba(15, 23, 42, 0.70)',
  card_gradient_direction: '135deg',

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

const mapLoadedMethods = (loadedMethods) => {
  const loaded = loadedMethods || [];
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
};

export const useAuthConfigStore = create(
  persist(
    (set, get) => ({
      // Hydrate entire store from a backend config object
      hydrateFromConfig: (apiConfig) => {
        const {
          project_name, ui, auth_methods, forgot_password_enabled, signup_fields,
          sso, redirect_urls, two_factor, location_based_auth,
          signin, signup, separate_config
        } = apiConfig;

        const isSeparate = separate_config !== undefined
          ? !!separate_config
          : (!!signin || !!signup);

        const signinMethods = mapLoadedMethods(signin?.auth_methods || auth_methods);
        const signupMethods = mapLoadedMethods(signup?.auth_methods || auth_methods);

        const signinUI = { ...DEFAULT_UI_CONFIG, ...(ui || {}), ...(signin?.ui || {}) };
        const signupUI = { ...DEFAULT_UI_CONFIG, ...(ui || {}), ...(signup?.ui || {}) };

        const activeMode = get().activeMode || 'signin';
        const activeMethods = isSeparate
          ? (activeMode === 'signup' ? signupMethods : signinMethods)
          : signinMethods;
        const activeUI = isSeparate
          ? (activeMode === 'signup' ? signupUI : signinUI)
          : signinUI;

        set({
          projectName: project_name || 'Untitled Project',
          separateConfig: isSeparate,
          signinAuthMethods: signinMethods,
          signupAuthMethods: signupMethods,
          signinUIConfig: signinUI,
          signupUIConfig: signupUI,
          authMethods: activeMethods.map((m) => ({ ...m })),
          uiConfig: { ...activeUI },
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

      // Mode-specific & Separation State
      separateConfig: false,
      signinAuthMethods: DEFAULT_AUTH_METHODS.map((m) => ({ ...m })),
      signupAuthMethods: DEFAULT_AUTH_METHODS.map((m) => ({ ...m })),
      signinUIConfig: { ...DEFAULT_UI_CONFIG },
      signupUIConfig: { ...DEFAULT_UI_CONFIG },

      setSeparateConfig: (val) => {
        const currentMode = get().activeMode;
        if (val) {
          const signinMethods = get().signinAuthMethods.map((m) => ({ ...m }));
          const signinUI = { ...get().signinUIConfig };
          const signupMethods = get().signupAuthMethods.map((m) => ({ ...m }));
          const signupUI = { ...get().signupUIConfig };
          set({
            separateConfig: true,
            signupAuthMethods: signupMethods.length ? signupMethods : signinMethods,
            signupUIConfig: Object.keys(signupUI).length ? signupUI : signinUI,
            authMethods: currentMode === 'signup' ? signupMethods : signinMethods,
            uiConfig: currentMode === 'signup' ? signupUI : signinUI,
            hasUnsavedChanges: true,
          });
        } else {
          const signinMethods = get().signinAuthMethods.map((m) => ({ ...m }));
          const signinUI = { ...get().signinUIConfig };
          set({
            separateConfig: false,
            signupAuthMethods: signinMethods.map((m) => ({ ...m })),
            signupUIConfig: { ...signinUI },
            authMethods: signinMethods.map((m) => ({ ...m })),
            uiConfig: { ...signinUI },
            hasUnsavedChanges: true,
          });
        }
      },

      toggleSeparateConfig: () => {
        get().setSeparateConfig(!get().separateConfig);
      },

      copyModeConfig: (fromMode, toMode) => {
        const s = get();
        const sourceMethods = (fromMode === 'signup' ? s.signupAuthMethods : s.signinAuthMethods).map((m) => ({ ...m }));
        const sourceUI = { ...(fromMode === 'signup' ? s.signupUIConfig : s.signinUIConfig) };

        if (toMode === 'signup') {
          set({
            signupAuthMethods: sourceMethods,
            signupUIConfig: sourceUI,
            ...(s.activeMode === 'signup' ? { authMethods: sourceMethods.map((m) => ({ ...m })), uiConfig: { ...sourceUI } } : {}),
            hasUnsavedChanges: true,
          });
        } else {
          set({
            signinAuthMethods: sourceMethods,
            signinUIConfig: sourceUI,
            ...(s.activeMode === 'signin' ? { authMethods: sourceMethods.map((m) => ({ ...m })), uiConfig: { ...sourceUI } } : {}),
            hasUnsavedChanges: true,
          });
        }
      },

      setActiveMode: (mode) => {
        const s = get();
        const isSeparate = s.separateConfig;
        const currentMethods = isSeparate
          ? (mode === 'signup' ? s.signupAuthMethods : s.signinAuthMethods)
          : s.signinAuthMethods;
        const currentUI = isSeparate
          ? (mode === 'signup' ? s.signupUIConfig : s.signinUIConfig)
          : s.signinUIConfig;

        set({
          activeMode: mode,
          authMethods: currentMethods.map((m) => ({ ...m })),
          uiConfig: { ...currentUI },
        });
      },

      setProjectName: (name) => set({ projectName: name, hasUnsavedChanges: true }),

      uiConfig: { ...DEFAULT_UI_CONFIG },
      updateUIConfig: (key, value) => {
        const s = get();
        const isSeparate = s.separateConfig;
        const mode = s.activeMode;

        if (isSeparate) {
          if (mode === 'signup') {
            const newSignupUI = { ...s.signupUIConfig, [key]: value };
            set({
              signupUIConfig: newSignupUI,
              uiConfig: newSignupUI,
              hasUnsavedChanges: true,
            });
          } else {
            const newSigninUI = { ...s.signinUIConfig, [key]: value };
            set({
              signinUIConfig: newSigninUI,
              uiConfig: newSigninUI,
              hasUnsavedChanges: true,
            });
          }
        } else {
          const newUI = { ...s.uiConfig, [key]: value };
          set({
            signinUIConfig: newUI,
            signupUIConfig: newUI,
            uiConfig: newUI,
            hasUnsavedChanges: true,
          });
        }
      },

      authMethods: DEFAULT_AUTH_METHODS.map((m) => ({ ...m })),
      toggleAuthMethod: (id) => {
        const s = get();
        const isSeparate = s.separateConfig;
        const mode = s.activeMode;

        const targetMethods = isSeparate
          ? (mode === 'signup' ? s.signupAuthMethods : s.signinAuthMethods)
          : s.signinAuthMethods;

        const target = targetMethods.find((m) => m.id === id);
        if (target?.isLocked) return;
        const enabledCount = targetMethods.filter((m) => m.enabled).length;
        if (target?.enabled && enabledCount <= 1) return;

        const updated = targetMethods.map((m) =>
          m.id === id ? { ...m, enabled: !m.enabled } : m
        );

        if (isSeparate) {
          if (mode === 'signup') {
            set({
              signupAuthMethods: updated,
              authMethods: updated,
              hasUnsavedChanges: true,
            });
          } else {
            set({
              signinAuthMethods: updated,
              authMethods: updated,
              hasUnsavedChanges: true,
            });
          }
        } else {
          set({
            signinAuthMethods: updated,
            signupAuthMethods: updated,
            authMethods: updated,
            hasUnsavedChanges: true,
          });
        }
      },

      reorderAuthMethods: (methods) => {
        const s = get();
        const isSeparate = s.separateConfig;
        const mode = s.activeMode;

        if (isSeparate) {
          if (mode === 'signup') {
            set({
              signupAuthMethods: methods,
              authMethods: methods,
              hasUnsavedChanges: true,
            });
          } else {
            set({
              signinAuthMethods: methods,
              authMethods: methods,
              hasUnsavedChanges: true,
            });
          }
        } else {
          set({
            signinAuthMethods: methods,
            signupAuthMethods: methods,
            authMethods: methods,
            hasUnsavedChanges: true,
          });
        }
      },

      forgotPasswordEnabled: true,
      toggleForgotPassword: () =>
        set((s) => ({ forgotPasswordEnabled: !s.forgotPasswordEnabled, hasUnsavedChanges: true })),

      signupFields: DEFAULT_SIGNUP_FIELDS.map((f) => ({ ...f })),
      addSignupField: () =>
        set((s) => ({
          signupFields: [
            ...s.signupFields,
            { id: `field-${Date.now()}`, label: 'New Field', name: 'new_field', type: 'text', required: false },
          ],
          hasUnsavedChanges: true,
        })),
      removeSignupField: (id) =>
        set((s) => ({ signupFields: s.signupFields.filter((f) => f.id !== id), hasUnsavedChanges: true })),
      updateSignupField: (id, updates) =>
        set((s) => ({
          signupFields: s.signupFields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
          hasUnsavedChanges: true,
        })),
      reorderSignupFields: (fields) => set({ signupFields: fields, hasUnsavedChanges: true }),

      sso: { enabled: false, isLocked: true, domains: [] },
      toggleSSO: () => set((s) => ({ sso: { ...s.sso, enabled: s.sso.isLocked ? false : !s.sso.enabled }, hasUnsavedChanges: true })),
      addSSODomain: (domain) =>
        set((s) => ({
          sso: { ...s.sso, domains: s.sso.isLocked ? s.sso.domains : [...s.sso.domains, { id: `d-${Date.now()}`, domain }] },
          hasUnsavedChanges: true,
        })),
      removeSSODomain: (id) =>
        set((s) => ({
          sso: { ...s.sso, domains: s.sso.isLocked ? s.sso.domains : s.sso.domains.filter((d) => d.id !== id) },
          hasUnsavedChanges: true,
        })),

      twoFactor: { enabled: false },
      updateTwoFactor: (updates) => set((s) => ({ twoFactor: { ...s.twoFactor, ...updates }, hasUnsavedChanges: true })),

      locationAuth: false,
      setLocationAuth: (val) => set({ locationAuth: val, hasUnsavedChanges: true }),

      // Redirect URLs
      redirectURLs: { ...DEFAULT_REDIRECT_URLS },
      updateRedirectURL: (key, value) =>
        set((s) => ({ redirectURLs: { ...s.redirectURLs, [key]: value }, hasUnsavedChanges: true })),

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
          separateConfig: false,
          theme: 'light',
          uiConfig: { ...DEFAULT_UI_CONFIG },
          authMethods: DEFAULT_AUTH_METHODS.map((m) => ({ ...m })),
          signinAuthMethods: DEFAULT_AUTH_METHODS.map((m) => ({ ...m })),
          signupAuthMethods: DEFAULT_AUTH_METHODS.map((m) => ({ ...m })),
          signinUIConfig: { ...DEFAULT_UI_CONFIG },
          signupUIConfig: { ...DEFAULT_UI_CONFIG },
          forgotPasswordEnabled: true,
          signupFields: DEFAULT_SIGNUP_FIELDS.map((f) => ({ ...f })),
          sso: { enabled: false, isLocked: true, domains: [] },
          twoFactor: { enabled: false },
          locationAuth: false,
          redirectURLs: { ...DEFAULT_REDIRECT_URLS },
          hasUnsavedChanges: true,

          adminUsers: [],
          adminRoles: DEFAULT_ROLES.map((r) => ({ ...r })),
        }),

      getExportConfig: () => {
        const {
          projectName, uiConfig, authMethods,
          signinUIConfig, signupUIConfig,
          signinAuthMethods, signupAuthMethods,
          separateConfig,
          forgotPasswordEnabled, signupFields, sso, redirectURLs, twoFactor, locationAuth
        } = get();

        const exportSigninMethods = (separateConfig ? signinAuthMethods : authMethods).map(({ id, name, enabled }) => ({ id, name, enabled }));
        const exportSignupMethods = (separateConfig ? signupAuthMethods : authMethods).map(({ id, name, enabled }) => ({ id, name, enabled }));
        const exportSigninUI = separateConfig ? signinUIConfig : uiConfig;
        const exportSignupUI = separateConfig ? signupUIConfig : uiConfig;

        return {
          project_name: projectName,
          ui: exportSigninUI,
          auth_methods: exportSigninMethods,
          separate_config: separateConfig,
          signin: {
            auth_methods: exportSigninMethods,
            ui: exportSigninUI,
          },
          signup: {
            auth_methods: exportSignupMethods,
            ui: exportSignupUI,
          },
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

