"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const auth = require("../auth_info");
class StackOverflowClient {
    constructor(access_token) {
        this.url = 'http://178.128.152.177';
        this.access_token = access_token;
    }
    getEvents(minutes, callback) {
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
                let events = JSON.parse(body).items;
                return callback(events);
            }
        });
    }
    getQuestions(minutes, callback) {
        this.getEvents(minutes, (events) => {
            return callback(events.filter((item) => item.event_type === 'question_posted'));
        });
    }
}
exports.StackOverflowClient = StackOverflowClient;
//# sourceMappingURL=stackoverflow_client.js.map