/* External Imports */
import { Request, Response, NextFunction, Router } from 'express';
import request = require('request');

/* Internal Imports */
import IRouter from './i_router';
import auth = require('../auth/auth_info');

export class StackOverflowRouter implements IRouter {
    router: Router;
    access_token: string

    constructor() {
        this.router = Router();
        this.init();
    }

    // Auth request to retrieve access token from Stack Overflow.
    public authorize(req: Request, res: Response, next: NextFunction) : void {
        const successMessage = 'Authorized. You may close this window.';
        const errorMessage = 'Could not authenticate properly.';

        const options = {
            url: 'https://stackoverflow.com/oauth/access_token/json',
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'charset': 'utf-8'
            },
            form: {
                client_id: auth.SO_CLIENT_ID,
                client_secret: auth.SO_CLIENT_SECRET,
                redirect_uri: auth.SO_REDIRECT_URI,
                code: req.query.code
            }
        }

        request(options, (error: any, response: request.Response, body: any) => {
            if(!error && response.statusCode === 200) {
                this.access_token = JSON.parse(body).access_token;
                res.json({ type: 'Success', message: successMessage });
            } else {
                res.json({ type: 'Error', message: errorMessage });
            }
        });
    }

    init() : void {
        this.router.get('/auth', this.authorize.bind(this));
    }
}

export default new StackOverflowRouter();
