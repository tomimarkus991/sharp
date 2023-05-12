import { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const filterUserForClient = ({ id, username, profileImageUrl }: User) => {
  return { id, username, profileImageUrl };
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({ orderBy: { createdAt: "desc" } });

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
});
