"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* External Imports */
const express_1 = require("express");
const request_1 = __importDefault(require("request"));
const auth = require("../../auth_info");
class StackOverflowAuthRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    authorize(req, res, next) {
        const options = {
            url: 'https://stackoverflow.com/oauth',
            method: 'GET',
            form: {
                client_id: auth.SO_CLIENT_ID,
                scope: auth.SO_SCOPE,
                redirect_uri: auth.SO_REDIRECT_URI,
            }
        };
        request_1.default(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                console.log(response);
            }
        });
    }
    access(req, res, next) {
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
        request_1.default(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
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
exports.StackOverflowAuthRouter = StackOverflowAuthRouter;
exports.default = new StackOverflowAuthRouter().router;
//# sourceMappingURL=stackoverflow_auth_router.js.map