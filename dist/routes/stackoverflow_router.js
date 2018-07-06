"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* External Imports */
const express_1 = require("express");
const request = require("request");
const auth = require("../auth_info");
class StackOverflowRouter {
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
        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                res.redirect(options.form.redirect_uri);
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
        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                this.access_token = JSON.parse(body).access_token;
                console.log(this.access_token);
                res.redirect('https://stackapps.com/');
            }
        });
    }
    // https://stackoverflow.com/oauth?client_id=12765&scope=private_info&redirect_uri=http://178.128.152.177/stackoverflow/auth
    getEvents(req, res, next) {
        const minutes = (req.params.minutes == null) ? 15 : req.params.minutes;
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
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
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
exports.StackOverflowRouter = StackOverflowRouter;
exports.default = new StackOverflowRouter().router;
//# sourceMappingURL=stackoverflow_router.js.map