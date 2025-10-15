"use server";

import { Post, UserType } from "@/app/generated/prisma";
import { auth } from "@/auth";
import {
  CommentData,
  commentSchema,
  UploadPostData,
  uploadPostSchema,
} from "@/lib/schemas";
import {
  createFile,
  createTemporaryFolder,
  deleteFolder,
} from "@/lib/supabase/bucketUtils";
import { Buckets, getBucket } from "@/lib/supabase/client";

import { prisma } from "@/prisma/client";

export type PostData = Pick<
  Post,
  "id" | "createdAt" | "title" | "content" | "images"
> & {
  author: {
    name: string;
    image?: string;
  };
  likeStats: PostStat;
  dislikeStats: PostStat;
  comments: PostComment[];
};

export type PostStat = {
  count: number;
  selected: boolean;
};

export type PostComment = {
  id: string;
  createdAt: Date;
  user: {
    name: string;
    image?: string;
  };
  content: string;
};

export async function getPosts(): Promise<PostData[]> {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session?.user?.id;

  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      likes: {
        select: {
          userId: true,
        },
      },
      dislikes: {
        select: {
          userId: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return posts.map((post) => ({
    id: post.id.toString(),
    createdAt: post.createdAt,
    title: post.title,
    content: post.content,
    images: post.images || [],
    author: {
      name: post.author?.name || "Unknown",
      image: post.author?.image || undefined,
    },
    likeStats: {
      count: post.likes.length || 0,
      selected: post.likes.some((like) => like.userId === userId),
    },
    dislikeStats: {
      count: post.dislikes.length || 0,
      selected: post.dislikes.some((dislike) => dislike.userId === userId),
    },
    comments: post.comments.map((comment) => ({
      ...comment,
      user: {
        name: comment.user.name || "Unknown",
        image: comment.user.image || undefined,
      },
    })),
  }));
}

export async function upsertPost(data: UploadPostData) {
  const session = await auth();
  if (!session || !session.user.id || session.user.type !== UserType.Admin) {
    throw new Error("Unauthorized");
  }

  const validation = uploadPostSchema.safeParse(data);

  if (!validation.success) {
    throw new Error("Invalid data", { cause: validation.error });
  }

  const { id, title, content, images } = validation.data;
  let post = null;
  let justCreated = false;

  if (!id) {
    post = await prisma.post.create({
      data: { title, content, authorId: session.user.id },
    });
    justCreated = true;
  } else {
    console.log("Updating hotline with id:", id);
    post = await prisma.post.update({
      where: { id },
      data: { title, content, authorId: session.user.id },
    });
    justCreated = false;
  }

  const bucket = getBucket(Buckets.Posts, session?.supabaseAccessToken || "");

  // Move existing images to a temp folder
  // This is to prevent losing images if upload fails
  let ignoreFiles: (string | undefined)[] = [];
  if (!justCreated) {
    // Get list of files to ignore (those that are still present)
    ignoreFiles = (post.images || []).map((url) => {
      const part = url.split("/");
      if (images && images.includes(url)) return part[part.length - 1]; // Keep existing image
    });

    await createTemporaryFolder(post.id, post.id + "_old", bucket, ignoreFiles);
  }

  const urls: string[] = [];

  await Promise.all(
    (images || []).map(async (image) => {
      if (typeof image === "string") {
        urls.push(image);
      } else if (image instanceof File && image.size > 0) {
        const filename = crypto.randomUUID();
        await createFile(image, bucket, filename, post.id, true)
          .then((uploadedUrl) => {
            urls.push(uploadedUrl);
          })
          .catch(async (error) => {
            justCreated &&
              (await prisma.post.delete({ where: { id: post.id } }));

            // Restore old images
            await deleteFolder(post.id, bucket);
            !justCreated &&
              (await createTemporaryFolder(post.id + "_old", post.id, bucket));
            throw new Error("Failed to upload image " + error?.message || "");
          });
      }
    })
  );

  console.log("Uploaded image URLs:", urls);

  if (urls.length > 0) {
    await prisma.post.update({
      where: { id: post.id },
      data: { images: urls },
    });
  }

  // Delete temp folder
  !justCreated && (await deleteFolder(post.id + "_old", bucket));
}

export async function likePost(postId: string, like: boolean) {
  const session = await auth();
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  if (typeof postId !== "string" || typeof like !== "boolean") {
    throw new Error("Invalid request");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      likes: { where: { userId: session.user.id } },
      dislikes: { where: { userId: session.user.id } },
    },
  });

  if (!post) throw new Error("Post not found");

  const alreadyLiked = post.likes.length > 0;
  if (like && alreadyLiked) return; // Already liked, do nothing
  if (!like && !alreadyLiked) return; // Not liked, do nothing

  const alreadyDisliked = post.dislikes.length > 0;

  if (alreadyLiked) {
    await prisma.like.deleteMany({
      where: { postId: postId, userId: session.user.id },
    });
  } else {
    if (alreadyDisliked) {
      await prisma.dislike.deleteMany({
        where: { postId: postId, userId: session.user.id },
      });
    }
    await prisma.like.create({
      data: { postId: postId, userId: session.user.id },
    });
  }
}

export async function deletePost(postId: string) {
  const session = await auth();
  if (!session || !session.user?.id || session.user.type !== UserType.Admin) {
    throw new Error("Unauthorized");
  }

  await prisma.post.delete({ where: { id: postId } });

  const bucket = getBucket(Buckets.Posts, session?.supabaseAccessToken || "");
  await deleteFolder(postId, bucket);
}

export async function dislikePost(postId: string, dislike: boolean) {
  const session = await auth();
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  if (typeof postId !== "string" || typeof dislike !== "boolean") {
    throw new Error("Invalid request");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      likes: { where: { userId: session.user.id } },
      dislikes: { where: { userId: session.user.id } },
    },
  });

  if (!post) throw new Error("Post not found");

  const alreadyDisliked = post.dislikes.length > 0;
  if (dislike && alreadyDisliked) return; // Already disliked, do nothing
  if (!dislike && !alreadyDisliked) return; // Not disliked, do nothing

  const alreadyLiked = post.likes.length > 0;

  if (alreadyDisliked) {
    await prisma.dislike.deleteMany({
      where: { postId: postId, userId: session.user.id },
    });
  } else {
    if (alreadyLiked) {
      await prisma.like.deleteMany({
        where: { postId: postId, userId: session.user.id },
      });
    }
    await prisma.dislike.create({
      data: { postId: postId, userId: session.user.id },
    });
  }
}

export async function addComment(data: CommentData): Promise<void> {
  const session = await auth();
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  console.log("Adding comment:", data);
  const parsed = commentSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid request");
  }

  const { postId, content } = parsed.data as CommentData;

  if (!content.trim()) throw new Error("Comment content cannot be empty");

  await prisma.comment.create({
    data: {
      postId: postId,
      userId: session.user.id,
      content,
    },
  });
}
