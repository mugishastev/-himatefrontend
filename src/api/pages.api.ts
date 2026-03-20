import api from './axios';

export interface Page {
    id: number;
    ownerId: number;
    name: string;
    handle: string;
    bio?: string;
    avatarUrl?: string;
    coverPhotoUrl?: string;
    isVerified: boolean;
    category: string;
    _count?: { followers: number };
}

export interface PagePost {
    id: number;
    pageId: number;
    content: string;
    mediaUrls: string[];
    views: number;
    createdAt: string;
    _count?: {
        reactions: number;
    };
}

export const pagesApi = {
    getDiscoverPages: async () => {
        const response = await api.get<Page[]>('/pages/discover');
        return response.data;
    },
    
    getPageByHandle: async (handle: string) => {
        const response = await api.get<Page & { posts: PagePost[] }>(`/pages/${handle}`);
        return response.data;
    },

    followPage: async (pageId: number) => {
        const response = await api.post(`/pages/${pageId}/follow`);
        return response.data;
    },

    createPage: async (data: Partial<Page>) => {
        const response = await api.post<Page>('/pages', data);
        return response.data;
    },

    createPost: async (pageId: number, data: { content: string, mediaUrls?: string[] }) => {
        const response = await api.post<PagePost>(`/pages/${pageId}/posts`, data);
        return response.data;
    },

    getMyPages: async () => {
        const response = await api.get<Page[]>('/pages/my-pages');
        return response.data;
    },

    getPageAnalytics: async (pageId: number) => {
        const response = await api.get<{ followersCount: number, postsCount: number, totalViews: number, unreadTickets: number }>(`/pages/${pageId}/analytics`);
        return response.data;
    },

    getPageConversations: async (pageId: number) => {
        const response = await api.get<any[]>(`/pages/${pageId}/conversations`);
        return response.data;
    },

    messagePage: async (pageId: number) => {
        const response = await api.post<any>(`/pages/${pageId}/message`);
        return response.data;
    },

    reactToPost: async (postId: number, emoji: string) => {
        const response = await api.post(`/pages/posts/${postId}/react`, { emoji });
        return response.data;
    },

    trackPostView: async (postId: number) => {
        const response = await api.post(`/pages/posts/${postId}/view`);
        return response.data;
    },

    deletePost: async (postId: number) => {
        const response = await api.post(`/pages/posts/${postId}/delete`);
        return response.data;
    }
};
