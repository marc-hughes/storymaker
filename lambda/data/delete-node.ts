import { ddbDocClient, STORY_TABLE_NAME } from './dynamodb';
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

export async function deleteNode(userId: string, storyId: string, nodeId: string): Promise<void> {
    const params = {
        TableName: STORY_TABLE_NAME,
        Key: {
            PK: `USER#${userId}#STORY#${storyId}`,
            SK: `NODE#${nodeId}`,
        },
    };

    await ddbDocClient.send(new DeleteCommand(params));
}