import Slack = require('./client/slack_client');
import StackOverflow = require('./client/stackoverflow_client');

export class Bot {
    slackClient: any;
    soClient: any;

    updateInterval: number = 0.5; // minutes

    constructor(slack_access_token: string, so_access_token: string) {
        this.slackClient = new Slack.SlackClient(slack_access_token);
        this.soClient = new StackOverflow.StackOverflowClient(so_access_token);

        setInterval(() => {
            this.update();
        }, 1000 * 60 * this.updateInterval)
    }

    public update() : void {
        this.soClient.getQuestions(15, (questions: any) => {
            questions.forEach( (question: any) => {
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
                }, (body: any) => {
                    //console.log(body);
                })
            });
        });
    }
}
