import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
    favoriteConversationIds: Record<string, true>;
    isFavoriteConversation: (conversationId: string | number) => boolean;
    toggleFavoriteConversation: (conversationId: string | number) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favoriteConversationIds: {},
            isFavoriteConversation: (conversationId) => {
                const key = String(conversationId);
                return !!get().favoriteConversationIds[key];
            },
            toggleFavoriteConversation: (conversationId) => {
                const key = String(conversationId);
                set((state) => {
                    const next = { ...state.favoriteConversationIds };
                    if (next[key]) delete next[key];
                    else next[key] = true;
                    return { favoriteConversationIds: next };
                });
            },
        }),
        { name: 'himate-favorites' }
    )
);

