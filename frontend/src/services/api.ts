import { AxiosInstance } from 'axios';
import { Story, StoryNode, StoryNodeSchema, StorySchema } from '../types/story-maker';

export const getStories = async (apiClient: AxiosInstance): Promise<Story[]> => {
    const response = await apiClient.get('/stories');
    return response.data.map(StorySchema.parse);
};

export const getStory = async (apiClient: AxiosInstance, id: string): Promise<Story> => {
    const response = await apiClient.get(`/stories/${id}`);
    return StorySchema.parse(response.data);
};

export const createStory = async (apiClient: AxiosInstance, title: string): Promise<Story> => {
    const response = await apiClient.post('/stories', { title });
    return StorySchema.parse(response.data);
};

export const updateStory = async (apiClient: AxiosInstance, id: string, title: string): Promise<Story> => {
    const response = await apiClient.patch(`/stories/${id}`, { title });
    return StorySchema.parse(response.data);
};

export const deleteStory = async (apiClient: AxiosInstance, id: string): Promise<void> => {
    await apiClient.delete(`/stories/${id}`);
};

export const createNode = async (apiClient: AxiosInstance, storyId: string, node: Partial<StoryNode>): Promise<StoryNode> => {
    const response = await apiClient.post(`/stories/${storyId}/nodes`, node);
    return StoryNodeSchema.parse(response.data);
};

export const updateNode = async (apiClient: AxiosInstance, storyId: string, nodeId: string, node: Partial<StoryNode>): Promise<StoryNode> => {
    const response = await apiClient.patch(`/stories/${storyId}/nodes/${nodeId}`, node);
    return StoryNodeSchema.parse(response.data);
};

export const deleteNode = async (apiClient: AxiosInstance, storyId: string, nodeId: string): Promise<void> => {
    await apiClient.delete(`/stories/${storyId}/nodes/${nodeId}`);
};