# Serverless Stack (SST) AppSync Demo

This project was bootstrapped with [Create Serverless Stack](https://docs.serverless-stack.com/packages/create-serverless-stack). And is based on the [AppSync AWS Guide](https://aws.amazon.com/blogs/mobile/building-scalable-graphql-apis-on-aws-with-cdk-and-aws-appsync/).

Start by installing the dependencies.

```bash
$ npm install
```

Start the Live Lambda Development environment.

```bash
$ npm sst start
```

Once your local environment is ready, [head over to the AppSync console](https://console.aws.amazon.com/appsync).

Here you can run queries and mutations and make changes locally to test your Lambda resolvers.

```graphql
mutation createNote {
  createNote(note: {
    id: "001"
    name: "My note"
    completed: false
  }) {
    id
    name
    completed
  }
}

query getNoteById {
  getNoteById(noteId: "001") {
    id
    name
    completed
  }
}

query listNotes {
  listNotes {
    id
    name
    completed
  }
}

mutation updateNote {
  updateNote(note: {
    id: "001"
    completed: true
  }) {
    id
    completed
  }
}


mutation deleteNote {
  deleteNote(noteId: "001") 
}
```

## Documentation

Learn more about the Serverless Stack.

- [Docs](https://docs.serverless-stack.com)
- [@serverless-stack/cli](https://docs.serverless-stack.com/packages/cli)
- [@serverless-stack/resources](https://docs.serverless-stack.com/packages/resources)

## Community

[Follow us on Twitter](https://twitter.com/ServerlessStack) or [post on our forums](https://discourse.serverless-stack.com).
