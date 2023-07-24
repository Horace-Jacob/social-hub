import express, { Response } from "express";
import { authMiddleware } from "../middleware/IsAuth";
import { CustomRequest, DataReturn } from "../utils/Interfaces";
import { Comment } from "../entities/Comment";
import { AppDataSource } from "../utils/AppDataSource";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const data: Comment = req.body;
      await AppDataSource.transaction(async (tm) => {
        tm.query(
          `
            insert into comment (comment, "userId", "postId") values ($1, $2, $3)
          `,
          [data.comment, req.userId, data.postId]
        );
        tm.query(
          `
            update post set "commentCount" = "commentCount" + 1
            where id = $1
          `,
          [data.postId]
        );
      });
      res.json({
        success: true,
        message: "success",
      } as DataReturn);
    } catch (error) {
      res.json({ success: false, message: error } as DataReturn);
    }
  }
);

router.get(
  "/getcommentbypost/:postId",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const postId: number = parseInt(req.params.postId);
      const result = await AppDataSource.query(
        `
        SELECT c.*, p."commentCount", JSON_BUILD_OBJECT('id', u.id, 'username', u.username, 'photo', u.photo) as creator
        FROM comment c
        LEFT JOIN post p ON p.id = c."postId"
        INNER JOIN users u on c."userId" = u.id
        WHERE c."postId" = ${postId} and c."isDeleted" = false
        ORDER By c."createdAt" DESC
        `
      );
      res.json({
        success: true,
        message: "success",
        results: result,
      } as DataReturn);
    } catch (error) {
      res.json({ success: false, message: "fail", results: [] } as DataReturn);
    }
  }
);

router.post(
  "/update",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    let result;
    try {
      const data: Comment = req.body;
      if (data.userId !== req.userId) {
        res.json({
          success: false,
          message: "You do not have permission to edit the comment",
        } as DataReturn);
      } else {
        const dataResult = await AppDataSource.createQueryBuilder()
          .update(Comment)
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
        } as DataReturn);
      }
    } catch (error) {
      res.json({ success: false, message: error } as DataReturn);
    }
  }
);

export default router;
