"use client";

import { fetchOtherPostData, fetchPostData } from "@/app/api/route";
import { useQuery } from "@tanstack/react-query";
import FeedCard from "./FeedCard";
import React from "react";
import { GetNonSSRPostData, GetSSRPostData } from "@/utils/constants";

export default function Cards() {
  const [userToken, setUserToken] = React.useState<string | null>();

  React.useLayoutEffect(() => {
    const token = localStorage.getItem("token");
    setUserToken(token);
  }, []);

  const otherDataQuery = useQuery({
    queryKey: [GetNonSSRPostData],
    queryFn: fetchOtherPostData,
    refetchOnWindowFocus: false,
  });

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [GetSSRPostData],
    queryFn: fetchPostData,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {error ? (
        <div className="p-4 mx-2 flex flex-col items-center min-h-[350px] justify-center">
          <div className="mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-10 h-10 text-slate-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <span className="text-sm text-slate-400">
            Oops! There was an error while fetching comments
          </span>
        </div>
      ) : isLoading ? (
        <div className="p-4 mx-2 flex flex-col items-center min-h-[350px] justify-center">
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
          <span className="text-sm text-slate-400">Please wait...</span>
        </div>
      ) : data?.results.length === 0 ? (
        <div className="p-4 mx-2 flex flex-col items-center min-h-[350px] justify-center">
          <div className="mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-10 h-10 text-slate-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
              />
            </svg>
          </div>
          <span className="text-sm text-slate-400">
            No post on the platform
          </span>
        </div>
      ) : data?.success ? (
        data?.results.map((value, index) => {
          const otherDataValue =
            userToken !== null ? otherDataQuery.data?.results[index] : null;
          return (
            <FeedCard data={value} key={index} otherData={otherDataValue} />
          );
        })
      ) : null}
    </>
  );
}
