import express, { Response } from "express";
import { authMiddleware } from "../middleware/IsAuth";
import { CustomRequest, DataReturn } from "../utils/Interfaces";
import { AppDataSource } from "../utils/AppDataSource";

const router = express.Router();

router.get(
  "/searchall/:query",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const query = req.params.query;
      if (query !== "" && query.length > 3) {
        const result = await AppDataSource.query(
          `
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
          `,
          [query]
        );
        res.json({
          success: true,
          message: "success",
          results: result,
        } as DataReturn);
      }
    } catch (error) {
      res.json({ success: false, message: "Error", results: [] } as DataReturn);
    }
  }
);

export default router;
