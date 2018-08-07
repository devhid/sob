/* External Imports */
import { Request, Response, NextFunction, Router } from 'express';
import request = require('request');
import ioClient = require('socket.io-client');

/* Internal Imports */
import IRouter from './i_router';
import auth = require('../auth/auth_info');

export class SlackAuthRouter implements IRouter {
    router: Router;
    access_token: string;

    constructor() {
        this.router = Router();
        this.init();
    }

    // Auth request to retrieve access token from Slack.
    public authorize(req: Request, res: Response, next: NextFunction) : void {
        if(req.query.error === 'access_denied') {
            res.redirect(auth.SOB_BLUEMIX);
            return;
        }

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
                this.access_token = JSON.parse(body).access_token;

                this.redirect(this.access_token, res);
            }
        });
    }

    // Redirect the user to the team slack workspace after authentication succeeds.
    private redirect(accessToken: string, res: Response) : void {
        this.getTeamName(accessToken, (teamName: string) => {
            res.redirect(`http://${teamName}.slack.com`);
        });
    }

    private getTeamName(accessToken : string, callback: Function) : any {
        request.post(`https://slack.com/api/team.info?token=${accessToken}`, (error: any, response: request.Response, body: any) => {
            if (!error && response.statusCode === 200) {
                let team = JSON.parse(body).team.domain;
                return callback(team);
            }
        });
    }

    init() : void {
        this.router.get('/auth', this.authorize.bind(this));
    }

}

export default new SlackAuthRouter();
