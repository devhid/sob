import { Request, Response, NextFunction, Router } from 'express';

export class AuthRouter {
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

const authRouter = new AuthRouter();

export default authRouter.router;
