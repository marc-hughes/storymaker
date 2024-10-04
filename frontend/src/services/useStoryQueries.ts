import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/api';
import { Story, StoryNode } from '../types/story-maker';
import { useAuth } from '../context/AuthContext';



// Assuming you have a way to get the token, e.g., from a context or state
const useToken = () => {
    const auth = useAuth();
    return auth.user?.idToken;
};

export const useGetStories = () => {
    const token = useToken();
    return useQuery<Story[], Error>({
        queryKey: ['stories'],
        queryFn: () => {
            if (!token) throw new Error('No authentication token available');
            return api.getStories(token);
        },
        enabled: !!token,
    });
};

export const useGetStory = (id: string) => {
    const token = useToken();
    return useQuery<Story, Error>({
        queryKey: ['story', id],
        queryFn: () => {
            if (!token) throw new Error('No authentication token available');
            return api.getStory(token, id);
        },
        enabled: !!token,
    });
};

export const useCreateStory = () => {
    const queryClient = useQueryClient();
    const token = useToken();
    return useMutation<Story, Error, { title: string }>({
        mutationFn: ({ title }) => {
            if (!token) throw new Error('No authentication token available');
            return api.createStory(token, title);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stories'] });
        },
    });
};

export const useUpdateStory = () => {
    const queryClient = useQueryClient();
    const token = useToken();
    return useMutation<Story, Error, { id: string; title: string }>({
        mutationFn: ({ id, title }) => {
            if (!token) throw new Error('No authentication token available');
            return api.updateStory(token, id, title);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['stories'] });
            queryClient.invalidateQueries({ queryKey: ['story', data.id] });
        },
    });
};

export const useDeleteStory = () => {
    const queryClient = useQueryClient();
    const token = useToken();
    return useMutation<void, Error, { id: string }>({
        mutationFn: ({ id }) => {
            if (!token) throw new Error('No authentication token available');
            return api.deleteStory(token, id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stories'] });
        },
    });
};

export const useCreateNode = () => {
    const queryClient = useQueryClient();
    const token = useToken();
    return useMutation<StoryNode, Error, { storyId: string; node: Partial<StoryNode> }>({
        mutationFn: ({ storyId, node }) => {
            if (!token) throw new Error('No authentication token available');
            return api.createNode(token, storyId, node);
        },
        onSuccess: (data, { storyId }) => {
            queryClient.invalidateQueries({ queryKey: ['story', storyId] });
        },
    });
};

export const useUpdateNode = () => {
    const queryClient = useQueryClient();
    const token = useToken();
    return useMutation<StoryNode, Error, { storyId: string; nodeId: string; node: Partial<StoryNode> }>({
        mutationFn: ({ storyId, nodeId, node }) => {
            if (!token) throw new Error('No authentication token available');
            return api.updateNode(token, storyId, nodeId, node);
        },
        onSuccess: (data, { storyId }) => {
            queryClient.invalidateQueries({ queryKey: ['story', storyId] });
        },
    });
};

export const useDeleteNode = () => {
    const queryClient = useQueryClient();
    const token = useToken();
    return useMutation<void, Error, { storyId: string; nodeId: string }>({
        mutationFn: ({ storyId, nodeId }) => {
            if (!token) throw new Error('No authentication token available');
            return api.deleteNode(token, storyId, nodeId);
        },
        onSuccess: (_, { storyId }) => {
            queryClient.invalidateQueries({ queryKey: ['story', storyId] });
        },
    });
};
