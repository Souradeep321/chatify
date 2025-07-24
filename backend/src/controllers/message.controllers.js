import { getRecieverSocketId } from "../lib/socket.js";
import { Message } from "../models/message.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { io } from "../lib/socket.js";

const getUsersForSidebar = asyncHandler(async (req, res) => {
    const filteredUsers = await User.find({ _id: { $ne: req.user?._id } })
        .select("-password -refreshToken")
        .lean();
    return res.status(200).json(new ApiResponse(200, filteredUsers, "Users fetched successfully"));
})

const getMessages = asyncHandler(async (req, res) => {
    const { id: userToChatID } = req.params;
    const myId = req.user._id;


    const messages = await Message.find({
        $or: [
            { senderId: myId, receiverId: userToChatID },
            { senderId: userToChatID, receiverId: myId },
        ],
    });

    return res
        .status(200)
        .json(new ApiResponse(200, messages, "Messages fetched successfully"));

})


const sendMessage = asyncHandler(async (req, res) => {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Validate: At least text or image must be present
    if (!text?.trim() && !req.file?.path) {
        throw new ApiError(400, "Message must contain text or an image");
    }

    let imageData = { url: "", public_id: "" };
    if (req.file?.path) {
        const image = await uploadOnCloudinary(req.file.path);
        if (!image?.url || !image?.public_id) {
            throw new ApiError(500, "Failed to upload image");
        }
        imageData = {
            url: image.url,
            public_id: image.public_id,
        };
    }

    const message = await Message.create({
        senderId,
        receiverId,
        text: text?.trim(),
        image: imageData,
    });

    const receiverSocketId = getRecieverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", message);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, message, "Message sent successfully"));
});


export {
    getUsersForSidebar,
    getMessages,
    sendMessage
}