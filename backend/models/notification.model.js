import mongoose from "mongoose";

// تعریف اسکیما برای اعلان‌ها
const notificationSchema = new mongoose.Schema(
	{
		// شناسه کاربری که اعلان را ایجاد کرده است
		from: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// شناسه کاربری که اعلان برای او ارسال شده است
		to: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// نوع اعلان (دنبال کردن یا لایک)
		type: {
			type: String,
			required: true,
			enum: ["follow", "like"],
		},
		// وضعیت خوانده شدن اعلان
		read: {
			type: Boolean,
			default: false,
		},
	},
	// اضافه کردن فیلدهای زمان ایجاد و زمان بروزرسانی خودکار
	{ timestamps: true }
);

// ایجاد مدل اعلان از اسکیما
const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
