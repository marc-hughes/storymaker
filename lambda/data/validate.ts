import {
    StorySchema,
    StoryNodeSchema,
    type Story,
    type StoryNode
} from '../../frontend/src/types/story-maker';

// Function to validate and clean up API input
export function validateStory(input: unknown): Story {
    return StorySchema.parse(input);
}

// You can create similar functions for other types if needed
export function validateStoryNode(input: unknown): StoryNode {
    return StoryNodeSchema.parse(input);
}
