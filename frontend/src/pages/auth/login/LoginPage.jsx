import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

import { useMutation, useQueryClient } from "@tanstack/react-query";

// کامپوننت صفحه ورود
const LoginPage = () => {
  // استفاده از useState برای مدیریت داده‌های فرم
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // ایجاد queryClient برای مدیریت کش داده‌ها
  const queryClient = useQueryClient();

  // استفاده از useMutation برای ارسال درخواست ورود
  const {
    mutate: loginMutation,
    isPending,   // برای نمایش وضعیت در حال ارسال درخواست
    isError,     // برای شناسایی خطا
    error,       // برای دسترسی به پیغام خطا
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        // ارسال درخواست به سرور برای ورود
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // نوع داده ارسال شده
          },
          body: JSON.stringify({ username, password }), // داده‌ها به صورت JSON ارسال می‌شوند
        });

        const data = await res.json();

        // بررسی وضعیت پاسخ از سرور
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        // در صورت بروز خطا، خطا را پرتاب می‌کند
        throw new Error(error);
      }
    },
    onSuccess: () => {
      // پس از موفقیت در ورود، کش داده‌ها برای authUser نوسازی می‌شود
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  // تابع ارسال فرم
  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData); // ارسال داده‌های فرم برای ورود
  };

  // تابع برای مدیریت تغییرات ورودی
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // بروزرسانی داده‌های فرم
  };

  return (
    <div className='max-w-screen-xl mx-auto flex h-screen'>
      {/* بخش سمت چپ برای نمایش لوگو یا هر محتوای دیگر */}
      <div className='flex-1 hidden lg:flex items-center justify-center'>
        <XSvg className='lg:w-2/3 fill-white' />
      </div>
      {/* بخش فرم ورود */}
      <div className='flex-1 flex flex-col justify-center items-center'>
        <form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
          <XSvg className='w-24 lg:hidden fill-white' />
          <h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
          {/* فیلد نام کاربری */}
          <label className='input input-bordered rounded flex items-center gap-2'>
            <MdOutlineMail />
            <input
              type='text'
              className='grow'
              placeholder='username'
              name='username'
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>

          {/* فیلد رمز عبور */}
          <label className='input input-bordered rounded flex items-center gap-2'>
            <MdPassword />
            <input
              type='password'
              className='grow'
              placeholder='Password'
              name='password'
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>

          {/* دکمه ورود */}
          <button className='btn rounded-full btn-primary text-white'>
            {isPending ? "Loading..." : "Login"}
          </button>
          {/* نمایش پیغام خطا در صورت بروز مشکل */}
          {isError && <p className='text-red-500'>{error.message}</p>}
        </form>
        {/* بخش ثبت نام برای کاربرانی که حساب ندارند */}
        <div className='flex flex-col gap-2 mt-4'>
          <p className='text-white text-lg'>{"Don't"} have an account?</p>
          <Link to='/signup'>
            <button className='btn rounded-full btn-primary text-white btn-outline w-full'>
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
