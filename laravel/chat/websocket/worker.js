// Cloudflare Worker + Durable Object implementation
// Using WebSocket Hibernation API for efficiency

export default {
  async fetch(request, env) {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected websocket", { status: 400 });
    }

    // Connect to a single global chat room for this demo
    // In a real app, you might derive the ID from the URL: env.CHAT_ROOM.idFromName(url.pathname)
    const id = env.CHAT_ROOM.idFromName("GLOBAL_CHAT");
    const stub = env.CHAT_ROOM.get(id);

    return stub.fetch(request);
  }
};

// Durable Object Class
export class ChatRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    // We keep track of which WebSocket belongs to which user ID
    // Note: In a real DO, this is transient memory. If the DO is evicted, this is lost.
    // For robust presence, you'd store this in this.state.storage, 
    // but for active WebSockets, memory is usually sufficient as they are tied to the DO lifecycle.
    this.sessions = new Map();
  }

  async fetch(request) {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    // Use serializeAttachment to attach metadata (like empty user ID initially) to the socket
    // so we can retrieve it later even after hibernation w/o keeping a Map in memory if we wanted.
    // But for this simple demo, we'll just accept it and wait for the 'user-online' message.
    this.state.acceptWebSocket(server);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async webSocketMessage(ws, message) {
    const broadcast = (data, excludeWs = null) => {
      for (const client of this.state.getWebSockets()) {
        if (client !== excludeWs) {
          try {
            client.send(data);
          } catch (e) { }
        }
      }
    };

    try {
      const data = JSON.parse(message);

      if (!['newmessage', 'user-online'].includes(data.signal)) {
        return;
      }

      if (data.signal === 'user-online') {
        // Associate this websocket with the user ID
        this.sessions.set(ws, data.user);

        // 1. Broadcast to OTHERS that this user is online
        broadcast(JSON.stringify({
          signal: 'user-online',
          user: data.user
        }), ws);

        // 2. Send the CURRENT list of online users to THIS new user
        const onlineUsers = Array.from(new Set(this.sessions.values()));
        ws.send(JSON.stringify({
          signal: 'online-users-list',
          users: onlineUsers
        }));
      }

      if (data.signal === 'newmessage') {
        broadcast(JSON.stringify({
          signal: 'newmessage',
          user: data.user
        }), ws);
      }

    } catch (err) {
      // ignore bad json
    }
  }

  async webSocketClose(ws, code, reason, wasClean) {
    // Determine which user just disconnected
    const userId = this.sessions.get(ws);

    if (userId) {
      this.sessions.delete(ws);

      // Check if this user has any OTHER active connections (opened in another tab?)
      // If not, broadcast 'user-offline'
      const isStillOnline = Array.from(this.sessions.values()).includes(userId);

      if (!isStillOnline) {
        // Broadcast to all remaining clients
        for (const client of this.state.getWebSockets()) {
          try {
            client.send(JSON.stringify({
              signal: 'user-offline',
              user: userId
            }));
          } catch (e) { }
        }
      }
    }
  }

  async webSocketError(ws, error) {
    console.log("WebSocket error:", error);
  }
}
