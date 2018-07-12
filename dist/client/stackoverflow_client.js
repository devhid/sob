"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const auth = require("../auth/auth_info");
const cheerio = require("cheerio");
class StackOverflowClient {
    constructor(access_token) {
        this.access_token = access_token;
    }
    // Returns the events that occurred on Stack Overflow since a specified
    // number of minutes ago.
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
    // Filters the events retrieved a specified minutes ago by questions.
    getQuestions(minutes, callback) {
        this.getEvents(minutes, (events) => {
            return callback(events.filter((item) => item.event_type === 'question_posted'));
        });
    }
    // Scrape the tags from a specified question link.
    getTags(link, callback) {
        request.get(link, (error, response, body) => {
            const $ = cheerio.load(body);
            let tags = {};
            $('.post-tag').each((index, element) => {
                const tag = $(element).text();
                if (!(tag in tags)) {
                    tags[$(element).text()] = true;
                }
            });
            return callback(tags);
        });
    }
}
exports.StackOverflowClient = StackOverflowClient;
//# sourceMappingURL=stackoverflow_client.js.map