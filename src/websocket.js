import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const connectedUsers = new Map();

export function setupWebSocketServer(wss) {
  wss.on("connection", async (ws) => {
    let userId = null;

    ws.on("message", async (message) => {
      const data = JSON.parse(message);

      switch (data.type) {
        case "auth":
          userId = data.userId;
          connectedUsers.set(userId, ws);
          broadcastOnlineUsers();
          break;

        case "chat":
          await handleChatMessage(data);
          break;
      }
    });

    ws.on("close", () => {
      if (userId) {
        connectedUsers.delete(userId);
        broadcastOnlineUsers();
      }
    });
  });
}

async function handleChatMessage(data) {
  const { from, to, content } = data;

  const message = await prisma.message.create({
    data: {
      content,
      senderId: from,
      receiverId: to,
    },
  });

  const recipientWs = connectedUsers.get(to);
  if (recipientWs) {
    recipientWs.send(
      JSON.stringify({
        type: "chat",
        message: {
          id: message.id,
          content,
          from,
          timestamp: message.createdAt,
        },
      })
    );
  }
}

function broadcastOnlineUsers() {
  const onlineUsers = Array.from(connectedUsers.keys());
  const message = JSON.stringify({
    type: "onlineUsers",
    users: onlineUsers,
  });

  for (const ws of connectedUsers.values()) {
    ws.send(message);
  }
}
