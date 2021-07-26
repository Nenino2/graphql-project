import mongoose from 'mongoose'
const { Schema } = mongoose;

const postSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    published: { type: Boolean, default: false },
    author: { type: Schema.Types.ObjectId },
});

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    posts: { type: Schema.Types.ObjectId, ref: 'Post' },
    comments: {type: Schema.Types.ObjectId, ref: 'Comment'},
    password: { type: String, required: true },
});

const commentSchema = new Schema({
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId},
    post: { type: Schema.Types.ObjectId},
})

const Post = mongoose.model('Post', postSchema);
const User = mongoose.model('User', userSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
    Post,
    User,
    Comment,
};