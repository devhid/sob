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
const Bot = require("./bot");
/* The port the server will listen on. */
const PORT = 3000;
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
    update() {
        let authCheck = setInterval(() => {
            console.log("Checking authorizations...");
            if (slack_router_1.default.access_token !== undefined && stackoverflow_router_1.default.access_token !== undefined) {
                console.log("Bot created.");
                let bot = new Bot.Bot(slack_router_1.default.access_token, stackoverflow_router_1.default.access_token);
                clearInterval(authCheck);
            }
        }, 1000 * 30);
    }
}
new SOB();
//# sourceMappingURL=app.js.map