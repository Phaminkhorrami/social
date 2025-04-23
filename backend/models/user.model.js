// وارد کردن کتابخانه mongoose برای کار با MongoDB
import mongoose from "mongoose";

// تعریف اسکیما (ساختار) کاربر با استفاده از mongoose.Schema
const userSchema = new mongoose.Schema(
	{
		// نام کاربری - اجباری و منحصر به فرد
		username: {
			type: String,
			required: true,
			unique: true,
		},
		// نام کامل - اجباری
		fullName: {
			type: String,
			required: true,
		},
		// رمز عبور - اجباری با حداقل 6 کاراکتر
		password: {
			type: String,
			required: true,
			minLength: 6,
		},
		// ایمیل - اجباری و منحصر به فرد
		email: {
			type: String,
			required: true,
			unique: true,
		},
		// لیست دنبال کنندگان - آرایه ای از شناسه های کاربران
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		// لیست دنبال شوندگان - آرایه ای از شناسه های کاربران
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		// تصویر پروفایل - پیش‌فرض خالی
		profileImg: {
			type: String,
			default: "",
		},
		// تصویر کاور - پیش‌فرض خالی
		coverImg: {
			type: String,
			default: "",
		},
		// بیوگرافی - پیش‌فرض خالی
		bio: {
			type: String,
			default: "",
		},
		// لینک - پیش‌فرض خالی
		link: {
			type: String,
			default: "",
		},
		// پست‌های لایک شده - آرایه ای از شناسه های پست‌ها
		likedPosts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Post",
				default: [],
			},
		],
	},
	// فعال کردن فیلدهای زمان ایجاد و بروزرسانی
	{ timestamps: true }
);

// ایجاد مدل User از اسکیما
const User = mongoose.model("User", userSchema);

// صادر کردن مدل User
export default User;
