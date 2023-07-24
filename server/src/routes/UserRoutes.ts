import express, { Response } from "express";
import { Users } from "../entities/Users";
import { AppDataSource } from "../utils/AppDataSource";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { CustomRequest, DataReturn } from "../utils/Interfaces";
import { authMiddleware } from "../middleware/IsAuth";

const router = express.Router();

router.post("/signup", async (req: CustomRequest, res: Response) => {
  let result;
  try {
    const user: Users = req.body;
    const findUser = await AppDataSource.getRepository(Users).findOneBy({
      email: user.email,
      isDeleted: false,
    });

    if (findUser !== null) {
      res.json({
        success: false,
        results: [],
        message: "User already exists",
      } as DataReturn);
    } else {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const data = await AppDataSource.createQueryBuilder()
        .insert()
        .into(Users)
        .values({
          email: user.email,
          username: user.username,
          password: hashedPassword,
          photo: user.photo,
        })
        .returning("*")
        .execute();
      result = data.raw[0];
      res.json({
        success: true,
        results: result,
        message: "success",
      } as DataReturn);
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error,
    } as DataReturn);
  }
});

router.post("/signin", async (req: CustomRequest, res: Response) => {
  try {
    const user: Users = req.body;
    const findUser = await AppDataSource.getRepository(Users).findOneBy({
      email: user.email,
    });
    if (findUser !== null) {
      const validatePassword = await bcrypt.compare(
        user.password,
        findUser.password
      );
      if (!validatePassword) {
        res.json({
          success: false,
          results: [],
          message: "Invalid Credentials",
        } as DataReturn);
      } else {
        const token = jwt.sign({ id: findUser.id }, "jwtauthorization", {
          expiresIn: "1000hr",
        });
        res.json({
          success: true,
          results: token,
          message: "success",
        } as DataReturn);
      }
    } else {
      res.json({
        success: false,
        results: [],
        message: "User Not Found",
      } as DataReturn);
    }
  } catch (error) {
    res.json({
      success: false,
      results: [],
      message: error.message,
    } as DataReturn);
  }
});

router.post(
  "/updateusername",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const user: Users = req.body;
      const userId = req.userId;

      const existingUser = await AppDataSource.getRepository(Users).findOneBy({
        isDeleted: false,
        id: userId,
      });

      if (existingUser !== null) {
        await AppDataSource.createQueryBuilder()
          .update(Users)
          .set({
            username: user.username,
          })
          .where("id = :id", { id: userId })
          .returning("*")
          .execute();
        res.json({
          success: true,
          message: "Username updated successfully",
          results: [],
        } as DataReturn);
      } else {
        res.json({
          success: false,
          message: "User does't exist",
          results: [],
        } as DataReturn);
      }
    } catch (error) {
      res.json({
        success: false,
        message: "fail",
        results: error,
      } as DataReturn);
    }
  }
);

router.get(
  "/userprofile/:id",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const result = await AppDataSource.query(
        `
          SELECT u.*,
          CASE WHEN f.id IS NOT NULL THEN true ELSE false END AS "isFollowing"
          from users u
          LEFT JOIN follow f ON f."FromUser" = ${req.userId} AND f."ToUser" = u.id AND f."isDeleted" = false
          WHERE u.id = $1
        `,
        [id]
      );
      if (result != null) {
        res.json({
          success: true,
          results: result[0],
          message: "success",
        } as DataReturn);
      } else {
        res.json({
          success: false,
          results: [],
          message: "fail",
        } as DataReturn);
      }
    } catch (error) {
      res.json({ success: false, results: [], message: error } as DataReturn);
    }
  }
);

router.get(
  "/myprofile",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const result = await AppDataSource.getRepository(Users).findOneBy({
        id: req.userId,
        isDeleted: false,
      });
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

export default router;
