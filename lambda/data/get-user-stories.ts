import { ddbDocClient, STORY_TABLE_NAME } from './dynamodb';
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

interface StorySummary {
    id: string;
    title: string;
}

export async function getUserStories(userId: string): Promise<StorySummary[]> {
    const params = {
        TableName: STORY_TABLE_NAME,
        IndexName: 'UserStoriesIndex',
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
            ':pk': `USER#${userId}`,
            ':sk': 'STORY#',
        },
        ProjectionExpression: 'StoryId, Title',
    };

    const data = await ddbDocClient.send(new QueryCommand(params));

    return (data.Items || []).map(item => ({
        id: item.StoryId,
        title: item.Title,
    }));
}