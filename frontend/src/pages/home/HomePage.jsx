import { useState } from "react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
  // وضعیت انتخاب نوع فید
  const [feedType, setFeedType] = useState("forYou");

  return (
    <div className='flex-1 min-h-screen py-4'>
      {/* هدر برای انتخاب نوع فید */}
      <div className='flex w-full mb-4 bg-[#16181C] rounded-lg p-2'>
        <div
          className={
            "flex justify-center flex-1 p-3 hover:bg-[#1E1E1E] transition duration-300 cursor-pointer relative rounded-lg"
          }
          onClick={() => setFeedType("forYou")}
        >
          <span className={`text-lg font-semibold ${feedType === "forYou" ? "text-white" : "text-gray-400"}`}>
            For you
          </span>
          {/* خط زیر برای نمایش انتخاب شدن گزینه */}
          {feedType === "forYou" && (
            <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
          )}
        </div>
        <div
          className='flex justify-center flex-1 p-3 hover:bg-[#1E1E1E] transition duration-300 cursor-pointer relative rounded-lg'
          onClick={() => setFeedType("following")}
        >
          <span className={`text-lg font-semibold ${feedType === "following" ? "text-white" : "text-gray-400"}`}>
            Following
          </span>
          {/* خط زیر برای نمایش انتخاب شدن گزینه */}
          {feedType === "following" && (
            <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
          )}
        </div>
      </div>

      {/* فرم ایجاد پست */}
      <div className="mb-4">
        <CreatePost />
      </div>

      {/* نمایش پست‌ها بر اساس نوع فید */}
      <Posts feedType={feedType} />
    </div>
  );
};

export default HomePage;
