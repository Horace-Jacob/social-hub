"use strict";
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
const express_1 = __importDefault(require("express"));
const IsAuth_1 = require("../middleware/IsAuth");
const Comment_1 = require("../entities/Comment");
const AppDataSource_1 = require("../utils/AppDataSource");
const router = express_1.default.Router();
router.post("/create", IsAuth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        yield AppDataSource_1.AppDataSource.transaction((tm) => __awaiter(void 0, void 0, void 0, function* () {
            tm.query(`
            insert into comment (comment, "userId", "postId") values ($1, $2, $3)
          `, [data.comment, req.userId, data.postId]);
            tm.query(`
            update post set "commentCount" = "commentCount" + 1
            where id = $1
          `, [data.postId]);
        }));
        res.json({
            success: true,
            message: "success",
        });
    }
    catch (error) {
        res.json({ success: false, message: error });
    }
}));
router.get("/getcommentbypost/:postId", IsAuth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = parseInt(req.params.postId);
        const result = yield AppDataSource_1.AppDataSource.query(`
        SELECT c.*, p."commentCount", JSON_BUILD_OBJECT('id', u.id, 'username', u.username, 'photo', u.photo) as creator
        FROM comment c
        LEFT JOIN post p ON p.id = c."postId"
        INNER JOIN users u on c."userId" = u.id
        WHERE c."postId" = ${postId} and c."isDeleted" = false
        ORDER By c."createdAt" DESC
        `);
        res.json({
            success: true,
            message: "success",
            results: result,
        });
    }
    catch (error) {
        res.json({ success: false, message: "fail", results: [] });
    }
}));
router.post("/update", IsAuth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        const data = req.body;
        if (data.userId !== req.userId) {
            res.json({
                success: false,
                message: "You do not have permission to edit the comment",
            });
        }
        else {
            const dataResult = yield AppDataSource_1.AppDataSource.createQueryBuilder()
                .update(Comment_1.Comment)
                .set({
                comment: data.comment,
            })
                .returning("*")
                .execute();
            result = dataResult.raw[0];
            res.json({
                success: true,
                results: result,
                message: "success",
            });
        }
    }
    catch (error) {
        res.json({ success: false, message: error });
    }
}));
exports.default = router;
//# sourceMappingURL=CommentRoutes.js.map