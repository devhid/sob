import { Request, Response, NextFunction, Router } from 'express';
import IRouter from './i_router';

export class IndexRouter implements IRouter {
    router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    public getDefault(req: Request, res: Response, next: NextFunction) : void {
        res.json({ message: 'Successful.' });
    }

    init(): void {
        this.router.get('/', this.getDefault);
    }
}

export default new IndexRouter();
