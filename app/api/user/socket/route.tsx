import { auth } from "@/auth";
import ClientSocketServer from "@/lib/socket/ClientSocketServer";
import { NextRequest } from "next/server";
import { WebSocket, WebSocketServer } from "ws";

export function GET() {
  const headers = new Headers();
  headers.set("Connection", "Upgrade");
  headers.set("Upgrade", "websocket");
  return new Response("Upgrade Required", { status: 426, headers });
}

export async function UPGRADE(
  client: WebSocket,
  server: WebSocketServer,
  request: NextRequest
) {
  console.log("Socket count:", server.clients.size);

  const session = await auth();
  console.log(session);

  if (!session || !session.user) {
    client.close(1008, "Unauthorized");
    return;
  }

  console.log("WebSocket connection by user:", session.user.name);

  new ClientSocketServer(client, server, session.user);
}

// export async function UPGRADE(
//   client: WebSocket,
//   server: WebSocketServer,
//   request: NextRequest
// ) {
//   console.log("Socket count:", server.clients.size);

//   const token = await getToken({
//     req: request,
//   });
//   console.log("WebSocket connection attempt by user:", token?.name);

//   if (!token || !token.sub || !token.email) {
//     console.error("Unauthorized access attempt");
//     client.close(1008, "Unauthorized");
//     return;
//   }

//   new ClientSocketServer(client, server, token);
// }
