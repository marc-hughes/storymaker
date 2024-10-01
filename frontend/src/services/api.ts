import axios, { AxiosInstance } from 'axios';
import { Story, StoryNode } from '../types/story-maker';

const API_URL = import.meta.env.VITE_API_URL;

const createApiClient = (token: string): AxiosInstance => {
    return axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
};

export const getStories = async (token: string): Promise<Story[]> => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get('/stories');
    return response.data;
};

export const getStory = async (token: string, id: string): Promise<Story> => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get(`/stories/${id}`);
    return response.data;
};

export const createStory = async (token: string, title: string): Promise<Story> => {
    const apiClient = createApiClient(token);
    const response = await apiClient.post('/stories', { title });
    return response.data;
};

export const updateStory = async (token: string, id: string, title: string): Promise<Story> => {
    const apiClient = createApiClient(token);
    const response = await apiClient.patch(`/stories/${id}`, { title });
    return response.data;
};

export const deleteStory = async (token: string, id: string): Promise<void> => {
    const apiClient = createApiClient(token);
    await apiClient.delete(`/stories/${id}`);
};

export const createNode = async (token: string, storyId: string, node: Partial<StoryNode>): Promise<StoryNode> => {
    const apiClient = createApiClient(token);
    const response = await apiClient.post(`/stories/${storyId}/nodes`, node);
    return response.data;
};

export const updateNode = async (token: string, storyId: string, nodeId: string, node: Partial<StoryNode>): Promise<StoryNode> => {
    const apiClient = createApiClient(token);
    const response = await apiClient.patch(`/stories/${storyId}/nodes/${nodeId}`, node);
    return response.data;
};

export const deleteNode = async (token: string, storyId: string, nodeId: string): Promise<void> => {
    const apiClient = createApiClient(token);
    await apiClient.delete(`/stories/${storyId}/nodes/${nodeId}`);
};