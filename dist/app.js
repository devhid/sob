"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* External Imports */
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
/* Internal Imports */
const index_router_1 = require("./routes/index_router");
const auth_router_1 = require("./routes/auth_router");
/* The port the server will listen on. */
const PORT = 3000;
class SOB {
    constructor() {
        this.app = express();
        this.middleware();
        this.routes();
        this.start();
    }
    // Configure middleware.
    middleware() {
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    // Configure API endpoints (routing).
    routes() {
        this.app.use('/', index_router_1.default);
        this.app.use('/auth', auth_router_1.default);
    }
    // Start the server.
    start() {
        this.app.listen(PORT, () => console.log('Server listening on port: %s', PORT));
    }
}
new SOB();
