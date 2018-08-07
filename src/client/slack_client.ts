import request = require('request');

export class SlackClient {
    access_token: string = null;

    constructor(access_token : string) {
        this.access_token = access_token;
    }

    // Sends a message to a specified channel in slack.
    public sendMessage(channel: string, message: any, callback: Function) : any {
        let text = message.text;
        let attachments = message.attachments;

        this.getChannelId(channel, (channelId: any) => {
            if(!channelId) {
                return callback(null);
            }

            const options: any = {
                url: 'https://slack.com/api/chat.postMessage',
                method: 'POST',
                form: {
                    token: this.access_token,
                    channel: channelId,
                    text: text,
                    attachments: JSON.stringify(attachments)
                }
            };

            request(options, (error: any, response: request.Response, body: any) => {
                if(!error && response.statusCode === 200) {
                    return callback(JSON.parse(body));
                }

                return callback(null);
            });
        });
    }

    // Gets the channel id of a channel given its name.
    public getChannelId(channelName: string, callback: Function) : any {
        const url = `https://slack.com/api/channels.list?token=${this.access_token}`;

        request.get(url, (error: any, response: request.Response, body: any) => {
            if(!error && response.statusCode === 200) {
                let channels = JSON.parse(body).channels;
                let channel = channels.find( (channel: any) => channel.name === channelName);

                return callback('id' in channel ? channel.id : null);
            }
        });
    }
}
