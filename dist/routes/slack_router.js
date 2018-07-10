"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* External Imports */
const express_1 = require("express");
const request = require("request");
const auth = require("../auth_info");
class SlackRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    authorize(req, res, next) {
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
                this.access_token = JSON.parse(body).access_token;
                this.redirect(this.access_token, res);
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
        this.router.get('/auth', this.authorize.bind(this));
    }
}
exports.SlackRouter = SlackRouter;
exports.default = new SlackRouter();
//# sourceMappingURL=slack_router.js.map