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
const Follow_1 = require("../entities/Follow");
const AppDataSource_1 = require("../utils/AppDataSource");
const router = express_1.default.Router();
router.get("/getfollowing", IsAuth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const result = yield AppDataSource_1.AppDataSource.query(`
      SELECT f.*,
             JSON_BUILD_OBJECT('id', u.id, 'username', u.username, 'photo', u.photo, 'followerCount', u."followerCount") AS creator
        FROM follow f
        INNER JOIN users u ON f."ToUser" = u.id
        WHERE f."FromUser" = $1
        AND f."isDeleted" = false
        ORDER BY f."createdAt" DESC;
      `, [userId]);
        res.json({ success: true, results: result, message: "success" });
    }
    catch (error) {
        res.json({
            message: "fail",
            results: error,
            success: false,
        });
    }
}));
router.post("/create", IsAuth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const userId = req.userId;
        const hasAlreadyFollowed = yield AppDataSource_1.AppDataSource.getRepository(Follow_1.Follow).findOneBy({
            FromUser: userId,
            ToUser: data.ToUser,
        });
        if (hasAlreadyFollowed === null && userId !== data.ToUser) {
            yield AppDataSource_1.AppDataSource.transaction((tm) => __awaiter(void 0, void 0, void 0, function* () {
                yield tm.query(`
                insert into follow ("FromUser", "ToUser") values ($1, $2)
            `, [userId, data.ToUser]);
                yield tm.query(`
            update users set "followingCount" = "followingCount" + 1
            where id = $1
          `, [userId]);
                yield tm.query(`
                update users set "followerCount" = "followerCount" + 1
                where id = $1
            `, [data.ToUser]);
            }));
            res.json({ success: true, message: "success" });
        }
        else {
            res.json({ success: false, message: "fail" });
        }
    }
    catch (error) {
        res.json({ success: false, message: error });
    }
}));
router.post("/unfollow", IsAuth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const userId = req.userId;
        if (userId != data.ToUser) {
            yield AppDataSource_1.AppDataSource.transaction((tm) => __awaiter(void 0, void 0, void 0, function* () {
                yield tm.query(`
                delete from follow where "FromUser" = $1 and "ToUser" = $2
            `, [userId, data.ToUser]);
                yield tm.query(`
            update users set "followingCount" = "followingCount" - 1
            where id = $1
          `, [userId]);
                yield tm.query(`
                update users set "followerCount" = "followerCount" - 1
                where id = $1
            `, [data.ToUser]);
            }));
            res.json({ success: true, message: "success" });
        }
        else {
            res.json({ success: false, message: "fail" });
        }
    }
    catch (error) {
        res.json({ success: false, message: error });
    }
}));
exports.default = router;
//# sourceMappingURL=FollowRoutes.js.map