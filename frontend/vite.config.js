// ایمپورت کردن تابع defineConfig از پکیج Vite
import { defineConfig } from "vite";

// ایمپورت کردن پلاگین React برای Vite
import react from "@vitejs/plugin-react";

// صادر کردن تنظیمات Vite
export default defineConfig({
	// اضافه کردن پلاگین React به پروژه
	plugins: [react()],
	server: {
		// مشخص کردن پورتی که سرور توسعه روی آن اجرا می‌شود
		port: 3000,
		proxy: {
			// تنظیم پراکسی برای مسیرهایی که با /api شروع می‌شوند
			"/api": {
				// مقصد پراکسی: سروری که ریکوئست‌ها به آن فوروارد می‌شوند
				target: "http://localhost:5000",
				// تغییر origin ریکوئست برای مطابقت با سرور مقصد
				changeOrigin: true,
			},
		},
	},
});
