import CreatePost from "@/components/CreatePost";
import React from "react";
import Following from "@/components/Following";
import MainNav from "@/components/MainNav";
import { fetchPostData } from "./api/route";
import getQueryClient from "@/lib/getQueryClient";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import Cards from "@/components/Cards";
import { GetSSRPostData } from "@/utils/constants";

export default async function Home() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery([GetSSRPostData], fetchPostData);
  const dehydratedState = dehydrate(queryClient);
  return (
    <section className="bg-slate-50 overflow-hidden min-h-screen">
      <MainNav />
      <div className="container mx-auto p-6 mt-5">
        <div className="grid grid-cols-7 gap-2">
          <div className="col-span-2 bg-slate-100 rounded-lg h-[500px] max-sm:hidden max-md:hidden">
            <div className="flex justify-start items-center p-6">
              <span className="text-xl font-bold text-slate-900">
                People You Followed
              </span>
            </div>
            <div className="">
              <Following />
            </div>
          </div>
          <div className="col-span-3 overflow-auto mx-2 max-sm:col-span-7 max-md:col-span-7">
            <Hydrate state={dehydratedState}>
              <CreatePost />
              <Cards />
            </Hydrate>
          </div>
        </div>
      </div>
    </section>
  );
}
