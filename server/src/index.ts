import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as dotEnv from "dotenv";
import { AppDataSource } from "./utils/AppDataSource";
import UserRoutes from "./routes/UserRoutes";
import PostRoutes from "./routes/PostRoutes";
import CommentRoutes from "./routes/CommentRoutes";
import FollowRoutes from "./routes/FollowRoutes";
import SearchRoutes from "./routes/SearchRoutes";

dotEnv.config();

const PORT = process.env.PORT || 4000;

const main = async () => {
  const app = express();

  AppDataSource.initialize()
    .then(() => {})
    .catch((error) => {
      console.log(error);
    });

  app.use(bodyParser.json({ limit: "30mb" }));
  app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use("/user", UserRoutes);
  app.use("/post", PostRoutes);
  app.use("/comment", CommentRoutes);
  app.use("/follow", FollowRoutes);
  app.use("/search", SearchRoutes)

  app.listen(PORT, () => {
    console.log(`Server has started running on PORT ${PORT}`);
  });
};

main();
