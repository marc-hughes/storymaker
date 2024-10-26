import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/api';
import { Story, StoryNode } from '../types/story-maker';
import { useAuth } from '../context/AuthContext';
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '../constants';

interface RetryableRequest extends InternalAxiosRequestConfig {
    _retry?: boolean;
}


const useApiClient = (): AxiosInstance => {
    const auth = useAuth();
    const apiClient = axios.create({
        baseURL: API_URL,
    });

    apiClient.interceptors.request.use(
        async (config) => {
            const token = auth.getAccessToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    apiClient.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as RetryableRequest;
            if (originalRequest && error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const newToken = await auth.refreshToken();
                    if (newToken && originalRequest.headers) {
                        originalRequest.headers['Authorization'] = `Bearer ${newToken.idToken}`;
                    }
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    // Handle refresh error (e.g., redirect to login)
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );

    return apiClient;
};

export const useGetStories = () => {
    const client = useApiClient();
    return useQuery<Story[], Error>({
        queryKey: ['stories'],
        queryFn: () => {
            if (!client) throw new Error('No authentication token available');
            return api.getStories(client);
        },
        enabled: !!client,
    });
};

export const useGetStory = (id: string) => {
    const client = useApiClient();
    console.info("useGetStory", id);
    return useQuery<Story, Error>({
        queryKey: ['story', id],
        queryFn: () => api.getStory(client, id),
        enabled: !!client,
    });
};

export const useCreateStory = () => {
    const queryClient = useQueryClient();
    const client = useApiClient();
    return useMutation<Story, Error, { title: string }>({
        mutationFn: ({ title }) => api.createStory(client, title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stories'] });
        },
    });
};

export const useUpdateStory = () => {
    const queryClient = useQueryClient();
    const client = useApiClient();
    return useMutation<Story, Error, { id: string; title: string }>({
        mutationFn: ({ id, title }) => api.updateStory(client, id, title),
        onSuccess: (_msg, updatedStory) => {
            console.info("Successfully updated story", updatedStory);
            // Invalidate the specific story query
            // Update the specific story in the cache with the new data            
            queryClient.invalidateQueries({ queryKey: ['story', updatedStory.id] });
            // Optionally, update the stories list if needed
            queryClient.invalidateQueries({ queryKey: ['stories'] });
        },
    });
};

export const useDeleteStory = () => {
    const queryClient = useQueryClient();
    const client = useApiClient();
    return useMutation<void, Error, { id: string }>({
        mutationFn: ({ id }) => api.deleteStory(client, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stories'] });
        },
    });
};

export const useCreateNode = () => {
    const queryClient = useQueryClient();
    const client = useApiClient();
    return useMutation<StoryNode, Error, { storyId: string; node: Partial<StoryNode> }>({
        mutationFn: ({ storyId, node }) => api.createNode(client, storyId, node),
        onSuccess: (_data, { storyId }) => {
            queryClient.invalidateQueries({ queryKey: ['story', storyId] });
        },
    });
};

export const useUpdateNode = () => {
    const queryClient = useQueryClient();
    const client = useApiClient();
    return useMutation<StoryNode, Error, { storyId: string; nodeId: string; node: Partial<StoryNode> }>({
        mutationFn: ({ storyId, nodeId, node }) => api.updateNode(client, storyId, nodeId, node),
        onSuccess: (_data, { storyId }) => {
            queryClient.invalidateQueries({ queryKey: ['story', storyId] });
        },
    });
};

export const useDeleteNode = () => {
    const queryClient = useQueryClient();
    const client = useApiClient();
    return useMutation<void, Error, { storyId: string; nodeId: string }>({
        mutationFn: ({ storyId, nodeId }) => api.deleteNode(client, storyId, nodeId),
        onSuccess: (_, { storyId }) => {
            queryClient.invalidateQueries({ queryKey: ['story', storyId] });
        },
    });
};
