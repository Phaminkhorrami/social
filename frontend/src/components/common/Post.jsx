// وارد کردن آیکون‌های مورد نیاز از کتابخانه react-icons
import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";

// وارد کردن useState از React
import { useState } from "react";
// وارد کردن Link برای لینک‌های داخلی
import { Link } from "react-router-dom";
// وارد کردن useMutation و useQuery از react-query برای مدیریت داده‌ها
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// وارد کردن toast برای نمایش نوتیفیکیشن
import { toast } from "react-hot-toast";

// وارد کردن کامپوننت لودینگ اسپینر و تابع فرمت تاریخ
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";

// تعریف کامپوننت Post
const Post = ({ post }) => {
  // مدیریت وضعیت متن کامنت
  const [comment, setComment] = useState("");

  // گرفتن اطلاعات کاربر لاگین شده
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // گرفتن queryClient برای مدیریت کش
  const queryClient = useQueryClient();

  // بررسی اینکه این پست متعلق به کاربر جاری هست یا خیر
  const isMyPost = authUser._id === post.user._id;

  // بررسی اینکه آیا کاربر این پست را لایک کرده یا نه
  const isLiked = post.likes.includes(authUser._id);

  // فرمت کردن تاریخ پست
  const formattedDate = formatPostDate(post.createdAt);

  // تعریف متد برای حذف پست
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/${post._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "مشکلی پیش آمده");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("پست با موفقیت حذف شد");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // تعریف متد برای لایک کردن پست
  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "مشکلی پیش آمده");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (updatedLikes) => {
      // به جای ریفچ کل پست‌ها، فقط کش مربوط به این پست را آپدیت می‌کنیم
      queryClient.setQueryData(["posts"], (oldData) =>
        oldData.map((p) => (p._id === post._id ? { ...p, likes: updatedLikes } : p))
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // تعریف متد برای ثبت کامنت جدید
  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/comment/${post._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: comment }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "مشکلی پیش آمده");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("کامنت با موفقیت ارسال شد");
      setComment(""); // ریست کردن متن کامنت
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // هندلر حذف پست
  const handleDeletePost = () => {
    deletePost();
  };

  // هندلر ثبت کامنت
  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
  };

  // هندلر لایک کردن پست
  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  // خروجی کامپوننت
  return (
    <>
      <div className="flex gap-3 items-start p-6 border-b border-gray-700 hover:bg-[#0A0A0A] transition-all duration-300">
        {/* آواتار کاربر */}
        <div className="avatar">
          <Link to={`/profile/${post.user.username}`} className="w-10 rounded-lg overflow-hidden">
            <img src={post.user.profileImg || "/avatar-placeholder.png"} />
          </Link>
        </div>

        {/* محتوای پست */}
        <div className="flex flex-col flex-1">
          {/* مشخصات کاربر */}
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${post.user.username}`} className="font-bold text-lg">
              {post.user.fullName}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${post.user.username}`}>@{post.user.username}</Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>

            {/* دکمه حذف پست برای صاحب پست */}
            {isMyPost && (
              <span className="flex justify-end flex-1">
                {!isDeleting ? (
                  <FaTrash className="cursor-pointer hover:text-red-500 w-5 h-5" onClick={handleDeletePost} />
                ) : (
                  <LoadingSpinner size="sm" />
                )}
              </span>
            )}
          </div>

          {/* متن پست و تصویر (در صورت وجود) */}
          <div className="flex flex-col gap-4 overflow-hidden mt-2">
            <span className="text-base leading-relaxed">{post.text}</span>
            {post.img && (
              <div className="relative group">
                <img
                  src={post.img}
                  className="h-96 w-full object-cover rounded-lg border border-gray-700 transition-transform duration-300 group-hover:scale-[1.02]"
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              </div>
            )}
          </div>

          {/* دکمه‌های عملیات روی پست */}
          <div className="flex justify-between mt-4">
            <div className="flex gap-6 items-center w-2/3 justify-between">
              {/* دکمه باز کردن مودال کامنت‌ها */}
              <div
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
              >
                <FaRegComment className="w-5 h-5 text-slate-500 group-hover:text-sky-400 transition-colors duration-300" />
                <span className="text-sm text-slate-500 group-hover:text-sky-400 transition-colors duration-300">
                  {post.comments.length}
                </span>
              </div>

              {/* مودال نمایش کامنت‌ها */}
              <dialog id={`comments_modal${post._id}`} className="modal border-none outline-none">
                <div className="modal-box rounded-lg border border-gray-600 bg-[#16181C]">
                  <h3 className="font-bold text-xl mb-4">کامنت‌ها</h3>

                  {/* لیست کامنت‌ها */}
                  <div className="flex flex-col gap-4 max-h-60 overflow-auto">
                    {post.comments.length === 0 ? (
                      <p className="text-sm text-slate-500">فعلاً کامنتی وجود ندارد 🤔 اولین نفر باش 😉</p>
                    ) : (
                      post.comments.map((comment) => (
                        <div key={comment._id} className="flex gap-3 items-start p-3 hover:bg-[#1E1E1E] rounded-lg transition-all duration-300">
                          <div className="avatar">
                            <div className="w-10 rounded-lg overflow-hidden">
                              <img src={comment.user.profileImg || "/avatar-placeholder.png"} />
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base">{comment.user.fullName}</span>
                              <span className="text-gray-700 text-sm">@{comment.user.username}</span>
                            </div>
                            <div className="text-sm mt-1">{comment.text}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* فرم ارسال کامنت */}
                  <form
                    className="flex gap-3 items-center mt-4 border-t border-gray-600 pt-4"
                    onSubmit={handlePostComment}
                  >
                    <textarea
                      className="textarea w-full p-3 rounded-lg text-md resize-none border focus:outline-none border-gray-800 bg-[#1E1E1E]"
                      placeholder="نظر خود را بنویسید..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button className="btn btn-primary rounded-lg btn-sm text-white px-6 py-2">
                      {isCommenting ? <LoadingSpinner size="md" /> : "ارسال"}
                    </button>
                  </form>
                </div>

                {/* دکمه بستن مودال */}
                <form method="dialog" className="modal-backdrop">
                  <button className="outline-none">بستن</button>
                </form>
              </dialog>

              {/* دکمه ری‌پست (فعلاً بدون عملکرد) */}
              <div className="flex flex-col items-center cursor-pointer group">
                <BiRepost className="w-5 h-5 text-slate-500 group-hover:text-green-400 transition-colors duration-300" />
                <span className="text-sm text-slate-500 group-hover:text-green-400 transition-colors duration-300">0</span>
              </div>

              {/* دکمه لایک */}
              <div className="flex flex-col items-center cursor-pointer group" onClick={handleLikePost}>
                {isLiking ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <FaRegHeart
                      className={`w-5 h-5 transition-colors duration-300 ${
                        isLiked ? "text-red-500" : "text-slate-500 group-hover:text-red-500"
                      }`}
                    />
                    <span
                      className={`text-sm transition-colors duration-300 ${
                        isLiked ? "text-red-500" : "text-slate-500 group-hover:text-red-500"
                      }`}
                    >
                      {post.likes.length}
                    </span>
                  </>
                )}
              </div>

              {/* دکمه ذخیره (فعلاً بدون عملکرد) */}
              <div className="flex flex-col items-center cursor-pointer group">
                <FaRegBookmark className="w-5 h-5 text-slate-500 group-hover:text-yellow-400 transition-colors duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// خروجی گرفتن از کامپوننت
export default Post;
