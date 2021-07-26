import {ObjectType, Field, ID, InputType, Authorized} from 'type-graphql'
import { Comment } from '../comment/CommentSchema';
import { Post } from '../post/PostSchema';
import {prop as Property} from '@typegoose/typegoose'
import { RefType } from '../utils/utils';

@ObjectType()
export class User {
    @Field(type => ID)
    _id: string;

    @Property({required: true})
    @Field()
    name: string;

    @Property({required: true, unique: true})
    @Field()
    email: string; 

    @Property({required: true})
    @Field()
    password: string;

    @Property({ref: () => Post, default: []})
    @Field(type => [Post])
    posts: RefType<Post>[];

    @Property({ref: () => Comment, default: []})
    @Field(type => [Comment])
    comments: RefType<Comment>[];
}

@ObjectType()
export class AuthPayload {
    @Field(type => User)
    user: User;

    @Field()
    token: string;
}

@InputType()
export class CreateUserInput {
    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    password: string;
}

@InputType()
export class UpdateUserInput {
    @Field({nullable: true})
    name?: string;

    @Field({nullable: true})
    email?: string;

    @Field({nullable: true})
    password?: string;
}
