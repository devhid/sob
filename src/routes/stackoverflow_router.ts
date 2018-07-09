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

    public getEventsDefault(req: Request, res: Response, next: NextFunction) : any {
        const minutes: number = 15;

        this.eventsRequest(res, minutes);
    }

    public getEvents(req: Request, res: Response, next: NextFunction) : any {
        const minutes: number = (req.params.minutes == undefined) ? 15 : req.params.minutes;

        this.eventsRequest(res, minutes);
    }

    private eventsRequest(res: Response, minutes: number) {
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
                let events = JSON.parse(body);
                res.json(events);
            }
        });
    }

    init() {
        this.router.get('/auth', this.authorize.bind(this));
        this.router.get('/events', this.getEventsDefault.bind(this));
        this.router.get('/events/:minutes', this.getEvents.bind(this));
    }
}

export default new StackOverflowRouter().router;
