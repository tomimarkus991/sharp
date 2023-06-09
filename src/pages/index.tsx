import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

import { RealButton } from "@/components";
import { CreatePostForm } from "@/ui/";

import { Feed } from "../components/Feed";
import { api } from "../utils/api";

const Home: NextPage = () => {
  // Start fetching asap
  api.posts.getAll.useQuery();

  const { isSignedIn } = useUser();

  return (
    <>
      <Head>
        <title>Sharp</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col h-screen bg-slate-800 overflow-none justify-center">
        <div className="flex items-center justify-around max-w-5xl mx-auto mt-12">
          <div className="mr-64">
            <h1 className="text-4xl font-bold text-white">Sharp</h1>
          </div>
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton>
              <RealButton size="sm">Sign in</RealButton>
            </SignInButton>
          )}
        </div>
        <div className="flex justify-center pt-12">
          <CreatePostForm />
        </div>
        <Feed />
      </main>
    </>
  );
};

export default Home;
