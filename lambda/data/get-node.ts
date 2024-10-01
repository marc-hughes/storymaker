import { ddbDocClient, STORY_TABLE_NAME } from './dynamodb';
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { StoryNode } from '../../frontend/src/types/story-maker';
import { deserializeNodeFromDynamoDB } from './serialize';

export async function getNode(userId: string, storyId: string, nodeId: string): Promise<StoryNode | null> {
    const params = {
        TableName: STORY_TABLE_NAME,
        Key: {
            PK: `USER#${userId}#STORY#${storyId}`,
            SK: `NODE#${nodeId}`,
        },
    };

    try {
        const { Item } = await ddbDocClient.send(new GetCommand(params));

        if (!Item) {
            return null;
        }

        return deserializeNodeFromDynamoDB(Item, storyId);
    } catch (error) {
        console.error('Error fetching node:', error);
        throw error;
    }
}
