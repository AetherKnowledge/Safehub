"use server";

import authOptions from "@/lib/auth/authOptions";
import { formatDatetime } from "@/lib/utils";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";

export type PostProps = {
  id: string;
  date: string;
  title: string;
  content: string;
  images: string[];
  authorName: string;
  authorImage?: string;
  likesStats: PostStat;
  dislikesStats: PostStat;
  comments: PostComment[];
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
  const session = await getServerSession(authOptions);
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
    date: formatDatetime(post.createdAt),
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

export async function likePost(postId: string, like: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("User not authenticated");

  const post = await prisma.post.findUnique({
    where: { id: parseInt(postId) },
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
      where: { postId: parseInt(postId), userId: session.user.id },
    });
  } else {
    if (alreadyDisliked) {
      await prisma.dislike.deleteMany({
        where: { postId: parseInt(postId), userId: session.user.id },
      });
    }
    await prisma.like.create({
      data: { postId: parseInt(postId), userId: session.user.id },
    });
  }
}

export async function dislikePost(postId: string, dislike: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("User not authenticated");

  const post = await prisma.post.findUnique({
    where: { id: parseInt(postId) },
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
      where: { postId: parseInt(postId), userId: session.user.id },
    });
  } else {
    if (alreadyLiked) {
      await prisma.like.deleteMany({
        where: { postId: parseInt(postId), userId: session.user.id },
      });
    }
    await prisma.dislike.create({
      data: { postId: parseInt(postId), userId: session.user.id },
    });
  }
}

export async function addComment(
  postId: string,
  content: string
): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("User not authenticated");

  if (!content.trim()) throw new Error("Comment content cannot be empty");

  await prisma.comment.create({
    data: {
      postId: parseInt(postId),
      userId: session.user.id,
      content,
    },
  });
}
