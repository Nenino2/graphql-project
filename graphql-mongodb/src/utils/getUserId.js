import jwt from 'jsonwebtoken';

export const getUserId = ({request, connection}, requireAuth = true) => {
    const authorization = request ? request.headers.authorization : connection.context.Authorization;
    
    if (authorization) {
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, "mysecret");
        return decoded.userId;
    }

    if (requireAuth) {
        throw new Error('Unauthorized');
    }

    return null;
}