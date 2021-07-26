import {ExpressContext} from 'apollo-server-express' 
import { Document } from 'mongoose';

export interface ContextType extends ExpressContext {
    req: ExpressContext["req"];
    res: ExpressContext["res"];
    currentUser?: Document;
}