import { getUserId } from '../utils/getUserId';

const User = {
    email(parent, args, ctx, info) {
        const userId = getUserId(ctx.request, false);
        if (userId && userId === parent.id) {
            return parent.email;
        } 
        return null;
    },
    async posts(parent, args, { db }, info) {
        return db.Post.find({
            author: parent.id,
            published: true
        });
    },
    async comments(parent, args, { db }, info) {
        return db.Comment.find({
            author: parent.id
        });
    }
}

export { User as default }