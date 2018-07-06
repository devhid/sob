/* External Imports */
import express = require('express');
import logger = require('morgan');
import bodyParser = require('body-parser');

/* Internal Imports */
import IndexRouter from './routes/index_router';
import SlackRouter from './routes/slack_router';
import StackOverflowRouter from './routes/stackoverflow_router';

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
    }

    // Configure middleware.
    private middleware() : void {
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    // Configure API endpoints (routing).
    private routes() : void {
        this.app.use('/', IndexRouter);
        this.app.use('/slack', SlackRouter);
        this.app.use('/stackoverflow', StackOverflowRouter);
    }

    // Start the server.
    private start() : void {
        this.app.listen(PORT, () => console.log('Server listening on port: %s', PORT));
    }
}

new SOB();
