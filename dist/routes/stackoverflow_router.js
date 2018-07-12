"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* External Imports */
const express_1 = require("express");
const request = require("request");
const auth = require("../auth/auth_info");
class StackOverflowRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    // Auth request to retrieve access token from Stack Overflow.
    authorize(req, res, next) {
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
        };
        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                this.access_token = JSON.parse(body).access_token;
                res.json({ type: 'Success', message: successMessage });
            }
            else {
                res.json({ type: 'Error', message: errorMessage });
            }
        });
    }
    init() {
        this.router.get('/auth', this.authorize.bind(this));
    }
}
exports.StackOverflowRouter = StackOverflowRouter;
exports.default = new StackOverflowRouter();
//# sourceMappingURL=stackoverflow_router.js.map