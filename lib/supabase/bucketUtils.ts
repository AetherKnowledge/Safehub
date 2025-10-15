import StorageFileApi from "@supabase/storage-js/dist/module/packages/StorageFileApi";
import { fileTypeFromBuffer } from "file-type";
import path from "path";

export async function createFile(
  file: File,
  bucket: StorageFileApi,
  filename: string,
  folderPath?: string,
  upsert = false
): Promise<string> {
  if (!file || !(file instanceof File) || file.size === 0) {
    throw new Error("No file uploaded");
  }

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
    throw new Error("Only image files are allowed");
  }
  if (!/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name)) {
    throw new Error("File extension not allowed");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Validate actual file type using magic bytes
  const type = await fileTypeFromBuffer(buffer);
  if (!type || !type.mime.startsWith("image/")) {
    throw new Error("Uploaded file is not a valid image");
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

  const url = bucket.getPublicUrl(pathSafe);
  return url.data.publicUrl;
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
