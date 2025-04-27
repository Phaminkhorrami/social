import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// کامپوننت ایجاد پست
const CreatePost = () => {
  // مدیریت وضعیت برای متن و تصویر پست
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);

  // درخواست داده‌های کاربر وارد شده (authUser)
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  // استفاده از useMutation برای ارسال درخواست پست جدید
  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        // ارسال درخواست ایجاد پست به سرور
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },

    // در صورت موفقیت در ارسال پست
    onSuccess: () => {
      setText(""); // پاک کردن متن
      setImg(null); // پاک کردن تصویر
      toast.success("Post created successfully"); // نمایش پیام موفقیت
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // نوسازی داده‌ها
    },
  });

  // تابع ارسال فرم
  const handleSubmit = (e) => {
    e.preventDefault(); // جلوگیری از رفرش صفحه
    createPost({ text, img }); // ارسال داده‌ها
  };

  // تابع تغییر تصویر
  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result); // ذخیره تصویر
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='flex p-4 items-start gap-4 border-b border-gray-700'>
      {/* نمایش تصویر پروفایل کاربر */}
      <div className='avatar'>
        <div className='w-8 rounded-full'>
          <img src={authUser.profileImg || "/avatar-placeholder.png"} />
        </div>
      </div>

      {/* فرم ایجاد پست */}
      <form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
        {/* فیلد برای نوشتن متن پست */}
        <textarea
          className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800'
          placeholder='What is happening?!'
          value={text}
          onChange={(e) => setText(e.target.value)} // به روز رسانی متن
        />
        
        {/* نمایش تصویر انتخابی */}
        {img && (
          <div className='relative w-72 mx-auto'>
            {/* دکمه برای حذف تصویر */}
            <IoCloseSharp
              className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
              onClick={() => {
                setImg(null); // پاک کردن تصویر
                imgRef.current.value = null; // پاک کردن ورودی فایل
              }}
            />
            <img src={img} className='w-full mx-auto h-72 object-contain rounded' />
          </div>
        )}

        {/* بخش انتخاب تصویر و ارسال پست */}
        <div className='flex justify-between border-t py-2 border-t-gray-700'>
          <div className='flex gap-1 items-center'>
            {/* آیکن برای انتخاب تصویر */}
            <CiImageOn
              className='fill-primary w-6 h-6 cursor-pointer'
              onClick={() => imgRef.current.click()} // کلیک برای انتخاب فایل
            />
            <BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
          </div>
          {/* ورودی فایل برای انتخاب تصویر */}
          <input type='file' accept='image/*' hidden ref={imgRef} onChange={handleImgChange} />
          {/* دکمه ارسال پست */}
          <button className='btn btn-primary rounded-full btn-sm text-white px-4'>
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {/* نمایش خطای ارسال درخواست */}
        {isError && <div className='text-red-500'>{error.message}</div>}
      </form>
    </div>
  );
};

export default CreatePost;
