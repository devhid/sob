"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Slack = require("./client/slack_client");
const StackOverflow = require("./client/stackoverflow_client");
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const request = require("request");
class Bot {
    constructor(slack_access_token, so_access_token) {
        this.updateInterval = 0.25; // minutes
        this.slackClient = new Slack.SlackClient(slack_access_token);
        this.soClient = new StackOverflow.StackOverflowClient(so_access_token);
        this.loadConfig();
        console.log(this.config);
        setInterval(() => {
            this.update();
        }, 1000 * 60 * this.updateInterval);
    }
    update() {
        this.soClient.getQuestions(15, (questions) => {
            questions.forEach((question) => {
                let excerpt = question.excerpt;
                let link = question.link;
                let title = link.substr(link.lastIndexOf('/') + 1);
                let date = question.creation_date;
                this.getTags(link, (tags) => {
                    this.config.channels.forEach((channel) => {
                        channel.tags.forEach((tag) => {
                            if (tag in tags) {
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
                                }, (body) => {
                                    //console.log(body);
                                });
                            }
                        });
                    });
                });
            });
        });
    }
    loadConfig() {
        const config = path.join(__dirname, '../', 'config.json');
        if (this.config === undefined) {
            this.config = JSON.parse(fs.readFileSync(config, 'utf-8'));
        }
    }
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
exports.Bot = Bot;
//# sourceMappingURL=bot.js.map