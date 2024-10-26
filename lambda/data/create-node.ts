import { ddbDocClient, STORY_TABLE_NAME } from './dynamodb';
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { StoryNode } from '../../frontend/src/types/story-maker';
import { serializeNodeToDynamoDB } from './serialize';
import { StoryNodeSchema, validateStoryNode } from './validate';

export async function createNode(userId: string, storyId: string, nodeData: Omit<StoryNode, 'id' | 'storyId'>): Promise<StoryNode> {
    const nodeId = uuidv4();
    const node: StoryNode = {
        ...nodeData,
        id: nodeId,
        storyId,
    };

    // Validate the node data using the StoryNodeSchema
    const validatedNode = validateStoryNode(node);

    const serializedNode = serializeNodeToDynamoDB(validatedNode, userId, storyId);

    const params = {
        TableName: STORY_TABLE_NAME,
        Item: serializedNode,
        ConditionExpression: 'attribute_not_exists(PK)',
    };

    await ddbDocClient.send(new PutCommand(params));

    return node;
}
