import * as cdk from "@aws-cdk/core";
import * as appsync from '@aws-cdk/aws-appsync';
import * as sst from "@serverless-stack/resources";

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // Creates the AppSync API
    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'cdk-notes-appsync-api',
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        },
      },
      xrayEnabled: true,
    });

    const notesTable = new sst.Table(this, "Notes", {
      fields: {
        id: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "id" },
    });

    const notesLambda = new sst.Function(this, "AppSyncNotesHandler", {
      handler: "src/main.handler",
      environment: {
        NOTES_TABLE: notesTable.dynamodbTable.tableName
      },
    });

    // Set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource('lambdaDatasource', notesLambda);

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getNoteById"
    });

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listNotes"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createNote"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deleteNote"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "updateNote"
    });

    // enable the Lambda function to access the DynamoDB table (using IAM)
    notesLambda.attachPermissions([ notesTable ]);

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
     value: api.graphqlUrl
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || ''
    });

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region
    });
  }
}
