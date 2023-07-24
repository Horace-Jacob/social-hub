"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const Vote_1 = require("../entities/Vote");
const Comment_1 = require("../entities/Comment");
const Post_1 = require("../entities/Post");
const Users_1 = require("../entities/Users");
const typeorm_1 = require("typeorm");
const Follow_1 = require("../entities/Follow");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    port: 5432,
    host: "dpg-civ9kn407spttti407tg-a.singapore-postgres.render.com",
    username: "social_hub",
    password: "LBXfhVq17j5rlBNBe9qWYB9GaRS0UEmM",
    database: "social_hub_db",
    entities: [Users_1.Users, Post_1.Post, Comment_1.Comment, Vote_1.Vote, Follow_1.Follow],
    ssl: true,
    logging: true,
    synchronize: true,
});
//# sourceMappingURL=AppDataSource.js.map