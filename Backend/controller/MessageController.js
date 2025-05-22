const { io, userSocketMap } = require("../app"); // Assuming you export both from app.js
const cloudinary = require("../lib/CLOUDINARY");
const Message = require("../model/Message.Model");
const User = require("../model/User.models");
const { userSocketMap: configUserSocketMap } = require('../config/socket');
// const {io, }



 const getUserForSlider = async (req, res) => {
    try {
        const userId = req.user._id;
        const filterdUser = await User.find({_id: {$ne: userId}}).select("-password");


        // count number of messages not seen

        const unseenMessages = {}

        const  promises = filterdUser.map(async (user) => {
            const message = await Message.find({
                senderId: user._id, 
                receiverId:userId,
                seen:false
            });

            if(message.length > 0) {
                unseenMessages[user._id] = message.length
            }
        })
        await Promise.all(promises);
        res.json({success: true, users:filterdUser, unseenMessages})
        
    } catch (error) {
        console.error('Error in getUserForSlider:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching users"
        });
    }
}



// get message all
 const getAllMessages = async (req, res) => {
    try {

        const { id: selecteUserId} = req.params;
        const myId = req.user._id
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selecteUserId },
                { senderId: selecteUserId, receiverId: myId },
            ]
        })

        await Message.updateMany( { senderId: selecteUserId, receiverId: myId },{ seen:true});
        res.json({success: true, messages})

        
    } catch (error) {
        console.error('Error in getAllMessages:', error);
        res.status(500).json({
            success: false, 
            message: "Error fetching messages"
        });
    }
}






// api  to make message as seen using message id
 const makeMessageAsSeen = async (req, res) => {
    try {

        const {id} = req.params;
        await Message.findByIdAndUpdate(id, {seen:true})
        res.json({
            success: true,
            message: "Message marked as seen",
        })
        
    } catch (error) {
        console.error('Error in makeMessageAsSeen:', error);
        res.status(500).json({
            success: false, 
            message: "Error making message as seen"
        });
    }
}


// send the message to select user


const sendMessage = async (req, res) => {
    try {
        console.log('Received message request:', {
            body: req.body,
            params: req.params,
            user: req.user
        });

        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        // Validate receiver ID
        if (!receiverId) {
            console.error('Missing receiver ID');
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required"
            });
        }

        // Validate sender ID
        if (!senderId) {
            console.error('Missing sender ID');
            return res.status(400).json({
                success: false,
                message: "Sender ID is required"
            });
        }

        // Validate message content
        if (!text && !image) {
            console.error('Missing message content');
            return res.status(400).json({
                success: false,
                message: "Message must contain either text or image"
            });
        }

        let imageUrl;
        if(image) {
            try {
                console.log('Processing image upload...');
                console.log('Image type:', typeof image);
                console.log('Image starts with data:image?', typeof image === 'string' && image.startsWith('data:image'));

                // Handle base64 image data
                if (typeof image === 'string' && image.startsWith('data:image')) {
                    // Validate image size (max 5MB)
                    const base64Data = image.split(',')[1];
                    const imageSize = Math.ceil((base64Data.length * 3) / 4);
                    console.log('Image size:', imageSize, 'bytes');

                    if (imageSize > 5 * 1024 * 1024) {
                        return res.status(400).json({
                            success: false,
                            message: "Image size should be less than 5MB"
                        });
                    }

                    // Upload to Cloudinary with better error handling
                    console.log('Uploading to Cloudinary...');
                    const uploadResponse = await cloudinary.uploader.upload(image, {
                        resource_type: "auto",
                        folder: "chat_images",
                        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
                        transformation: [
                            { width: 1000, height: 1000, crop: "limit" },
                            { quality: "auto" }
                        ]
                    });

                    console.log('Cloudinary upload response:', uploadResponse);

                    if (!uploadResponse || !uploadResponse.secure_url) {
                        throw new Error('Failed to get secure URL from Cloudinary');
                    }

                    imageUrl = uploadResponse.secure_url;
                    console.log('Image uploaded successfully:', imageUrl);
                } else if (typeof image === 'string' && image.startsWith('http')) {
                    // If it's already a URL, use it directly
                    imageUrl = image;
                    console.log('Using existing image URL:', imageUrl);
                } else {
                    console.error('Invalid image format:', typeof image);
                    return res.status(400).json({
                        success: false,
                        message: "Invalid image format. Please provide a valid image file or URL."
                    });
                }

                // Validate the image URL before saving
                if (!imageUrl || !imageUrl.startsWith('http')) {
                    throw new Error('Invalid image URL format');
                }
            } catch (uploadError) {
                console.error('Error uploading image:', uploadError);
                return res.status(500).json({
                    success: false,
                    message: "Error uploading image: " + uploadError.message
                });
            }
        }

        // Create the message
        console.log('Creating new message with image URL:', imageUrl);
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text: text || '',
            image: imageUrl || null,
            seen: false
        });
        console.log('Message created successfully:', newMessage);

        // Get the socket.io instance from the app
        const io = req.app.get('io');
        
        // Emit the new message to both sender and receiver
        const senderSocketId = configUserSocketMap[senderId];
        const receiverSocketId = configUserSocketMap[receiverId];

        if (senderSocketId) {
            console.log('Emitting message to sender:', senderSocketId);
            io.to(senderSocketId).emit("newMessage", newMessage);
        }

        if (receiverSocketId) {
            console.log('Emitting message to receiver:', receiverSocketId);
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        
        res.json({
            success: true,
            newMessage
        });
    } catch (error) {
        console.error('Error in sendMessage:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false, 
            message: "Error sending message: " + error.message
        });
    }
}

module.exports = { getAllMessages, makeMessageAsSeen ,getUserForSlider, sendMessage };