"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hello_router_1 = require("./routes/hello.router");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    process.stdout.write(`Server started on port: ${port}\n`);
});
app.use('/hello', hello_router_1.HelloRouteur);
