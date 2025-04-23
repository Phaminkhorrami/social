// وارد کردن کتابخانه express برای ساخت مسیرها
import express from "express";
// وارد کردن middleware برای محافظت از مسیرها
import { protectRoute } from "../middleware/protectRoute.js";
// وارد کردن توابع کنترلر کاربر
import { followUnfollowUser, getSuggestedUsers, getUserProfile, updateUser } from "../controllers/user.controller.js";

// ایجاد یک نمونه از Router
const router = express.Router();

// مسیر برای دریافت پروفایل کاربر با نام کاربری مشخص
router.get("/profile/:username", protectRoute, getUserProfile);
// مسیر برای دریافت لیست کاربران پیشنهادی
router.get("/suggested", protectRoute, getSuggestedUsers);
// مسیر برای دنبال کردن یا لغو دنبال کردن یک کاربر
router.post("/follow/:id", protectRoute, followUnfollowUser);
// مسیر برای به‌روزرسانی اطلاعات کاربر
router.post("/update", protectRoute, updateUser);

// صادر کردن router برای استفاده در فایل‌های دیگر
export default router;
