"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
class SlackClient {
    constructor(access_token) {
        this.access_token = null;
        this.access_token = access_token;
    }
    // Sends a message to a specified channel in slack.
    sendMessage(channel, message, callback) {
        let text = message.text;
        let attachments = message.attachments;
        this.getChannelId(channel, (channelId) => {
            if (!channelId) {
                console.log("Could not find channel: '%s'", channel);
                return callback(null);
            }
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
                if (!error && response.statusCode === 200) {
                    return callback(JSON.parse(body));
                }
                console.log("Error sending message to channel: '%s'", channel);
                return callback(null);
            });
        });
    }
    // Gets the channel id of a channel given its name.
    getChannelId(channelName, callback) {
        const url = `https://slack.com/api/channels.list?token=${this.access_token}`;
        request.get(url, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                let channels = JSON.parse(body).channels;
                let channel = channels.find((channel) => channel.name === channelName);
                if (!channel) {
                    console.log("Error obtaining channel id of channel: '%s'", channelName);
                }
                return callback(channel !== undefined && 'id' in channel ? channel.id : null);
            }
            console.log("Error obtaining channel id of channel: '%s'", channelName);
            return callback(null);
        });
    }
}
exports.SlackClient = SlackClient;
//# sourceMappingURL=slack_client.js.map