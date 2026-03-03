import React, { useEffect, useState } from 'react';
import { statusesApi } from '../../../api/statuses.api';
import type { StatusPost } from '../../../types/status.types';
import { formatRelativeTime } from '../../../utils/date';
import { useAuthStore } from '../../../store/auth.store';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

interface StatusFeedProps {
    refreshKey: number;
}

export const StatusFeed: React.FC<StatusFeedProps> = ({ refreshKey }) => {
    const { user } = useAuthStore();
    const [items, setItems] = useState<StatusPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<StatusPost | null>(null);
    const [editingStatusId, setEditingStatusId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const loadStatuses = async () => {
        setIsLoading(true);
        try {
            const response = await statusesApi.getStatuses();
            setItems(response.data || []);
        } catch (error) {
            console.error('Failed to fetch statuses', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadStatuses();
    }, [refreshKey]);

    const startEdit = (item: StatusPost) => {
        setEditingStatusId(item.id);
        setEditContent(item.content);
    };

    const saveEdit = async (id: number) => {
        setIsUpdating(true);
        try {
            await statusesApi.updateStatus(id, { content: editContent.trim() });
            setEditingStatusId(null);
            setEditContent('');
            await loadStatuses();
        } catch (error) {
            console.error('Failed to update status', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const deleteStatus = async (id: number) => {
        setIsDeleting(id);
        try {
            await statusesApi.deleteStatus(id);
            await loadStatuses();
        } catch (error) {
            console.error('Failed to delete status', error);
        } finally {
            setIsDeleting(null);
        }
    };

    if (isLoading) return <div className="p-6 text-text-secondary">Loading updates...</div>;
    if (items.length === 0) return <div className="p-6 text-text-secondary">No updates yet.</div>;

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <article key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                    <header className="flex items-center justify-between mb-3">
                        <div>
                            <p className="font-bold text-text-primary">{item.user?.username || `User #${item.userId}`}</p>
                            <p className="text-xs text-text-secondary">{formatRelativeTime(item.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setSelectedStatus(item)}>View</Button>
                            {Number(item.userId) === Number(user?.id) && (
                                <>
                                    <Button size="sm" variant="ghost" onClick={() => startEdit(item)}>Update</Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-600"
                                        isLoading={isDeleting === item.id}
                                        onClick={() => deleteStatus(item.id)}
                                    >
                                        Delete
                                    </Button>
                                </>
                            )}
                        </div>
                    </header>
                    {editingStatusId === item.id ? (
                        <div className="space-y-2">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={3}
                                className="w-full p-2 rounded-lg bg-bg-secondary border border-gray-200 outline-none"
                            />
                            <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline" onClick={() => setEditingStatusId(null)}>Cancel</Button>
                                <Button size="sm" isLoading={isUpdating} onClick={() => saveEdit(item.id)} disabled={!editContent.trim()}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">{item.content}</p>
                    )}
                    {item.mediaUrl && (
                        <a
                            href={item.mediaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-block text-sm text-brand font-semibold hover:underline"
                        >
                            View media
                        </a>
                    )}
                </article>
            ))}
            <Modal
                isOpen={!!selectedStatus}
                onClose={() => setSelectedStatus(null)}
                title="Status Details"
            >
                {selectedStatus && (
                    <div className="space-y-3">
                        <p className="text-sm text-text-secondary">
                            by {selectedStatus.user?.username || `User #${selectedStatus.userId}`} • {formatRelativeTime(selectedStatus.createdAt)}
                        </p>
                        <p className="text-sm text-text-primary whitespace-pre-wrap">{selectedStatus.content}</p>
                        {selectedStatus.mediaUrl && (
                            <a href={selectedStatus.mediaUrl} target="_blank" rel="noreferrer" className="text-sm text-brand font-semibold hover:underline">
                                Open media
                            </a>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};
