"use server";

import { UserType } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { CommentData, commentSchema, newPostSchema } from "@/lib/schemas";
import { Buckets, getBucket } from "@/lib/supabase/client";
import { createFile } from "@/lib/utils";

import { prisma } from "@/prisma/client";
import path from "path";

export type PostProps = {
  id: string;
  date: Date;
  title: string;
  content: string;
  images: string[];
  authorName: string;
  authorImage?: string;
  likesStats: PostStat;
  dislikesStats: PostStat;
  comments: PostComment[];
  isPopup?: boolean;
};

export type PostStat = {
  count: number;
  selected: boolean;
};

export type PostComment = {
  id: string;
  createdAt: string;
  user: {
    name: string;
    image?: string;
  };
  content: string;
};

export async function getPosts(): Promise<PostProps[]> {
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
        select: {
          id: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          content: true,
        },
      },
    },
  });

  return posts.map((post) => ({
    id: post.id.toString(),
    date: post.createdAt,
    title: post.title,
    content: post.content || "",
    images: post.images || [],
    authorName: post.author.name || "",
    authorImage: post.author.image || undefined,
    likesStats: {
      count: post.likes.length || 0,
      selected: post.likes.some((like) => like.userId === userId),
    },
    dislikesStats: {
      count: post.dislikes.length || 0,
      selected: post.dislikes.some((dislike) => dislike.userId === userId),
    },
    comments: post.comments.map((comment) => ({
      id: comment.id.toString(),
      createdAt: comment.createdAt.toISOString() || new Date().toISOString(),
      user: {
        name: comment.user.name || "",
        image: comment.user.image || undefined,
      },
      content: comment.content || "",
    })),
  }));
}

export async function createPost(formData: FormData): Promise<void> {
  const session = await auth();
  const bucket = await getBucket(
    Buckets.Posts,
    session?.supabaseAccessToken || ""
  );

  if (
    !session ||
    !(session.user.type === UserType.Admin) ||
    !session.user?.id
  ) {
    throw new Error("Unauthorized");
  }

  if (!(formData instanceof FormData)) {
    throw new Error("Invalid request");
  }

  const validation = newPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    images: formData.getAll("images") as File[],
  });

  if (!validation.success) {
    console.log("Validation errors:", validation.error);
    throw new Error("Invalid request");
  }

  const { title, content, images } = validation.data;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: session.user.id,
    },
  });

  const postId = post.id;
  const imageUrls: string[] = [];
  try {
    if (images && images.length > 0) {
      await Promise.all(
        images.map(async (file) => {
          if (
            !file ||
            !(file instanceof File) ||
            file.size === 0 ||
            !session.user.id
          )
            return;

          const filename = crypto.randomUUID();
          const pathSafe = path.posix.join(session.user.id, postId);

          const url = await createFile(file, bucket, filename, pathSafe);
          imageUrls.push(url);
        })
      );
    }
  } catch (error) {
    console.error("Error uploading images:", error);
    await prisma.post.delete({
      where: { id: postId },
    });
    return;
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      images: imageUrls,
    },
  });
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
