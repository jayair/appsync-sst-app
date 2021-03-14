import { DynamoDB } from 'aws-sdk';

const docClient = new DynamoDB.DocumentClient();

async function deleteNote(noteId: string): Promise<string|null> {
    const params = {
        TableName: process.env.NOTES_TABLE as string,
        Key: { id: noteId }
    }
    try {
        await docClient.delete(params).promise()
        return noteId
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default deleteNote;
