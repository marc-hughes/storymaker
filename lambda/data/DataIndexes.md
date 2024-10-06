# DynamoDB Table Indexes

This document outlines the structure of Primary Keys (PK) and Sort Keys (SK) for the objects stored in the DynamoDB table, along with their data attributes.

## Story Object

### Story Index Record

- **PK**: `USER#${userId}`
- **SK**: `STORY#${storyId}`
- **Data Attributes**:
  - ItemType: 'StoryIndex'
  - id: string
  - title: string
  - CreatedAt: string (ISO date)
  - UpdatedAt: string (ISO date)
  - deleted: boolean (always false)

This record contains a lightweight index of the story for quicker retrieval of story lists.

### Deleted Story Index Record

- **PK**: `DELETED#USER#${userId}`
- **SK**: `STORY#${storyId}`
- **Data Attributes**:
  - ItemType: 'StoryIndex'
  - id: string
  - title: string
  - CreatedAt: string (ISO date)
  - UpdatedAt: string (ISO date)
  - deleted: boolean (always true)

This record represents a deleted story in the index for efficient retrieval of deleted story lists.

### Main Story Record

- **PK**: `USER#${userId}#STORY#${storyId}`
- **SK**: 'METADATA'
- **Data Attributes**:
  - ItemType: 'Story'
  - id: string
  - title: string
  - CreatedAt: string (ISO date)
  - UpdatedAt: string (ISO date)
  - deleted: boolean

This record contains the main story metadata, including its deletion status.

## Story Node Object

- **PK**: `USER#${userId}#STORY#${storyId}`
- **SK**: `NODE#${nodeId}`
- **Data Attributes**:
  - ItemType: 'Node'
  - id: string
  - storyId: string
  - nodeOrder: number (assumed)
  - type: string (assumed)
  - prompt: string (assumed)
  - responses: any[] (assumed)
  - media: any (assumed)
  - Additional attributes as defined in the StoryNode type

This record contains the data for individual nodes within a story.

## Notes

- The structure allows for efficient retrieval of:
  - All stories for a user (using the Story Index Records)
  - All deleted stories for a user (using the Deleted Story Index Records)
  - All nodes for a specific story
  - Specific stories or nodes by their IDs
- The `deleted` attribute in the Story Index Record and Main Story Record allows for soft deletion of stories
- When a story is deleted, its index record is moved from the `USER#${userId}` partition to the `DELETED#USER#${userId}` partition
