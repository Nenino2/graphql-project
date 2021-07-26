import {getUserId} from '../utils/getUserId'

const Subscription = {
    comment: {
        subscribe(parent, { postId }, { db, pubsub }, info){
            const post = db.Post.find({
                id: postId,
                published: true
            })

            if (!post) {
                throw new Error('Post not found')
            }

            return pubsub.asyncIterator(`comment ${postId}`)
        }
    },
    post: {
        subscribe(parent, args, { pubsub }, info) {
            return pubsub.asyncIterator('post')
        }
    },
    myPost: {
        subscribe(parent, args, {pubsub, request}, info) {
            const userId = getUserId(request);
            return pubsub.asyncIterator(`post-${userId}`)
        }
    }
}

export { Subscription as default }