import { z } from "zod";

const CreatePost = z.object({
  content: z.string().emoji("Only emojis are allowed").min(1).max(280),
});

export const ZodSchemas = {
  CreatePost,
};
