import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetStaticProps, InferGetStaticPropsType, type NextPage } from "next";
import Head from "next/head";
import SuperJSON from "superjson";

import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import { api } from "@/utils/api";

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
        <title>{data?.username}</title>
      </Head>
      <main className="flex flex-col h-screen bg-slate-800">
        <p className="text-white">{data?.username}</p>
      </main>
    </>
  );
};

export default ProfilePage;
