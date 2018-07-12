"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* External Imports */
const express = require("express");
const prettify = require("express-prettify");
const logger = require("morgan");
const bodyParser = require("body-parser");
/* Internal Imports */
const index_router_1 = __importDefault(require("./routes/index_router"));
const slack_router_1 = __importDefault(require("./routes/slack_router"));
const stackoverflow_router_1 = __importDefault(require("./routes/stackoverflow_router"));
const Bot = require("./bot/so_bot");
/* The port the server will listen on. */
const PORT = 3000;
/* Seconds before server checks if it has received the slack and SO tokens. */
const TOKEN_INTERVAL = 10;
class SOB {
    constructor() {
        this.app = express();
        this.middleware();
        this.routes();
        this.start();
        this.update();
    }
    // Configure middleware.
    middleware() {
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(prettify({ query: 'pretty' }));
    }
    // Configure API endpoints (routing).
    routes() {
        this.app.use('/', index_router_1.default.router);
        this.app.use('/slack', slack_router_1.default.router);
        this.app.use('/stackoverflow', stackoverflow_router_1.default.router);
    }
    // Start the server.
    start() {
        this.app.listen(PORT, () => console.log('Server listening on port: %s', PORT));
    }
    // Check if the user authorized both on Stack Overflow and Slack.
    update() {
        let authCheck = setInterval(() => {
            let slackToken = slack_router_1.default.access_token;
            let soToken = stackoverflow_router_1.default.access_token;
            if (slackToken !== undefined && soToken !== undefined) {
                new Bot.SOBot(slackToken, soToken);
                clearInterval(authCheck);
            }
        }, 1000 * TOKEN_INTERVAL);
    }
}
new SOB();
//# sourceMappingURL=app.js.map