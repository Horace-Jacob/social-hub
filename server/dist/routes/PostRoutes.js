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
const Post_1 = require("../entities/Post");
const AppDataSource_1 = require("../utils/AppDataSource");
const IsAuth_1 = require("../middleware/IsAuth");
const Vote_1 = require("../entities/Vote");
const router = express_1.default.Router();
router.post("/create", IsAuth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        const post = req.body;
        if (post.about !== null || post.about !== "") {
            const data = yield AppDataSource_1.AppDataSource.createQueryBuilder()
                .insert()
                .into(Post_1.Post)
                .values(Object.assign(Object.assign({}, post), { creatorId: req.userId }))
                .returning("*")
                .execute();
            result = data.raw[0];
            res.json({
                success: true,
                results: result,
                message: "success",
            });
        }
        else {
            res.json({
                success: true,
                results: [],
                message: "Please fill required data",
            });
        }
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, results: [], message: error });
    }
}));
router.get("/getssrdata", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        yield AppDataSource_1.AppDataSource.transaction((tm) => __awaiter(void 0, void 0, void 0, function* () {
            result = yield tm.query(`
              SELECT p.*,
                JSON_BUILD_OBJECT('id', u.id, 'username', u.username, 'photo', u.photo) AS creator
              FROM post p
              INNER JOIN users u ON p."creatorId" = u.id
              WHERE p."isDeleted" = false
              ORDER BY p."createdAt" DESC;
          `);
        }));
        res.json({
            success: true,
            results: result,
            message: "success",
        });
    }
    catch (error) {
        res.json({ success: false, message: error });
    }
}));
router.get("/getotherpostdata", IsAuth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        yield AppDataSource_1.AppDataSource.transaction((tm) => __awaiter(void 0, void 0, void 0, function* () {
            result = yield tm.query(`
              SELECT p.*,
                JSON_BUILD_OBJECT('id', u.id, 'username', u.username, 'photo', u.photo) AS creator,
                ${req.userId
                ? `(SELECT value FROM vote WHERE "userId" = ${req.userId} AND "postId" = p.id)`
                : 'null AS "voteStatus"'},
                CASE WHEN f.id IS NOT NULL THEN true ELSE false END AS "isFollowing"
              FROM post p
              INNER JOIN users u ON p."creatorId" = u.id
              LEFT JOIN follow f ON f."FromUser" = ${req.userId} AND f."ToUser" = u.id AND f."isDeleted" = false
              WHERE p."isDeleted" = false
              ORDER BY p."createdAt" DESC;
          `);
        }));
        res.json({
            success: true,
            results: result,
            message: "success",
        });
    }
    catch (error) {
        res.json({ success: false, message: error });
    }
}));
router.post("/update", IsAuth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    console.log(req.body);
    try {
        const post = req.body;
        const findPost = yield AppDataSource_1.AppDataSource.getRepository(Post_1.Post).findOneBy({
            id: post.id,
        });
        if (findPost !== null) {
            if (findPost.creatorId !== req.userId) {
                res.json({
                    success: false,
                    results: [],
                    message: "You do not have permissions to edit the post",
                });
            }
            const data = yield AppDataSource_1.AppDataSource.createQueryBuilder()
                .update(Post_1.Post)
                .set(Object.assign({}, post))
                .where("id = :id", { id: post.id })
                .returning("*")
                .execute();
            result = data.raw[0];
            res.json({
                success: true,
                results: result,
                message: "success",
            });
        }
        else {
            res.json({
                success: false,
                results: [],
                message: "Couldn't find post",
            });
        }
    }
    catch (error) {
        res.json({ success: false, results: [], message: error });
    }
}));
router.get("/userposts/:id", IsAuth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const result = yield AppDataSource_1.AppDataSource.query(`
                  SELECT p.*,
                    JSON_BUILD_OBJECT('id', u.id, 'username', u.username, 'photo', u.photo) AS creator,
                    ${req.userId
            ? `(SELECT value FROM vote WHERE "userId" = ${req.userId} AND "postId" = p.id)`
            : 'null AS "voteStatus"'},
                    CASE WHEN f.id IS NOT NULL THEN true ELSE false END AS "isFollowing"
                  FROM post p
                  INNER JOIN users u ON p."creatorId" = u.id
                  LEFT JOIN follow f ON f."FromUser" = ${req.userId} AND f."ToUser" = u.id AND f."isDeleted" = false
                  WHERE p."creatorId" = $1 AND p."isDeleted" = false
                  ORDER BY p."createdAt" DESC;
                `, [id]);
        if (result != null) {
            res.json({
                success: true,
                results: result,
                message: "success",
            });
        }
    }
    catch (error) {
        res.json({ success: false, results: [], message: error });
    }
}));
router.post("/vote", IsAuth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const isUpVote = data.value !== -1;
        const realValue = isUpVote ? 1 : -1;
        const undoValue = isUpVote ? -1 : 1;
        const userId = req.userId;
        const resetValue = 0;
        const existingVote = yield AppDataSource_1.AppDataSource.getRepository(Vote_1.Vote).findOneBy({
            postId: data.postId,
            userId: userId,
        });
        if (existingVote !== null &&
            existingVote.value !== realValue &&
            existingVote.value !== 0) {
            yield AppDataSource_1.AppDataSource.transaction((tm) => __awaiter(void 0, void 0, void 0, function* () {
                yield tm.query(`update vote set value = $1 where "postId" = $2 and "userId" = $3`, [realValue, data.postId, userId]);
                yield tm.query(`update post set points = points + $1 where id = $2`, [
                    realValue * 2,
                    data.postId,
                ]);
            }));
            res.json({ success: true, results: [], message: "success" });
        }
        else if (existingVote !== null && existingVote.value === 0) {
            yield AppDataSource_1.AppDataSource.transaction((tm) => __awaiter(void 0, void 0, void 0, function* () {
                yield tm.query(`
          update vote set value = $1 where "postId" = $2 and "userId" = $3
        `, [realValue, data.postId, userId]);
                yield tm.query(`
          update post set points = points + $1 where id = $2
        `, [realValue, data.postId]);
            }));
            res.json({ success: true, results: [], message: "success" });
        }
        else if (existingVote !== null && existingVote.value === realValue) {
            yield AppDataSource_1.AppDataSource.transaction((tm) => __awaiter(void 0, void 0, void 0, function* () {
                yield tm.query(`
          update vote set value = $1 where "postId" = $2 and "userId" = $3
        `, [resetValue, data.postId, userId]);
                yield tm.query(`
          update post set points = points + $1 where id = $2
        `, [undoValue, data.postId]);
            }));
            res.json({ success: true, results: [], message: "success" });
        }
        else {
            yield AppDataSource_1.AppDataSource.transaction((tm) => __awaiter(void 0, void 0, void 0, function* () {
                yield tm.query(`insert into vote (value, "postId", "userId") values ($1, $2, $3)`, [realValue, data.postId, userId]);
                yield tm.query(`update post set points = points + $1 where id = $2`, [
                    realValue,
                    data.postId,
                ]);
            }));
            res.json({ success: true, results: [], message: "success" });
        }
    }
    catch (error) {
        res.json({ success: false, results: [], message: error });
    }
}));
router.post("/delete/:id", IsAuth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const result = yield AppDataSource_1.AppDataSource.getRepository(Post_1.Post).findOneBy({
            id,
            isDeleted: false,
        });
        if (result != null) {
            if (result.creatorId !== req.userId) {
                res.json({
                    success: false,
                    results: [],
                    message: "You do not have permissions to edit the post",
                });
            }
            yield AppDataSource_1.AppDataSource.createQueryBuilder()
                .update(Post_1.Post)
                .set({
                isDeleted: true,
            })
                .where("id = :id", { id: id })
                .execute();
            res.json({
                success: true,
                message: "Post Deleted Successfully",
            });
        }
        else {
            res.json({
                success: false,
                message: "Could't find post",
            });
        }
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, results: [], message: error });
    }
}));
exports.default = router;
//# sourceMappingURL=PostRoutes.js.map