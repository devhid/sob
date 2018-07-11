"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
class SlackClient {
    constructor(access_token) {
        this.access_token = null;
        this.access_token = access_token;
    }
    sendMessage(channel, message, callback) {
        let text = message.text;
        let attachments = message.attachments;
        this.getChannelId(channel, (channelId) => {
            const options = {
                url: 'https://slack.com/api/chat.postMessage',
                method: 'POST',
                form: {
                    token: this.access_token,
                    channel: channelId,
                    text: text,
                    attachments: JSON.stringify(attachments)
                }
            };
            request(options, (error, response, body) => {
                return callback(JSON.parse(body));
            });
        });
    }
    getChannelId(channelName, callback) {
        const url = `https://slack.com/api/channels.list?token=${this.access_token}`;
        request.get(url, (error, response, body) => {
            let channels = JSON.parse(body).channels;
            return callback(channels.find((channel) => channel.name === channelName).id);
        });
    }
}
exports.SlackClient = SlackClient;
//# sourceMappingURL=slack_client.js.map