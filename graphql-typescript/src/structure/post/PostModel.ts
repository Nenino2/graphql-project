import { getModelForClass } from '@typegoose/typegoose';
import { Post } from './PostSchema';

export const PostModel = getModelForClass(Post);