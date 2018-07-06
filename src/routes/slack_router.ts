/* External Imports */
import { Request, Response, NextFunction, Router } from 'express';
import request = require('request');

/* Internal Imports */
import IRouter from './i_router';
import auth = require('../auth_info');

export class SlackRouter implements IRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public authorize(req: Request, res: Response, next: NextFunction) : void {
        const options: any = {
            url: 'https://slack.com/oauth/authorize',
            method: 'GET',
            form: {
                client_id: auth.SLACK_CLIENT_ID,
                client_secret: auth.SLACK_CLIENT_SECRET,
                scope: auth.SLACK_SCOPE,
                redirect_uri: auth.SLACK_REDIRECT_URI,
                state: auth.SLACK_STATE,
            }
        };

        request(options, (error: any, response: request.Response, body: any) => {
            if(!error && response.statusCode === 200) {
                console.log(response);
            }
        });
    }

    public access(req: Request, res: Response, next: NextFunction) : void {
        const options: any = {
            url: 'https://slack.com/api/oauth.access',
            method: 'POST',
            form: {
                client_id: auth.SLACK_CLIENT_ID,
                client_secret: auth.SLACK_CLIENT_SECRET,
                redirect_uri: auth.SLACK_REDIRECT_URI,
                state: auth.SLACK_STATE,
                code: req.query.code
            }
        };

        request(options, (error: any, response: request.Response, body: any) => {
            if(!error && response.statusCode === 200) {
                this.redirect(JSON.parse(body).access_token, res);
            }
        });
    }

    private redirect(accessToken: string, res: Response) : void {
        request.post('https://slack.com/api/team.info', {form: {token: accessToken}}, (error: any, response: request.Response, body: any) => {
            if (!error && response.statusCode == 200) {
                let team = JSON.parse(body).team.domain;
                res.redirect('http://' + team + '.slack.com');
            }
        });
    }

    init() {
        this.router.get('/auth', this.access.bind(this));
    }

}

export default new SlackRouter().router;
