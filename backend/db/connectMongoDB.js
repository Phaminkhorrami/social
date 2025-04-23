// وارد کردن کتابخانه mongoose برای کار با MongoDB
import mongoose from "mongoose";

// تعریف تابع async برای اتصال به دیتابیس MongoDB
const connectMongoDB = async () => {
	try {
		// تلاش برای اتصال به MongoDB با استفاده از آدرس موجود در متغیر محیطی
		const conn = await mongoose.connect(process.env.MONGO_URI);
		// نمایش پیام موفقیت آمیز بودن اتصال به همراه نام هاست
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		// نمایش خطا در صورت عدم موفقیت در اتصال
		console.error(`Error connection to mongoDB: ${error.message}`);
		// خروج از برنامه با کد خطا
		process.exit(1);
	}
};

// صادر کردن تابع اتصال برای استفاده در سایر فایل‌ها
export default connectMongoDB;
