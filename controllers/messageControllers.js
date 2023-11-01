const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId })
    .populate("sender", "name pic email")
    .populate("chat");
  res.json(messages);
};

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  let message = new Message({
    sender: req.user.id,
    content: content,
    chat: chatId,
  });
  const saved = await message.save();
  let finalMessage = await Message.findById(saved._id)
    .populate("sender", "name pic")
    .populate("chat");
  finalMessage = await User.populate(finalMessage, {
    path: "chat.users",
    select: "name pic email",
  });

  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: finalMessage,
  });

  res.json(finalMessage);
};

module.exports = { allMessages, sendMessage };
