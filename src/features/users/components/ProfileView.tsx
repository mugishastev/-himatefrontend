import React, { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../../../store/auth.store';
import { UserAvatar } from './UserAvatar';
import { usersApi } from '../../../api/users.api';
import { useUIStore } from '../../../store/ui.store';

// ── Section wrapper ──────────────────────────────────────────────────────────
const Section: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="bg-[#1F2937] rounded-2xl overflow-hidden border border-white/5">
    <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="text-xs text-[#9CA3AF] mt-0.5">{subtitle}</p>
    </div>
    <div className="p-6 space-y-5">{children}</div>
  </div>
);

// ── Editable row ─────────────────────────────────────────────────────────────
const EditRow: React.FC<{
  label: string; value: string; placeholder?: string;
  onSave: (v: string) => Promise<void>; multiline?: boolean; type?: string;
}> = ({ label, value, placeholder = '—', onSave, multiline = false, type = 'text' }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setVal(value); }, [value]);

  const save = async () => {
    setSaving(true);
    try { await onSave(val); setEditing(false); }
    catch { setVal(value); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <label className="text-xs font-semibold text-[#F97316] uppercase tracking-wider block mb-2">{label}</label>
      <div className={`flex items-start gap-3 bg-[#111827] rounded-xl px-4 py-3 border ${editing ? 'border-[#F97316]/40' : 'border-white/5'} transition-colors`}>
        {editing ? (
          <>
            {multiline ? (
              <textarea
                autoFocus rows={3}
                className="flex-1 bg-transparent text-white text-sm outline-none resize-none placeholder:text-[#6B7280]"
                value={val} placeholder={placeholder}
                onChange={e => setVal(e.target.value)}
              />
            ) : (
              <input
                autoFocus type={type}
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-[#6B7280]"
                value={val} placeholder={placeholder}
                onChange={e => setVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && save()}
              />
            )}
            <div className="flex gap-2 pt-0.5 shrink-0">
              <button onClick={save} disabled={saving}
                className="px-3 py-1 rounded-lg bg-[#F97316] text-white text-xs font-semibold hover:bg-[#EA6C0A] disabled:opacity-50 transition-colors">
                {saving ? '...' : 'Save'}
              </button>
              <button onClick={() => { setEditing(false); setVal(value); }}
                className="px-3 py-1 rounded-lg bg-white/10 text-[#9CA3AF] text-xs font-semibold hover:bg-white/15 transition-colors">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="flex-1 text-sm text-white break-all">{val || <span className="text-[#6B7280]">{placeholder}</span>}</span>
            <button onClick={() => setEditing(true)}
              className="shrink-0 p-1.5 rounded-lg text-[#6B7280] hover:text-[#F97316] hover:bg-[#F97316]/10 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ── Toggle row ────────────────────────────────────────────────────────────────
const ToggleRow: React.FC<{ label: string; description: string; value: boolean; onChange: (v: boolean) => void }> = ({ label, description, value, onChange }) => (
  <div className="flex items-center justify-between py-1">
    <div>
      <p className="text-sm font-medium text-white">{label}</p>
      <p className="text-xs text-[#9CA3AF] mt-0.5">{description}</p>
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${value ? 'bg-[#F97316]' : 'bg-white/10'}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

// ── Status selector ──────────────────────────────────────────────────────────
const STATUSES = [
  { value: 'ONLINE', label: '🟢 Online', color: 'text-emerald-400' },
  { value: 'AWAY', label: '🟡 Away', color: 'text-amber-400' },
  { value: 'DND', label: '🔴 Do Not Disturb', color: 'text-red-400' },
  { value: 'INVISIBLE', label: '⚫ Invisible', color: 'text-[#9CA3AF]' },
];

// ── Main component ────────────────────────────────────────────────────────────
export const ProfileView: React.FC = () => {
  const { user, updateUser, logout } = useAuthStore();
  const { setView } = useUIStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password change state
  const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  // Privacy toggles (stored locally — backend extension point)
  const [privacy, setPrivacy] = useState({
    showLastSeen: true,
    showProfilePhoto: true,
    readReceipts: true,
  });

  // Notification prefs
  const [notifs, setNotifs] = useState({
    messageNotifs: true,
    soundEnabled: true,
    desktopNotifs: true,
  });

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState('');
  // Full-screen photo viewer
  const [viewingPhoto, setViewingPhoto] = useState(false);
  const [removingPhoto, setRemovingPhoto] = useState(false);

  if (!user) return null;

  const saveField = (field: string) => async (value: string) => {
    const updated = await usersApi.update(Number(user.id), { [field]: value });
    updateUser({ [field]: updated[field] });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    const result = await usersApi.uploadProfileImage(Number(user.id), file);
    updateUser({ profileImage: result.profileImage, avatarUrl: result.profileImage });
    // reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleRemovePhoto = async () => {
    if (!user?.id || removingPhoto) return;
    setRemovingPhoto(true);
    try {
      await usersApi.update(Number(user.id), { profileImage: null, avatarUrl: null });
      updateUser({ profileImage: undefined, avatarUrl: undefined });
    } catch (err) {
      console.error('Failed to remove photo', err);
    } finally {
      setRemovingPhoto(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    await usersApi.update(Number(user.id), { status });
    updateUser({ status });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.new !== pwForm.confirm) { setPwError('New passwords do not match'); return; }
    if (pwForm.new.length < 8) { setPwError('Password must be at least 8 characters'); return; }
    setPwSaving(true);
    try {
      await usersApi.changePassword(Number(user.id), pwForm.current, pwForm.new);
      setPwSuccess(true);
      setPwForm({ current: '', new: '', confirm: '' });
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err: any) {
      setPwError(err?.response?.data?.message || 'Incorrect current password');
    } finally { setPwSaving(false); }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user.username) return;
    await usersApi.deleteAccount(Number(user.id));
    logout();
  };

  const joinedDate = (user as any).createdAt
    ? new Date((user as any).createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Not available';

  return (
    <div className="flex flex-col h-full bg-[#111827] animate-in fade-in duration-300">

      {/* Header */}
      <header className="h-[80px] bg-[#1F2937] border-b border-white/5 flex items-center px-6 shrink-0 gap-4">
        <button onClick={() => setView('CHATS')}
          className="p-2 rounded-xl hover:bg-white/10 text-[#9CA3AF] hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">Profile Settings</h1>
          <p className="text-xs text-[#9CA3AF]">Manage your identity, security & preferences</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto py-6 px-4 md:px-6 space-y-5 no-scrollbar">
        <div className="max-w-2xl mx-auto space-y-5">

          {/* ── Full-screen photo viewer ── */}
          {viewingPhoto && (user.avatarUrl || user.profileImage) && (
            <div
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center"
              onClick={() => setViewingPhoto(false)}
            >
              <div className="relative max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
                <img
                  src={user.avatarUrl || user.profileImage}
                  alt="Profile"
                  className="w-full rounded-2xl shadow-2xl object-contain max-h-[80vh]"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => { setViewingPhoto(false); fileInputRef.current?.click(); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F97316] text-white text-xs font-bold shadow-lg hover:bg-[#EA6C0A] transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Change
                  </button>
                  <button
                    onClick={() => { setViewingPhoto(false); handleRemovePhoto(); }}
                    disabled={removingPhoto}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/80 text-white text-xs font-bold shadow-lg hover:bg-red-500 transition-colors disabled:opacity-50"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Remove
                  </button>
                  <button
                    onClick={() => setViewingPhoto(false)}
                    className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Avatar hero ── */}
          <div className="bg-[#1F2937] rounded-2xl border border-white/5 p-6 flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar with click-to-view */}
            <div className="relative shrink-0">
              <button
                onClick={() => setViewingPhoto(true)}
                className="relative group w-28 h-28 rounded-2xl overflow-hidden ring-2 ring-[#F97316]/30 hover:ring-[#F97316] transition-all"
                title="View full photo"
              >
                <UserAvatar user={user} size="full" className="w-full h-full" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase">View</span>
                </div>
              </button>
              {/* Quick action buttons below avatar */}
              <div className="flex gap-1.5 mt-2 justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-[#F97316]/10 hover:bg-[#F97316]/20 text-[#F97316] text-[10px] font-bold transition-colors"
                  title="Upload new photo"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  Upload
                </button>
                {(user.avatarUrl || user.profileImage) && (
                  <button
                    onClick={handleRemovePhoto}
                    disabled={removingPhoto}
                    className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold transition-colors disabled:opacity-40"
                    title="Remove photo"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    {removingPhoto ? '...' : 'Remove'}
                  </button>
                )}
              </div>
            </div>
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">{user.username ?? user.email}</h2>
              <p className="text-[#9CA3AF] text-sm mt-1">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                {STATUSES.map(s => (
                  <button key={s.value} onClick={() => handleStatusChange(s.value)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${user.status === s.value ? 'border-[#F97316] bg-[#F97316]/15 text-white' : 'border-white/10 bg-white/5 text-[#9CA3AF] hover:border-white/30'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#6B7280] mt-3">Member since {joinedDate}</p>
            </div>
          </div>

          {/* ── 1. Identity ── */}
          <Section title="Identity" subtitle="Your visible name, bio and contact info">
            <EditRow label="Display Name" value={user.username || ''} placeholder="Your name" onSave={saveField('username')} />
            <EditRow label="Bio / About" value={(user as any).bio || ''} placeholder="Hey there! I'm using Himate." onSave={saveField('bio')} multiline />
            <EditRow label="Phone Number" value={(user as any).phoneNumber || ''} placeholder="+1 555 000 0000" onSave={saveField('phoneNumber')} type="tel" />
            <div>
              <label className="text-xs font-semibold text-[#F97316] uppercase tracking-wider block mb-2">Email Address</label>
              <div className="flex items-center gap-3 bg-[#111827] rounded-xl px-4 py-3 border border-white/5">
                <span className="text-sm text-[#9CA3AF] flex-1">{user.email}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Verified</span>
              </div>
            </div>
          </Section>

          {/* ── 2. Account Security ── */}
          <Section title="Account Security" subtitle="Change your password to keep your account safe">
            <form onSubmit={handleChangePassword} className="space-y-3">
              {[
                { key: 'current', label: 'Current Password', placeholder: 'Enter current password' },
                { key: 'new', label: 'New Password', placeholder: 'Min 8 characters' },
                { key: 'confirm', label: 'Confirm New Password', placeholder: 'Repeat new password' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-[#F97316] uppercase tracking-wider block mb-1.5">{f.label}</label>
                  <input
                    type="password" placeholder={f.placeholder}
                    value={(pwForm as any)[f.key]}
                    onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-[#111827] border border-white/5 focus:border-[#F97316]/40 rounded-xl px-4 py-3 text-sm text-white outline-none placeholder:text-[#6B7280] transition-colors"
                  />
                </div>
              ))}
              {pwError && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{pwError}</p>}
              {pwSuccess && <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">✓ Password updated successfully</p>}
              <button type="submit" disabled={pwSaving || !pwForm.current || !pwForm.new}
                className="w-full py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA6C0A] text-white font-semibold text-sm disabled:opacity-40 transition-colors">
                {pwSaving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </Section>

          {/* ── 3. Privacy ── */}
          <Section title="Privacy" subtitle="Control who can see your information">
            <ToggleRow label="Show Last Seen" description="Let contacts see when you were last active"
              value={privacy.showLastSeen} onChange={v => setPrivacy(p => ({ ...p, showLastSeen: v }))} />
            <div className="border-t border-white/5" />
            <ToggleRow label="Profile Photo Visibility" description="Allow contacts to see your profile picture"
              value={privacy.showProfilePhoto} onChange={v => setPrivacy(p => ({ ...p, showProfilePhoto: v }))} />
            <div className="border-t border-white/5" />
            <ToggleRow label="Read Receipts" description="Send and receive read receipts on messages"
              value={privacy.readReceipts} onChange={v => setPrivacy(p => ({ ...p, readReceipts: v }))} />
          </Section>

          {/* ── 4. Notifications & Preferences ── */}
          <Section title="Notifications & Preferences" subtitle="Customize your notification and sound settings">
            <ToggleRow label="Message Notifications" description="Show notifications for new messages"
              value={notifs.messageNotifs} onChange={v => setNotifs(p => ({ ...p, messageNotifs: v }))} />
            <div className="border-t border-white/5" />
            <ToggleRow label="Notification Sounds" description="Play a sound when new messages arrive"
              value={notifs.soundEnabled} onChange={v => setNotifs(p => ({ ...p, soundEnabled: v }))} />
            <div className="border-t border-white/5" />
            <ToggleRow label="Desktop Notifications" description="Show browser notifications when Himate is in background"
              value={notifs.desktopNotifs} onChange={v => setNotifs(p => ({ ...p, desktopNotifs: v }))} />
          </Section>

          {/* ── 5. Danger Zone ── */}
          <div className="bg-[#1F2937] rounded-2xl overflow-hidden border border-red-500/20">
            <div className="px-6 py-4 border-b border-red-500/10 bg-red-500/5">
              <h3 className="text-base font-semibold text-red-400">Danger Zone</h3>
              <p className="text-xs text-[#9CA3AF] mt-0.5">Permanent actions — proceed with caution</p>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-[#9CA3AF]">
                Deleting your account is <span className="text-white font-semibold">permanent and irreversible</span>. All your messages, contacts and data will be erased.
              </p>
              <div>
                <label className="text-xs font-semibold text-red-400 uppercase tracking-wider block mb-1.5">
                  Type your username <span className="font-bold text-white">"{user.username}"</span> to confirm
                </label>
                <input
                  type="text" placeholder={user.username}
                  value={deleteConfirm}
                  onChange={e => setDeleteConfirm(e.target.value)}
                  className="w-full bg-[#111827] border border-red-500/20 focus:border-red-500/50 rounded-xl px-4 py-3 text-sm text-white outline-none placeholder:text-[#6B7280] transition-colors mb-3"
                />
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== user.username}
                  className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold text-sm disabled:opacity-30 transition-all">
                  Delete My Account Permanently
                </button>
              </div>
            </div>
          </div>

          <div className="pb-6" />
        </div>
      </div>
    </div>
  );
};
