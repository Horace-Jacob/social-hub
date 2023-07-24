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
const AppDataSource_1 = require("../utils/AppDataSource");
const router = express_1.default.Router();
router.get("/searchall/:query", IsAuth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.params.query;
        if (query !== "" && query.length > 3) {
            const result = yield AppDataSource_1.AppDataSource.query(`
            SELECT
              'user' AS entity_type,
              u.id AS entity_id,
              u.username AS entity_text,
              u.photo AS entity_photo,
              (u."followingCount" + u."followerCount") * 2 + COALESCE(c."commentCount", 0) AS rank,
              u."createdAt" AS sort_date,
              NULL AS commentCount,
              NULL AS post_creator,
              NULL AS creator_photo,
              NULL AS creator_id,
              u."followerCount" as follower_count,
              NULL AS entity_points,
              NULL AS voteStatus,
              (CASE WHEN f."FromUser" IS NOT NULL THEN true ELSE false END) AS "isFollowing"
            FROM
              users u
            LEFT JOIN (
              SELECT
                "postId",
                COUNT(*) AS "commentCount"
              FROM
                comment
              GROUP BY
                "postId"
            ) AS c ON u.id = c."postId"
            LEFT JOIN follow f ON f."FromUser" = ${req.userId} AND f."ToUser" = u.id AND f."isDeleted" = false
            WHERE
              to_tsvector('english', u.username) @@ plainto_tsquery('english', $1)
            UNION

            SELECT
              'post' AS entity_type,
              p.id AS entity_id,
              p.about AS entity_text,
              NULL as entity_photo,
              p."commentCount" AS rank,
              p."createdAt" AS sort_date,
              p."commentCount",
              u.username as post_creator,
              u.photo as creator_photo,
              u.id as creator_id,
              NULL AS follower_count,
              p.points AS entity_points,
              v.value AS voteStatus,
              NULL AS "isFollowing"
            FROM
              post p
            LEFT JOIN users u ON p."creatorId" = u.id
            LEFT JOIN vote v ON v."userId" = ${req.userId} AND v."postId" = p.id
            WHERE
              to_tsvector('english', p.about) @@ plainto_tsquery('english', $1)

            ORDER BY rank DESC, sort_date DESC;
          `, [query]);
            res.json({
                success: true,
                message: "success",
                results: result,
            });
        }
    }
    catch (error) {
        res.json({ success: false, message: "Error", results: [] });
    }
}));
exports.default = router;
//# sourceMappingURL=SearchRoutes.js.map