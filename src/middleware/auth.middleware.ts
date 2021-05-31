import { NextFunction, Response, Request } from 'express';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import * as jwt from 'jsonwebtoken';

async function authMiddleware(request: Request, response: Response, next: NextFunction) {

  if (request.headers.authorization) {
    
    const bearer = request.headers.authorization.split(' ');
    const bearerToken = bearer[1];
    try {
      const decoded: any = jwt.verify(bearerToken, 'shhhhh');
    } catch(err) {
      next(new NotAuthorizedException());
    }
    next();
  } else {
    next(new NotAuthorizedException());
  }
}
export default authMiddleware;
