import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { createStory } from '../lambda/data/create-story';
import { createNode } from '../lambda/data/create-node';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Set up DynamoDB client with credentials from .env
const ddbClient = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-west-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

async function createStoryWithNodes() {
    const userId = uuidv4(); // Simulate a user ID
    const storyTitle = "My Test Story";

    try {
        // Create a new story
        console.info("Creating story...");
        const story = await createStory(userId, storyTitle);
        console.log("Created story:", story);

        // Create 4 nodes
        for (let i = 1; i <= 4; i++) {
            const node = await createNode(userId, story.id, {
                nodeOrder: i,
                type: "conversation",
                prompt: [{
                    id: uuidv4(),
                    body: `This is node ${i}`,
                    conditions: [],
                    media: []
                }],
                responses: [{
                    id: uuidv4(),
                    text: `Choice ${i}A`,
                    conditions: [],
                    media: []
                }, {
                    id: uuidv4(),
                    text: `Choice ${i}B`,
                    conditions: [],
                    media: []
                }],
                media: []
            });
            console.log(`Created node ${i}:`, node);
        }

        console.log("Story creation complete!");
    } catch (error) {
        console.error("Error creating story and nodes:", error);
    }
}

createStoryWithNodes();