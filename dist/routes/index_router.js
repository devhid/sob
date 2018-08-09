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
    get403(req, res, next) {
        res.sendFile(path_1.default.join(__dirname, '..', '..', 'public', '403.html'));
    }
    get404(req, res, next) {
        res.sendFile(path_1.default.join(__dirname, '..', '..', 'public', '404.html'));
    }
    init() {
        this.router.get('/', this.getDefault);
        this.router.get('/forbidden', this.get403);
        this.router.get('*', this.get404);
    }
}
exports.IndexRouter = IndexRouter;
exports.default = new IndexRouter();
//# sourceMappingURL=index_router.js.map