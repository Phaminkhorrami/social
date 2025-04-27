// وارد کردن کتابخانه React
import React from "react";

// وارد کردن ReactDOM برای رندر کردن اپلیکیشن داخل DOM
import ReactDOM from "react-dom/client";

// وارد کردن کامپوننت اصلی اپلیکیشن
import App from "./App.jsx";

// وارد کردن فایل CSS اصلی پروژه
import "./index.css";

// وارد کردن BrowserRouter برای مدیریت مسیرهای اپلیکیشن
import { BrowserRouter } from "react-router-dom";

// وارد کردن QueryClient و QueryClientProvider برای مدیریت کوئری‌ها با React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ساخت یک نمونه جدید از QueryClient با تنظیمات دلخواه
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// جلوگیری از واکشی مجدد داده‌ها هنگام فوکوس شدن مجدد پنجره
			refetchOnWindowFocus: false,
		},
	},
});

// رندر کردن اپلیکیشن داخل المانی با id برابر با root
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		{/* فعال کردن حالت StrictMode برای پیدا کردن خطاهای احتمالی در زمان توسعه */}
		<BrowserRouter>
			{/* فراهم کردن context مربوط به React Query برای کل اپلیکیشن */}
			<QueryClientProvider client={queryClient}>
				{/* رندر کردن کامپوننت اصلی اپلیکیشن */}
				<App />
			</QueryClientProvider>
		</BrowserRouter>
	</React.StrictMode>
);
