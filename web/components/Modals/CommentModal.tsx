"use client";

import { createComment, fetchCommentsByPost } from "@/app/api/route";
import {
  GetCommentByPostId,
  GetNonSSRPostData,
  GetSSRPostData,
  GetUserPostById,
} from "@/utils/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom";
import CommentCard from "../CommentCard";

interface DynamicModalProps {
  onClose: () => void;
  title: string;
  postId: number;
}

const CommentModal: React.FC<DynamicModalProps> = ({
  onClose,
  title,
  postId,
}) => {
  const modalRoot = document.getElementById("modal-root") as Element;
  const [comment, setComment] = React.useState<string>("");
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [GetCommentByPostId],
    queryFn: () => fetchCommentsByPost(postId),
    refetchOnWindowFocus: false,
  });

  const handleCommentCreate = async () => {
    if (comment !== "") {
      const data = await createComment({ comment: comment, postId: postId });
      if (data.success) {
        setComment("");
        await queryClient.invalidateQueries([GetSSRPostData]);
        await queryClient.invalidateQueries([GetNonSSRPostData]);
        await queryClient.invalidateQueries([GetCommentByPostId]);
        await queryClient.invalidateQueries([GetUserPostById]);
      } else {
        console.log(data);
      }
    } else {
    }
  };

  if (modalRoot) {
    return ReactDOM.createPortal(
      <>
        <div
          data-te-modal-init
          className="fixed left-0 top-0 z-[1055] h-full w-full overflow-y-auto overflow-x-hidden outline-none"
          id="exampleModalScrollable"
          tabIndex={-1}
          aria-labelledby="exampleModalScrollableLabel"
          aria-hidden="true"
        >
          <div
            data-te-modal-dialog-ref
            className="pointer-events-none relative h-[calc(100%-1rem)] w-auto transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:h-[calc(100%-3.5rem)] min-[576px]:max-w-[500px]"
          >
            <div className="pointer-events-auto relative flex max-h-[100%] w-full flex-col overflow-hidden rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none ">
              <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 ">
                <h5 className="text-base text-slate-500" id="exampleModalLabel">
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

              <div className="relative overflow-y-auto p-4 max-sm:min-h-screen min-h-[500px]">
                {error ? (
                  <div className="p-4 mx-2 flex flex-col items-center min-h-[465px] justify-center">
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
                  <div className="p-4 mx-2 flex flex-col items-center min-h-[465px] justify-center">
                    <div className="lds-ripple">
                      <div></div>
                      <div></div>
                    </div>
                    <span className="text-sm text-slate-400">
                      Please wait...
                    </span>
                  </div>
                ) : data?.results.length === 0 ? (
                  <div className="p-4 mx-2 flex flex-col items-center min-h-[465px] justify-center">
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
                          d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-400">
                      No comment yet
                    </span>
                  </div>
                ) : data?.success ? (
                  data?.results.map((value, index) => {
                    return (
                      <CommentCard
                        key={index}
                        commentData={value.comment}
                        profilePic={value.creator.photo}
                        username={value.creator.username}
                        commentCreateTime={value.createdAt}
                      />
                    );
                  })
                ) : null}
              </div>

              <div className="mt-auto">
                <label htmlFor="chat" className="sr-only">
                  Your message
                </label>
                <div className="flex items-center px-3 py-2 rounded-lg border-none">
                  <textarea
                    id="chat"
                    rows={1}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    className="block mx-4 p-2.5 resize-y w-full text-sm text-gray-900 bg-white rounded-lg focus:outline-none"
                    placeholder="Your message..."
                  ></textarea>
                  <button
                    onClick={handleCommentCreate}
                    type="button"
                    className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100"
                  >
                    <svg
                      className="w-5 h-5 rotate-90"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 20"
                    >
                      <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                    </svg>
                    <span className="sr-only">Send message</span>
                  </button>
                </div>
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

export default CommentModal;
