import { DynamoDB } from 'aws-sdk';
import Note from './Note';

const docClient = new DynamoDB.DocumentClient();

async function getNoteById(noteId: string): Promise<Note|null> {
    const params = {
        TableName: process.env.NOTES_TABLE as string,
        Key: { id: noteId }
    }
    try {
        const { Item } = await docClient.get(params).promise()
        return Item as Note;
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null;
    }
}

export default getNoteById;
