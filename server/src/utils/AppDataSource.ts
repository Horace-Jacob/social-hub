import { Vote } from "../entities/Vote";
import { Comment } from "../entities/Comment";
import { Post } from "../entities/Post";
import { Users } from "../entities/Users";
import { DataSource } from "typeorm";
import { Follow } from "../entities/Follow";

export const AppDataSource = new DataSource({
  type: "postgres",
  port: 5432,
  host: "dpg-civ9kn407spttti407tg-a.singapore-postgres.render.com",
  username: "social_hub",
  password: "LBXfhVq17j5rlBNBe9qWYB9GaRS0UEmM",
  database: "social_hub_db",
  entities: [Users, Post, Comment, Vote, Follow],
  ssl: true,
  logging: true,
  synchronize: true,
});

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   port: 5432,
//   username: "postgres",
//   password: "awesomepassword123",
//   database: "social_media_clone",
//   entities: [Users, Post, Comment, Vote, Follow],
//   logging: true,
//   synchronize: true,
// });
