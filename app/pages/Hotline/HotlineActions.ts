"use server";
import { UserType } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { UploadHotlineData, uploadHotlineSchema } from "@/lib/schemas";
import {
  createFile,
  createTemporaryFolder,
  deleteFolder,
} from "@/lib/supabase/bucketUtils";
import { Buckets, getBucket } from "@/lib/supabase/client";
import { prettifyZodErrorMessage } from "@/lib/utils";
import { prisma } from "@/prisma/client";

export async function getAllHotline() {
  const session = await auth();
  if (!session || session.user.deactivated) {
    throw new Error("Unauthorized");
  }

  return await prisma.hotline.findMany();
}

export async function getThreeHotlines() {
  const session = await auth();
  if (!session || session.user.deactivated) {
    throw new Error("Unauthorized");
  }

  return await prisma.hotline.findMany({ take: 4 });
}

export async function upsertHotline(data: UploadHotlineData) {
  const session = await auth();
  if (
    !session ||
    session.user.type !== UserType.Admin ||
    session.user.deactivated
  ) {
    throw new Error("Unauthorized");
  }

  const validation = uploadHotlineSchema.safeParse(data);

  if (!validation.success) {
    throw new Error(prettifyZodErrorMessage(validation.error));
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

  const bucket = getBucket(Buckets.Hotline, session?.supabaseAccessToken || "");

  // Move existing images to a temp folder
  // This is to prevent losing images if upload fails\
  // if the image is a string, it means it's an existing image, so we ignore it
  !justCreated &&
    image &&
    typeof image === "string" &&
    (await createTemporaryFolder(hotline.id, hotline.id + "_old", bucket, [
      image,
    ]));

  let url: string | undefined = undefined;
  if (image && typeof image === "string" && image.length > 0) {
    url = image;
  } else if (image && image instanceof File && image.size > 0) {
    await createFile(
      image,
      bucket,
      Buckets.Hotline,
      hotline.id,
      hotline.id,
      true,
      false
    )
      .then((uploadedUrl) => {
        url = uploadedUrl;
      })
      .catch(async (error) => {
        justCreated &&
          (await prisma.hotline.delete({ where: { id: hotline.id } }));

        // Restore old images
        await deleteFolder(hotline.id, bucket);
        !justCreated &&
          (await createTemporaryFolder(
            hotline.id + "_old",
            hotline.id,
            bucket
          ));
        throw new Error("Failed to upload image " + error?.message || "");
      });
  }

  if (url) {
    await prisma.hotline.update({
      where: { id: hotline.id },
      data: { image: url },
    });
  }

  // Delete temp folder
  !justCreated && (await deleteFolder(hotline.id + "_old", bucket));
}

export async function deleteHotline(id: string) {
  const session = await auth();
  if (
    !session ||
    session.user.type !== UserType.Admin ||
    session.user.deactivated
  ) {
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
