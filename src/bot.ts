import Slack = require('./client/slack_client');
import StackOverflow = require('./client/stackoverflow_client');
import fs = require('fs');
import path = require('path');

const CONFIG_JSON : string = 'config.json';

export class Bot {
    slackClient: any;
    soClient: any;

    config: any;

    finalQuestion : any;

    constructor(slack_access_token: string, so_access_token: string) {
        this.slackClient = new Slack.SlackClient(slack_access_token);
        this.soClient = new StackOverflow.StackOverflowClient(so_access_token);

        this.loadConfig();

        setInterval(() => this.update(), 1000 * this.config.update_interval);
    }

    // Send the message to Slack every x number of seconds (updateInterval).
    private update() : void {
        this.soClient.getQuestions(this.config.questions_since, (questions: any) => {
            questions.forEach((question: any) => this.postQuestion(question));
        });
    }

    // Gets the message format from the config, substitues the actual values, and
    // sends the actual message to Slack.
    private sendMessage(channel: string, question: any) : void {
        let message = JSON.parse(JSON.stringify(this.config.message_format));
        message.text = message.text
            .replace(/{link}/g, question.link)
            .replace(/{title}/g, question.title);

        message.attachments.forEach((attachment: any, index: number) => {
            message.attachments[index].text = message.attachments[index].text
                .replace(/{excerpt}/g, question.excerpt)
                .replace(/{tags}/g, question.tags);

            message.attachments[index].footer = message.attachments[index].footer
                .replace(/{date_posted}/g, question.datePosted);

        });

        this.slackClient.sendMessage(channel, message, (body: any) => {});
    }

    // Creates a clean question object with all the necessary fields.
    private createQuestion(rawQuestion: any, tagObject: any) : any {
        return this.finalQuestion = {
            title: rawQuestion.link.substr(rawQuestion.link.lastIndexOf('/') + 1),
            link: rawQuestion.link,
            excerpt: rawQuestion.excerpt,
            tags: Object.keys(tagObject).toString().replace(/,/g, ', '),
            datePosted: new Date(parseInt(rawQuestion.creation_date) * 1000).toLocaleString()
        };
    }

    // Handles the logic behind which questions get sent to which channel based on tags.
    private postQuestion(rawQuestion: any) : void {
        this.soClient.getTags(rawQuestion.link, (tagObject: any) => {
            let cleanQuestion: any = this.createQuestion(rawQuestion, tagObject);

            this.config.channels.forEach((channel: any) => {
                if(channel.tags.some((tag: string) => tag in tagObject)) {
                    this.sendMessage(channel.name, cleanQuestion);
                }
            });
        });
    }

    // Loads the configuration object.
    private loadConfig() : void {
        const config = path.join(__dirname, '..', '..', CONFIG_JSON);
        if(this.config === undefined) {
            this.config = JSON.parse(fs.readFileSync(config, 'utf-8'));
        }
    }
}
