import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {getUserId} from '../utils/getUserId'

const Mutation = {
    async createUser(parent, args, { db }, info) {
        if (args.data.password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }

        const password = await bcrypt.hash(args.data.password, 10);

        const user = new db.User({
            ...args.data,
            password
        })
        await user.save();

        return {
            user,
            token: jwt.sign({userId: user._id}, "mysecret", {expiresIn: '1h'})
        }
    },
    async login(parent, {email, password}, {db}, info) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const user = await db.User.findOne({email});
        if (!user) {
            throw new Error('User not found');
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error('Incorrect password');
        }

        return {
            user,
            token: jwt.sign({userId: user._id}, "mysecret", {expiresIn: '1h'})
        }
    },
    async deleteUser(parent, args, { db, request }, info) {
        const userId = getUserId(request)
        const user = await db.User.findById(userId)
        await user.remove();

        const posts = await db.Post.find({ author: userId })
        
        for (let post of posts) {
            const comments = await db.Comment.find({ post: post.id })
            for (let comment of comments) {
                await comment.remove()
            }
            await post.remove()
        }

        const comments = await db.Comment.find({ author: userId })
        
        for (let comment of comments) {
            await comment.remove()
        }

        return user;
    },
    async updateUser(parent, args, { db, request }, info) {
        const userId = getUserId(request)
        const { data } = args;
        const user = await db.User.findById(userId)

        if (!user) {
            throw new Error('User not found')
        }

        if (typeof data.email === 'string') {
            user.email = data.email
        }

        if (typeof data.name === 'string') {
            user.name = data.name
        }

        if (typeof data.age !== 'undefined') {
            user.age = data.age
        }

        if (typeof data.password === 'string') {
            if (data.password.length < 8) {
                throw new Error('Password must be at least 8 characters long');
            }
            const password = await bcrypt.hash(data.password, 10);
            user.password = password
        }

        await user.save()

        return user
    },
    async createPost(parent, args, { db, pubsub, request }, info) {
        const userId = getUserId(request)
        const user = await db.User.findById(userId);
        if (!user) {
            throw new Error('User not found')
        }
        const post = new db.Post({
            ...args.data,
            author: user.id
        })

        await post.save()

        if (args.data.published) {
            pubsub.publish('post', { 
                post: {
                    mutation: 'CREATED',
                    data: post
                }
             })
        }

        pubsub.publish(`post-${post.author}`, { 
            post: {
                mutation: 'CREATED',
                data: post
            }
         })

        return post
    },
    async deletePost(parent, args, { db, pubsub, request }, info) {
        const userId = getUserId(request)
        const post = await db.Post.findOne({_id: args.id, author: userId});

        if (!post) {
            throw new Error('Post not found')
        }

        await post.remove()
        
        const comments = await db.Comment.find({ post: args.id })

        for (let comment of comments) {
            await comment.remove()
        }

        if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        }
        pubsub.publish(`post-${post.author}`, {
            post: {
                mutation: 'DELETED',
                data: post
            }
        })

        return post
    },
    async updatePost(parent, args, { db, pubsub, request }, info) {
        const userId = getUserId(request);
        const { id, data } = args
        const post = await db.Post.findOne({_id: id, author: userId});

        if (!post) {
            throw new Error('Post not found')
        }

        if (typeof data.title === 'string') {
            post.title = data.title
        }

        if (typeof data.body === 'string') {
            post.body = data.body
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published

            if (originalPost.published && !post.published) {

                // delete all comments of this post
                const comments = await db.Comment.find({ post: id })
                for (let comment of comments) {
                    await comment.remove()
                }

                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            } else if (!originalPost.published && post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }
        } else if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }
        pubsub.publish(`post-${post.author}`, {
            post: {
                mutation: 'UPDATED',
                data: post
            }
        })

        await post.save()

        return post
    },
    async createComment(parent, args, { db, pubsub, request }, info) {
        const userId = getUserId(request);
        const user = await db.User.findById(userId);
        if (!user) {
            throw new Error('User not found')
        }

        const post = await db.Post.findOne({_id:args.data.post,published: true} );
        if (!post) {
            throw new Error('Post not found')
        }
        if (!post.published) {
            throw new Error('Post is not published')
        }

        const comment = new db.Comment({
            ...args.data,
            author: userId
        })

        await comment.save()

        pubsub.publish(`comment ${args.data.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        })

        return comment
    },
    async deleteComment(parent, args, { db, pubsub,request }, info) {
        const userId = getUserId(request);
        const comment = await db.Comment.findOne({_id: args.id, author: userId})
        await comment.remove()

        pubsub.publish(`comment ${deletedComment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: deletedComment
            }
        })

        return deletedComment
    },
    async updateComment(parent, args, { db,pubsub, request }, info) {
        const userId = getUserId(request);
        const { id, data } = args
        const comment = await db.Comment.findById({_id: id, author: userId})

        if (!comment) {
            throw new Error('Comment not found')
        }

        if (typeof data.text === 'string') {
            comment.text = data.text
        }

        await comment.save()

        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })

        return comment
    }
}

export { Mutation as default }