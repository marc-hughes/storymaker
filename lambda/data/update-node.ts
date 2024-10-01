import { StoryNode } from '../../frontend/src/types/story-maker';
import { ddbDocClient, STORY_TABLE_NAME } from './dynamodb';
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { serializeNodeToDynamoDB } from './serialize';

export async function updateNode(userId: string, storyId: string, nodeId: string, updates: StoryNode): Promise<void> {
    const serializedNode = serializeNodeToDynamoDB(updates, userId, storyId);

    const params = {
        TableName: STORY_TABLE_NAME,
        Item: serializedNode,
    };

    await ddbDocClient.send(new PutCommand(params));
}