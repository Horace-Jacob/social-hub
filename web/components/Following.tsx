"use client";

import { UserFollowings, UserFollowingsData } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ConfirmationModal from "./Modals/ConfirmationModal";
import { GetFollowing } from "@/utils/constants";
import { baseURL } from "@/utils/url";

async function GetUserFollowing() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${baseURL}/follow/getfollowing`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data: UserFollowings = await response.json();
  return data;
}

const Following = () => {
  const getFollowingQuery = useQuery([GetFollowing], GetUserFollowing);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [followingData, setFollowingData] =
    React.useState<UserFollowingsData>();

  const openModal = (data: UserFollowingsData) => {
    if (data !== undefined) {
      setFollowingData(data);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {getFollowingQuery.data?.success &&
      getFollowingQuery.data?.results.length > 0 ? (
        getFollowingQuery.data?.results.map((value, index) => (
          <div
            className="block p-4 overflow-hidden border-b leading-relaxed"
            key={index}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href={`/profile/${value.creator.id}`}>
                  <img
                    className="h-12 w-12 rounded-full cursor-pointer"
                    src={value.creator.photo}
                    alt="Profile Pic"
                  />
                </Link>

                <div className="flex flex-col mx-2">
                  <Link href={`/profile/${value.creator.id}`}>
                    <span className="font-semibold text-lg hover:underline cursor-pointer">
                      {value.creator.username}
                    </span>
                  </Link>
                  <span className="text-sm text-slate-500">
                    {value.creator.followerCount === 1
                      ? "1 follower"
                      : value.creator.followerCount > 1
                      ? value.creator.followerCount + " followers"
                      : "no follower"}
                  </span>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => openModal(value)}
                  className="flex outline-none border-none justify-center text-slate-900 items-center rounded-md  px-1 py-1 text-sm font-semibold leading-6 hover:underline"
                >
                  <span className="mx-1 text-xs">Unfollow</span>
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 mx-2 flex flex-col items-center h-[300px] justify-center">
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
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
          </div>
          <span className="text-sm text-slate-400">
            You have not followed anyone yet
          </span>
        </div>
      )}
      {isModalOpen && (
        <ConfirmationModal
          onClose={closeModal}
          followingData={followingData}
          title={"Unfollow " + followingData?.creator.username}
          about="Are you sure you want to unfollow this user?"
        />
      )}
    </>
  );
};

export default Following;
