/* External Imports */
import express = require('express');
import logger = require('morgan');
import bodyParser = require('body-parser');
import http = require('http');
import ioServer = require('socket.io');

/* Internal Imports */
import IndexRouter from './routes/index_router';
import SlackAuthRouter from './routes/slack_auth_router';
import StackOverflowBot = require('./bot');
import auth = require('./auth/auth_info');

/* The port the server will listen on. */
const PORT: number = 3000;

/* Seconds before server checks if it has received the slack token. */
const TOKEN_INTERVAL: number = 10;

class SOB {
    // Express Application Instance
    public app: express.Application;
    public server: http.Server;
    public socket: ioServer.Server;

    constructor() {
        this.init();
        this.middleware();
        this.routes();
        this.start();
        this.update();
    }

    // Initialize fields.
    private init() : void {
        this.app = express();
        this.server = http.createServer(this.app);
        this.socket = ioServer(this.server);
    }

    // Configure middleware.
    private middleware() : void {
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    // Configure API endpoints (routing).
    private routes() : void {
        this.app.use('/slack', SlackAuthRouter.router);
        this.app.use('/', IndexRouter.router);
    }

    // Start the server.
    private start() : void {
        this.server.listen(PORT, () => {
            console.log('Server listening on port: %s', PORT);
        });
    }

    // Check if the user authorized on Slack.
    private update() : void {
        let authCheck = setInterval( () => {
            let slackToken = SlackAuthRouter.access_token;

            if(slackToken !== undefined) {
                new StackOverflowBot.Bot(slackToken, auth.SO_ACCESS_TOKEN);

                clearInterval(authCheck);
            }
        }, 1000 * TOKEN_INTERVAL);
    }
}

new SOB();
