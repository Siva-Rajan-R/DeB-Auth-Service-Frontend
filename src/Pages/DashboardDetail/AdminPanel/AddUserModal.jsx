import { useState, useEffect } from 'react';
import { useAuthConfigStore } from '../../../Store/useAuthConfigStore';
import { CreateRoleModal } from './CreateRoleModal';
import { X, Plus, Trash2, Eye, EyeOff, ChevronRight } from 'lucide-react';
import Select from 'react-select';

// ─── react-select dark styles ─────────────────────────────────────────────────
const selectStyles = {
  control: (b, s) => ({
    ...b, backgroundColor: 'var(--bg-deep)', borderColor: s.isFocused ? '#a855f7' : 'var(--border-glass)',
    borderRadius: '0.75rem', minHeight: '38px', boxShadow: 'none',
    '&:hover': { borderColor: '#a855f7' },
  }),
  menu: (b) => ({ ...b, backgroundColor: 'var(--bg-surface)', borderRadius: '0.75rem', border: '1px solid var(--border-glass)', zIndex: 60 }),
  option: (b, s) => ({
    ...b, backgroundColor: s.isSelected ? '#7c3aed' : s.isFocused ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
    color: s.isSelected ? '#ffffff' : 'var(--text-main)',
    fontSize: '0.8125rem', cursor: 'pointer',
  }),
  singleValue: (b) => ({ ...b, color: 'var(--text-main)', fontSize: '0.8125rem' }),
  input: (b) => ({ ...b, color: 'var(--text-main)' }),
  placeholder: (b) => ({ ...b, color: 'var(--text-dim)', fontSize: '0.8125rem' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (b) => ({ ...b, color: 'var(--text-dim)', padding: '0 8px' }),
};

// ─── Step indicator ───────────────────────────────────────────────────────────
const StepIndicator = ({ current, labels }) => (
  <div className='flex items-center justify-center gap-0 px-6 py-4 border-b border-[var(--border-glass)]'>
    {labels.map((label, i) => {
      const stepNum = i + 1;
      const isDone   = stepNum < current;
      const isActive = stepNum === current;
      return (
        <div key={i} className='flex items-center'>
          <div className='flex flex-col items-center'>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              isDone   ? 'bg-emerald-500 text-white' :
              isActive ? 'bg-purple-600 text-white ring-4 ring-purple-600/20 shadow-lg shadow-purple-600/20' :
                         'bg-[var(--bg-surface)] text-[var(--text-dim)] border border-[var(--border-glass)]'
            }`}>
              {isDone ? '✓' : stepNum}
            </div>
            <span className={`text-[10px] mt-1.5 whitespace-nowrap transition-colors uppercase font-bold tracking-widest ${
              isActive ? 'text-purple-400' : isDone ? 'text-emerald-400' : 'text-[var(--text-dim)]'
            }`}>{label}</span>
          </div>
          {i < labels.length - 1 && (
            <div className={`w-12 h-0.5 mx-2 mb-5 transition-colors ${isDone ? 'bg-emerald-500/50' : 'bg-[var(--border-glass)]'}`} />
          )}
        </div>
      );
    })}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
export const AddUserModal = ({ editingUser, onClose }) => {
  const { addAdminUser, updateAdminUser, adminRoles } = useAuthConfigStore();

  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [pendingRoleRowIdx, setPendingRoleRowIdx] = useState(null);
  const [errors, setErrors] = useState({});
  const [productError, setProductError] = useState('');

  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    status: 'active', lastLogin: '',
    products: [],
  });

  // Pre-fill when editing
  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || '',
        email: editingUser.email || '',
        password: editingUser.password || '',
        status: editingUser.status || 'active',
        lastLogin: editingUser.lastLogin || '',
        products: editingUser.products ? [...editingUser.products.map(p => ({ ...p }))] : [],
      });
    }
  }, [editingUser]);

  // Build role options for react-select
  const getRoleOptions = () => [
    ...adminRoles.map((r) => ({ value: r.id, label: r.name })),
    { value: '__create__', label: '+ Create New Role', isSpecial: true },
  ];

  const handleRoleChange = (opt, rowIdx) => {
    if (opt.value === '__create__') {
      setPendingRoleRowIdx(rowIdx);
      setShowCreateRole(true);
      return;
    }
    updateProductRow(rowIdx, 'roleId', opt.value);
  };

  const handleRoleCreated = (roleName) => {
    // Find newly added role (last non-default matching name)
    setShowCreateRole(false);
    // After store update we need the id — we'll get it on next render via adminRoles
    // Schedule a micro-task to pick it up
    setTimeout(() => {
      const { adminRoles: roles } = useAuthConfigStore.getState();
      const newRole = roles.find((r) => r.name === roleName && !r.isDefault);
      if (newRole && pendingRoleRowIdx !== null) {
        updateProductRow(pendingRoleRowIdx, 'roleId', newRole.id);
      }
      setPendingRoleRowIdx(null);
    }, 0);
  };

  const updateProductRow = (idx, key, val) =>
    setFormData((f) => ({
      ...f,
      products: f.products.map((p, i) => (i === idx ? { ...p, [key]: val } : p)),
    }));

  const addProductRow = () =>
    setFormData((f) => ({ ...f, products: [...f.products, { url: '', roleId: '' }] }));

  const removeProductRow = (idx) =>
    setFormData((f) => ({ ...f, products: f.products.filter((_, i) => i !== idx) }));

  // ── Validation ──────────────────────────────────────────────────────────────
  const validateStep1 = () => {
    const e = {};
    if (!formData.name.trim())                                   e.name = 'Name is required';
    if (!formData.email.trim())                                  e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email';
    if (!editingUser && !formData.password.trim())               e.password = 'Password is required';
    else if (!editingUser && formData.password.length < 6)       e.password = 'At least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const invalid = formData.products.some((p) => !p.url.trim() || !p.roleId);
    if (invalid) { setProductError('All product rows must have a URL and role.'); return false; }
    setProductError('');
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => s + 1);
  };

  const handleSubmit = () => {
    if (editingUser) {
      updateAdminUser(editingUser.id, formData);
    } else {
      addAdminUser(formData);
    }
    onClose();
  };

  const inputClass = (field) =>
    `w-full bg-[var(--bg-deep)] border rounded-xl px-4 py-2.5 text-[var(--text-main)] text-sm focus:outline-none transition-colors placeholder-[var(--text-dim)] font-medium ${
      errors[field] ? 'border-red-500 focus:border-red-400' : 'border-[var(--border-glass)] focus:border-purple-500/50'
    }`;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300'>
      <div className='bg-[var(--bg-navbar)] border border-[var(--border-glass)] rounded-[2rem] w-[560px] max-h-[88vh] flex flex-col shadow-[var(--glass-shadow)] overflow-hidden'>

        {/* Header */}
        <div className='flex items-center justify-between px-6 py-5 border-b border-[var(--border-glass)] flex-none'>
          <h2 className='text-[var(--text-main)] font-bold text-lg'>
            {editingUser ? 'Edit User' : 'Add New User'}
          </h2>
          <button onClick={onClose} className='text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors p-1'>
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className='flex-none'>
          <StepIndicator current={step} labels={['Basic Info', 'Product Access', 'Review']} />
        </div>

        {/* Step Content */}
        <div className='flex-1 overflow-y-auto p-6' style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}>

          {/* ── Step 1: Basic Info ── */}
          {step === 1 && (
            <div className='space-y-5'>
              <div className='space-y-2'>
                <label className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest block'>Full Name <span className='text-red-400'>*</span></label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                  placeholder='John Doe'
                  className={inputClass('name')}
                />
                {errors.name && <p className='text-red-400 text-xs font-medium'>{errors.name}</p>}
              </div>

              <div className='space-y-2'>
                <label className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest block'>Email Address <span className='text-red-400'>*</span></label>
                <input
                  type='email'
                  value={formData.email}
                  onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                  placeholder='john@example.com'
                  className={inputClass('email')}
                />
                {errors.email && <p className='text-red-400 text-xs font-medium'>{errors.email}</p>}
              </div>

              <div className='space-y-2'>
                <label className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest block'>
                  Password {editingUser && <span className='text-[var(--text-dim)] opacity-70'>(leave blank to keep current)</span>}
                  {!editingUser && <span className='text-red-400'> *</span>}
                </label>
                <div className='relative'>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData((f) => ({ ...f, password: e.target.value }))}
                    placeholder='••••••••'
                    className={inputClass('password')}
                  />
                  <button onClick={() => setShowPass((v) => !v)} className='absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)] hover:text-[var(--text-muted)] transition-colors p-1'>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className='text-red-400 text-xs font-medium'>{errors.password}</p>}
              </div>

              <div className='space-y-2'>
                <label className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest block'>Account Status</label>
                <div className='flex gap-3 p-1 bg-[var(--bg-deep)] border border-[var(--border-glass)] rounded-2xl'>
                  {['active', 'inactive'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFormData((f) => ({ ...f, status: s }))}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all capitalize ${
                        formData.status === s
                          ? s === 'active'
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-lg shadow-emerald-500/5'
                            : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-glass)]'
                          : 'text-[var(--text-dim)] hover:text-[var(--text-muted)] border border-transparent'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Product Access ── */}
          {step === 2 && (
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-[var(--text-main)] text-sm font-bold'>Product Access</p>
                  <p className='text-[var(--text-muted)] text-[11px] font-medium mt-1'>Assign this user to one or more products with a specific role.</p>
                </div>
                <button
                  onClick={addProductRow}
                  className='flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-purple-600/20 active:scale-95'
                >
                  <Plus size={14} /> Add Product
                </button>
              </div>

              {productError && <p className='text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 font-medium'>{productError}</p>}

              {formData.products.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-12 border-2 border-dashed border-[var(--border-glass)] rounded-[2rem] text-center bg-[var(--bg-deep)]/20'>
                  <p className='text-[var(--text-dim)] text-sm mb-3 font-medium'>No products added yet</p>
                  <button onClick={addProductRow} className='text-purple-400 text-xs font-bold hover:text-purple-300 transition-colors'>+ Add first product</button>
                </div>
              ) : (
                <div className='space-y-4'>
                  {formData.products.map((product, idx) => (
                    <div key={idx} className='bg-[var(--bg-surface)]/50 border border-[var(--border-glass)] rounded-2xl p-4 space-y-3 shadow-sm'>
                      <div className='flex items-center justify-between'>
                        <span className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest'>Product Entry #{idx + 1}</span>
                        <button onClick={() => removeProductRow(idx)} className='text-[var(--text-dim)] hover:text-red-400 transition-colors p-1'>
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <input
                        type='url'
                        value={product.url}
                        onChange={(e) => updateProductRow(idx, 'url', e.target.value)}
                        placeholder='https://your-product.com'
                        className={`w-full bg-[var(--bg-deep)] border rounded-xl px-4 py-2.5 text-[var(--text-main)] text-sm focus:outline-none transition-colors placeholder-[var(--text-dim)] font-medium ${
                          !product.url.trim() && productError ? 'border-red-500' : 'border-[var(--border-glass)] focus:border-purple-500/50'
                        }`}
                      />
                      <div className={!product.roleId && productError ? 'ring-2 ring-red-500/30 rounded-xl' : ''}>
                        <Select
                          options={getRoleOptions()}
                          value={adminRoles.find((r) => r.id === product.roleId) ? { value: product.roleId, label: adminRoles.find((r) => r.id === product.roleId)?.name } : null}
                          onChange={(opt) => handleRoleChange(opt, idx)}
                          styles={selectStyles}
                          placeholder='Assign a role...'
                          isSearchable={false}
                          menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                          menuPosition='fixed'
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Review ── */}
          {step === 3 && (
            <div className='space-y-6'>
              <p className='text-[var(--text-muted)] text-sm font-medium'>Review the details before {editingUser ? 'updating' : 'creating'} the user.</p>

              {/* Basic info */}
              <div className='bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-2xl p-5 space-y-4 shadow-sm'>
                <h4 className='text-indigo-400 text-[10px] font-bold uppercase tracking-widest'>Basic Profile</h4>
                <div className='grid grid-cols-2 gap-4'>
                  <ReviewRow label='Name'   value={formData.name} />
                  <ReviewRow label='Email'  value={formData.email} />
                  <ReviewRow label='Status' value={formData.status} capitalize />
                  <ReviewRow label='Password' value={formData.password ? '••••••••' : '(unchanged)'} />
                </div>
              </div>

              {/* Products */}
              <div className='bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-2xl p-5 space-y-4 shadow-sm'>
                <h4 className='text-purple-400 text-[10px] font-bold uppercase tracking-widest'>Product Access ({formData.products.length})</h4>
                {formData.products.length === 0 ? (
                  <p className='text-[var(--text-dim)] text-xs italic font-medium'>No products assigned.</p>
                ) : (
                  <div className='space-y-3'>
                    {formData.products.map((p, i) => {
                      const roleName = adminRoles.find((r) => r.id === p.roleId)?.name || p.roleId;
                      return (
                        <div key={i} className='flex items-center justify-between text-sm bg-[var(--bg-deep)]/40 p-2.5 rounded-xl border border-[var(--border-glass)]'>
                          <span className='text-[var(--text-muted)] truncate max-w-[280px] font-medium' title={p.url}>{p.url || '—'}</span>
                          <span className='text-purple-400 font-bold text-[10px] uppercase tracking-widest bg-purple-500/10 px-2 py-1 rounded-lg'>{roleName}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between px-6 py-5 border-t border-[var(--border-glass)] bg-[var(--bg-navbar)] flex-none'>
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className='border border-[var(--border-glass)] hover:border-[var(--border-active)] text-[var(--text-muted)] hover:text-[var(--text-main)] px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest bg-[var(--bg-surface)]'
              >
                Back
              </button>
            )}
          </div>
          <div className='flex items-center gap-3'>
            <button
              onClick={onClose}
              className='text-[var(--text-dim)] hover:text-[var(--text-main)] text-xs font-bold uppercase tracking-widest px-4 py-2 transition-colors'
            >
              Cancel
            </button>
            {step < 3 ? (
              <button
                onClick={handleNext}
                className='flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-purple-600/20 active:scale-95'
              >
                Next Step <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className='bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 active:scale-95'
              >
                {editingUser ? 'Save Changes' : 'Confirm & Create'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Create Role sub-modal */}
      {showCreateRole && (
        <CreateRoleModal
          onCreated={handleRoleCreated}
          onClose={() => { setShowCreateRole(false); setPendingRoleRowIdx(null); }}
        />
      )}
    </div>
  );
};

const ReviewRow = ({ label, value, capitalize }) => (
  <div className='space-y-1'>
    <span className='text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest block'>{label}</span>
    <p className={`text-[var(--text-main)] text-sm font-bold truncate ${capitalize ? 'capitalize' : ''}`}>{value || '—'}</p>
  </div>
);
