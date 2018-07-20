"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* External Imports */
const express_1 = require("express");
const request = require("request");
const ioClient = require("socket.io-client");
const auth = require("../auth/auth_info");
class SlackAuthRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    // Auth request to retrieve access token from Slack.
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
                this.authorizeClient();
                this.redirect(this.access_token, res);
            }
        });
    }
    // Redirect the user to the team slack workspace after authentication succeeds.
    redirect(accessToken, res) {
        this.getTeamName(accessToken, (teamName) => {
            res.redirect(`http://${teamName}.slack.com`);
        });
    }
    getTeamName(accessToken, callback) {
        request.post(`https://slack.com/api/team.info?token=${accessToken}`, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let team = JSON.parse(body).team.domain;
                return callback(team);
            }
        });
    }
    authorizeClient() {
        let client = ioClient.connect('http://localhost:3000');
        client.emit('authorization', 'A client has authorized the application.');
    }
    init() {
        this.router.get('/auth', this.authorize.bind(this));
    }
}
exports.SlackAuthRouter = SlackAuthRouter;
exports.default = new SlackAuthRouter();
//# sourceMappingURL=slack_auth_router.js.map