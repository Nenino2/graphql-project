import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const getUserIdFromToken = (token: string): Promise<string | null> => {
	return new Promise((resolve) => {
        if (!token) resolve(null);
		jwt.verify(token, "mysecret", (error, decodedToken: { _id?: string }) => {
			if (error) return resolve(null);
			if (!decodedToken._id) return resolve(null);
			resolve(decodedToken._id);
		});
	});
}

export const getHashedPassword = async (plainPassword: string) => {
	return await bcrypt.hash(plainPassword, 10);
}

export const verifyPassword = bcrypt.compare;

export const getSignedJwt = async (userId: string) => {
	return jwt.sign({_id: userId}, "mysecret", {expiresIn: '1h'});
}

export type RefType<Schema> = Schema | string;