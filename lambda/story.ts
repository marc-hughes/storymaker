import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createStory } from './data/create-story';
// Import other story-related functions as needed
// import { getStory } from './data/get-story';
// import { updateStory } from './data/update-story';
// import { deleteStory } from './data/delete-story';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Check if the user is authenticated
    if (!event.requestContext.authorizer) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized' }),
        };
    }

    // Extract the userId from the Cognito claims
    const userId = event.requestContext.authorizer.claims['sub'];

    try {
        const { httpMethod, path } = event;
        const pathParts = path.split('/').filter(Boolean);

        switch (true) {
            case httpMethod === 'POST' && path === '/stories':
                return await handleCreateStory(event, userId);

            // Add more cases for other story-related actions
            // case httpMethod === 'GET' && pathParts[0] === 'stories' && pathParts.length === 2:
            //     return await handleGetStory(event, userId, pathParts[1]);
            // case httpMethod === 'PUT' && pathParts[0] === 'stories' && pathParts.length === 2:
            //     return await handleUpdateStory(event, userId, pathParts[1]);
            // case httpMethod === 'DELETE' && pathParts[0] === 'stories' && pathParts.length === 2:
            //     return await handleDeleteStory(event, userId, pathParts[1]);

            default:
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: 'Not found' }),
                };
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
};

const handleCreateStory = async (event: APIGatewayProxyEvent, userId: string): Promise<APIGatewayProxyResult> => {
    const body = JSON.parse(event.body || '{}');
    const { title } = body;

    if (!title) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Title is required' }),
        };
    }

    const story = await createStory(userId, title);

    return {
        statusCode: 201,
        body: JSON.stringify(story),
    };
};

// Implement other handler functions as needed
// const handleGetStory = async (event: APIGatewayProxyEvent, userId: string, storyId: string): Promise<APIGatewayProxyResult> => { ... }
// const handleUpdateStory = async (event: APIGatewayProxyEvent, userId: string, storyId: string): Promise<APIGatewayProxyResult> => { ... }
// const handleDeleteStory = async (event: APIGatewayProxyEvent, userId: string, storyId: string): Promise<APIGatewayProxyResult> => { ... }