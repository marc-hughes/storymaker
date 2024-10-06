import { createStory } from './create-story';
import { getStory } from './get-story';
import { ddbDocClient, STORY_TABLE_NAME } from './dynamodb';
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { Story, StoryNode, ConditionalPrompts, Response } from '../../frontend/src/types/story-maker';
import { updateNode } from './update-node';
import { createNode } from './create-node';
import { deleteNode } from './delete-node';
import { getNode } from './get-node';
import { checkUserOwnership } from './check-user-ownership';
import { getUserStories } from './get-user-stories';
import { deleteStory, undeleteStory } from './delete-story';

const TEST_USER_ID = 'test-user-123';
const TEST_TIMEOUT = 45000; // 45 seconds in milliseconds

describe('Story Creation and Retrieval', () => {
    let createdStoryId: string;

    afterAll(async () => {
        // Clean up the created story after all tests
        if (createdStoryId) {
            const deleteParams = {
                TableName: STORY_TABLE_NAME,
                Key: {
                    PK: `USER#${TEST_USER_ID}#STORY#${createdStoryId}`,
                    SK: 'METADATA'
                }
            };
            await ddbDocClient.send(new DeleteCommand(deleteParams));
        }
    });

    it('should create a story, add nodes, update a node, and then retrieve it', async () => {
        // Create a story
        const storyTitle = 'Test Story';
        const createdStory = await createStory(TEST_USER_ID, storyTitle);

        expect(createdStory).toBeDefined();
        expect(createdStory.id).toBeDefined();
        expect(createdStory.title).toBe(storyTitle);
        expect(createdStory.nodes).toEqual([]);

        createdStoryId = createdStory.id;

        // Create two nodes
        const node1Data: Omit<StoryNode, 'id' | 'storyId'> = {
            type: 'conversation',
            nodeOrder: 1,
            prompt: [
                {
                    id: '1',
                    body: 'This is node 1',
                    conditions: [],
                    media: [],
                },
            ],
            responses: [
                {
                    id: '1',
                    text: 'Response 1',
                    conditions: [],
                    media: [],
                },
            ],
            media: [],
        };

        const node2Data: Omit<StoryNode, 'id' | 'storyId'> = {
            type: 'conversation',
            nodeOrder: 2,
            prompt: [
                {
                    id: '2',
                    body: 'This is node 2',
                    conditions: [],
                    media: [],
                },
            ],
            responses: [
                {
                    id: '2',
                    text: 'Response 2',
                    conditions: [],
                    media: [],
                },
            ],
            media: [],
        };

        const createdNode1 = await createNode(TEST_USER_ID, createdStoryId, node1Data);
        const createdNode2 = await createNode(TEST_USER_ID, createdStoryId, node2Data);

        // Update node 1
        const node1Updates: StoryNode = {
            ...createdNode1,
            prompt: [
                {
                    id: '1',
                    body: 'This is updated node 1',
                    conditions: [],
                    media: [],
                },
            ],
        };
        await updateNode(TEST_USER_ID, createdStoryId, createdNode1.id, node1Updates);

        // Retrieve the updated story
        const retrievedStoryData = await getStory(TEST_USER_ID, createdStoryId);

        //console.info(JSON.stringify(retrievedStoryData))

        expect(retrievedStoryData).toBeDefined();
        expect(retrievedStoryData.story).toBeDefined();
        expect(retrievedStoryData.story.nodes).toBeDefined();

        const { story } = retrievedStoryData;
        const nodes = story.nodes;

        expect(story.id).toBe(createdStoryId);
        expect(story.title).toBe(storyTitle);
        expect(nodes).toHaveLength(2);

        // Verify the updated node 1
        const updatedNode1 = nodes.find(node => node.id === createdNode1.id);
        expect(updatedNode1).toBeDefined();
        expect(updatedNode1?.prompt[0].body).toBe('This is updated node 1');

        // Verify node 2 remains unchanged
        const unchangedNode2 = nodes.find(node => node.id === createdNode2.id);
        expect(unchangedNode2).toBeDefined();
        expect(unchangedNode2?.prompt[0].body).toBe('This is node 2');

        // Delete node 2 and make sure it's gone
        await deleteNode(TEST_USER_ID, createdStoryId, createdNode2.id);
        const deletedNode2 = await getNode(TEST_USER_ID, createdStoryId, createdNode2.id);
        expect(deletedNode2).toBeNull();

        // Make sure it's not in the story
        const storyAfterDeletion = await getStory(TEST_USER_ID, createdStoryId);
        expect(storyAfterDeletion.story.nodes).toHaveLength(1);
        expect(storyAfterDeletion.story.nodes.find(node => node.id === createdNode2.id)).toBeUndefined();

        // Add tests for deleting and undeleting a story
        // Delete the story
        await deleteStory(TEST_USER_ID, createdStoryId);

        // Verify the story is marked as deleted
        const deletedStoryData = await getStory(TEST_USER_ID, createdStoryId);
        expect(deletedStoryData.story.deleted).toBe(true);

        // Verify the story doesn't appear in the user's stories list
        const userStoriesAfterDeletion = await getUserStories(TEST_USER_ID);
        expect(userStoriesAfterDeletion.find(story => story.id === createdStoryId)).toBeUndefined();

        // Undelete the story
        await undeleteStory(TEST_USER_ID, createdStoryId);

        // Verify the story is no longer marked as deleted
        const undeletedStoryData = await getStory(TEST_USER_ID, createdStoryId);
        expect(undeletedStoryData.story.deleted).toBe(false);

        // Verify the story reappears in the user's stories list
        const userStoriesAfterUndeletion = await getUserStories(TEST_USER_ID);
        expect(userStoriesAfterUndeletion.find(story => story.id === createdStoryId)).toBeDefined();

        const weOwn = await checkUserOwnership(TEST_USER_ID, createdStoryId);
        expect(weOwn).toBe(true);

        const notOwn = await checkUserOwnership("SOMEOHTERID", createdStoryId);
        expect(notOwn).toBe(false);

        const userStories = await getUserStories(TEST_USER_ID);
        expect(userStories.find(story => story.id === createdStoryId)).toBeDefined();

    }, TEST_TIMEOUT);  // Add timeout here

    // it('should throw an error when trying to retrieve a non-existent story', async () => {
    //     const nonExistentStoryId = 'non-existent-story-id';
    //     await expect(getStory(TEST_USER_ID, nonExistentStoryId)).rejects.toThrow('Story not found');
    // });
});
