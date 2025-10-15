"use server";
import { UserType } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { upsertHotlineSchema } from "@/lib/schemas";
import { Buckets, getBucket } from "@/lib/supabase/client";
import { createFile, deleteFolder } from "@/lib/utils";
import { prisma } from "@/prisma/client";

export async function getAllHotline() {
  const session = auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  return await prisma.hotline.findMany();
}

export async function upsertHotline(formData: FormData) {
  const session = await auth();
  if (!session || session.user.type !== UserType.Admin) {
    throw new Error("Unauthorized");
  }

  const validation = upsertHotlineSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
  });

  if (!validation.success) {
    throw new Error("Invalid data", { cause: validation.error });
  }

  const { id, name, phone, description, website, image } = validation.data;
  let hotline = null;
  let justCreated = false;

  if (!id) {
    hotline = await prisma.hotline.create({
      data: { name, phone, description, website },
    });
    justCreated = true;
  } else {
    console.log("Updating hotline with id:", id);
    hotline = await prisma.hotline.update({
      where: { id },
      data: { name, phone, description, website },
    });
    justCreated = false;
  }

  const bucket = await getBucket(
    Buckets.Hotline,
    session?.supabaseAccessToken || ""
  );

  let url: string | undefined = undefined;
  if (image && typeof image === "string" && image.length > 0) {
    url = image;
  } else if (image && image instanceof File && image.size > 0) {
    await createFile(image, bucket, hotline.id, hotline.id, true)
      .then((uploadedUrl) => {
        url = uploadedUrl;
      })
      .catch(async (error) => {
        justCreated &&
          (await prisma.hotline.delete({ where: { id: hotline.id } }));
        throw new Error("Failed to upload image " + error?.message || "");
      });
  }

  if (url) {
    await prisma.hotline.update({
      where: { id: hotline.id },
      data: { image: url },
    });
  }
}

export async function deleteHotline(id: string) {
  const session = await auth();
  if (!session || session.user.type !== UserType.Admin) {
    throw new Error("Unauthorized");
  }

  try {
    const deletedHotline = await prisma.hotline.delete({ where: { id } });
    const bucket = await getBucket(
      Buckets.Hotline,
      session?.supabaseAccessToken || ""
    );
    await deleteFolder(deletedHotline.id, bucket);
  } catch (error) {
    throw new Error("Failed to delete hotline. " + (error as Error).message);
  }
}
