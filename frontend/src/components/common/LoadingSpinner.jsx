// کامپوننت LoadingSpinner که یک اسپینر بارگذاری را نمایش می‌دهد
const LoadingSpinner = ({ size = "md" }) => {
	// تعیین کلاس سایز اسپینر بر اساس مقدار ورودی
	const sizeClass = `loading-${size}`;

	// بازگرداندن یک span با کلاس‌های مربوط به اسپینر بارگذاری
	return <span className={`loading loading-spinner ${sizeClass}`} />;
};

// صادر کردن کامپوننت برای استفاده در فایل‌های دیگر
export default LoadingSpinner;
