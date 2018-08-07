import request = require('request');
import auth = require('../auth/auth_info');
import cheerio = require('cheerio');

export class StackOverflowClient {
    access_token: string;

    constructor(access_token : string) {
        this.access_token = access_token;
    }

    // Returns the events that occurred on Stack Overflow since a specified
    // number of minutes ago.
    public getEvents(minutes: number, callback: Function) : any {
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
        }, (error: any, response: request.Response, body: any) => {
            if(!error && response.statusCode === 200) {
                let events = JSON.parse(body).items;
                return callback(events);
            }

            return callback(null);
        });
    }

    // Filters the events retrieved a specified minutes ago by questions.
    public getQuestions(minutes: number, callback: Function) : any {
        this.getEvents(minutes, (events: any) => {
            return callback(events === null ? null : events.filter( (item: any) => item.event_type === 'question_posted'));
        });
    }

    // Scrape the tags from a specified question link.
    public getTags(link: string, callback: Function) : any {
        request.get(link, (error: any, response: request.Response, body: any) => {
            const $ = cheerio.load(body);
            let tags: any = {};

            $('.post-tag').each( (index: any, element: any) => {
                const tag = $(element).text();
                if(!(tag in tags)) {
                    tags[$(element).text()] = true;
                }
            });

            return callback(tags);
        });
    }
}
