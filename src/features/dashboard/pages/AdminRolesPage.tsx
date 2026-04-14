import React, { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../../api/admin.api';

const PERMISSION_LABELS: Record<string, string> = {
    MANAGE_USERS: 'Manage Users',
    DELETE_ANY_MESSAGE: 'Delete Content',
    VIEW_ALL_CONVERSATIONS: 'View Conversations',
};

export const AdminRolesPage: React.FC = () => {
    const [roles, setRoles] = useState<any[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editPerms, setEditPerms] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

    const allActions = useMemo(() => {
        const actions = new Set<string>();
        roles.forEach((r) => (r.permissions || []).forEach((p: any) => actions.add(p.action)));
        if (actions.size === 0) {
            ['MANAGE_USERS', 'DELETE_ANY_MESSAGE', 'VIEW_ALL_CONVERSATIONS'].forEach((a) => actions.add(a));
        }
        return Array.from(actions);
    }, [roles]);

    const loadRoles = () => {
        setLoading(true);
        adminApi.getRoles(1, 100).then((res) => {
            const list = res.data ?? [];
            setRoles(list);
            setSelectedRoleId((prev) => prev ?? list[0]?.id ?? null);
            setLoading(false);
        }).catch(() => setLoading(false));
    };

    useEffect(() => { loadRoles(); }, []);

    const handleEditClick = () => {
        setEditPerms((selectedRole?.permissions ?? []).map((p: any) => p.action));
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!selectedRole) return;
        setSaving(true);
        const currentActions = (selectedRole.permissions ?? []).map((p: any) => p.action);
        const toAdd = editPerms.filter((a) => !currentActions.includes(a));
        const toRemove = (selectedRole.permissions ?? []).filter((p: any) => !editPerms.includes(p.action));

        try {
            await Promise.all([
                ...toAdd.map((action) => adminApi.createPermission(selectedRole.id, action)),
                ...toRemove.map((perm: any) => adminApi.deletePermission(perm.id)),
            ]);
            setIsEditing(false);
            loadRoles();
        } finally {
            setSaving(false);
        }
    };

    const togglePerm = (perm: string) => {
        setEditPerms(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]);
    };

    return (
        <div className="p-4 sm:p-8">
            <h1 className="text-2xl font-bold text-white mb-2">Admin Roles</h1>
            <p className="text-slate-400 text-sm mb-8">Define who can do what in the admin panel. Assign roles to staff members.</p>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Role List */}
                <div className="w-full md:w-72 flex-shrink-0 space-y-3">
                    {loading ? (
                        <div className="text-sm text-slate-500">Loading roles...</div>
                    ) : roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => { setSelectedRoleId(role.id); setIsEditing(false); }}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${selectedRole?.id === role.id ? 'bg-brand/10 border-brand/30' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="font-semibold text-slate-200">{role.name}</span>
                                <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{(role.permissions ?? []).length} perms</span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2">Permissions: {(role.permissions ?? []).length}</p>
                        </button>
                    ))}

                    <div className="pt-2">
                        <button
                            onClick={async () => {
                                const name = prompt('Role name');
                                if (!name?.trim()) return;
                                await adminApi.createRole(name.trim());
                                loadRoles();
                            }}
                            className="w-full py-3 border border-dashed border-slate-700 rounded-xl text-slate-500 hover:border-brand hover:text-brand transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Create New Role
                        </button>
                    </div>
                </div>

                {/* Role Detail */}
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white">{selectedRole?.name || 'Select a role'}</h2>
                            <p className="text-sm text-slate-400 mt-1">Manage permissions for admin roles</p>
                        </div>
                        {!isEditing && selectedRole && (
                            <button onClick={handleEditClick} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors">
                                Edit Permissions
                            </button>
                        )}
                    </div>

                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Permissions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {allActions.map((perm) => {
                            const active = isEditing ? editPerms.includes(perm) : (selectedRole?.permissions ?? []).some((p: any) => p.action === perm);
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
                                    <span className={`text-sm font-medium ${active ? 'text-slate-200' : 'text-slate-500'}`}>{PERMISSION_LABELS[perm] || perm}</span>
                                </label>
                            );
                        })}
                    </div>

                    {isEditing && (
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setIsEditing(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 transition-colors">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-brand text-white hover:bg-brand/90 transition-colors disabled:opacity-60">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
