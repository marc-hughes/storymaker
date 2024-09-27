import { ddbDocClient, STORY_TABLE_NAME } from './dynamodb';
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { StoryNode } from '../../frontend/story-maker';


export async function createNode(userId: string, storyId: string, nodeData: Omit<StoryNode, 'id' | 'storyId'>): Promise<StoryNode> {
    const nodeId = uuidv4();
    const node: StoryNode = {
        ...nodeData,
        id: nodeId,
        storyId,
    };

    const params = {
        TableName: STORY_TABLE_NAME,
        Item: {
            PK: `USER#${userId}#STORY#${storyId}`,
            SK: `NODE#${nodeId}`,
            ItemType: 'Node',
            NodeId: nodeId,
            ...nodeData,
        },
        ConditionExpression: 'attribute_not_exists(PK)',
    };

    await ddbDocClient.send(new PutCommand(params));

    return node;
}