import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import {buildSchema} from 'type-graphql'
import mongoose from 'mongoose';
import { context } from './structure/context/ContextMiddleware';
import { customAuthChecker } from './structure/checker/AuthChecker';
import { UserMutationResolver, UserQueryResolver, UserTypeResolver } from './structure/user/UserResolver';
import { PostQueryResolver, PostTypeResolver } from './structure/post/PostResolver';
import { CommentQueryResolver, CommentTypeResolver } from './structure/comment/CommentResolver';

(async () => {

  const schema = await buildSchema({
    resolvers: [
      UserQueryResolver,
      UserMutationResolver,
      UserTypeResolver,
      PostQueryResolver,
      PostTypeResolver,
      CommentQueryResolver,
      CommentTypeResolver,
    ],
    authChecker: customAuthChecker
  });
  
  const server = new ApolloServer({
    schema,
    context,
  });
  
  await mongoose
    .connect(
      'mongodb://localhost:27017/graphql-example',
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      }
    )

    const { url } = await server.listen(4000);
    console.log(`Server is running, GraphQL Playground available at ${url}`);
})()