require("express-async-errors");
const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { Server } = require("socket.io");
const path = require("path");
dotenv.config();
const app = express();

app.use(express.static(path.resolve(__dirname, "./frontend/dist")));

app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./frontend/dist", "index.html"));
});

const port = process.env.PORT || 3000;

app.use(notFound);
app.use(errorHandler);

const node = async () => {
  const connect = await connectDB();
  console.log(`mongodb connect: ${connect.connection.host}`);
};
const fuck = app.listen(port, () => console.log(`node is on port ${port}`));

node();

const io = new Server(fuck, {
  cors: {
    origin: "http://localhost:5173",
  },
  pingTimeout: 6000,
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    socket.emit("connected");
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users is not defined");
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
