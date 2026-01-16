import express from "express";
import WebSocket, { WebSocketServer } from "ws";

const app = express();
const httpServer = app.listen(process.env.PORT || 8081);

/* -----------------------------
   GLOBAL SAFETY (IMPORTANT)
--------------------------------*/
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});

/* -----------------------------
   WebSocket Server
--------------------------------*/
const wss = new WebSocketServer({ server: httpServer });



wss.on('connection', function connection(ws) {

    ws.on('error', console.error);

    ws.on('message', function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
            if (client != ws && client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
                console.log(data);
            }
        });
    });

    ws.send('hello from server')

    ws.on("error", (err) => {
        console.error("Socket error:", err);
    })
})



/* -----------------------------
   Graceful shutdown
--------------------------------*/
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
    console.log("Shutting down server...");
    //   clearInterval(interval);

    wss.clients.forEach((ws) => {
        // try {
        ws.terminate();
        // } catch { }
    });

    httpServer.close(() => process.exit(0));
}
// })