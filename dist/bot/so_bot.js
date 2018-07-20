"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Slack = require("../client/slack_client");
const StackOverflow = require("../client/stackoverflow_client");
const fs = require("fs");
const path = require("path");
const CONFIG_JSON = 'config.json';
class SOBot {
    constructor(slack_access_token, so_access_token) {
        this.slackClient = new Slack.SlackClient(slack_access_token);
        this.soClient = new StackOverflow.StackOverflowClient(so_access_token);
        this.loadConfig();
        setInterval(() => this.update(), 1000 * this.config.update_interval);
    }
    // Send the message to Slack every x number of seconds (updateInterval).
    update() {
        this.soClient.getQuestions(this.config.questions_since, (questions) => {
            questions.forEach((question) => this.postQuestion(question));
        });
    }
    // Gets the message format from the config, substitues the actual values, and
    // sends the actual message to Slack.
    sendMessage(channel, question) {
        let message = JSON.parse(JSON.stringify(this.config.message_format));
        message.text = message.text
            .replace(/{link}/g, question.link)
            .replace(/{title}/g, question.title);
        message.attachments.forEach((attachment, index) => {
            message.attachments[index].text = message.attachments[index].text
                .replace(/{excerpt}/g, question.excerpt)
                .replace(/{tags}/g, question.tags);
            message.attachments[index].footer = message.attachments[index].footer
                .replace(/{date_posted}/g, question.datePosted);
        });
        this.slackClient.sendMessage(channel, message, (body) => { });
    }
    // Creates a clean question object with all the necessary fields.
    createQuestion(rawQuestion, tagObject) {
        return this.finalQuestion = {
            title: rawQuestion.link.substr(rawQuestion.link.lastIndexOf('/') + 1),
            link: rawQuestion.link,
            excerpt: rawQuestion.excerpt,
            tags: Object.keys(tagObject).toString().replace(/,/g, ', '),
            datePosted: new Date(parseInt(rawQuestion.creation_date) * 1000).toLocaleString()
        };
    }
    // Handles the logic behind which questions get sent to which channel based on tags.
    postQuestion(rawQuestion) {
        this.soClient.getTags(rawQuestion.link, (tagObject) => {
            let cleanQuestion = this.createQuestion(rawQuestion, tagObject);
            this.config.channels.forEach((channel) => {
                if (channel.tags.some((tag) => tag in tagObject)) {
                    this.sendMessage(channel.name, cleanQuestion);
                }
            });
        });
    }
    // Loads the configuration object.
    loadConfig() {
        const config = path.join(__dirname, '..', '..', CONFIG_JSON);
        if (this.config === undefined) {
            this.config = JSON.parse(fs.readFileSync(config, 'utf-8'));
        }
    }
}
exports.SOBot = SOBot;
//# sourceMappingURL=so_bot.js.map