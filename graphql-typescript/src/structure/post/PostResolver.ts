import { DocumentType } from '@typegoose/typegoose';
import { FilterQuery } from 'mongoose';
import {Resolver, Query, Arg, Ctx, Authorized, FieldResolver, ResolverInterface, Root} from 'type-graphql'
import { CommentModel } from '../comment/CommentModel';
import { Comment } from '../comment/CommentSchema';
import { ContextType } from '../context/ContextType';
import { UserModel } from '../user/UserModel';
import { User } from '../user/UserSchema';
import { PostModel } from './PostModel';
import { Post } from './PostSchema';

@Resolver()
export class PostQueryResolver {
    @Query(returns => [Post])
    async posts(
        @Arg('query', {nullable: true}) query?: string, 
        @Arg('skip', {nullable: true}) skip?: number, 
        @Arg('limit', {nullable: true}) limit?: number
    ) {
        const mongodbQuery: FilterQuery<DocumentType<Post>> = {
            published: true
        };

        if (query) {
            mongodbQuery.$or = [
                { title: new RegExp(query, 'i') },
                { body: new RegExp(query, 'i') }
            ]
        }
        
        const posts = await PostModel.find(mongodbQuery).skip(skip).limit(limit);

        return posts;
    }

    @Authorized()
    @Query(returns => [Post])
    myPosts(@Ctx() ctx: ContextType) {
        return PostModel.find({ author: ctx.currentUser._id });
    }
}

@Resolver(of => Post)
export class PostTypeResolver implements ResolverInterface<Post> {
    @FieldResolver(returns => User)
    async author(@Root() post: DocumentType<Post>): Promise<User> {
        const author = await UserModel.findById(post.author);
        return author;
    }

    @FieldResolver(returns => [Comment])
    async comments(@Root() post: DocumentType<Post>) {
        const comments = await CommentModel.find({post: post._id});
        return comments;
    }
}
