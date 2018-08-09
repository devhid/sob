import { Request, Response, NextFunction, Router } from 'express';
import IRouter from './i_router';
import path from 'path';

export class IndexRouter implements IRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    // Default response for the server with no routes.
    public getDefault(req: Request, res: Response, next: NextFunction) : void {
        res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
    }

    public get403(req: Request, res: Response, next: NextFunction) : void {
        res.sendFile(path.join(__dirname, '..', '..', 'public', '403.html'));
    }

    public get404(req: Request, res: Response, next: NextFunction) : void {
        res.sendFile(path.join(__dirname, '..', '..', 'public', '404.html'));
    }

    init(): void {
        this.router.get('/', this.getDefault);
        this.router.get('/forbidden', this.get403);
        this.router.get('*', this.get404);
    }
}

export default new IndexRouter();
