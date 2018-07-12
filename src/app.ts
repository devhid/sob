/* External Imports */
import express = require('express');
import prettify = require('express-prettify');
import logger = require('morgan');
import bodyParser = require('body-parser');

/* Internal Imports */
import IndexRouter from './routes/index_router';
import SlackRouter from './routes/slack_router';
import StackOverflowRouter from './routes/stackoverflow_router';
import Bot = require('./bot/so_bot');

/* The port the server will listen on. */
const PORT = 3000;

/* Seconds before server checks if it has received the slack and SO tokens. */
const TOKEN_INTERVAL = 10;

class SOB {
    // Express Application Instance
    public app: express.Application

    constructor() {
        this.app = express();
        this.middleware();
        this.routes();
        this.start();
        this.update();
    }

    // Configure middleware.
    private middleware() : void {
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(prettify({ query: 'pretty' }));
    }

    // Configure API endpoints (routing).
    private routes() : void {
        this.app.use('/', IndexRouter.router);
        this.app.use('/slack', SlackRouter.router);
        this.app.use('/stackoverflow', StackOverflowRouter.router);
    }

    // Start the server.
    private start() : void {
        this.app.listen(PORT, () => console.log('Server listening on port: %s', PORT));
    }

    // Check if the user authorized both on Stack Overflow and Slack.
    private update() : void {
        let authCheck = setInterval( () => {
            let slackToken = SlackRouter.access_token;
            let soToken = StackOverflowRouter.access_token;

            if(slackToken !== undefined && soToken !== undefined) {
                new Bot.SOBot(slackToken, soToken);

                clearInterval(authCheck);
            }
        }, 1000 * TOKEN_INTERVAL);
    }
}

new SOB();
