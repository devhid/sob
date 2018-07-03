import { Request, Response, NextFunction, Router } from 'express';
import IRouter from './i_router';

export class AuthRouter implements IRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public authorize(req: Request, res: Response, next: NextFunction) {
        res.send({ message: 'Authorized.' });
    }

    init() {
        this.router.get('/', this.authorize);
    }
}

export default new AuthRouter().router;
