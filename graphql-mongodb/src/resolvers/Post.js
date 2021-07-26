const Post = {
    async author(parent, args, { db }, info) {
        return db.User.findById(parent.author);
    },
    async comments(parent, args, { db }, info) {
        return db.Comment.find({ post: parent.id });
    }
}

export { Post as default }