import express, { Response } from "express";
import { authMiddleware } from "../middleware/IsAuth";
import { CustomRequest, DataReturn } from "../utils/Interfaces";
import { Follow } from "../entities/Follow";
import { AppDataSource } from "../utils/AppDataSource";

const router = express.Router();

router.get(
  "/getfollowing",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.userId;
      const result = await AppDataSource.query(
        `
      SELECT f.*,
             JSON_BUILD_OBJECT('id', u.id, 'username', u.username, 'photo', u.photo, 'followerCount', u."followerCount") AS creator
        FROM follow f
        INNER JOIN users u ON f."ToUser" = u.id
        WHERE f."FromUser" = $1
        AND f."isDeleted" = false
        ORDER BY f."createdAt" DESC;
      `,
        [userId] // Pass the userId as a parameter to avoid SQL injection
      );
      res.json({ success: true, results: result, message: "success" });
    } catch (error) {
      res.json({
        message: "fail",
        results: error,
        success: false,
      } as DataReturn);
    }
  }
);

router.post(
  "/create",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const data: Follow = req.body;
      const userId = req.userId;
      const hasAlreadyFollowed = await AppDataSource.getRepository(
        Follow
      ).findOneBy({
        FromUser: userId,
        ToUser: data.ToUser,
      });
      if (hasAlreadyFollowed === null && userId !== data.ToUser) {
        await AppDataSource.transaction(async (tm) => {
          await tm.query(
            `
                insert into follow ("FromUser", "ToUser") values ($1, $2)
            `,
            [userId, data.ToUser]
          );
          await tm.query(
            `
            update users set "followingCount" = "followingCount" + 1
            where id = $1
          `,
            [userId]
          );
          await tm.query(
            `
                update users set "followerCount" = "followerCount" + 1
                where id = $1
            `,
            [data.ToUser]
          );
        });
        res.json({ success: true, message: "success" } as DataReturn);
      } else {
        res.json({ success: false, message: "fail" } as DataReturn);
      }
    } catch (error) {
      res.json({ success: false, message: error } as DataReturn);
    }
  }
);

router.post(
  "/unfollow",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const data: Follow = req.body;
      const userId = req.userId;
      if (userId != data.ToUser) {
        await AppDataSource.transaction(async (tm) => {
          await tm.query(
            `
                delete from follow where "FromUser" = $1 and "ToUser" = $2
            `,
            [userId, data.ToUser]
          );
          await tm.query(
            `
            update users set "followingCount" = "followingCount" - 1
            where id = $1
          `,
            [userId]
          );
          await tm.query(
            `
                update users set "followerCount" = "followerCount" - 1
                where id = $1
            `,
            [data.ToUser]
          );
        });
        res.json({ success: true, message: "success" } as DataReturn);
      } else {
        res.json({ success: false, message: "fail" } as DataReturn);
      }
    } catch (error) {
      res.json({ success: false, message: error } as DataReturn);
    }
  }
);

export default router;
