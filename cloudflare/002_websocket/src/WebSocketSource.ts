import { DurableObject } from "cloudflare:workers";

interface Env {
    WEBSOCKET_SOURCE: DurableObjectNamespace;
}

export class WebSocketSource extends DurableObject<Env> {
    // Holds the WebSocket connections
    // We can use this.ctx.getWebSockets() to get all active connections if we use the state.

    async fetch(request: Request): Promise<Response> {
        const url = new URL(request.url);

        // Case 1: Client connecting via WebSocket
        if (url.pathname === "/websocket") {
            if (request.headers.get("Upgrade") !== "websocket") {
                return new Response("Expected Upgrade: websocket", { status: 426 });
            }

            const pair = new WebSocketPair();
            const [client, server] = Object.values(pair);

            // Accept the connection
            this.ctx.acceptWebSocket(server);

            // Optional: Should connection be saved? 
            // this.ctx.getWebSockets() automatically tracks accepted sockets.

            return new Response(null, {
                status: 101,
                webSocket: client,
            });
        }

        // Case 2: API Request to broadcast a message
        if (url.pathname === "/broadcast") {
            const message = url.searchParams.get("message");
            if (!message) {
                return new Response("Missing 'message' query parameter", { status: 400 });
            }

            // Broadcast to all connected clients
            this.broadcast(message);
            return new Response(`Broadcasted: "${message}" to active clients.`, { status: 200 });
        }

        return new Response("Not found", { status: 404 });
    }

    async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
        // Just echo back or ignore. For a push notification system, we mostly send OUT.
        // Let's implement a simple ping/pong or debug echo.
        // ws.send(`[Echo] ${message}`);
    }

    async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
        // Connection closed
        // If we were maintaining a manual list, we'd remove it here.
        // Since we rely on this.ctx.getWebSockets(), it's handled automatically.
    }

    async webSocketError(ws: WebSocket, error: unknown) {
        console.error("WebSocket error:", error);
    }

    // Helper to broadcast to all sessions
    broadcast(message: string) {
        for (const ws of this.ctx.getWebSockets()) {
            try {
                ws.send(message);
            } catch (err) {
                // Handle broken connections if any
                console.error("Error broadcasting:", err);
            }
        }
    }
}
