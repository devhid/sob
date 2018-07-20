import { Request, Response, NextFunction, Router } from 'express';
import IRouter from './i_router';
import path from 'path';

export class IndexRouter implements IRouter {
    router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    // Default response for the server with no routes.
    public getDefault(req: Request, res: Response, next: NextFunction) : void {
        res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
    }

    init(): void {
        this.router.get('/', this.getDefault);
    }
}

export default new IndexRouter();
