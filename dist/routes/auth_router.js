"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class AuthRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    authorize(req, res, next) {
        res.send({ message: 'Authorized.' });
    }
    init() {
        this.router.get('/', this.authorize);
    }
}
exports.AuthRouter = AuthRouter;
const authRouter = new AuthRouter();
exports.default = authRouter.router;
