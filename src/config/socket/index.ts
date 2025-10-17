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
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on("join_user_channel", (userId: string | number) => {
      const room = `user:${userId}`;
      socket.join(room);
      console.log(`Socket ${socket.id} se unió al canal de usuario: ${room}`);

      socket.emit("joined_channel", { room, userId });
    });

    socket.on("join_case_channel", (caseId: string) => {
      const room = `case:${caseId}`;
      socket.join(room);
      console.log(`Socket ${socket.id} se unió al canal del caso: ${room}`);

      socket.emit("joined_case_channel", { room, caseId });
    });

    socket.on("disconnect", (reason) => {
      console.log(`Cliente desconectado: ${socket.id}, razón: ${reason}`);
    });

    socket.on("error", (error) => {
      console.error(`Error en socket ${socket.id}:`, error);
    });
  });
};

export { io };
