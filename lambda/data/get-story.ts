import { Story, StoryNode } from '../../frontend/src/types/story-maker';
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient, STORY_TABLE_NAME } from './dynamodb';
import { deserializeStoryFromDynamoDB, deserializeNodeFromDynamoDB } from './serialize';

export async function getStory(userId: string, storyId: string): Promise<{ story: Story; }> {
    const params = {
        TableName: STORY_TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
            ':pk': `USER#${userId}#STORY#${storyId}`,
        },
    };
    // console.info("Retrieving story", {
    //     ':pk': `USER#${userId}#STORY#${storyId}`,
    // });

    const data = await ddbDocClient.send(new QueryCommand(params));

    const items = data.Items || [];
    let story: Story | null = null;
    const nodes: StoryNode[] = [];

    for (const item of items) {
        if (item.ItemType === 'Story') {
            story = deserializeStoryFromDynamoDB(item);
        } else if (item.ItemType === 'Node') {
            nodes.push(deserializeNodeFromDynamoDB(item, storyId));
        }
    }

    if (!story) {
        throw new Error('Story not found');
    }

    story.nodes = nodes;
    return { story };
}