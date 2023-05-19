import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";

import { RouterOutputs } from "../utils/api";

import { LoadingSpinner } from "./LoadingSpinner";

type PostWithAuthor = RouterOutputs["posts"]["getAll"][number];

export const Post = ({ author, post }: PostWithAuthor) => {
  dayjs.extend(relativeTime);
  return (
    <div className="bg-[#0C1222] text-white w-[30rem] p-4 mr-1 rounded-2xl flex">
      {author.profileImageUrl ? (
        <Link href={author.username}>
          <Image
            alt="profile pic"
            src={author.profileImageUrl}
            className="mr-2 rounded-full"
            width={56}
            height={56}
          />
        </Link>
      ) : (
        <LoadingSpinner />
      )}

      <div className="flex flex-col">
        <div className="flex text-sm opacity-75">
          <p className="mr-1">{author.username}</p>
          <p className="">{dayjs(post.createdAt).fromNow()}</p>
        </div>

        <h1 className="text-2xl">{post.content}</h1>
      </div>
    </div>
  );
};
