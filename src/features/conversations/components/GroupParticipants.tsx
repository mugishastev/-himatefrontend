import React from 'react';
import type { Participant } from '../../../types/conversation.types';
import { UserAvatar } from '../../users/components/UserAvatar';

interface GroupParticipantsProps {
    participants: Participant[];
}

export const GroupParticipants: React.FC<GroupParticipantsProps> = ({ participants }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                Participants ({participants.length})
            </h3>
            <div className="space-y-2">
                {participants.map((participant) => (
                    <div key={participant.user.id} className="flex items-center p-2 hover:bg-bg-secondary rounded-xl transition-colors">
                        <UserAvatar user={participant.user} size="sm" />
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-text-primary">
                                {participant.user.username}
                                {participant.isAdmin && (
                                    <span className="ml-2 text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded-full font-bold">
                                        ADMIN
                                    </span>
                                )}
                            </p>
                            <p className="text-xs text-text-secondary truncate">
                                {participant.user.email}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
