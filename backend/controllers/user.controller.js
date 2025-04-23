import bcrypt from "bcryptjs"; // وارد کردن کتابخانه bcrypt برای رمزنگاری
import { v2 as cloudinary } from "cloudinary"; // وارد کردن کتابخانه cloudinary برای مدیریت تصاویر

// models
import Notification from "../models/notification.model.js"; // وارد کردن مدل اعلان‌ها
import User from "../models/user.model.js"; // وارد کردن مدل کاربر

export const getUserProfile = async (req, res) => {
	const { username } = req.params; // دریافت نام کاربری از پارامترهای درخواست

	try {
		const user = await User.findOne({ username }).select("-password"); // جستجوی کاربر با نام کاربری و حذف فیلد رمز عبور
		if (!user) return res.status(404).json({ message: "User not found" }); // اگر کاربر پیدا نشد، خطا برگردان

		res.status(200).json(user); // ارسال اطلاعات کاربر
	} catch (error) {
		console.log("Error in getUserProfile: ", error.message); // ثبت خطا در کنسول
		res.status(500).json({ error: error.message }); // ارسال خطا به کاربر
	}
};

export const followUnfollowUser = async (req, res) => {
	try {
		const { id } = req.params; // دریافت شناسه کاربر از پارامترها
		const userToModify = await User.findById(id); // یافتن کاربر مورد نظر
		const currentUser = await User.findById(req.user._id); // یافتن کاربر فعلی

		if (id === req.user._id.toString()) {
			return res.status(400).json({ error: "You can't follow/unfollow yourself" }); // بررسی عدم امکان فالو کردن خود
		}

		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" }); // بررسی وجود کاربران

		const isFollowing = currentUser.following.includes(id); // بررسی وضعیت فالو بودن

		if (isFollowing) {
			// Unfollow the user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } }); // حذف فالوور
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } }); // حذف فالووینگ

			res.status(200).json({ message: "User unfollowed successfully" }); // ارسال پیام موفقیت
		} else {
			// Follow the user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } }); // اضافه کردن فالوور
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } }); // اضافه کردن فالووینگ
			// Send notification to the user
			const newNotification = new Notification({
				type: "follow", // نوع اعلان
				from: req.user._id, // فرستنده
				to: userToModify._id, // گیرنده
			});

			await newNotification.save(); // ذخیره اعلان

			res.status(200).json({ message: "User followed successfully" }); // ارسال پیام موفقیت
		}
	} catch (error) {
		console.log("Error in followUnfollowUser: ", error.message); // ثبت خطا در کنسول
		res.status(500).json({ error: error.message }); // ارسال خطا به کاربر
	}
};

export const getSuggestedUsers = async (req, res) => {
	try {
		const userId = req.user._id; // دریافت شناسه کاربر فعلی

		const usersFollowedByMe = await User.findById(userId).select("following"); // دریافت لیست کاربران فالو شده

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId }, // انتخاب کاربران به جز کاربر فعلی
				},
			},
			{ $sample: { size: 10 } }, // انتخاب تصادفی 10 کاربر
		]);

		// فیلتر کردن کاربران پیشنهادی
		const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4); // انتخاب 4 کاربر پیشنهادی

		suggestedUsers.forEach((user) => (user.password = null)); // حذف رمز عبور از اطلاعات کاربران

		res.status(200).json(suggestedUsers); // ارسال کاربران پیشنهادی
	} catch (error) {
		console.log("Error in getSuggestedUsers: ", error.message); // ثبت خطا در کنسول
		res.status(500).json({ error: error.message }); // ارسال خطا به کاربر
	}
};

export const updateUser = async (req, res) => {
	const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body; // دریافت اطلاعات به‌روزرسانی
	let { profileImg, coverImg } = req.body;

	const userId = req.user._id; // دریافت شناسه کاربر

	try {
		let user = await User.findById(userId); // یافتن کاربر
		if (!user) return res.status(404).json({ message: "User not found" }); // بررسی وجود کاربر

		if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
			return res.status(400).json({ error: "Please provide both current password and new password" }); // بررسی کامل بودن اطلاعات رمز عبور
		}

		if (currentPassword && newPassword) {
			const isMatch = await bcrypt.compare(currentPassword, user.password); // بررسی تطابق رمز عبور فعلی
			if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" }); // خطای رمز عبور نادرست
			if (newPassword.length < 6) {
				return res.status(400).json({ error: "Password must be at least 6 characters long" }); // بررسی طول رمز عبور جدید
			}

			const salt = await bcrypt.genSalt(10); // تولید نمک برای رمزنگاری
			user.password = await bcrypt.hash(newPassword, salt); // رمزنگاری رمز عبور جدید
		}

		if (profileImg) {
			if (user.profileImg) {
				// حذف تصویر پروفایل قبلی از cloudinary
				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profileImg); // آپلود تصویر جدید
			profileImg = uploadedResponse.secure_url; // دریافت لینک تصویر
		}

		if (coverImg) {
			if (user.coverImg) {
				await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]); // حذف تصویر کاور قبلی
			}

			const uploadedResponse = await cloudinary.uploader.upload(coverImg); // آپلود تصویر کاور جدید
			coverImg = uploadedResponse.secure_url; // دریافت لینک تصویر
		}

		// به‌روزرسانی اطلاعات کاربر
		user.fullName = fullName || user.fullName;
		user.email = email || user.email;
		user.username = username || user.username;
		user.bio = bio || user.bio;
		user.link = link || user.link;
		user.profileImg = profileImg || user.profileImg;
		user.coverImg = coverImg || user.coverImg;

		user = await user.save(); // ذخیره تغییرات

		user.password = null; // حذف رمز عبور از پاسخ

		return res.status(200).json(user); // ارسال اطلاعات به‌روز شده
	} catch (error) {
		console.log("Error in updateUser: ", error.message); // ثبت خطا در کنسول
		res.status(500).json({ error: error.message }); // ارسال خطا به کاربر
	}
};
