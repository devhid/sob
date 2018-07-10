"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Slack = require("./client/slack_client");
const StackOverflow = require("./client/stackoverflow_client");
class Bot {
    constructor(slack_access_token, so_access_token) {
        this.updateInterval = 0.5; // minutes
        this.slackClient = new Slack.SlackClient(slack_access_token);
        this.soClient = new StackOverflow.StackOverflowClient(so_access_token);
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
                // Replace this with configuration (specify specific channels and tags).
                this.slackClient.sendMessage('general', {
                    text: 'New Question Posted',
                    attachments: [
                        {
                            'title': title,
                            'title_link': link,
                            'text': excerpt,
                            'footer': 'Stack Overflow API',
                            'footer_icon': 'https://i.imgur.com/FzHXEPd.png'
                        }
                    ]
                }, (body) => {
                    //console.log(body);
                });
            });
        });
    }
}
exports.Bot = Bot;
//# sourceMappingURL=bot.js.map