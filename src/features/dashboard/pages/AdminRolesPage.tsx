import React, { useState } from 'react';

const defaultRoles = [
    {
        id: 1,
        name: 'Super Admin',
        color: 'brand',
        description: 'Full access to all platform features, settings, and data.',
        members: 1,
        permissions: ['Manage Users', 'Ban/Unban Users', 'View Messages', 'Delete Content', 'Manage Roles', 'Access Settings', 'Send Broadcasts', 'View Analytics'],
    },
    {
        id: 2,
        name: 'Moderator',
        color: 'violet-400',
        description: 'Can manage users and remove harmful content but cannot change system settings.',
        members: 0,
        permissions: ['Manage Users', 'Ban/Unban Users', 'View Messages', 'Delete Content'],
    },
    {
        id: 3,
        name: 'Support Staff',
        color: 'sky-400',
        description: 'Handles user complaints and support tickets only. Read-only access to data.',
        members: 0,
        permissions: ['View Messages', 'Manage Support Tickets'],
    },
];

const ALL_PERMISSIONS = [
    'Manage Users', 'Ban/Unban Users', 'View Messages', 'Delete Content',
    'Manage Roles', 'Access Settings', 'Send Broadcasts', 'View Analytics', 'Manage Support Tickets',
];

export const AdminRolesPage: React.FC = () => {
    const [roles, setRoles] = useState(defaultRoles);
    const [selectedRole, setSelectedRole] = useState(defaultRoles[0]);
    const [isEditing, setIsEditing] = useState(false);
    const [editPerms, setEditPerms] = useState<string[]>([]);

    const handleEditClick = () => {
        setEditPerms([...selectedRole.permissions]);
        setIsEditing(true);
    };

    const handleSave = () => {
        setRoles(roles.map(r => r.id === selectedRole.id ? { ...r, permissions: editPerms } : r));
        setSelectedRole({ ...selectedRole, permissions: editPerms });
        setIsEditing(false);
    };

    const togglePerm = (perm: string) => {
        setEditPerms(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]);
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-white mb-2">Admin Roles</h1>
            <p className="text-slate-400 text-sm mb-8">Define who can do what in the admin panel. Assign roles to staff members.</p>

            <div className="flex gap-6">
                {/* Role List */}
                <div className="w-72 flex-shrink-0 space-y-3">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => { setSelectedRole(role); setIsEditing(false); }}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${selectedRole.id === role.id ? 'bg-brand/10 border-brand/30' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="font-semibold text-slate-200">{role.name}</span>
                                <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{role.members} member{role.members !== 1 ? 's' : ''}</span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2">{role.description}</p>
                        </button>
                    ))}

                    <div className="pt-2">
                        <button className="w-full py-3 border border-dashed border-slate-700 rounded-xl text-slate-500 hover:border-brand hover:text-brand transition-colors text-sm font-medium flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Create New Role
                        </button>
                    </div>
                </div>

                {/* Role Detail */}
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white">{selectedRole.name}</h2>
                            <p className="text-sm text-slate-400 mt-1">{selectedRole.description}</p>
                        </div>
                        {!isEditing && selectedRole.id !== 1 && (
                            <button onClick={handleEditClick} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors">
                                Edit Permissions
                            </button>
                        )}
                    </div>

                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Permissions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ALL_PERMISSIONS.map((perm) => {
                            const active = isEditing ? editPerms.includes(perm) : selectedRole.permissions.includes(perm);
                            return (
                                <label
                                    key={perm}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isEditing ? 'cursor-pointer' : 'cursor-default'} ${active ? 'border-brand/30 bg-brand/5' : 'border-slate-800 bg-slate-950/30'}`}
                                >
                                    <span className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${active ? 'bg-brand border-brand' : 'border-slate-700'}`}>
                                        {active && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                    </span>
                                    {isEditing ? (
                                        <input type="checkbox" className="sr-only" checked={active} onChange={() => togglePerm(perm)} />
                                    ) : null}
                                    <span className={`text-sm font-medium ${active ? 'text-slate-200' : 'text-slate-500'}`}>{perm}</span>
                                </label>
                            );
                        })}
                    </div>

                    {isEditing && (
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setIsEditing(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 transition-colors">Cancel</button>
                            <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-brand text-white hover:bg-brand/90 transition-colors">Save Changes</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
