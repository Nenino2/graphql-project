import { DocumentType } from '@typegoose/typegoose';
import {Resolver, Query, Arg, Ctx, Authorized, FieldResolver, ResolverInterface, Root, Mutation} from 'type-graphql'
import { CommentModel } from '../comment/CommentModel';
import { Comment } from '../comment/CommentSchema';
import { ContextType } from '../context/ContextType';
import { PostModel } from '../post/PostModel';
import { Post } from '../post/PostSchema';
import { getHashedPassword, getSignedJwt, verifyPassword } from '../utils/utils';
import { UserModel } from './UserModel';
import { AuthPayload, CreateUserInput, User } from './UserSchema';

@Resolver()
export class UserQueryResolver {
    @Query(returns => [User])
    users(@Arg("query", {nullable: true}) query?: string) {
        if (!query) {
            return UserModel.find({});
        }

        return UserModel.find({
            name: new RegExp(query, 'i')
        });
    }

    @Authorized()
    @Query(returns => User)
    me(@Ctx() ctx: ContextType) {
        return UserModel.findOne(ctx.currentUser._id);
    }
}

@Resolver()
export class UserMutationResolver {
    @Mutation(returns => AuthPayload)
    async createUser(@Arg("data") data: CreateUserInput) {
        if (data.password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }

        const password = await getHashedPassword(data.password);

        const user = new UserModel({
            ...data,
            password
        })
        await user.save();

        return {
            user,
            token: await getSignedJwt(user._id)
        }
    }

    @Mutation(returns => AuthPayload)
    async login(@Arg("email") email: string, @Arg("password") password: string) {
        const user = await UserModel.findOne({email});
        if (!user) {
            throw new Error('User not found');
        }

        const valid = await verifyPassword(password, user.password);
        if (!valid) {
            throw new Error('Incorrect password');
        }

        return {
            user,
            token: await getSignedJwt(user._id)
        }
    }
}


@Resolver(of => User)
export class UserTypeResolver implements ResolverInterface<User> {
    @FieldResolver(returns => [Post])
    async posts(@Root() user: DocumentType<User>): Promise<Post[]> {
        const posts = await PostModel.find({
            author: user._id,
            published: true
        });
        return posts;
    }

    @FieldResolver(returns => [Comment])
    async comments(@Root() user: DocumentType<User>): Promise<Comment[]> {
        const comments = await CommentModel.find({author: user._id});
        return comments;
    }
}