import { ddbDocClient, STORY_TABLE_NAME } from './dynamodb';
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { Story } from '../../frontend/src/types/story-maker';
import { serializeStoryIndexToDynamoDB, serializeStoryToDynamoDB } from './serialize';

export async function createStory(userId: string, title: string): Promise<Story> {
    const storyId = uuidv4();
    const story: Story = {
        id: storyId,
        title,
        nodes: [],
        
        deleted: false,
    };

    const params = {
        TableName: STORY_TABLE_NAME,
        Item: serializeStoryToDynamoDB(story, userId),
        ConditionExpression: 'attribute_not_exists(PK)',
    };

    const params2 = {
        TableName: STORY_TABLE_NAME,
        Item: serializeStoryIndexToDynamoDB(story, userId),
    };

    await Promise.all([
        ddbDocClient.send(new PutCommand(params)),
        ddbDocClient.send(new PutCommand(params2)),
    ]);



    return story;
}