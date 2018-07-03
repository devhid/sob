import { Request, Response, NextFunction, Router } from 'express';

export default interface IRouter {
    router: Router;
    init(): void;
}
