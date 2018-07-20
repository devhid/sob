"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
class IndexRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    // Default response for the server with no routes.
    getDefault(req, res, next) {
        res.sendFile(path_1.default.join(__dirname, '..', '..', 'public', 'index.html'));
    }
    init() {
        this.router.get('/', this.getDefault);
    }
}
exports.IndexRouter = IndexRouter;
exports.default = new IndexRouter();
//# sourceMappingURL=index_router.js.map