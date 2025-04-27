// ایمپورت کامپوننت‌های مسیریابی از کتابخانه react-router-dom
import { Navigate, Route, Routes } from "react-router-dom";

// ایمپورت صفحات اصلی
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

// ایمپورت کامپوننت‌های مشترک
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

// ایمپورت کامپوننت‌های کاربردی
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
    // دریافت اطلاعات کاربر احراز هویت شده با استفاده از React Query
    const { data: authUser, isLoading } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                // ارسال درخواست به API برای دریافت اطلاعات کاربر فعلی
                const res = await fetch("/api/auth/me");
                const data = await res.json();
                if (data.error) return null;
                if (!res.ok) {
                    throw new Error(data.error || "مشکلی پیش آمده است");
                }
                console.log("authUser is here:", data);
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        retry: false, // در صورت خطا تلاش مجدد نکند
    });

    // نمایش اسپینر لودینگ تا زمانی که اطلاعات کاربر در حال دریافت است
    if (isLoading) {
        return (
            <div className='h-screen flex justify-center items-center'>
                <LoadingSpinner size='lg' />
            </div>
        );
    }

    return (
        // کانتینر اصلی اپلیکیشن با عرض حداکثر و مرکزچینی
        <div className='flex min-h-screen bg-[#0A0A0A]'>
            {/* در صورت لاگین بودن کاربر، سایدبار نمایش داده می‌شود */}
            {authUser && <Sidebar />}

            {/* تعریف مسیرهای اپلیکیشن */}
            <div className="flex-1 max-w-4xl mx-auto px-4">
                <Routes>
                    {/* مسیر صفحه اصلی - در صورت نبود احراز هویت به صفحه لاگین هدایت می‌شود */}
                    <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
                    {/* مسیر لاگین - در صورت احراز هویت به صفحه اصلی هدایت می‌شود */}
                    <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
                    {/* مسیر ثبت‌نام - در صورت احراز هویت به صفحه اصلی هدایت می‌شود */}
                    <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
                    {/* مسیر نوتیفیکیشن‌ها - نیاز به احراز هویت دارد */}
                    <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
                    {/* مسیر پروفایل کاربر - نیاز به احراز هویت دارد */}
                    <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
                </Routes>
            </div>

            {/* در صورت لاگین بودن کاربر، پنل سمت راست نمایش داده می‌شود */}
            {authUser && <RightPanel />}

            {/* کانتینر نمایش Toast برای اعلان‌ها */}
            <Toaster />
        </div>
    );
}

export default App;
