"use client";

import CreatePost from "@/components/CreatePost";
import FeedCard from "@/components/FeedCard";
import MainNav from "@/components/MainNav";
import Image from "next/image";
import React from "react";
import { Post, TokenDecode, UserProfile, normalReturn } from "@/utils/types";
import jwt_decode from "jwt-decode";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { follow, unfollowUser } from "@/app/api/route";
import { GetUserPostById, GetUserProfileById } from "@/utils/constants";
import { baseURL } from "@/utils/url";
import InputModal from "@/components/Modals/InputModal";

async function GetUserProfile(id: number) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${baseURL}/user/userprofile/${id}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data: UserProfile = await response.json();
  return data;
}

async function GetUserPosts(id: number) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${baseURL}/post/userposts/${id}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data: Post = await response.json();
  return data;
}

function UserProfile({ params }: any) {
  const [userId, setUserId] = React.useState<number>(0);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const queryClient = useQueryClient();
  const getUserPostsQuery = useQuery([GetUserPostById], () =>
    GetUserPosts(params.id)
  );
  const { data, isLoading, isFetching, error } = useQuery(
    [GetUserProfileById],
    () => GetUserProfile(params.id)
  );

  const modalOpen = () => {
    setIsModalOpen(true);
  };

  const modalClose = () => {
    setIsModalOpen(false);
  };

  async function unfollow(toUser: number) {
    const data: normalReturn = await unfollowUser({
      ToUser: toUser,
    });
    if (data.success) {
      await queryClient.invalidateQueries([GetUserProfileById]);
    }
  }

  async function followUser(touser: number) {
    const data = await follow({ ToUser: touser });
    if (data?.success) {
      await queryClient.invalidateQueries([GetUserProfileById]);
    }
  }

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      const decodedToken: TokenDecode = jwt_decode(token);
      setUserId(decodedToken.id);
    }
  }, [params]);
  return (
    <>
      <section className="bg-slate-50 overflow-hidden min-h-screen">
        <MainNav />
        {data !== undefined ? (
          <div className="container mx-auto px-6">
            <div className="bg-black w-full h-72 rounded-s-md rounded-e-md">
              <div className="text-white flex justify-center items-center text-center h-72">
                <span className="text-3xl text-slate-500">
                  Adding cover photo is under development
                </span>
              </div>
            </div>
            <div className="flex items-center px-6 justify-between bg-slate-100 max-sm:flex-col">
              <div className="flex items-center max-sm:flex-col">
                <div className="mt-[-50px] border-4 border-slate-100 rounded-full">
                  <img
                    className="h-48 w-48 rounded-full bg-black"
                    src={data.results.photo}
                    alt="Profile Pic"
                  />
                </div>
                <div className="flex flex-col mx-6 max-sm:items-center">
                  <span className="font-semibold text-3xl">
                    {data.results.username}
                  </span>
                  <div className="my-2">
                    <span className="text-sm text-slate-500 hover:underline cursor-pointer">
                      {data.results.followerCount === 1
                        ? "1 follower"
                        : data.results.followerCount > 1
                        ? data.results.followerCount + " followers"
                        : "no follower"}
                    </span>

                    <span className="mx-2 text-sm">&middot;</span>
                    <span className="text-sm text-slate-500 hover:underline cursor-pointer">
                      {data.results.followingCount === 1
                        ? "1 following"
                        : data.results.followingCount > 1
                        ? data.results.followingCount + " followings"
                        : "no following"}
                    </span>
                  </div>
                </div>
              </div>
              {userId != 0 && userId === data.results.id ? (
                <div className="max-sm:mb-3">
                  <button
                    onClick={modalOpen}
                    type="button"
                    className="flex justify-center items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                    <span className="mx-2">Edit Profile</span>
                  </button>
                </div>
              ) : !data.results.isFollowing ? (
                <div className="max-sm:mb-3">
                  <button
                    onClick={() => followUser(data.results.id)}
                    type="button"
                    className="flex justify-center items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                      />
                    </svg>

                    <span className="mx-2">Follow</span>
                  </button>
                </div>
              ) : (
                <div className="max-sm:mb-3">
                  <button
                    type="button"
                    onClick={() => unfollow(data.results.id)}
                    className="flex justify-center items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                      />
                    </svg>

                    <span className="mx-2">Unfollow</span>
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-7 gap-2 relative top-2">
              <div className="col-span-1 max-sm:hidden"></div>
              <div className="col-span-1 max-sm:hidden"></div>
              <div className="col-span-3 overflow-auto max-sm:col-span-7">
                {userId != 0 && userId === data.results.id ? (
                  <CreatePost />
                ) : null}
                {getUserPostsQuery.data?.results !== undefined
                  ? getUserPostsQuery.data?.results.map((value, index) => (
                      <FeedCard data={value} key={index} isProfile={true} />
                    ))
                  : null}
              </div>
            </div>
          </div>
        ) : null}
      </section>
      {isModalOpen && (
        <InputModal
          onClose={modalClose}
          title="Update Username"
          oldUsername={data?.results.username}
        />
      )}
    </>
  );
}

export default UserProfile;
