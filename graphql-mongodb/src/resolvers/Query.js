import {getUserId} from '../utils/getUserId'
const Query = {
    async users(parent, args, { db }, info) {
        if (!args.query) {
            return db.User.find({});
        }

        return db.User.find({
            name: new RegExp(args.query, 'i')
        });
    },
    async posts(parent, args, { db }, info) {
        if (!args.query) {
            return db.Post.find({
                published: true
            }).skip(args.skip).limit(args.limit);
        }
        
        return db.Post.find({
            published: true,
            $or: [
                { title: new RegExp(args.query, 'i') },
                { body: new RegExp(args.query, 'i') }
            ]
        }).skip(args.skip).limit(args.limit);
    },
    async myPosts(parent, args, {db, request}, info) {
        const userId = getUserId(request)
        const query = {
            published: true,
            author: userId
        };
        if (args.query) {
            query.$or = [
                { title: new RegExp(args.query, 'i') },
                { body: new RegExp(args.query, 'i') }
            ]
        }
        return db.Post.find(query);
    },
    async comments(parent, args, { db, }, info) {
        return db.Comment.find({});
    },
    async me(parent, args, { db, request }, info) {
        const userId = getUserId(request)
        return db.User.findOne({_id: userId});
    },
    async post(parent, {id}, { db, request }, info) {
        const userId = getUserId(request, false)
        const query = {
           _id: id,
           $or: [
               { author: userId },
               { published: true }
           ]
        }
        const post = await db.Post.findOne(query);

        if (!post) {
            throw new Error('Post not found');
        }

        return post;
    }
}

export { Query as default }