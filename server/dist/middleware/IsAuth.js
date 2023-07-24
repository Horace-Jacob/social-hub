"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, "jwtauthorization");
            req.userId = decoded.id;
            next();
        }
        catch (error) {
            res.json({ success: false, message: "Invalid Token" });
        }
    }
    else {
        res.send("Authorization header missing");
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=IsAuth.js.map