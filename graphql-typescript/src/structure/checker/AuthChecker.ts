import { AuthChecker } from 'type-graphql';
import { ContextType } from '../context/ContextType';

export const customAuthChecker: AuthChecker<ContextType> = (
    { root, args, context, info },
    roles,
  ) => {
    if (context.currentUser) return true;
    return false;
  };