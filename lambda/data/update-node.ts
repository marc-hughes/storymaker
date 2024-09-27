import { StoryNode } from '../../frontend/story-maker';
import { ddbDocClient, STORY_TABLE_NAME } from './dynamodb';
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";


export async function updateNode(userId: string, storyId: string, nodeId: string, updates: Partial<StoryNode>): Promise<void> {
    const updateExpressions = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    for (const [key, value] of Object.entries(updates)) {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
    }

    const params = {
        TableName: STORY_TABLE_NAME,
        Key: {
            PK: `USER#${userId}#STORY#${storyId}`,
            SK: `NODE#${nodeId}`,
        },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
    };

    await ddbDocClient.send(new UpdateCommand(params));
}