"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotEnv = __importStar(require("dotenv"));
const AppDataSource_1 = require("./utils/AppDataSource");
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const PostRoutes_1 = __importDefault(require("./routes/PostRoutes"));
const CommentRoutes_1 = __importDefault(require("./routes/CommentRoutes"));
const FollowRoutes_1 = __importDefault(require("./routes/FollowRoutes"));
const SearchRoutes_1 = __importDefault(require("./routes/SearchRoutes"));
dotEnv.config();
const PORT = process.env.PORT || 4000;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    AppDataSource_1.AppDataSource.initialize()
        .then(() => { })
        .catch((error) => {
        console.log(error);
    });
    app.use(body_parser_1.default.json({ limit: "30mb" }));
    app.use(body_parser_1.default.urlencoded({ limit: "30mb", extended: true }));
    app.set("trust proxy", 1);
    app.use((0, cors_1.default)({
        origin: "https://social-hub-two.vercel.app",
        credentials: true,
    }));
    app.use("/user", UserRoutes_1.default);
    app.use("/post", PostRoutes_1.default);
    app.use("/comment", CommentRoutes_1.default);
    app.use("/follow", FollowRoutes_1.default);
    app.use("/search", SearchRoutes_1.default);
    app.listen(PORT, () => {
        console.log(`Server has started running on PORT ${PORT}`);
    });
});
main();
//# sourceMappingURL=index.js.map