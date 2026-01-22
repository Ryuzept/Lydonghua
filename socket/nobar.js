import { Server } from "socket.io";
import jwt from "jsonwebtoken";

export function initNobarSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const nobar = io.of("/nobar");

  // 🔐 Auth middleware
  nobar.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  nobar.on("connection", (socket) => {
    console.log("User connected:", socket.user.id);

    // 🏠 Create room (HOST)
    socket.on("create_room", ({ episodeId }, cb) => {
      const roomId = `nobar-${episodeId}-${Date.now()}`;
      socket.join(roomId);
      socket.roomId = roomId;
      socket.isHost = true;

      cb({ roomId });
    });

    // 🚪 Join room
    socket.on("join_room", ({ roomId }) => {
      socket.join(roomId);
      socket.roomId = roomId;
      socket.isHost = false;

      socket.to(roomId).emit("user_joined", {
        userId: socket.user.id,
      });
    });

    // ▶️ VIDEO CONTROL (HOST ONLY)
    socket.on("video_event", (data) => {
      if (!socket.isHost) return;

      socket.to(socket.roomId).emit("video_sync", {
        type: data.type, // play | pause | seek
        currentTime: data.currentTime,
      });
    });

    // 💬 CHAT
    socket.on("chat_message", (msg) => {
      nobar.to(socket.roomId).emit("chat_message", {
        user: socket.user.display_name,
        message: msg,
        time: Date.now(),
      });
    });

    // 🎁 GIFT COIN
    socket.on("gift_coin", ({ amount }) => {
      nobar.to(socket.roomId).emit("gift_coin", {
        from: socket.user.display_name,
        amount,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}
