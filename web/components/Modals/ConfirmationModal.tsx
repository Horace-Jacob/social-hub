"use client";

import { deletePost, unfollowUser } from "@/app/api/route";
import {
  GetFollowing,
  GetNonSSRPostData,
  GetSSRPostData,
  GetUserPostById,
} from "@/utils/constants";
import { UserFollowingsData, normalReturn } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import ReactDOM from "react-dom";

interface Props {
  onClose: () => void;
  title?: string;
  about: string;
  followingData?: UserFollowingsData;
  deleteConfirmation?: boolean | null;
  postId?: number | null;
}

const ConfirmationModal: React.FC<Props> = ({
  onClose,
  title,
  about,
  followingData,
  postId,
  deleteConfirmation,
}) => {
  const modalRoot = document.getElementById("modal-root") as Element;
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  async function unfollow() {
    if (token !== null) {
      const data: normalReturn = await unfollowUser({
        ToUser: followingData?.ToUser,
      });
      if (data.success) {
        onClose();
        await queryClient.invalidateQueries([GetSSRPostData]);
        await queryClient.invalidateQueries([GetNonSSRPostData]);
        await queryClient.invalidateQueries([GetFollowing]);
      }
    }
  }

  async function deleteUserPost() {
    console.log(postId);
    if (postId !== null && postId !== undefined) {
      const data: normalReturn = await deletePost(postId);
      if (data.success) {
        onClose();
        await queryClient.invalidateQueries([GetSSRPostData]);
        await queryClient.invalidateQueries([GetNonSSRPostData]);
        await queryClient.invalidateQueries([GetFollowing]);
        await queryClient.invalidateQueries([GetUserPostById]);
      }
    }
  }

  if (modalRoot) {
    return ReactDOM.createPortal(
      <>
        <div
          data-te-modal-init
          className="fixed left-0 top-0 z-[1055] h-full w-full overflow-y-auto overflow-x-hidden outline-none"
          id="exampleModalCenter"
          tabIndex={-1}
          aria-labelledby="exampleModalCenterTitle"
          aria-modal="true"
          role="dialog"
        >
          <div
            data-te-modal-dialog-ref
            className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:min-h-[calc(100%-3.5rem)] min-[576px]:max-w-[500px]"
          >
            <div className="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none">
              <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                <h5
                  className="text-base text-slate-500"
                  id="exampleModalScrollableLabel"
                >
                  {title}
                </h5>
                <button
                  type="button"
                  className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                  data-te-modal-dismiss
                  aria-label="Close"
                  onClick={onClose}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="relative p-4">
                <div className="flex flex-col justify-center items-center">
                  {followingData ? (
                    <>
                      <div>
                        <img
                          className="h-24 w-24 rounded-full cursor-pointer bg-slate-500"
                          src={followingData.creator.photo}
                          alt="Profile Pic"
                        />
                      </div>
                      <div className="mt-2">
                        <Link href={`/profile/${followingData.creator.id}`}>
                          <span className="font-semibold text-lg hover:underline cursor-pointer">
                            {followingData.creator.username}
                          </span>
                        </Link>
                      </div>
                    </>
                  ) : null}
                  <div>
                    <span className="text-sm text-slate-400">{about}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex justify-center rounded-md text-black hover:bg-slate-400 bg-slate-200 px-3 py-2 text-sm font-semibold leading-6 hover:text-white shadow-sm"
                >
                  Close
                </button>
                <button
                  onClick={deleteConfirmation ? deleteUserPost : unfollow}
                  type="button"
                  className="flex justify-center rounded-md mx-2 bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {deleteConfirmation ? "Delete" : "Unfollow"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>,
      modalRoot
    );
  }
};

export default ConfirmationModal;
