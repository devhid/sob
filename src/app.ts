/* External Imports */
import express = require('express');
import prettify = require('express-prettify');
import logger = require('morgan');
import bodyParser = require('body-parser');

/* Internal Imports */
import IndexRouter from './routes/index_router';
import SlackRouter from './routes/slack_router';
import StackOverflowRouter from './routes/stackoverflow_router';
import Bot = require('./bot');

/* The port the server will listen on. */
const PORT = 3000;

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

    private update() : void {
        let authCheck = setInterval( () => {
            let slackToken = SlackRouter.access_token;
            let soToken = StackOverflowRouter.access_token;

            if(slackToken !== undefined && soToken !== undefined) {
                let bot = new Bot.Bot(slackToken, soToken);

                clearInterval(authCheck);
            }
        }, 1000 * 30);
    }
}

new SOB();
