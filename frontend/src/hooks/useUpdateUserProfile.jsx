import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// هوک برای بروزرسانی پروفایل کاربر
const useUpdateUserProfile = () => {
  // ایجاد نمونه از queryClient برای مدیریت کش درخواست‌ها
  const queryClient = useQueryClient();

  // استفاده از useMutation برای انجام درخواست بروزرسانی پروفایل
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async (formData) => {
      try {
        // ارسال داده‌های فرم به سرور برای بروزرسانی پروفایل
        const res = await fetch(`/api/users/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // ارسال داده‌ها به صورت JSON
          },
          body: JSON.stringify(formData), // تبدیل داده‌ها به فرمت JSON
        });
        const data = await res.json();
        
        // بررسی وضعیت پاسخ از سرور
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        
        // در صورت موفقیت داده‌های پروفایل کاربر به روز رسانی می‌شود
        return data;
      } catch (error) {
        // در صورت بروز خطا پیام خطا نمایش داده می‌شود
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      // نمایش پیغام موفقیت‌آمیز بروزرسانی پروفایل
      toast.success("Profile updated successfully");
      
      // نوسازی داده‌های کش برای پروفایل کاربر
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      // نمایش پیغام خطا در صورت بروز مشکل در بروزرسانی
      toast.error(error.message);
    },
  });

  // برگرداندن متغیرهای استفاده‌شده در هوک برای استفاده در سایر بخش‌ها
  return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;
