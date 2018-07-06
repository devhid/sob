/* External Imports */
import { Request, Response, NextFunction, Router } from 'express';
import request = require('request');

/* Internal Imports */
import IRouter from './i_router';
import auth = require('../auth_info');

export class StackOverflowRouter implements IRouter {
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
                res.redirect(options.form.redirect_uri);
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
                console.log(this.access_token);
                res.redirect('https://stackapps.com/');

            }
        });
    }

// https://stackoverflow.com/oauth?client_id=12765&scope=private_info&redirect_uri=http://178.128.152.177/stackoverflow/auth
    public getEvents(req: Request, res: Response, next: NextFunction) : any {
        const minutes: number = (req.params.minutes == null) ? 15 : req.params.minutes;

        request.get('https://api.stackexchange.com/2.2/events', {
            headers: {
                'Accept-Encoding': 'gzip'
            },
            form: {
                key: auth.SO_API_KEY,
                access_token: this.access_token,
                page: '1',
                pagesize: '10',
                since: (Math.floor((Date.now() / 1000)) - 60 * minutes).toString(),
                site: 'stackoverflow',
                filter: '!9Z(-x*8uy',
            },
            gzip: true,
        }, (error: any, response: request.Response, body: any) => {
            if(!error && response.statusCode === 200) {
                res.json(JSON.parse(body));
            }
        });
    }

    init() {
        this.router.get('/auth', this.access.bind(this));
        this.router.get('/events', this.getEvents.bind(this));
        this.router.get('/events/:minutes', this.getEvents.bind(this));
    }
}

export default new StackOverflowRouter().router;
