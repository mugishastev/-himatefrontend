import { create } from 'zustand';

export type CallType = 'AUDIO' | 'VIDEO';
export type CallStatus = 'IDLE' | 'OUTGOING' | 'INCOMING' | 'CONNECTED';

interface CallState {
    status: CallStatus;
    type: CallType | null;
    participant: any | null; // The other user's info
    startTime: number | null;
    isIncoming: boolean;
    startCall: (participant: any, type: CallType, isIncoming?: boolean) => void;
    acceptCall: () => void;
    endCall: () => void;
}

export const useCallStore = create<CallState>((set) => ({
    status: 'IDLE',
    type: null,
    participant: null,
    startTime: null,
    isIncoming: false,

    startCall: (participant, type, isIncoming = false) =>
        set({ status: isIncoming ? 'INCOMING' : 'OUTGOING', type, participant, startTime: null, isIncoming }),

    acceptCall: () =>
        set({ status: 'CONNECTED', startTime: Date.now() }),

    endCall: () =>
        set({ status: 'IDLE', type: null, participant: null, startTime: null }),
}));
