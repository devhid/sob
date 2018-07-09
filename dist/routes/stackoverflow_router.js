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
    getEventsDefault(req, res, next) {
        const minutes = 15;
        this.eventsRequest(res, minutes);
    }
    getEvents(req, res, next) {
        const minutes = (req.params.minutes == undefined) ? 15 : req.params.minutes;
        this.eventsRequest(res, minutes);
    }
    eventsRequest(res, minutes) {
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
exports.StackOverflowRouter = StackOverflowRouter;
exports.default = new StackOverflowRouter().router;
//# sourceMappingURL=stackoverflow_router.js.map