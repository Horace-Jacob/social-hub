import express, { Response } from "express";
import { CustomRequest, DataReturn } from "../utils/Interfaces";
import { Post } from "../entities/Post";
import { AppDataSource } from "../utils/AppDataSource";
import { authMiddleware } from "../middleware/IsAuth";
import { Vote } from "../entities/Vote";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    let result;
    try {
      const post: Post = req.body;

      if (post.about !== null || post.about !== "") {
        const data = await AppDataSource.createQueryBuilder()
          .insert()
          .into(Post)
          .values({
            ...post,
            creatorId: req.userId,
          })
          .returning("*")
          .execute();
        result = data.raw[0];
        res.json({
          success: true,
          results: result,
          message: "success",
        } as DataReturn);
      } else {
        res.json({
          success: true,
          results: [],
          message: "Please fill required data",
        } as DataReturn);
      }
    } catch (error) {
      console.log(error);
      res.json({ success: false, results: [], message: error } as DataReturn);
    }
  }
);

router.get("/getssrdata", async (_: CustomRequest, res: Response) => {
  let result;
  try {
    await AppDataSource.transaction(async (tm) => {
      result = await tm.query(`
              SELECT p.*,
                JSON_BUILD_OBJECT('id', u.id, 'username', u.username, 'photo', u.photo) AS creator
              FROM post p
              INNER JOIN users u ON p."creatorId" = u.id
              WHERE p."isDeleted" = false
              ORDER BY p."createdAt" DESC;
          `);
    });

    res.json({
      success: true,
      results: result,
      message: "success",
    } as DataReturn);
  } catch (error) {
    res.json({ success: false, message: error } as DataReturn);
  }
});

router.get(
  "/getotherpostdata",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    let result;
    try {
      await AppDataSource.transaction(async (tm) => {
        result = await tm.query(`
              SELECT p.*,
                JSON_BUILD_OBJECT('id', u.id, 'username', u.username, 'photo', u.photo) AS creator,
                ${
                  req.userId
                    ? `(SELECT value FROM vote WHERE "userId" = ${req.userId} AND "postId" = p.id)`
                    : 'null AS "voteStatus"'
                },
                CASE WHEN f.id IS NOT NULL THEN true ELSE false END AS "isFollowing"
              FROM post p
              INNER JOIN users u ON p."creatorId" = u.id
              LEFT JOIN follow f ON f."FromUser" = ${
                req.userId
              } AND f."ToUser" = u.id AND f."isDeleted" = false
              WHERE p."isDeleted" = false
              ORDER BY p."createdAt" DESC;
          `);
      });

      res.json({
        success: true,
        results: result,
        message: "success",
      } as DataReturn);
    } catch (error) {
      res.json({ success: false, message: error } as DataReturn);
    }
  }
);

router.post(
  "/update",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    let result;
    console.log(req.body);
    try {
      const post: Post = req.body;

      const findPost = await AppDataSource.getRepository(Post).findOneBy({
        id: post.id,
      });
      if (findPost !== null) {
        if (findPost.creatorId !== req.userId) {
          res.json({
            success: false,
            results: [],
            message: "You do not have permissions to edit the post",
          } as DataReturn);
        }
        const data = await AppDataSource.createQueryBuilder()
          .update(Post)
          .set({
            ...post,
          })
          .where("id = :id", { id: post.id })
          .returning("*")
          .execute();
        result = data.raw[0];
        res.json({
          success: true,
          results: result,
          message: "success",
        } as DataReturn);
      } else {
        res.json({
          success: false,
          results: [],
          message: "Couldn't find post",
        } as DataReturn);
      }
    } catch (error) {
      res.json({ success: false, results: [], message: error } as DataReturn);
    }
  }
);

router.get(
  "/userposts/:id",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);

      const result = await AppDataSource.query(
        `
                  SELECT p.*,
                    JSON_BUILD_OBJECT('id', u.id, 'username', u.username, 'photo', u.photo) AS creator,
                    ${
                      req.userId
                        ? `(SELECT value FROM vote WHERE "userId" = ${req.userId} AND "postId" = p.id)`
                        : 'null AS "voteStatus"'
                    },
                    CASE WHEN f.id IS NOT NULL THEN true ELSE false END AS "isFollowing"
                  FROM post p
                  INNER JOIN users u ON p."creatorId" = u.id
                  LEFT JOIN follow f ON f."FromUser" = ${
                    req.userId
                  } AND f."ToUser" = u.id AND f."isDeleted" = false
                  WHERE p."creatorId" = $1 AND p."isDeleted" = false
                  ORDER BY p."createdAt" DESC;
                `,
        [id]
      );

      if (result != null) {
        res.json({
          success: true,
          results: result,
          message: "success",
        } as DataReturn);
      }
    } catch (error) {
      res.json({ success: false, results: [], message: error } as DataReturn);
    }
  }
);

router.post(
  "/vote",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const data: Vote = req.body;
      const isUpVote = data.value !== -1;
      const realValue = isUpVote ? 1 : -1;
      const undoValue = isUpVote ? -1 : 1;
      const userId = req.userId;
      const resetValue = 0;

      const existingVote = await AppDataSource.getRepository(Vote).findOneBy({
        postId: data.postId,
        userId: userId,
      });

      if (
        existingVote !== null &&
        existingVote.value !== realValue &&
        existingVote.value !== 0
      ) {
        //user has already voted and want to change the value
        await AppDataSource.transaction(async (tm) => {
          await tm.query(
            `update vote set value = $1 where "postId" = $2 and "userId" = $3`,
            [realValue, data.postId, userId]
          );
          await tm.query(`update post set points = points + $1 where id = $2`, [
            realValue * 2,
            data.postId,
          ]);
        });
        res.json({ success: true, results: [], message: "success" });
      } else if (existingVote !== null && existingVote.value === 0) {
        // user undo the vote but user want to vote again
        await AppDataSource.transaction(async (tm) => {
          await tm.query(
            `
          update vote set value = $1 where "postId" = $2 and "userId" = $3
        `,
            [realValue, data.postId, userId]
          );

          await tm.query(
            `
          update post set points = points + $1 where id = $2
        `,
            [realValue, data.postId]
          );
        });
        res.json({ success: true, results: [], message: "success" });
      } else if (existingVote !== null && existingVote.value === realValue) {
        //user has already voted but want to undo the vote
        await AppDataSource.transaction(async (tm) => {
          await tm.query(
            `
          update vote set value = $1 where "postId" = $2 and "userId" = $3
        `,
            [resetValue, data.postId, userId]
          );

          await tm.query(
            `
          update post set points = points + $1 where id = $2
        `,
            [undoValue, data.postId]
          );
        });
        res.json({ success: true, results: [], message: "success" });
      } else {
        //user has not voted yet
        await AppDataSource.transaction(async (tm) => {
          await tm.query(
            `insert into vote (value, "postId", "userId") values ($1, $2, $3)`,
            [realValue, data.postId, userId]
          );
          await tm.query(`update post set points = points + $1 where id = $2`, [
            realValue,
            data.postId,
          ]);
        });
        res.json({ success: true, results: [], message: "success" });
      }
    } catch (error) {
      res.json({ success: false, results: [], message: error } as DataReturn);
    }
  }
);

router.post(
  "/delete/:id",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const result = await AppDataSource.getRepository(Post).findOneBy({
        id,
        isDeleted: false,
      });
      if (result != null) {
        if (result.creatorId !== req.userId) {
          res.json({
            success: false,
            results: [],
            message: "You do not have permissions to edit the post",
          } as DataReturn);
        }
        await AppDataSource.createQueryBuilder()
          .update(Post)
          .set({
            isDeleted: true,
          })
          .where("id = :id", { id: id })
          .execute();
        res.json({
          success: true,
          message: "Post Deleted Successfully",
        } as DataReturn);
      } else {
        res.json({
          success: false,
          message: "Could't find post",
        } as DataReturn);
      }
    } catch (error) {
      console.log(error);
      res.json({ success: false, results: [], message: error } as DataReturn);
    }
  }
);

export default router;
