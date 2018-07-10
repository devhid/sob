import request = require('request');
import auth = require('../auth_info');

export class StackOverflowClient {
    access_token: string;

    constructor(access_token : string) {
        this.access_token = access_token;
    }

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
        });
    }

    public getQuestions(minutes: number, callback: Function) : any {
        this.getEvents(minutes, (events: any) => {
            return callback(events.filter( (item: any) => item.event_type === 'question_posted'));
        });
    }
}
