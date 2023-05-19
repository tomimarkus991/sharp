import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetStaticProps, InferGetStaticPropsType, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import SuperJSON from "superjson";

import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import { api } from "@/utils/api";

import { ProfileFeed } from "../components/Feed";

export const getStaticProps: GetStaticProps = async context => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: SuperJSON, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("Slug is missing");

  await ssg.profile.getUserByUsername.prefetch({ username: slug });

  return {
    props: { trpcState: ssg.dehydrate(), username: slug },
  };
};

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const ProfilePage: NextPage<PageProps> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  return (
    <>
      <Head>
        <title>{username}</title>
      </Head>
      <main className="flex flex-col h-screen bg-slate-800">
        <div className="flex flex-col max-w-2xl w-[42rem] mx-auto">
          <div className="relative w-full bg-gradient-to-r from-blue-800 to-blue-600 gradient h-36">
            <Image
              alt="pic"
              src={data?.profileImageUrl || ""}
              className="rounded-full absolute bottom-0 left-0 ml-2 -mb-[64px]"
              width={128}
              height={128}
            />
          </div>
          <div className="h-[64px]" />
          <p className="p-4 text-2xl font-bold">{username}</p>
        </div>
        <ProfileFeed userId={data?.id || ""} />
      </main>
    </>
  );
};

export default ProfilePage;
