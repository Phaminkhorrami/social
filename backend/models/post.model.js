import mongoose from "mongoose";

// تعریف اسکیما برای پست‌ها
const postSchema = new mongoose.Schema(
	{
		// شناسه کاربری که پست را ایجاد کرده است
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// متن پست
		text: {
			type: String,
		},
		// آدرس تصویر پست
		img: {
			type: String,
		},
		// لیست شناسه‌های کاربرانی که پست را لایک کرده‌اند
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		// لیست نظرات روی پست
		comments: [
			{
				// متن نظر
				text: {
					type: String,
					required: true,
				},
				// شناسه کاربری که نظر را ثبت کرده است
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
			},
		],
	},
	// اضافه کردن فیلدهای زمان ایجاد و زمان به‌روزرسانی به خودکار
	{ timestamps: true }
);

// ایجاد مدل پست از اسکیما
const Post = mongoose.model("Post", postSchema);

export default Post;
