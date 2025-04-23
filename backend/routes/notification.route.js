// وارد کردن کتابخانه express برای ساخت مسیرها
import express from "express";
// وارد کردن middleware محافظت از مسیر
import { protectRoute } from "../middleware/protectRoute.js";
// وارد کردن توابع کنترلر اعلان‌ها
import { deleteNotifications, getNotifications } from "../controllers/notification.controller.js";

// ایجاد یک نمونه از Router
const router = express.Router();

// مسیر GET برای دریافت اعلان‌ها با محافظت از مسیر
router.get("/", protectRoute, getNotifications);
// مسیر DELETE برای حذف اعلان‌ها با محافظت از مسیر
router.delete("/", protectRoute, deleteNotifications);

// صادر کردن router برای استفاده در فایل‌های دیگر
export default router;
