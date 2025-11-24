import { auth } from "@/auth";
import ClientSocketServer from "@/lib/socket/ClientSocketServer";
import { WebSocket, WebSocketServer } from "ws";

export function GET() {
  const headers = new Headers();
  headers.set("Connection", "Upgrade");
  headers.set("Upgrade", "websocket");
  return new Response("Upgrade Required", { status: 426, headers });
}

export async function UPGRADE(client: WebSocket, server: WebSocketServer) {
  console.log("Socket count:", server.clients.size);

  const session = await auth();
  console.log(session);

  if (!session || !session.user || session.user.deactivated) {
    client.close(1008, "Unauthorized");
    return;
  }

  console.log("WebSocket connection by user:", session.user.name);

  new ClientSocketServer(client, server, session.user);
}
