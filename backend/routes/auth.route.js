// وارد کردن کتابخانه express برای ساخت مسیرها
import express from "express";
// وارد کردن توابع کنترلر احراز هویت
import { getMe, login, logout, signup } from "../controllers/auth.controller.js";
// وارد کردن میدلور محافظت از مسیرها
import { protectRoute } from "../middleware/protectRoute.js";

// ایجاد یک نمونه از روتر
const router = express.Router();

// مسیر دریافت اطلاعات کاربر فعلی (نیاز به احراز هویت دارد)
router.get("/me", protectRoute, getMe);
// مسیر ثبت نام کاربر جدید
router.post("/signup", signup);
// مسیر ورود کاربر
router.post("/login", login);
// مسیر خروج کاربر
router.post("/logout", logout);

// صادر کردن روتر برای استفاده در فایل‌های دیگر
export default router;
