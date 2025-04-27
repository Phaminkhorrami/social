import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// کامپوننت صفحه ثبت نام
const SignUpPage = () => {
  // استفاده از useState برای مدیریت داده‌های فرم
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  // ایجاد queryClient برای مدیریت کش داده‌ها
  const queryClient = useQueryClient();

  // استفاده از useMutation برای ارسال درخواست ثبت نام
  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      try {
        // ارسال درخواست ثبت نام به سرور
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // نوع داده ارسال شده
          },
          body: JSON.stringify({ email, username, fullName, password }), // داده‌ها به صورت JSON ارسال می‌شوند
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create account");
        console.log(data); // در صورت موفقیت، داده‌های پاسخ را در کنسول چاپ می‌کند
        return data;
      } catch (error) {
        console.error(error); // در صورت بروز خطا، خطا در کنسول چاپ می‌شود
        throw error;
      }
    },
    onSuccess: () => {
      // پس از موفقیت در ثبت نام، پیام موفقیت نشان داده می‌شود
      toast.success("Account created successfully");

      // نوسازی کش داده‌ها برای authUser
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  // تابع ارسال فرم
  const handleSubmit = (e) => {
    e.preventDefault(); // جلوگیری از رفرش صفحه
    mutate(formData); // ارسال داده‌های فرم برای ثبت نام
  };

  // تابع برای مدیریت تغییرات ورودی‌ها
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // بروزرسانی داده‌های فرم
  };

  return (
    <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
      {/* بخش سمت چپ برای نمایش لوگو یا هر محتوای دیگر */}
      <div className='flex-1 hidden lg:flex items-center justify-center'>
        <XSvg className='lg:w-2/3 fill-white' />
      </div>
      {/* بخش فرم ثبت نام */}
      <div className='flex-1 flex flex-col justify-center items-center'>
        <form className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
          <XSvg className='w-24 lg:hidden fill-white' />
          <h1 className='text-4xl font-extrabold text-white'>Join today.</h1>

          {/* فیلد ایمیل */}
          <label className='input input-bordered rounded flex items-center gap-2'>
            <MdOutlineMail />
            <input
              type='email'
              className='grow'
              placeholder='Email'
              name='email'
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>

          {/* فیلد نام کاربری و نام کامل */}
          <div className='flex gap-4 flex-wrap'>
            <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
              <FaUser />
              <input
                type='text'
                className='grow'
                placeholder='Username'
                name='username'
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>
            <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
              <MdDriveFileRenameOutline />
              <input
                type='text'
                className='grow'
                placeholder='Full Name'
                name='fullName'
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </label>
          </div>

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

          {/* دکمه ثبت نام */}
          <button className='btn rounded-full btn-primary text-white'>
            {isPending ? "Loading..." : "Sign up"}
          </button>

          {/* نمایش پیغام خطا در صورت بروز مشکل */}
          {isError && <p className='text-red-500'>{error.message}</p>}
        </form>

        {/* بخش ورود برای کاربرانی که حساب دارند */}
        <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
          <p className='text-white text-lg'>Already have an account?</p>
          <Link to='/login'>
            <button className='btn rounded-full btn-primary text-white btn-outline w-full'>
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
