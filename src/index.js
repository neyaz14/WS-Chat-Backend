import express from "express";
import WebSocket, { WebSocketServer } from "ws";

const app = express();
const httpServer = app.listen(process.env.PORT || 8081);

app.get("/", (req, res) => {
  res.send(
    "WebSocket server is running, total user in the server is ",
    userCount
  );
  console.log(userCount);
});
/* -----------------------------
   GLOBAL SAFETY (IMPORTANT)
--------------------------------*/
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

function findRoom(roomId) {
  return rooms.find((r) => r.room === roomId);
}

function joinRoom(roomId, socket) {
  let room = findRoom(roomId);

  if (!room) {
    room = { room: roomId, allSockets: [] };
    rooms.push(room);
  }

  if (!room.allSockets.includes(socket)) {
    room.allSockets.push(socket);
  }
}

function removeSocket(socket) {
  for (const room of rooms) {
    room.allSockets = room.allSockets.filter((s) => s !== socket);
  }
}

/* -----------------------------
   WebSocket Server
--------------------------------*/
const wss = new WebSocketServer({ server: httpServer });

let userCount = 0;
const rooms = [];

/**
 * socket : WebSocket
 * room : string
 */

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (data) => {
    try {
      const parsed = JSON.parse(data.toString());

      const { type, payload } = parsed;

      // JOIN ROOM
      if (type === "join") {
        joinRoom(payload.roomId, ws);
        return;
      }

      // CHAT MESSAGE
      if (type === "chat") {
        const roomId = payload.roomId;
        const message = payload.message;

        const room = findRoom(roomId);
        if (!room) return;

        for (const socket of room.allSockets) {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(
              JSON.stringify({
                type: "chat",
                payload: {
                  message,
                },
              })
            );
          }
        }
      }
    } catch (err) {
      console.error("Invalid message format");
    }
  });
});

/* -----------------------------
   Graceful shutdown
--------------------------------*/
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("Shutting down server...");
  //   clearInterval(interval);

  wss.clients.forEach((socket) => {
    // try {
    socket.terminate();
    // } catch { }
  });

  httpServer.close(() => process.exit(0));
}
