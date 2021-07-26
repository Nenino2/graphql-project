const Comment = {
    async author(parent, args, { db }, info) {
        return db.User.findById(parent.author);
    },
    async post(parent, args, { db }, info) {
        return db.Post.findById(parent.post);
    }
}

export { Comment as default }