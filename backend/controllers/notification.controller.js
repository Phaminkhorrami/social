import Notification from "../models/notification.model.js";

// دریافت اعلان‌های کاربر
export const getNotifications = async (req, res) => {
	try {
		// دریافت شناسه کاربر از درخواست
		const userId = req.user._id;

		// جستجوی اعلان‌های کاربر و پر کردن اطلاعات فرستنده
		const notifications = await Notification.find({ to: userId }).populate({
			path: "from",
			select: "username profileImg",
		});

		// بروزرسانی وضعیت خواندن همه اعلان‌ها
		await Notification.updateMany({ to: userId }, { read: true });

		// ارسال اعلان‌ها به عنوان پاسخ
		res.status(200).json(notifications);
	} catch (error) {
		// ثبت خطا در کنسول
		console.log("Error in getNotifications function", error.message);
		// ارسال پیام خطای سرور
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// حذف اعلان‌های کاربر
export const deleteNotifications = async (req, res) => {
	try {
		// دریافت شناسه کاربر از درخواست
		const userId = req.user._id;

		// حذف همه اعلان‌های کاربر
		await Notification.deleteMany({ to: userId });

		// ارسال پیام موفقیت‌آمیز بودن عملیات
		res.status(200).json({ message: "Notifications deleted successfully" });
	} catch (error) {
		// ثبت خطا در کنسول
		console.log("Error in deleteNotifications function", error.message);
		// ارسال پیام خطای سرور
		res.status(500).json({ error: "Internal Server Error" });
	}
};
