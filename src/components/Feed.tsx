import { api } from "../utils/api";

import { LoadingSpinner } from "./LoadingSpinner";
import { Post } from "./Post";

export const Feed = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();

  return (
    <div className="flex flex-col items-center py-2 mx-auto space-y-2 overflow-y-scroll grow scrollbar-overflow">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {data?.map(fullPost => (
            <Post key={fullPost.post.id} {...fullPost} />
          ))}
        </>
      )}
    </div>
  );
};

type Props = {
  userId: string;
};

export const ProfileFeed = ({ userId }: Props) => {
  const { data, isLoading } = api.posts.getPostsByUser.useQuery({ userId });

  if (!data || data.length === 0) {
    return <p className="mt-12 text-2xl text-center">No posts</p>;
  }

  return (
    <div className="flex flex-col items-center py-2 mx-auto space-y-2 overflow-y-scroll grow scrollbar-overflow">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {data.map(fullPost => (
            <Post key={fullPost.post.id} {...fullPost} />
          ))}
        </>
      )}
    </div>
  );
};
