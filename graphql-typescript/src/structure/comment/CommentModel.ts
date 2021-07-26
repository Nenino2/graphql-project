import { getModelForClass } from '@typegoose/typegoose';
import { Comment } from './CommentSchema';

export const CommentModel = getModelForClass(Comment);