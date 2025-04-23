import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// این تابع یک middleware برای محافظت از مسیرها است
export const protectRoute = async (req, res, next) => {
	try {
		// دریافت توکن از کوکی‌های درخواست
		const token = req.cookies.jwt;
		// بررسی وجود توکن
		if (!token) {
			return res.status(401).json({ error: "Unauthorized: No Token Provided" });
		}

		// بررسی اعتبار توکن با استفاده از کلید مخفی
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// بررسی صحت توکن
		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized: Invalid Token" });
		}

		// جستجوی کاربر با استفاده از شناسه موجود در توکن
		const user = await User.findById(decoded.userId).select("-password");

		// بررسی وجود کاربر
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// اضافه کردن اطلاعات کاربر به درخواست
		req.user = user;
		// ادامه پردازش درخواست
		next();
	} catch (err) {
		// ثبت خطا در کنسول
		console.log("Error in protectRoute middleware", err.message);
		// ارسال پاسخ خطای سرور
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
