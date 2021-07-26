import {ObjectType, Field, ID, InputType} from 'type-graphql'
import { Comment } from '../comment/CommentSchema';
import { MutationType } from '../common/CommonSchema';
import { User } from '../user/UserSchema';
import {prop as Property} from '@typegoose/typegoose'
import { RefType } from '../utils/utils';

@ObjectType()
export class Post {
    @Field(type => ID)
    _id: string;

    @Property({required: true})
    @Field()
    title: string;

    @Property({required: true})
    @Field()
    body: string;

    @Property({default: false})
    @Field()
    published: boolean;

    @Property({ref: () => User, required: true})
    @Field(type => User)
    author: RefType<User>;

    @Property({ref: () => Comment, default: []})
    @Field(type => [Comment])
    comments: RefType<Comment>[];
}

@ObjectType()
export class PostSubscriptionPayload {
    @Field(type => Post)
    post: Post;

    @Field(type => MutationType)
    mutation: MutationType;
}

@InputType()
export class CreatePostInput {
    @Field()
    title: string;

    @Field()
    body: string;

    @Field()
    published: boolean;
}

@InputType()
export class UpdatePostInput {
    @Field({nullable: true})
    title?: string;

    @Field({nullable: true})
    body?: string;

    @Field({nullable: true})
    published?: boolean;
}