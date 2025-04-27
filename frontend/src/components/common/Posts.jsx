// وارد کردن کامپوننت Post برای نمایش هر پست
import Post from "./Post";
// وارد کردن کامپوننت PostSkeleton برای نمایش حالت لودینگ
import PostSkeleton from "../skeletons/PostSkeleton";
// استفاده از useQuery برای گرفتن داده‌ها
import { useQuery } from "@tanstack/react-query";
// استفاده از useEffect برای ریفچ مجدد در تغییرات
import { useEffect } from "react";
// وارد کردن داده‌های دامی
import { POSTS } from "../../utils/db/dummy";

// تعریف کامپوننت Posts
const Posts = ({ feedType, username, userId }) => {
  
  // تابع برای تعیین مسیر API بسته به نوع فید
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all"; // همه‌ی پست‌ها
      case "following":
        return "/api/posts/following"; // پست‌های کاربرانی که دنبال می‌کنیم
      case "posts":
        return `/api/posts/user/${username}`; // پست‌های یک کاربر خاص
      case "likes":
        return `/api/posts/likes/${userId}`; // پست‌هایی که لایک کردیم
      default:
        return "/api/posts/all"; // پیش‌فرض: همه‌ی پست‌ها
    }
  };

  // گرفتن مسیر API
  const POST_ENDPOINT = getPostEndpoint();

  // کوئری گرفتن پست‌ها
  const {
    data: posts, // داده‌های پست‌ها
    isLoading,   // وضعیت لود شدن اولیه
    refetch,     // تابع ریفچ
    isRefetching,// وضعیت ریفچ مجدد
    error,       // خطا
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "مشکلی پیش آمده");
        }

        return data;
      } catch (error) {
        // اگر خطا در دریافت داده‌ها از API، از داده‌های دامی استفاده کن
        console.log("Using dummy data due to API error:", error);
        return POSTS;
      }
    },
  });

  // استفاده از useEffect برای ریفچ مجدد هنگام تغییر feedType یا username
  useEffect(() => {
    refetch();
  }, [feedType, refetch, username]);

  // خروجی رندر
  return (
    <>
      {/* در حالت لودینگ یا ریفچ، اسکلِتون لودینگ نمایش بده */}
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center gap-4">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {/* اگر لودینگ نیست و پستی هم وجود نداره */}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <div className="text-center my-8 p-8 bg-gradient-to-br from-[#16181C] to-[#1E1E1E] rounded-lg border border-gray-700 shadow-lg">
          <p className="text-xl text-gray-400 font-semibold">در این بخش پستی وجود ندارد. بخش دیگری را امتحان کن 👻</p>
        </div>
      )}

      {/* اگر لودینگ نیست و پست‌ها موجودند، نمایش بده */}
      {!isLoading && !isRefetching && posts && (
        <div className="flex flex-col gap-4">
          {posts.map((post, index) => (
            <div 
              key={post._id} 
              className={`
                bg-gradient-to-br from-[#16181C] to-[#1E1E1E]
                hover:from-[#1E1E1E] hover:to-[#16181C]
                transition-all duration-500 rounded-lg shadow-lg
                transform hover:-translate-y-1
                ${index % 2 === 0 ? 'translate-x-2' : '-translate-x-2'}
              `}
            >
              <Post post={post} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

// خروجی گرفتن از کامپوننت
export default Posts;
