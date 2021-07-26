import { DocumentType } from '@typegoose/typegoose';
import {Resolver, Query, Arg, Ctx, Authorized, FieldResolver, ResolverInterface, Root} from 'type-graphql'
import { PostModel } from '../post/PostModel';
import { Post } from '../post/PostSchema';
import { UserModel } from '../user/UserModel';
import { User } from '../user/UserSchema';
import { CommentModel } from './CommentModel'
import { Comment } from './CommentSchema';

@Resolver()
export class CommentQueryResolver {
    @Query(returns => [Comment])
    comments() {
        return CommentModel.find();
    }
}

@Resolver(of => Comment)
export class CommentTypeResolver implements ResolverInterface<Comment>{
    @FieldResolver(returns => User)
    async author(@Root() comment: DocumentType<Comment>): Promise<User> {
        const author = await UserModel.findById(comment.author);
        return author;
    }

    @FieldResolver(returns => Post)
    async post(@Root() comment: DocumentType<Comment>): Promise<Post> {
        const post = await PostModel.findById(comment.post);
        return post;
    }
}