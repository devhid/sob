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
                console.log("Could not find channel: '%s'", channel);
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

                console.log("sendMessage(): Unsuccessful HTTP request.");
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
                let channelObject = channels.find( (channel: any) => channel.name === channelName);

                if(!channelObject) {
                    console.log("Error obtaining channel id of channel: '%s'", channelName);
                }

                return callback(channelObject !== undefined && 'id' in channelObject ? channelObject.id : null);
            }

            console.log("getChannelId(): Unsuccessful HTTP request.");
            return callback(null);
        });
    }

    // Gets the user id of a user given their username.
    public getUserId(username: string, callback: Function) : any {
        const url = `https://slack.com/api/users.list?token=${this.access_token}`;

        request.get(url, (error: any, response: request.Response, body: any) => {
            if(!error && response.statusCode === 200) {
                let members = JSON.parse(body).members;
                let memberObject = members.find( (member: any) => member.name === username);

                if(!memberObject) {
                    console.log("Error obtaining member id of member: '%s'", username);
                }

                return callback(memberObject !== undefined && 'id' in memberObject ? memberObject.id : null);
            }

            console.log("getUserId(): Unsuccessful HTTP request.");
            return callback(null);
        });
    }
}
