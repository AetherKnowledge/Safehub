import Client from "@/app/components/Socket/Client";
import { getToken } from "next-auth/jwt";
import { IncomingMessage } from "node:http";
import { WebSocket, WebSocketServer } from "ws";

export async function SOCKET(
  client: WebSocket,
  request: IncomingMessage,
  server: WebSocketServer,
  context: { params: Promise<{ id: string }> }
) {
  console.log("Socket count:", server.clients.size);
  const { id } = await context.params;

  const secret = process.env.NEXTAUTH_SECRET;

  const token = await getToken({ req: request as any, secret });
  console.log(
    "WebSocket connection attempt for chat:",
    id,
    " by ",
    token?.name
  );

  if (!token || !token.sub || !token.email) {
    console.error("Unauthorized access attempt:", request.socket.remoteAddress);
    client.close(1008, "Unauthorized");
    return;
  }

  new Client(client, server, token);
}
