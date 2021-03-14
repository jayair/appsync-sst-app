import { DynamoDB } from 'aws-sdk';
import Note from './Note';

const docClient = new DynamoDB.DocumentClient();

async function createNote(note: Note): Promise<Note|null> {
    const params = {
        TableName: process.env.NOTES_TABLE as string,
        Item: note as Record<string, unknown>
    }
    try {
        await docClient.put(params).promise();
        return note;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}

export default createNote;
