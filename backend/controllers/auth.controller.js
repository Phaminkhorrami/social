import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// تابع ثبت نام کاربر جدید
export const signup = async (req, res) => {
	try {
		// دریافت اطلاعات کاربر از درخواست
		const { fullName, username, email, password } = req.body;

		// بررسی فرمت ایمیل با استفاده از عبارت منظم
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}

		// بررسی تکراری نبودن نام کاربری
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: "Username is already taken" });
		}

		// بررسی تکراری نبودن ایمیل
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ error: "Email is already taken" });
		}

		// بررسی طول رمز عبور
		if (password.length < 6) {
			return res.status(400).json({ error: "Password must be at least 6 characters long" });
		}

		// تولید نمک و هش کردن رمز عبور
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// ایجاد کاربر جدید
		const newUser = new User({
			fullName,
			username,
			email,
			password: hashedPassword,
		});

		if (newUser) {
			// تولید توکن و تنظیم کوکی
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			// ارسال پاسخ موفقیت‌آمیز با اطلاعات کاربر
			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				email: newUser.email,
				followers: newUser.followers,
				following: newUser.following,
				profileImg: newUser.profileImg,
				coverImg: newUser.coverImg,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// تابع ورود کاربر
export const login = async (req, res) => {
	try {
		// دریافت نام کاربری و رمز عبور از درخواست
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		// بررسی صحت رمز عبور
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		// تولید توکن و تنظیم کوکی
		generateTokenAndSetCookie(user._id, res);

		// ارسال پاسخ موفقیت‌آمیز با اطلاعات کاربر
		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			email: user.email,
			followers: user.followers,
			following: user.following,
			profileImg: user.profileImg,
			coverImg: user.coverImg,
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// تابع خروج کاربر
export const logout = async (req, res) => {
	try {
		// پاک کردن کوکی توکن
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// تابع دریافت اطلاعات کاربر فعلی
export const getMe = async (req, res) => {
	try {
		// یافتن کاربر با حذف فیلد رمز عبور
		const user = await User.findById(req.user._id).select("-password");
		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
