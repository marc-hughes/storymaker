import { ddbDocClient, STORY_TABLE_NAME } from './dynamodb';
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { Story } from '../../frontend/story-maker';

export async function createStory(userId: string, title: string): Promise<Story> {
    const storyId = uuidv4();
    const story: Story = {
        id: storyId,
        title,
        nodes: [],
    };

    const params = {
        TableName: STORY_TABLE_NAME,
        Item: {
            PK: `USER#${userId}#STORY#${storyId}`,
            SK: 'METADATA',
            ItemType: 'Story',
            StoryId: storyId,
            Title: title,
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
        },
        ConditionExpression: 'attribute_not_exists(PK)',
    };

    await ddbDocClient.send(new PutCommand(params));

    return story;
}