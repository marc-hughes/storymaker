import { ddbDocClient, STORY_TABLE_NAME } from './dynamodb';
import { GetCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { Story } from '../../frontend/src/types/story-maker';
import { serializeStoryIndexToDynamoDB, deserializeStoryFromDynamoDB } from './serialize';

export async function deleteStory(userId: string, storyId: string): Promise<void> {
    // Get the current story
    const getParams = {
        TableName: STORY_TABLE_NAME,
        Key: {
            PK: `USER#${userId}#STORY#${storyId}`,
            SK: 'METADATA'
        }
    };

    const { Item } = await ddbDocClient.send(new GetCommand(getParams));
    if (!Item) {
        throw new Error('Story not found');
    }

    const story: Story = deserializeStoryFromDynamoDB(Item);
    story.deleted = true;

    const transactItems = [
        {
            // Update the main story record
            Update: {
                TableName: STORY_TABLE_NAME,
                Key: {
                    PK: `USER#${userId}#STORY#${storyId}`,
                    SK: 'METADATA'
                },
                UpdateExpression: 'SET deleted = :deleted, UpdatedAt = :updatedAt',
                ExpressionAttributeValues: {
                    ':deleted': true,
                    ':updatedAt': new Date().toISOString()
                }
            }
        },
        {
            // Create a new "deleted" index record
            Put: {
                TableName: STORY_TABLE_NAME,
                Item: serializeStoryIndexToDynamoDB(story, userId)
            }
        },
        {
            // Delete the old index record
            Delete: {
                TableName: STORY_TABLE_NAME,
                Key: {
                    PK: `USER#${userId}`,
                    SK: `STORY#${storyId}`
                }
            }
        }
    ];

    await ddbDocClient.send(new TransactWriteCommand({ TransactItems: transactItems }));
}

export async function undeleteStory(userId: string, storyId: string): Promise<void> {
    // Get the current story
    const getParams = {
        TableName: STORY_TABLE_NAME,
        Key: {
            PK: `USER#${userId}#STORY#${storyId}`,
            SK: 'METADATA'
        }
    };

    const { Item } = await ddbDocClient.send(new GetCommand(getParams));
    if (!Item) {
        throw new Error('Story not found');
    }

    const story: Story = deserializeStoryFromDynamoDB(Item);
    story.deleted = false;

    const transactItems = [
        {
            // Update the main story record
            Update: {
                TableName: STORY_TABLE_NAME,
                Key: {
                    PK: `USER#${userId}#STORY#${storyId}`,
                    SK: 'METADATA'
                },
                UpdateExpression: 'SET deleted = :deleted, UpdatedAt = :updatedAt',
                ExpressionAttributeValues: {
                    ':deleted': false,
                    ':updatedAt': new Date().toISOString()
                }
            }
        },
        {
            // Create a new "undeleted" index record
            Put: {
                TableName: STORY_TABLE_NAME,
                Item: serializeStoryIndexToDynamoDB(story, userId)
            }
        },
        {
            // Delete the old "deleted" index record
            Delete: {
                TableName: STORY_TABLE_NAME,
                Key: {
                    PK: `DELETED#USER#${userId}`,
                    SK: `STORY#${storyId}`
                }
            }
        }
    ];

    await ddbDocClient.send(new TransactWriteCommand({ TransactItems: transactItems }));
}
