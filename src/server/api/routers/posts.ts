import { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "@/server/api/trpc";

const filterUserForClient = ({ id, username, profileImageUrl }: User) => {
  return { id, username, profileImageUrl };
};

// Create a rate limiter that allows 3 requests per minute
const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "1 m"),
  analytics: true,
});

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({ take: 100, orderBy: { createdAt: "desc" } });

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map(post => post.authorId),
        limit: 100,
      })
    ).map(filterUserForClient);

    return posts.map(post => {
      const author = users.find(user => user.id === post.authorId);

      if (!author)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author for post not found",
        });

      return {
        post,
        author: {
          ...author,
          username: author.username ?? "Anonymous",
        },
      };
    });
  }),
  create: privateProcedure
    .input(z.object({ content: z.string().emoji("Only emojis are allowed").min(1).max(280) }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const { success } = await rateLimit.limit(userId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const post = await ctx.prisma.post.create({
        data: {
          authorId: userId,
          content: input.content,
        },
      });

      return post;
    }),
});
