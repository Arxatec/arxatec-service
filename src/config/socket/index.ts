import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { SOCKET_URL } from "../env";

let io: SocketIOServer;

export const initSocket = (server: HttpServer) => {
  const allowedOrigin = SOCKET_URL;

  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join_user_channel", (userId: number) => {
      const room = `user:${userId}`;
      socket.join(room);
      console.log(`Socket ${socket.id} joined the channel: ${room}`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

export { io };
