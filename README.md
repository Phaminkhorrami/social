# AminTwitter

## توضیحات پروژه
AminTwitter یک پلتفرم شبکه اجتماعی است که با استفاده از تکنولوژی‌های مدرن وب ساخته شده است. این پروژه امکان اشتراک‌گذاری محتوا، تعامل با کاربران دیگر و مدیریت پروفایل شخصی را فراهم می‌کند.

## تکنولوژی‌های استفاده شده
### Frontend
- React.js
- Tailwind CSS
- React Query
- React Router
- DaisyUI

### Backend
- Node.js
- Express.js
- MongoDB

## ویژگی‌ها
- ثبت‌نام و ورود کاربران
- ایجاد و ویرایش پروفایل
- ارسال و ویرایش پست‌ها
- لایک و کامنت روی پست‌ها
- دنبال کردن کاربران
- پنل کاربری شخصی
- نمایش کاربران پیشنهادی

## پیش‌نیازها
- Node.js (نسخه 14 یا بالاتر)
- MongoDB
- npm یا yarn

## نحوه نصب و راه‌اندازی
1. کلون کردن مخزن:
```bash
git clone https://github.com/yourusername/AminTwitter.git
cd AminTwitter
```
اگه پروزه رو دارید لازم نیست

2. نصب وابستگی‌های Frontend:
```bash
cd frontend
npm install
```

3. نصب وابستگی‌های Backend:
```bash
cd ../backend
npm install
```

4. تنظیم فایل‌های محیطی:
- یک فایل `.env` در پوشه backend ایجاد کنید
- متغیرهای محیطی مورد نیاز را تنظیم کنید

5. اجرای پروژه:
```bash
# در پوشه backend
npm run dev
# یا
npm start

# در پوشه frontend
npm run dev
# یا
npm start
```

## مستندات API
API های اصلی پروژه شامل موارد زیر است:
- `/api/auth` - احراز هویت
- `/api/users` - مدیریت کاربران
- `/api/posts` - مدیریت پست‌ها
- `/api/comments` - مدیریت کامنت‌ها

## تست‌ها
برای اجرای تست‌ها:
```bash
npm test
```



