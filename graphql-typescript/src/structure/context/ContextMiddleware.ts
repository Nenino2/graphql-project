
import {ExpressContext} from 'apollo-server-express' 
import { UserModel } from '../user/UserModel';
import { getUserIdFromToken } from '../utils/utils';
import { ContextType } from './ContextType';

export async function context({req, res}: ExpressContext): Promise<ContextType> {
    const contextData: ContextType = {req, res};
    const currentUserId = await getUserIdFromToken(req.headers.authorization.split(' ')[1]);
    if (currentUserId) {
        const currentUser = await UserModel.findById(currentUserId);
        if (currentUser) {
            contextData.currentUser = currentUser;
        }
    }
    return contextData;
}