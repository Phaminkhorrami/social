// وارد کردن ماژول های مورد نیاز
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

// وارد کردن مسیرهای API
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";

// وارد کردن تابع اتصال به دیتابیس
import connectMongoDB from "./db/connectMongoDB.js";

// تنظیم متغیرهای محیطی از فایل .env
dotenv.config();

// پیکربندی سرویس Cloudinary برای آپلود تصاویر
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ایجاد نمونه اکسپرس
const app = express();
// تنظیم پورت سرور
const PORT = process.env.PORT || 5000;
// دریافت مسیر دایرکتوری فعلی
const __dirname = path.resolve();

// تنظیم middleware برای پردازش JSON با محدودیت حجم
app.use(express.json({ limit: "5mb" })); // برای پردازش req.body
// محدودیت حجم نباید خیلی زیاد باشد تا از حملات DOS جلوگیری شود
app.use(express.urlencoded({ extended: true })); // برای پردازش داده‌های فرم

// استفاده از middleware برای پردازش کوکی‌ها
app.use(cookieParser());

// تعریف مسیرهای API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

// تنظیمات برای محیط تولید
if (process.env.NODE_ENV === "production") {
	// سرو کردن فایل‌های استاتیک از پوشه dist
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// سرو کردن فایل index.html برای تمام مسیرها
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// شروع سرور و اتصال به دیتابیس
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectMongoDB();
});
