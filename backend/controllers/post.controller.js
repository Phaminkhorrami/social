import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

// ایجاد پست جدید
export const createPost = async (req, res) => {
	try {
		// دریافت متن و تصویر از درخواست
		const { text } = req.body;
		let { img } = req.body;
		const userId = req.user._id.toString();

		// پیدا کردن کاربر با شناسه داده شده
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		// بررسی وجود متن یا تصویر
		if (!text && !img) {
			return res.status(400).json({ error: "Post must have text or image" });
		}

		// آپلود تصویر به کلودینری اگر وجود دارد
		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		// ایجاد پست جدید
		const newPost = new Post({
			user: userId,
			text,
			img,
		});

		// ذخیره پست در دیتابیس
		await newPost.save();
		res.status(201).json(newPost);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
		console.log("Error in createPost controller: ", error);
	}
};

// حذف پست
export const deletePost = async (req, res) => {
	try {
		// پیدا کردن پست با شناسه داده شده
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		// بررسی مالکیت پست
		if (post.user.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "You are not authorized to delete this post" });
		}

		// حذف تصویر از کلودینری اگر وجود دارد
		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		// حذف پست از دیتابیس
		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		console.log("Error in deletePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// کامنت گذاشتن روی پست
export const commentOnPost = async (req, res) => {
	try {
		// دریافت متن کامنت و شناسه‌های پست و کاربر
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;

		// بررسی وجود متن کامنت
		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		// ایجاد کامنت جدید
		const comment = { user: userId, text };

		// اضافه کردن کامنت به پست و ذخیره آن
		post.comments.push(comment);
		await post.save();

		res.status(200).json(post);
	} catch (error) {
		console.log("Error in commentOnPost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// لایک یا آنلایک کردن پست
export const likeUnlikePost = async (req, res) => {
	try {
		const userId = req.user._id;
		const { id: postId } = req.params;

		// پیدا کردن پست
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		// بررسی لایک بودن پست توسط کاربر
		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// آنلایک کردن پست
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

			const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
			res.status(200).json(updatedLikes);
		} else {
			// لایک کردن پست
			post.likes.push(userId);
			await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
			await post.save();

			// ایجاد نوتیفیکیشن برای لایک
			const notification = new Notification({
				from: userId,
				to: post.user,
				type: "like",
			});
			await notification.save();

			const updatedLikes = post.likes;
			res.status(200).json(updatedLikes);
		}
	} catch (error) {
		console.log("Error in likeUnlikePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// دریافت تمام پست‌ها
export const getAllPosts = async (req, res) => {
	try {
		// دریافت تمام پست‌ها با مرتب‌سازی بر اساس تاریخ ایجاد
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		if (posts.length === 0) {
			return res.status(200).json([]);
		}

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getAllPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// دریافت پست‌های لایک شده
export const getLikedPosts = async (req, res) => {
	const userId = req.params.id;

	try {
		// پیدا کردن کاربر
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		// دریافت پست‌های لایک شده توسط کاربر
		const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(likedPosts);
	} catch (error) {
		console.log("Error in getLikedPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// دریافت پست‌های کاربران دنبال شده
export const getFollowingPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		// پیدا کردن کاربر
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const following = user.following;

		// دریافت پست‌های کاربران دنبال شده
		const feedPosts = await Post.find({ user: { $in: following } })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(feedPosts);
	} catch (error) {
		console.log("Error in getFollowingPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// دریافت پست‌های یک کاربر خاص
export const getUserPosts = async (req, res) => {
	try {
		const { username } = req.params;

		// پیدا کردن کاربر با نام کاربری داده شده
		const user = await User.findOne({ username });
		if (!user) return res.status(404).json({ error: "User not found" });

		// دریافت پست‌های کاربر
		const posts = await Post.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getUserPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
