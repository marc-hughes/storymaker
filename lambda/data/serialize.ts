import { Story, StoryNode } from "../../frontend/src/types/story-maker";


export function serializeStoryIndexToDynamoDB(story: Story, userId: string): Record<string, any> {
    return {
        PK: story.deleted ? `DELETED#USER#${userId}` : `USER#${userId}`,
        SK: `STORY#${story.id}`,
        ItemType: 'StoryIndex',
        id: story.id,
        title: story.title,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
        deleted: story.deleted || false,
    };
}

export function serializeStoryToDynamoDB(story: Story, userId: string): Record<string, any> {
    const now = new Date().toISOString();
    return {
        PK: `USER#${userId}#STORY#${story.id}`,
        SK: 'METADATA',
        ItemType: 'Story',
        id: story.id,
        title: story.title,
        CreatedAt: story.CreatedAt || now, // Use existing createdAt or set new one
        UpdatedAt: now,
        deleted: story.deleted || false,
    };
}

export function deserializeStoryFromDynamoDB(item: Record<string, any>): Story {
    return {
        id: item.id,
        title: item.title,
        nodes: [],
        deleted: item.deleted || false,
        CreatedAt: item.CreatedAt,
        UpdatedAt: item.UpdatedAt,
    };
}

export function serializeNodeToDynamoDB(node: StoryNode, userId: string, storyId: string): Record<string, any> {
    const now = new Date().toISOString();
    return {
        ItemType: 'Node',
        PK: `USER#${userId}#STORY#${storyId}`,
        SK: `NODE#${node.id}`,
        ...node,
        CreatedAt: node.CreatedAt || now, // Use existing createdAt or set new one
        UpdatedAt: now,
    };
}

export function deserializeNodeFromDynamoDB(item: Record<string, any>, storyId: string): StoryNode {
    const { ItemType, PK, SK, ...node } = item;
    return node as StoryNode;
}