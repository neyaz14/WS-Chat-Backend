# 🗨️ Room-Based WebSocket Chat Application

This project is a **simple room-based chat application** built using **Node.js, Express, and WebSocket (ws)**.  
It uses an **array-based room management system** (no `Map`) and a **message-type driven protocol** from the frontend.

---

## 🚀 Features

- Room-based chat system
- Array-based room storage (easy to debug & understand)
- Supports joining rooms and sending messages
- Automatic socket cleanup on disconnect
- Simple and extensible message protocol

---

## 🧠 Core Idea

Each room is stored as an object inside an array:

```ts
[
  {
    room: "1",
    allSockets: [socketA, socketB]
  },
  {
    room: "15",
    allSockets: [socketC]
  }
]
```

Messages coming from the frontend always contain a **type**, and the server reacts based on that type.

---

## 📦 Tech Stack

- Node.js
- Express.js
- ws (WebSocket library)
- TypeScript (recommended)

---

## 📂 Project Structure

```text
project-root/
│
├── src/
│   └── server.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔁 Message Protocol

### 1️⃣ Join Room

```json
{
  "type": "join",
  "payload": {
    "roomId": "room1234"
  }
}
```

### 2️⃣ Send Chat Message

```json
{
  "type": "chat",
  "payload": {
    "roomId": "room1234",
    "message": "hii there"
  }
}
```

---

## 🧩 Room Interface

```ts
interface Room {
  room: string;
  allSockets: WebSocket[];
}
```

Rooms are stored in a simple array:

```ts
const rooms: Room[] = [];
```

---

## ⚙️ How It Works

1. A client connects via WebSocket
2. Client sends a `join` message → socket is added to the room
3. Client sends a `chat` message → message is broadcast to all sockets in that room
4. When a client disconnects → socket is removed from all rooms

---

## 🧹 Socket Cleanup

On socket close, the server removes the socket from all rooms to prevent memory leaks:

```ts
ws.on("close", () => {
  removeSocket(ws);
});
```

---

## ▶️ Run the Project

### Install dependencies

```bash
npm install
```

### Start server

```bash
npm run dev
```

Server runs on:

```text
ws://localhost:8081
```

---

## 🔮 Future Improvements

- Heartbeat (ping / pong)
- Username support
- Typing indicator
- Private rooms
- Room auto-delete when empty
- Authentication

---

## 📌 Notes

- This project intentionally avoids `Map` for educational clarity
- Best suited for learning and small-to-medium scale apps
- Easy to refactor later into Redis or database-backed rooms

---

## 🧑‍💻 Author

Built as a learning-focused WebSocket room chat implementation.

Happy hacking 🚀

