/* وارد کردن کتابخانه express برای ساخت مسیرها */
import express from "express";
/* وارد کردن middleware برای محافظت از مسیرها */
import { protectRoute } from "../middleware/protectRoute.js";
/* وارد کردن توابع کنترلر پست */
import {
	commentOnPost,    /* تابع برای کامنت گذاشتن روی پست */
	createPost,       /* تابع برای ایجاد پست جدید */
	deletePost,       /* تابع برای حذف پست */
	getAllPosts,      /* تابع برای دریافت همه پست‌ها */
	getFollowingPosts,/* تابع برای دریافت پست‌های دنبال‌شوندگان */
	getLikedPosts,    /* تابع برای دریافت پست‌های لایک شده */
	getUserPosts,     /* تابع برای دریافت پست‌های یک کاربر */
	likeUnlikePost,   /* تابع برای لایک/آنلایک کردن پست */
} from "../controllers/post.controller.js";

/* ایجاد یک مسیریاب جدید */
const router = express.Router();

/* مسیر برای دریافت همه پست‌ها (نیاز به احراز هویت دارد) */
router.get("/all", protectRoute, getAllPosts);
/* مسیر برای دریافت پست‌های دنبال‌شوندگان (نیاز به احراز هویت دارد) */
router.get("/following", protectRoute, getFollowingPosts);
/* مسیر برای دریافت پست‌های لایک شده یک کاربر (نیاز به احراز هویت دارد) */
router.get("/likes/:id", protectRoute, getLikedPosts);
/* مسیر برای دریافت پست‌های یک کاربر خاص (نیاز به احراز هویت دارد) */
router.get("/user/:username", protectRoute, getUserPosts);
/* مسیر برای ایجاد پست جدید (نیاز به احراز هویت دارد) */
router.post("/create", protectRoute, createPost);
/* مسیر برای لایک/آنلایک کردن پست (نیاز به احراز هویت دارد) */
router.post("/like/:id", protectRoute, likeUnlikePost);
/* مسیر برای کامنت گذاشتن روی پست (نیاز به احراز هویت دارد) */
router.post("/comment/:id", protectRoute, commentOnPost);
/* مسیر برای حذف پست (نیاز به احراز هویت دارد) */
router.delete("/:id", protectRoute, deletePost);

/* صادر کردن مسیریاب */
export default router;
