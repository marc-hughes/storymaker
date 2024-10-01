import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";


// {
//     "PK": "USER#<UserID>#STORY#<StoryID>",
//     "SK": "METADATA",
//     "ItemType": "Story",
//     "Title": "Story Title",
//     "CreatedAt": "2023-10-01T12:00:00Z",
//     "UpdatedAt": "2023-10-01T12:00:00Z",
//     "OtherStoryAttributes": "..."
// }
// {
//     "PK": "USER#<UserID>#STORY#<StoryID>",
//     "SK": "NODE#<NodeID>",
//     "ItemType": "Node",
//     "NodeOrder": 1,
//     "Type": "conversation",
//     "Prompt": [/* ConditionalPrompts */],
//     "Responses": [/* Responses */],
//     "Media": [/* Media */],
//     "OtherNodeAttributes": "..."
// }

const client = new DynamoDBClient({});
export const ddbDocClient = DynamoDBDocumentClient.from(client);


export const STORY_TABLE_NAME = process.env.STORY_TABLE_NAME;

// console.info("STORY_TABLE_NAME", STORY_TABLE_NAME);
// console.info("process.env", process.env.AWS_ACCESS_KEY_ID);

if (!STORY_TABLE_NAME) {
    throw new Error("STORY_TABLE_NAME environment variable is not set");
}