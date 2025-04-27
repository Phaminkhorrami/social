// ایمپورت پلاگین DaisyUI
import daisyui from "daisyui";

// ایمپورت تم‌های پیش‌فرض DaisyUI
import daisyUIThemes from "daisyui/src/theming/themes";

/** @type {import('tailwindcss').Config} */
// صادر کردن تنظیمات TailwindCSS
export default {
	// تعیین مسیر فایل‌هایی که Tailwind باید کلاس‌هایشان را اسکن کند
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

	theme: {
		// اضافه کردن تغییرات دلخواه به تم پیش‌فرض
		extend: {},
	},

	// اضافه کردن پلاگین DaisyUI به پروژه
	plugins: [daisyui],

	// تنظیمات مخصوص DaisyUI
	daisyui: {
		themes: [
			// استفاده از تم پیش‌فرض light
			"light",
			// تعریف تم سفارشی black با تغییر رنگ‌های اصلی
			{
				black: {
					// کپی از تم black پیش‌فرض DaisyUI
					...daisyUIThemes["black"],
					// تغییر رنگ اصلی (primary)
					primary: "rgb(29, 155, 240)",
					// تغییر رنگ ثانویه (secondary)
					secondary: "rgb(24, 24, 24)",
				},
			},
		],
	},
};
