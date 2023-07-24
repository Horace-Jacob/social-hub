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
const Users_1 = require("../entities/Users");
const AppDataSource_1 = require("../utils/AppDataSource");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const IsAuth_1 = require("../middleware/IsAuth");
const router = express_1.default.Router();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        const user = req.body;
        const findUser = yield AppDataSource_1.AppDataSource.getRepository(Users_1.Users).findOneBy({
            email: user.email,
            isDeleted: false,
        });
        if (findUser !== null) {
            res.json({
                success: false,
                results: [],
                message: "User already exists",
            });
        }
        else {
            const hashedPassword = yield bcryptjs_1.default.hash(user.password, 10);
            const data = yield AppDataSource_1.AppDataSource.createQueryBuilder()
                .insert()
                .into(Users_1.Users)
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
            });
        }
    }
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error,
        });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const findUser = yield AppDataSource_1.AppDataSource.getRepository(Users_1.Users).findOneBy({
            email: user.email,
        });
        if (findUser !== null) {
            const validatePassword = yield bcryptjs_1.default.compare(user.password, findUser.password);
            if (!validatePassword) {
                res.json({
                    success: false,
                    results: [],
                    message: "Invalid Credentials",
                });
            }
            else {
                const token = jsonwebtoken_1.default.sign({ id: findUser.id }, "jwtauthorization", {
                    expiresIn: "1000hr",
                });
                res.json({
                    success: true,
                    results: token,
                    message: "success",
                });
            }
        }
        else {
            res.json({
                success: false,
                results: [],
                message: "User Not Found",
            });
        }
    }
    catch (error) {
        res.json({
            success: false,
            results: [],
            message: error.message,
        });
    }
}));
router.post("/updateusername", IsAuth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const userId = req.userId;
        const existingUser = yield AppDataSource_1.AppDataSource.getRepository(Users_1.Users).findOneBy({
            isDeleted: false,
            id: userId,
        });
        if (existingUser !== null) {
            yield AppDataSource_1.AppDataSource.createQueryBuilder()
                .update(Users_1.Users)
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
            });
        }
        else {
            res.json({
                success: false,
                message: "User does't exist",
                results: [],
            });
        }
    }
    catch (error) {
        res.json({
            success: false,
            message: "fail",
            results: error,
        });
    }
}));
router.get("/userprofile/:id", IsAuth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const result = yield AppDataSource_1.AppDataSource.query(`
          SELECT u.*,
          CASE WHEN f.id IS NOT NULL THEN true ELSE false END AS "isFollowing"
          from users u
          LEFT JOIN follow f ON f."FromUser" = ${req.userId} AND f."ToUser" = u.id AND f."isDeleted" = false
          WHERE u.id = $1
        `, [id]);
        if (result != null) {
            res.json({
                success: true,
                results: result[0],
                message: "success",
            });
        }
        else {
            res.json({
                success: false,
                results: [],
                message: "fail",
            });
        }
    }
    catch (error) {
        res.json({ success: false, results: [], message: error });
    }
}));
router.get("/myprofile", IsAuth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield AppDataSource_1.AppDataSource.getRepository(Users_1.Users).findOneBy({
            id: req.userId,
            isDeleted: false,
        });
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
exports.default = router;
//# sourceMappingURL=UserRoutes.js.map