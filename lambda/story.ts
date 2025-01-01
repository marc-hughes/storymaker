import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createStory } from './data/create-story';
import { getUserStories } from './data/get-user-stories';
import { deleteStory } from './data/delete-story';
import { getStory } from './data/get-story';
import { updateStoryMetadata } from './data/update-story-metadata';
import { Story, StoryNode } from '../frontend/src/types/story-maker';
import { createNode } from './data/create-node';
import { updateNode } from './data/update-node';
import { ZodError } from 'zod';

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
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('User ID:', event.requestContext.authorizer?.claims['sub']);
    console.log('HTTP Method:', event.httpMethod);
    console.log('Path:', event.path);
    console.log('Query String Parameters:', event.queryStringParameters);
    console.log('Headers:', event.headers);
    console.log('Body:', event.body);
    // Check if the user is authenticated
    if (!event.requestContext.authorizer) {
        console.log('Unauthorized');
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
            case httpMethod === 'PATCH' && pathParts[0] === 'stories' && pathParts.length === 2:
                return await handleUpdateStory(event, userId, pathParts[1]);
            case httpMethod === 'DELETE' && pathParts[0] === 'stories' && pathParts.length === 2:
                return await handleDeleteStory(event, userId, pathParts[1]);
            case httpMethod === 'POST' && pathParts[0] === 'stories' && pathParts[2] === 'nodes' && pathParts.length === 3:
                return await handleCreateNode(event, userId, pathParts[1]);
            case httpMethod === 'PATCH' && event.resource === '/stories/{id}/nodes/{nodeId}':
                const storyId = event.pathParameters?.id;
                const nodeId = event.pathParameters?.nodeId;
                if (!storyId || !nodeId) {
                    return createCorsResponse(400, { message: "Story ID and Node ID are required" });
                }
                return handleUpdateNode(event, userId, storyId, nodeId);

            default:
                console.log('Path not found in lambda', httpMethod, path);
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

const handleCreateNode = async (event: APIGatewayProxyEvent, userId: string, storyId: string): Promise<APIGatewayProxyResult> => {
    try {
        const body = JSON.parse(event.body || '{}') as Omit<StoryNode, 'id' | 'storyId'>;


        if (!event.body || !body) {
            return createCorsResponse(400, { message: 'Content is required' });
        }


        const newNode = await createNode(userId, storyId, body);
        return createCorsResponse(201, newNode);
    } catch (error) {
        // Check if the error is a ZodError
        if (error instanceof ZodError) {
            return createCorsResponse(400, { message: `Validation failed: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}` });
        }
        console.error('Error creating node:', error);
        return createCorsResponse(500, { message: 'Failed to create node' });
    }
};

const handleUpdateNode = async (
    event: APIGatewayProxyEvent,
    userId: string,
    storyId: string,
    nodeId: string
): Promise<APIGatewayProxyResult> => {
    try {
        if (!event.body) {
            return createCorsResponse(400, { message: "Content is required" });
        }

        const updates = JSON.parse(event.body) as StoryNode;
        await updateNode(userId, storyId, nodeId, updates);
        return createCorsResponse(200, { message: "Node updated successfully" });
    } catch (error) {
        console.error("Error updating node:", error);
        return createCorsResponse(500, { message: "Failed to update node" });
    }
};
