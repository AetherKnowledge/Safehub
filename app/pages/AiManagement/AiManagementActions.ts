"use server";
import {
  AiPreset,
  AiSettings,
  MCPFile,
  UserType,
} from "@/app/generated/prisma";
import { auth } from "@/auth";
import { createFile, deleteFile } from "@/lib/supabase/bucketUtils";
import { Buckets, getBucket } from "@/lib/supabase/client";
import { prettifyZodErrorMessage } from "@/lib/utils";
import { prisma } from "@/prisma/client";
import {
  UpdateToggleableAiSettingsData,
  updateToggleableAiSettingsSchema,
  updateToolSettingsSchema,
  UploadAiPresetData,
  uploadAiPresetSchema,
  UploadMCPFileData,
  uploadMCPFileSchema,
} from "./schemas";

export type AiSettingsWithPreset = AiSettings & {
  preset: AiPreset;
};

export async function getPresets(): Promise<Array<AiPreset>> {
  const session = await auth();
  if (
    !session?.user ||
    session.user.type !== UserType.Admin ||
    session.user.deactivated
  ) {
    throw new Error("Unauthorized");
  }

  return prisma.aiPreset.findMany();
}

export async function getSettings(): Promise<AiSettingsWithPreset> {
  const session = await auth();
  if (!session?.user || session.user.deactivated) {
    throw new Error("Unauthorized");
  }

  const settings = await prisma.aiSettings.findUnique({
    where: { id: 1 },
    include: {
      preset: true,
    },
  });

  if (!settings) {
    throw new Error("Settings not found");
  }

  return settings;
}

export async function addPreset(data: unknown): Promise<AiPreset> {
  const session = await auth();
  if (
    !session?.user ||
    session.user.type !== UserType.Admin ||
    session.user.deactivated
  ) {
    throw new Error("Unauthorized");
  }

  const validation = uploadAiPresetSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(prettifyZodErrorMessage(validation.error));
  }
  const presetData = validation.data;
  const presetCount = await prisma.aiPreset.count();

  const newPreset = await prisma.aiPreset.create({
    data: {
      name: presetData.name || `New Preset ${presetCount + 1}`,
      prompt: presetData.prompt,
      tasks: presetData.tasks || "",
      rules: presetData.rules || "",
      limits: presetData.limits || "",
      examples: presetData.examples || "",
    },
  });

  return newPreset;
}

export async function updatePreset(
  data: UploadAiPresetData
): Promise<AiPreset> {
  const session = await auth();
  if (
    !session?.user ||
    session.user.type !== UserType.Admin ||
    session.user.deactivated
  ) {
    throw new Error("Unauthorized");
  }

  const validation = uploadAiPresetSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(prettifyZodErrorMessage(validation.error));
  }
  const presetData = validation.data;

  if (!presetData.id) {
    throw new Error("Preset ID is required for update");
  }

  const newPreset = await prisma.aiPreset.update({
    where: { id: presetData.id },
    data: validation.data,
  });

  return newPreset;
}

export async function deletePreset(presetId: number): Promise<void> {
  const session = await auth();
  if (
    !session?.user ||
    session.user.type !== UserType.Admin ||
    session.user.deactivated
  ) {
    throw new Error("Unauthorized");
  }

  if (!presetId) {
    throw new Error("Preset ID is required for deletion");
  }

  if (typeof presetId !== "number") {
    throw new Error("Preset ID must be a number");
  }

  const settings = await getSettings();
  if (settings.presetId === presetId) {
    // Revert to default preset if the deleted preset is currently in use
    await prisma.aiSettings.updateMany({
      where: { presetId: presetId },
      data: { presetId: 1 },
    });
  }

  if (presetId === 1) {
    throw new Error("Cannot delete default preset");
  }

  await prisma.aiPreset.delete({ where: { id: presetId } });
}

export async function toggleAiSetting(data: UpdateToggleableAiSettingsData) {
  const session = await auth();
  if (
    !session?.user ||
    session.user.type !== UserType.Admin ||
    session.user.deactivated
  ) {
    throw new Error("Unauthorized");
  }
  const validation = updateToggleableAiSettingsSchema.safeParse(data);

  if (!validation.success) {
    throw new Error(prettifyZodErrorMessage(validation.error));
  }

  await prisma.aiSettings.update({
    where: { id: 1 },
    data: { ...validation.data },
  });
}

export async function setAiPreset(presetId: number) {
  const session = await auth();
  if (
    !session?.user ||
    session.user.type !== UserType.Admin ||
    session.user.deactivated
  ) {
    throw new Error("Unauthorized");
  }

  if (!presetId) {
    throw new Error("Preset ID is required");
  }

  if (typeof presetId !== "number") {
    throw new Error("Preset ID must be a number");
  }

  await prisma.aiSettings.update({
    where: { id: 1 },
    data: { presetId },
  });
}

export async function updateToolSettings(data: unknown) {
  const session = await auth();
  if (
    !session?.user ||
    session.user.type !== UserType.Admin ||
    session.user.deactivated
  ) {
    throw new Error("Unauthorized");
  }
  const validation = updateToolSettingsSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(prettifyZodErrorMessage(validation.error));
  }

  const currentSettings = await prisma.aiSettings.findUnique({
    where: { id: 1 },
    select: { tools: true },
  });

  if (!currentSettings) {
    throw new Error("Settings not found");
  }

  const { tool, enabled } = validation.data;

  let updatedTools = currentSettings.tools ?? [];

  // Add or remove tool from array depending on `enabled`
  if (enabled) {
    // Add if not already included
    if (!updatedTools.includes(tool)) {
      updatedTools = [...updatedTools, tool];
    }
  } else {
    // Remove if it exists
    updatedTools = updatedTools.filter((t) => t !== tool);
  }

  await prisma.aiSettings.update({
    where: { id: 1 },
    data: { tools: updatedTools },
  });
}

export async function getMCPFiles(): Promise<Array<MCPFile>> {
  const session = await auth();
  if (
    !session?.user ||
    session.user.type !== UserType.Admin ||
    !session.supabaseAccessToken ||
    session.user.deactivated
  ) {
    throw new Error("Unauthorized");
  }

  return await prisma.mCPFile.findMany();
}

export async function uploadFileToMCP(
  data: UploadMCPFileData
): Promise<MCPFile> {
  const session = await auth();
  if (
    !session?.user ||
    session.user.type !== UserType.Admin ||
    !session.supabaseAccessToken ||
    session.user.deactivated
  ) {
    throw new Error("Unauthorized");
  }

  const validation = uploadMCPFileSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(prettifyZodErrorMessage(validation.error));
  }
  const fileData = validation.data;
  // Remove spaces from file name
  fileData.name = fileData.name.replaceAll(" ", "");

  const bucket = getBucket(Buckets.Documents, session?.supabaseAccessToken);
  const url: string = await createFile(
    fileData.file,
    bucket,
    Buckets.Documents,
    fileData.name.split(".")[0],
    "",
    true,
    false,
    false
  );

  return await prisma.mCPFile.create({
    data: {
      name: fileData.name,
      url,
    },
  });
}

export async function deleteFileFromMCP(fileId: string) {
  const session = await auth();
  if (
    !session?.user ||
    session.user.type !== UserType.Admin ||
    !session.supabaseAccessToken ||
    session.user.deactivated
  ) {
    throw new Error("Unauthorized");
  }

  const fileData = await prisma.mCPFile.findFirst({
    where: {
      id: fileId,
    },
  });

  if (!fileData) {
    throw new Error("File not found");
  }

  const bucket = getBucket(Buckets.Documents, session?.supabaseAccessToken);
  await deleteFile(fileData.name, bucket);

  await prisma.mCPFile.delete({
    where: {
      id: fileId,
    },
  });
}
