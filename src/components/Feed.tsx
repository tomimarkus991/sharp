import { api } from "../utils/api";

import { LoadingSpinner } from "./LoadingSpinner";
import { Post } from "./Post";

export const Feed = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();

  return (
    <div className="flex grow flex-col mx-auto overflow-y-scroll items-center space-y-2 py-2 scrollbar-overflow">
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
