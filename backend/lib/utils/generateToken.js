import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
	// ساخت توکن JWT با استفاده از شناسه کاربر و کلید مخفی
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d", // مدت اعتبار توکن 15 روز
	});

	// تنظیم کوکی در پاسخ HTTP
	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // مدت اعتبار کوکی به میلی‌ثانیه
		httpOnly: true, // جلوگیری از دسترسی JavaScript به کوکی برای امنیت در برابر حملات XSS
		sameSite: "strict", // محدود کردن ارسال کوکی به دامنه اصلی برای امنیت در برابر حملات CSRF
		secure: process.env.NODE_ENV !== "development", // استفاده از HTTPS در محیط تولید
	});
};
