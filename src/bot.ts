import Slack = require('./client/slack_client');
import StackOverflow = require('./client/stackoverflow_client');
import fs = require('fs');
import path = require('path');
import cheerio = require('cheerio');
import request = require('request');

export class Bot {
    slackClient: any;
    soClient: any;

    config: any;

    updateInterval: number = 0.25; // minutes

    constructor(slack_access_token: string, so_access_token: string) {
        this.slackClient = new Slack.SlackClient(slack_access_token);
        this.soClient = new StackOverflow.StackOverflowClient(so_access_token);

        this.loadConfig();
        console.log(this.config);

        setInterval(() => {
            this.update();
        }, 1000 * 60 * this.updateInterval)
    }

    private update() : void {
        this.soClient.getQuestions(15, (questions: any) => {
            questions.forEach( (question: any) => {
                let excerpt: string = question.excerpt;
                let link: string = question.link;
                let title: string = link.substr(link.lastIndexOf('/') + 1);
                let date: string = question.creation_date;

                this.getTags(link, (tags: any) => {
                    this.config.channels.forEach((channel: any) => {
                        channel.tags.forEach((tag: string) => {
                            if(tag in tags) {
                                this.slackClient.sendMessage(channel.name, {
                                    text: `*Question*: <${link}|${title}>`,
                                    attachments: [
                                        {
                                            'text': '*Excerpt*: ' + excerpt + '\n' + '*Tags*: ' + Object.keys(tags).toString().replace(/,/g, ', '),
                                            'footer': 'Stack Overflow | ' + new Date(parseInt(date) * 1000).toLocaleString(),
                                            'footer_icon': 'https://i.imgur.com/FzHXEPd.png',
                                            'mrkdwn_in': ['text']
                                        }
                                    ]
                                }, (body: any) => {
                                    //console.log(body);
                                });
                            }
                        });
                    });
                });
            });
        });
    }

    private loadConfig() : void {
        const config = path.join(__dirname, '../', 'config.json');
        if(this.config === undefined) {
            this.config = JSON.parse(fs.readFileSync(config, 'utf-8'));
        }
    }

    private getTags(link: string, callback: Function) : any {
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
