import StorageFileApi from "@supabase/storage-js/dist/module/packages/StorageFileApi";
import { fileTypeFromBuffer, FileTypeResult } from "file-type";
import { env } from "next-runtime-env";
import path from "path";
import { Buckets } from "./client";

export async function createFile(
  file: File,
  bucket: StorageFileApi,
  bucketName: Buckets,
  filename: string,
  folderPath?: string,
  upsert = false,
  imageOnly = false,
  isPublic = true
): Promise<string> {
  if (!file || !(file instanceof File) || file.size === 0) {
    throw new Error("No file uploaded");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const type = await fileTypeFromBuffer(buffer);
  if (!type) {
    throw new Error("Invalid Type");
  }

  if (imageOnly && !isFileImage(file, type)) {
    throw new Error("Only Image files are allowed");
  }

  const ext = type?.ext || "bin";
  const pathSafe = path.posix.join(folderPath || "", `${filename}.${ext}`);

  const { error } = await bucket.upload(pathSafe, buffer, {
    contentType: type.mime,
    upsert,
  });

  if (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }

  const url = isPublic
    ? bucket.getPublicUrl(pathSafe).data.publicUrl
    : `${env(
        "NEXT_PUBLIC_SUPABASE_URL"
      )}/storage/v1/object/authenticated/${bucketName}/${pathSafe}`;
  return url;
}

export function isFileImage(file: File, type: FileTypeResult): boolean {
  // Check MIME type and extension
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];
  if (!allowedTypes.includes(file.type)) {
    return false;
  }
  if (!/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name)) {
    return false;
  }

  if (!type || !type.mime.startsWith("image/")) {
    throw new Error("Uploaded file is not a valid image");
  }

  return true;
}

export async function deleteFile(filePath: string, bucket: StorageFileApi) {
  await bucket.remove([filePath]);
}

export async function deleteFolder(folderPath: string, bucket: StorageFileApi) {
  const items = await bucket.list(folderPath);
  await bucket.remove(
    items.data?.map((item) => folderPath + "/" + item.name) || []
  );
}

// itemsToCopy are the filenames (not full paths) that should be copied instead of moved
// this is useful when updating an entity and you want to keep some existing files
export async function createTemporaryFolder(
  oldFolderPath: string,
  newFolderPath: string,
  bucket: StorageFileApi,
  itemsToCopy: (string | undefined)[] = []
) {
  const items = await bucket.list(oldFolderPath);
  return await Promise.all(
    items.data?.map(async (item) => {
      const newPath = path.posix.join(newFolderPath, item.name);
      if (itemsToCopy.includes(item.name)) {
        await bucket.copy(oldFolderPath + "/" + item.name, newPath);
      } else {
        await bucket.move(oldFolderPath + "/" + item.name, newPath);
      }
    }) || []
  );
}
