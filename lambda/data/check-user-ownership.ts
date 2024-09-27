import { ddbDocClient, STORY_TABLE_NAME } from './dynamodb';
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export async function checkUserOwnership(userId: string, storyId: string): Promise<boolean> {
    const params = {
        TableName: STORY_TABLE_NAME,
        Key: {
            PK: `USER#${userId}#STORY#${storyId}`,
            SK: 'METADATA',
        },
        ProjectionExpression: 'StoryId',
    };

    const data = await ddbDocClient.send(new GetCommand(params));
    return !!data.Item;
}