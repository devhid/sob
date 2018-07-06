/* External Imports */
import { Request, Response, NextFunction, Router } from 'express';
import request from 'request';

/* Internal Imports */
import IRouter from '../i_router';
import auth = require('../../auth_info');

export class StackOverflowAuthRouter implements IRouter {
    router: Router;
    access_token: string

    constructor() {
        this.router = Router();
        this.init();
    }

    public authorize(req: Request, res: Response, next: NextFunction) : void {
        const options = {
            url: 'https://stackoverflow.com/oauth',
            method: 'GET',
            form: {
                client_id: auth.SO_CLIENT_ID,
                scope: auth.SO_SCOPE,
                redirect_uri: auth.SO_REDIRECT_URI,
            }
        }

        request(options, (error: any, response: request.Response, body: any) => {
            if(!error && response.statusCode === 200) {
                console.log(response);
            }
        })
    }

    public access(req: Request, res: Response, next: NextFunction) : void {
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
                res.redirect('https://stackapps.com/');

            }
        });
    }

    init() {
        //this.router.get('/auth', this.authorize);
        this.router.get('/auth', this.access.bind(this));
    }
}

export default new StackOverflowAuthRouter().router;
