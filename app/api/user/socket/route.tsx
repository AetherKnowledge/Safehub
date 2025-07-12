import ClientSocketServer from "@/lib/socket/ClientSocketServer";
import { getToken } from "next-auth/jwt";
import { IncomingMessage } from "node:http";
import { WebSocket, WebSocketServer } from "ws";

export function GET() {
  const headers = new Headers();
  headers.set("Connection", "Upgrade");
  headers.set("Upgrade", "websocket");
  return new Response("Upgrade Required", { status: 426, headers });
}

export async function SOCKET(
  client: WebSocket,
  request: IncomingMessage,
  server: WebSocketServer
) {
  console.log("Socket count:", server.clients.size);

  const token = await getToken({ req: request as any });
  console.log("WebSocket connection attempt by user:", token?.name);

  if (!token || !token.sub || !token.email) {
    console.error("Unauthorized access attempt:", request.socket.remoteAddress);
    client.close(1008, "Unauthorized");
    return;
  }

  new ClientSocketServer(client, server, token);
}
