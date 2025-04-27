// وارد کردن کامپوننت Link برای لینک‌دهی بین صفحات
import { Link } from "react-router-dom";
// وارد کردن هوک useQuery برای کوئری گرفتن داده‌ها
import { useQuery } from "@tanstack/react-query";

// وارد کردن هوک کاستوم برای فالو کردن کاربر
import useFollow from "../../hooks/useFollow";

// وارد کردن اسکلتون بارگذاری پنل راست
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
// وارد کردن کامپوننت لودینگ اسپینر
import LoadingSpinner from "./LoadingSpinner";
// وارد کردن داده‌های دامی
import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";

// تعریف کامپوننت RightPanel
const RightPanel = () => {
  
  // گرفتن لیست کاربران پیشنهادی از سرور
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"], // کلید یکتا برای کشینگ
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "مشکلی پیش آمده!");
        }
        return data;
      } catch (error) {
        // اگر خطا در دریافت داده‌ها از API، از داده‌های دامی استفاده کن
        console.log("Using dummy users data due to API error:", error);
        return USERS_FOR_RIGHT_PANEL;
      }
    },
  });

  // گرفتن تابع فالو و وضعیت در حال ارسال
  const { follow, isPending } = useFollow();

  // اگر کاربران پیشنهادی خالی بود، هیچی نمایش نده
  if (suggestedUsers?.length === 0) return <div className="md:w-64 w-0"></div>;

  // خروجی رندر
  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-6 rounded-lg sticky top-2">
        {/* عنوان بخش */}
        <p className="font-bold text-xl mb-4">چه کسانی را دنبال کنیم</p>

        {/* لیست کاربران */}
        <div className="flex flex-col gap-5">

          {/* نمایش اسکلتون‌ها هنگام لودینگ */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}

          {/* بعد از لود شدن، نمایش کاربران پیشنهادی */}
          {!isLoading &&
            suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4 p-2 hover:bg-[#1E1E1E] rounded-lg transition-all duration-300"
                key={user._id}
              >
                <div className="flex gap-3 items-center">
                  {/* تصویر پروفایل */}
                  <div className="avatar">
                    <div className="w-10 rounded-lg">
                      <img src={user.profileImg || "/avatar-placeholder.png"} />
                    </div>
                  </div>

                  {/* نام و یوزرنیم کاربر */}
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-32 text-base">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">@{user.username}</span>
                  </div>
                </div>

                {/* دکمه‌ی فالو */}
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-lg btn-sm px-4"
                    onClick={(e) => {
                      e.preventDefault();
                      follow(user._id);
                    }}
                  >
                    {isPending ? <LoadingSpinner size="sm" /> : "Follow"}
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

// خروجی گرفتن از کامپوننت
export default RightPanel;
