import { Story, StoryNode } from '../../frontend/story-maker';

import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient, STORY_TABLE_NAME } from './dynamodb';


export async function getStory(userId: string, storyId: string): Promise<{ story: Story; nodes: StoryNode[] }> {
    const params = {
        TableName: STORY_TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
            ':pk': `USER#${userId}#STORY#${storyId}`,
        },
    };

    const data = await ddbDocClient.send(new QueryCommand(params));

    const items = data.Items || [];
    let story: Story | null = null;
    const nodes: StoryNode[] = [];

    for (const item of items) {
        if (item.ItemType === 'Story') {
            story = {
                id: storyId,
                title: item.Title,
                nodes: []
            };
        } else if (item.ItemType === 'Node') {
            nodes.push({
                id: item.NodeId,
                nodeOrder: item.NodeOrder,
                storyId: storyId,
                type: item.Type,
                prompt: item.Prompt,
                responses: item.Responses,
                media: item.Media,
            });
        }
    }

    if (!story) {
        throw new Error('Story not found');
    }

    return { story, nodes };
}