import {ObjectType, Field, ID, InputType} from 'type-graphql'
import { MutationType } from '../common/CommonSchema';
import { Post } from '../post/PostSchema';
import { User } from '../user/UserSchema'
import {prop as Property} from '@typegoose/typegoose'
import { RefType } from '../utils/utils';

@ObjectType()
export class Comment{
    @Field(type => ID)
    _id: string

    @Property({required: true})
    @Field()
    text: string

    @Property({ref: () => User, required: true})
    @Field(type => User)
    author: RefType<User>;

    @Property({ref: () => Post, required: true})
    @Field(type => Post)
    post: RefType<Post>;
}

@ObjectType()
export class CommentSubscriptionPayload {
    @Field(type => Comment)
    comment: Comment;

    @Field(type => MutationType)
    mutation: MutationType;
}


@InputType()
export class CreateCommentInput {
    @Field(type => ID)
    id: string

    @Field()
    text: string
}

@InputType()
export class UpdateCommentInput {
    @Field({nullable: true})
    text?: string
}