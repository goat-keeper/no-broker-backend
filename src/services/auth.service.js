import User from "../models/user.model.js";

import { comparePassword, hashPassword } from "../lib/hash.js";
import { signAccessToken, verifyAccessToken } from "../lib/jwt.js";
import cloudinary from "../lib/cloudinary.js";

export async function registerUser(userData) {
const user = new User(userData);

await user.validate();

user.password = await hashPassword(user.password);

await user.save();

return {
user: toPublicUser(user),
token: signAccessToken({ userId: user._id }),
};
}

export async function authenticateUser(email, password) {
const user = await User.findOne({ email }).select("+password");

if (!user || !(await comparePassword(password, user.password))) {
const error = new Error("Invalid email or password");
error.statusCode = 401;
throw error;
}

return {
user: toPublicUser(user),
token: signAccessToken({ userId: user._id }),
};
}

export function authenticateToken(token) {
return verifyAccessToken(token);
}

export async function getMe(user) {
const currUser = await User.findById(user.userId);

if (!currUser) {
const error = new Error("User not found");
error.statusCode = 404;
throw error;
}

return toPublicUser(currUser);
}

export async function completeUser(userId, phoneNumber, address, profileUrl) {
  
const user = await User.findByIdAndUpdate(
userId,
{
phoneNumber,
address,
profileImage: profileUrl,
onBoarded: true,
},
{
new: true,
runValidators: true,
}
);

if (!user) {
const error = new Error("User not found");
error.statusCode = 404;
throw error;
}

return toPublicUser(user);
}

export async function uploadToCloudinary(image){
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;
    return imageUrl;
}

function toPublicUser(user) {
return {
id: user._id,
username: user.username,
fullname: user.fullname,
email: user.email,
profileImage: user.profileImage,
phoneNumber: user.phoneNumber,
isOnboarded: user.onBoarded,
createdAt: user.createdAt,
updatedAt: user.updatedAt,
};
}
