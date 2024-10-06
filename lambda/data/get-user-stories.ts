import { ddbDocClient, STORY_TABLE_NAME } from './dynamodb';
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

interface StorySummary {
    id: string;
    title: string;
}

export async function getUserStories(userId: string): Promise<StorySummary[]> {
    const params = {
        TableName: STORY_TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
            ':pk': `USER#${userId}`,
        },
        ProjectionExpression: 'id, title',
    };

    const data = await ddbDocClient.send(new QueryCommand(params));
    // console.info("Retrieved user stories", {
    //     data,
    // });

    return (data.Items || []).map(item => ({
        id: item.id,
        title: item.title,
    }));
}