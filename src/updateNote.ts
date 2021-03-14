import { DynamoDB } from 'aws-sdk';
import Note from './Note';

const docClient = new DynamoDB.DocumentClient();

async function updateNote(note: Record<string, unknown>): Promise<Note|null> {
  const params = {
    TableName: process.env.NOTES_TABLE as string,
    Key: {
      id: note.id
    },
    ExpressionAttributeValues: {} as Record<string, unknown>,
    ExpressionAttributeNames: {} as Record<string, string>,
    UpdateExpression: "",
    ReturnValues: "UPDATED_NEW"
  };
  let prefix = "set ";
  const attributes = Object.keys(note);
  for (let i=0; i<attributes.length; i++) {
    const attribute = attributes[i];
    if (attribute !== "id") {
      params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;
      params["ExpressionAttributeValues"][":" + attribute] = note[attribute];
      params["ExpressionAttributeNames"]["#" + attribute] = attribute;
      prefix = ", ";
    }
 }
  console.log('params: ', params)
  try {
    await docClient.update(params).promise()
    return note as Note;
  } catch (err) {
    console.log('DynamoDB error: ', err)
    return null
  }
}

export default updateNote;
