"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class IndexRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    getDefault(req, res, next) {
        res.json({ message: 'Successful.' });
    }
    init() {
        this.router.get('/', this.getDefault);
    }
}
exports.IndexRouter = IndexRouter;
exports.default = new IndexRouter().router;
