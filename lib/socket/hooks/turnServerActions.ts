"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma/client";

type TurnCredentials = {
  username: string;
  password: string;
  expiryInSeconds?: number;
  label?: string;
  apiKey?: string;
};

export async function getTurnCredentials(
  callId: string
): Promise<TurnCredentials> {
  const createCredentialResponse = await fetch(
    `https://${process.env.TURN_SERVER_URL}/api/v1/turn/credential?secretKey=${process.env.TURN_SERVER_SECRET_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expiryInSeconds: 14400,
        label: callId,
      }),
    }
  );
  if (!createCredentialResponse.ok) {
    console.error(
      "Failed to create TURN credentials:",
      createCredentialResponse.statusText
    );
    const errorMessage = await createCredentialResponse.json();
    throw new Error("Failed to create TURN credentials" + errorMessage.message);
  }
  const credentialData =
    (await createCredentialResponse.json()) as TurnCredentials;
  return credentialData;
}

export async function deleteTurnCredentials(callId: string) {
  const call = await prisma.call.findUnique({
    where: { id: callId },
    select: { turnCredentials: true },
  });

  if (!call || !call.turnCredentials) {
    console.error("No TURN credentials found for call:", callId);
    return;
  }

  const createCredentialResponse = await fetch(
    `https://${process.env.TURN_SERVER_URL}/api/v1/turn/credential?secretKey=${process.env.TURN_SERVER_SECRET_KEY}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: (call.turnCredentials as TurnCredentials).username,
      }),
    }
  );
  if (!createCredentialResponse.ok) {
    console.error(
      "Failed to create TURN credentials:",
      createCredentialResponse.statusText
    );
    const errorMessage = await createCredentialResponse.json();
    throw new Error("Failed to create TURN credentials" + errorMessage.message);
  }
  console.log("TURN credentials deleted for call:", callId);
}

export async function getIceServers(
  callId: string
): Promise<RTCIceServer[] | null> {
  const session = await auth();
  if (!session?.user || session.user.deactivated) {
    throw new Error("Unauthorized");
  }

  const call = await prisma.call.findUnique({
    where: { id: callId },
    select: { turnCredentials: true, chat: { include: { members: true } } },
  });

  if (!call || !call.turnCredentials) {
    return null;
  }

  if (!call.chat.members.some((cm) => cm.userId === session.user.id)) {
    throw new Error("User is not a member of the call");
  }

  const turnCredentials = call.turnCredentials as TurnCredentials;
  const response = await fetch(
    `https://${process.env.TURN_SERVER_URL}/api/v1/turn/credentials?apiKey=${turnCredentials.apiKey}`
  );
  if (!response.ok) {
    console.error("Failed to fetch TURN credentials:", response.statusText);
    return null;
  }

  const data = await response.json();
  console.log("Fetched ICE servers:", data as RTCIceServer[]);
  return data as RTCIceServer[];
}
