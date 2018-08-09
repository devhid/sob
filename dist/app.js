"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* External Imports */
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const http = require("http");
const ioServer = require("socket.io");
/* Internal Imports */
const index_router_1 = __importDefault(require("./routes/index_router"));
const slack_auth_router_1 = __importDefault(require("./routes/slack_auth_router"));
const StackOverflowBot = require("./bot");
const auth = require("./auth/auth_info");
/* The port the server will listen on. */
const PORT = 3000;
/* Seconds before server checks if it has received the slack token. */
const TOKEN_INTERVAL = 10;
class SOB {
    constructor() {
        this.init();
        this.middleware();
        this.routes();
        this.start();
        this.update();
    }
    // Initialize fields.
    init() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.socket = ioServer(this.server);
    }
    // Configure middleware.
    middleware() {
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    // Configure API endpoints (routing).
    routes() {
        this.app.use('/slack', slack_auth_router_1.default.router);
        this.app.use('/', index_router_1.default.router);
    }
    // Start the server.
    start() {
        this.server.listen(PORT, () => {
            console.log('Server listening on port: %s', PORT);
        });
    }
    // Check if the user authorized on Slack.
    update() {
        let authCheck = setInterval(() => {
            let slackToken = slack_auth_router_1.default.access_token;
            if (slackToken !== undefined) {
                new StackOverflowBot.Bot(slackToken, auth.SO_ACCESS_TOKEN);
                clearInterval(authCheck);
            }
        }, 1000 * TOKEN_INTERVAL);
    }
}
new SOB();
//# sourceMappingURL=app.js.map