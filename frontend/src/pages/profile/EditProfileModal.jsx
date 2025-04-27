import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const EditProfileModal = ({ authUser }) => {
  // استفاده از useState برای ذخیره داده‌های فرم
  const [formData, setFormData] = useState({
    fullName: "",  // نام کامل
    username: "",  // نام کاربری
    email: "",     // ایمیل
    bio: "",       // بیوگرافی
    link: "",      // لینک
    newPassword: "", // کلمه عبور جدید
    currentPassword: "", // کلمه عبور فعلی
  });

  // استفاده از hook سفارشی برای به‌روزرسانی پروفایل
  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  // تابعی برای مدیریت تغییرات ورودی‌ها در فرم
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // استفاده از useEffect برای بارگذاری داده‌های کاربر هنگام تغییر authUser
  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName,
        username: authUser.username,
        email: authUser.email,
        bio: authUser.bio,
        link: authUser.link,
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);

  return (
    <>
      {/* دکمه‌ای برای باز کردن مدال و ویرایش پروفایل */}
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() => document.getElementById("edit_profile_modal").showModal()}
      >
        Edit profile
      </button>
      
      {/* مدال ویرایش پروفایل */}
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box border rounded-md border-gray-700 shadow-md">
          <h3 className="font-bold text-lg my-3">Update Profile</h3>
          
          {/* فرم به‌روزرسانی پروفایل */}
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();  // جلوگیری از رفتار پیش‌فرض ارسال فرم
              updateProfile(formData);  // به‌روزرسانی پروفایل
            }}
          >
            {/* فیلدهای فرم برای وارد کردن اطلاعات پروفایل */}
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Full Name"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.fullName}
                name="fullName"
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Username"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.username}
                name="username"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
              <textarea
                placeholder="Bio"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.bio}
                name="bio"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="password"
                placeholder="Current Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.currentPassword}
                name="currentPassword"
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="New Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.newPassword}
                name="newPassword"
                onChange={handleInputChange}
              />
            </div>
            <input
              type="text"
              placeholder="Link"
              className="flex-1 input border border-gray-700 rounded p-2 input-md"
              value={formData.link}
              name="link"
              onChange={handleInputChange}
            />
            
            {/* دکمه ارسال فرم */}
            <button className="btn btn-primary rounded-full btn-sm text-white">
              {isUpdatingProfile ? "Updating..." : "Update"}  {/* متن دکمه بسته به وضعیت تغییر می‌کند */}
            </button>
          </form>
        </div>
        
        {/* دکمه برای بستن مدال */}
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">close</button>
        </form>
      </dialog>
    </>
  );
};

export default EditProfileModal;
