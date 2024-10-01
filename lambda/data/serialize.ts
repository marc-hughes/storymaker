import { Story, StoryNode } from "../../frontend/src/types/story-maker";


export function serializeStoryIndexToDynamoDB(story: Story, userId: string): Record<string, any> {
    return {
        PK: `USER#${userId}`,
        SK: `STORY#${story.id}`,
        ItemType: 'StoryIndex',
        id: story.id,
        title: story.title,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
    };
}

export function serializeStoryToDynamoDB(story: Story, userId: string): Record<string, any> {
    return {
        PK: `USER#${userId}#STORY#${story.id}`,
        SK: 'METADATA',
        ItemType: 'Story',
        id: story.id,
        title: story.title,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
    };
}

export function deserializeStoryFromDynamoDB(item: Record<string, any>): Story {
    return {
        id: item.id,
        title: item.title,
        nodes: [],
    };
}

export function serializeNodeToDynamoDB(node: StoryNode, userId: string, storyId: string): Record<string, any> {
    return {
        ItemType: 'Node',
        PK: `USER#${userId}#STORY#${storyId}`,
        SK: `NODE#${node.id}`,
        ...node
        // NodeId: node.id,
        // NodeOrder: node.nodeOrder,
        // Type: node.type,
        // Prompt: node.prompt,
        // Responses: node.responses,
        // Media: node.media,
    };
}

export function deserializeNodeFromDynamoDB(item: Record<string, any>, storyId: string): StoryNode {
    const { ItemType, PK, SK, ...node } = item;
    return node as StoryNode;
}