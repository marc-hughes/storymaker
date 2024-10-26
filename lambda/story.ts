import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createStory } from './data/create-story';
import { getUserStories } from './data/get-user-stories';
import { deleteStory } from './data/delete-story';
import { getStory } from './data/get-story';
import { updateStoryMetadata } from './data/update-story-metadata';
import { Story } from '../frontend/src/types/story-maker';

// Add this function to create a response with CORS headers
const createCorsResponse = (statusCode: number, body: any): APIGatewayProxyResult => {
    return {
        statusCode,
        headers: {
            'X-Story-Maker-Version': '0.0.1',
            'Access-Control-Allow-Origin': '*', // Allow all origins
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        },
        body: JSON.stringify(body),
    };
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Check if the user is authenticated
    if (!event.requestContext.authorizer) {
        return createCorsResponse(401, { message: 'Unauthorized' });
    }

    // Extract the userId from the Cognito claims
    const userId = event.requestContext.authorizer.claims['sub'];

    try {
        const { httpMethod, path } = event;
        const pathParts = path.split('/').filter(Boolean);

        switch (true) {
            case httpMethod === 'POST' && path === '/stories':
                return await handleCreateStory(event, userId);
            case httpMethod === 'GET' && path === '/stories':
                return await handleGetStories(userId);
            case httpMethod === 'GET' && pathParts[0] === 'stories' && pathParts.length === 2:
                return await handleGetStory(event, userId, pathParts[1]);
            case httpMethod === 'PUT' && pathParts[0] === 'stories' && pathParts.length === 2:
                return await handleUpdateStory(event, userId, pathParts[1]);
            case httpMethod === 'DELETE' && pathParts[0] === 'stories' && pathParts.length === 2:
                return await handleDeleteStory(event, userId, pathParts[1]);

            default:
                return createCorsResponse(404, { message: 'Not found' });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return createCorsResponse(500, { message: 'Internal server error' });
    }
};

const handleCreateStory = async (event: APIGatewayProxyEvent, userId: string): Promise<APIGatewayProxyResult> => {
    const body = JSON.parse(event.body || '{}');
    const { title } = body;

    if (!title) {
        return createCorsResponse(400, { message: 'Title is required' });
    }

    const story = await createStory(userId, title);

    return createCorsResponse(201, story);
};

const handleGetStories = async (userId: string): Promise<APIGatewayProxyResult> => {
    const stories = await getUserStories(userId);
    return createCorsResponse(200, stories);
};


const handleGetStory = async (event: APIGatewayProxyEvent, userId: string, storyId: string): Promise<APIGatewayProxyResult> => {
    try {
        const { story } = await getStory(userId, storyId);
        return createCorsResponse(200, story);
    } catch (error) {
        if (error instanceof Error && error.message === 'Story not found') {
            return createCorsResponse(404, { message: 'Story not found' });
        }
        console.error('Error retrieving story:', error);
        return createCorsResponse(500, { message: 'Failed to retrieve story' });
    }
};

const handleUpdateStory = async (event: APIGatewayProxyEvent, userId: string, storyId: string): Promise<APIGatewayProxyResult> => {
    try {
        const body = JSON.parse(event.body || '{}');
        const { title } = body;

        if (!title) {
            return createCorsResponse(400, { message: 'At least one field (title) is required for update' });
        }

        const updates: Partial<Story> = {};
        if (title !== undefined) updates.title = title;


        await updateStoryMetadata(userId, storyId, updates);

        return createCorsResponse(200, { message: 'Story updated successfully' });
    } catch (error) {
        console.error('Error updating story:', error);
        return createCorsResponse(500, { message: 'Failed to update story' });
    }
};

const handleDeleteStory = async (event: APIGatewayProxyEvent, userId: string, storyId: string): Promise<APIGatewayProxyResult> => {
    try {
        await deleteStory(userId, storyId);
        return createCorsResponse(200, { message: 'Story deleted successfully' });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Story not found') {
                return createCorsResponse(404, { message: 'Story not found or already deleted' });
            }
        }
        console.error('Error deleting story:', error);
        return createCorsResponse(500, { message: 'Failed to delete story' });
    }
};
