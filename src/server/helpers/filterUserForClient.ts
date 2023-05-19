import { User } from "@clerk/nextjs/server";

export const filterUserForClient = ({ id, username, profileImageUrl }: User) => {
  return { id, username, profileImageUrl };
};
