// تابع برای فرمت کردن تاریخ ارسال پست
export const formatPostDate = (createdAt) => {
	const currentDate = new Date(); // تاریخ فعلی
	const createdAtDate = new Date(createdAt); // تاریخ ارسال پست

	// محاسبه تفاوت زمانی به ثانیه
	const timeDifferenceInSeconds = Math.floor((currentDate - createdAtDate) / 1000);
	// تبدیل ثانیه‌ها به دقیقه
	const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
	// تبدیل دقیقه‌ها به ساعت
	const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
	// تبدیل ساعت‌ها به روز
	const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

	// اگر پست بیشتر از یک روز پیش ارسال شده باشد، تاریخ به صورت "ماه روز" نمایش داده می‌شود
	if (timeDifferenceInDays > 1) {
		return createdAtDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	} 
	// اگر پست یک روز پیش ارسال شده باشد، "1d" نمایش داده می‌شود
	else if (timeDifferenceInDays === 1) {
		return "1d";
	} 
	// اگر پست چند ساعت پیش ارسال شده باشد، تعداد ساعت‌ها به صورت "Xh" نمایش داده می‌شود
	else if (timeDifferenceInHours >= 1) {
		return `${timeDifferenceInHours}h`;
	} 
	// اگر پست چند دقیقه پیش ارسال شده باشد، تعداد دقیقه‌ها به صورت "Xm" نمایش داده می‌شود
	else if (timeDifferenceInMinutes >= 1) {
		return `${timeDifferenceInMinutes}m`;
	} 
	// در غیر این صورت، پست به تازگی ارسال شده و "Just now" نمایش داده می‌شود
	else {
		return "Just now";
	}
};

// تابع برای فرمت کردن تاریخ عضویت کاربر
export const formatMemberSinceDate = (createdAt) => {
	const date = new Date(createdAt); // تاریخ عضویت کاربر
	const months = [
		"January", "February", "March", "April", "May", "June", 
		"July", "August", "September", "October", "November", "December"
	]; // ماه‌های سال به انگلیسی
	const month = months[date.getMonth()]; // ماه تاریخ عضویت
	const year = date.getFullYear(); // سال تاریخ عضویت
	// نمایش تاریخ عضویت به صورت "Joined Month Year" (مثال: "Joined April 2025")
	return `Joined ${month} ${year}`;
};
