"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* External Imports */
const express_1 = require("express");
const request = require("request");
const auth = require("../../auth_info");
class SlackAuthRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    authorize(req, res, next) {
        const options = {
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
        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                console.log(response);
            }
        });
    }
    access(req, res, next) {
        const options = {
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
        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                this.redirect(JSON.parse(body).access_token, res);
            }
        });
    }
    redirect(accessToken, res) {
        request.post('https://slack.com/api/team.info', { form: { token: accessToken } }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let team = JSON.parse(body).team.domain;
                res.redirect('http://' + team + '.slack.com');
            }
        });
    }
    init() {
        //this.router.get('/auth', this.authorize);
        this.router.get('/auth', this.access.bind(this));
    }
}
exports.SlackAuthRouter = SlackAuthRouter;
exports.default = new SlackAuthRouter().router;
//# sourceMappingURL=slack_auth_router.js.map