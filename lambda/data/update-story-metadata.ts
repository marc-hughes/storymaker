import { Story } from '../../frontend/src/types/story-maker';
import { ddbDocClient, STORY_TABLE_NAME } from './dynamodb';
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";


export async function updateStoryMetadata(userId: string, storyId: string, updates: Partial<Story>): Promise<void> {
    const updateExpressions = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    for (const [key, value] of Object.entries(updates)) {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
    }

    updateExpressions.push('#UpdatedAt = :UpdatedAt');
    expressionAttributeNames['#UpdatedAt'] = 'UpdatedAt';
    expressionAttributeValues[':UpdatedAt'] = new Date().toISOString();

    const params = {
        TableName: STORY_TABLE_NAME,
        Key: {
            PK: `USER#${userId}#STORY#${storyId}`,
            SK: 'METADATA',
        },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
    };

    await ddbDocClient.send(new UpdateCommand(params));
}