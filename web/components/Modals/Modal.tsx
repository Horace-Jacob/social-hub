"use client";

import {
  GetNonSSRPostData,
  GetSSRPostData,
  GetUserPostById,
} from "@/utils/constants";
import { normalReturn } from "@/utils/types";
import { baseURL } from "@/utils/url";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  onClose: () => void;
  aboutPost?: string | null;
}

async function createPost(user_token: string, data: {}) {
  const response = await fetch(`${baseURL}/post/create`, {
    cache: "no-cache",
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${user_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const returnData = await response.json();
  return returnData;
}

async function updatePost(
  user_token: string,
  aboutData: string,
  postId: number
) {
  const response = await fetch(`${baseURL}/post/update`, {
    cache: "no-cache",
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${user_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ about: aboutData, id: postId }),
  });
  const returnData = await response.json();
  return returnData;
}

const Modal: React.FC<ModalProps> = ({ onClose, aboutPost }) => {
  const [about, setAbout] = React.useState<string>("");
  const [updatePostId, setUpdatePostId] = React.useState<number>(0);
  const [error, setError] = React.useState<string>("");
  const modalRoot = document.getElementById("modal-root") as Element;
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (aboutPost !== null && aboutPost !== undefined) {
      const splitedData = aboutPost.split("_");
      setAbout(splitedData[0]);
      setUpdatePostId(parseInt(splitedData[1]));
    }
  }, [aboutPost]);

  const handleUpdatePost = async () => {
    if (about !== "" && token != null) {
      const data: normalReturn = await updatePost(token, about, updatePostId);

      if (data.success) {
        onClose();
        await queryClient.invalidateQueries({ queryKey: [GetSSRPostData] });
        await queryClient.invalidateQueries({ queryKey: [GetNonSSRPostData] });
      } else {
        setError(JSON.stringify(data.message));
      }
    } else {
      setError("Please fill all required fields");
    }
  };

  const handleCreatePost = async () => {
    if (about !== "" && token != null) {
      const data: normalReturn = await createPost(token, {
        about: about,
      });

      if (data.success) {
        onClose();
        await queryClient.invalidateQueries({ queryKey: [GetSSRPostData] });
        await queryClient.invalidateQueries({ queryKey: [GetNonSSRPostData] });
        await queryClient.invalidateQueries({ queryKey: [GetUserPostById] });
      } else {
        setError(data.message);
      }
    } else {
      setError("Please fill all required fields");
    }
  };
  if (modalRoot) {
    return ReactDOM.createPortal(
      <>
        <div
          data-te-modal-init
          className="fixed left-0 top-0 z-[1055] h-full w-full overflow-y-auto overflow-x-hidden outline-none"
          id="staticBackdrop"
          data-te-backdrop="static"
          data-te-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div
            data-te-modal-dialog-ref
            className="pointer-events-none relative w-auto transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]"
          >
            <div className="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none">
              <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4">
                <h5 className="text-base text-slate-500" id="exampleModalLabel">
                  What&apos;s on your mind?
                </h5>
                <button
                  type="button"
                  className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                  data-te-modal-dismiss
                  onClick={onClose}
                  aria-label="Close"
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

              <div data-te-modal-body-ref className="relative p-4">
                <div className="max-h-96">
                  <textarea
                    id="about"
                    value={about}
                    onChange={(event) => setAbout(event.target.value)}
                    rows={4}
                    className="block border-none p-2.5 w-full text-sm max-h-96 resize-y overflow-auto focus:outline-none"
                    placeholder="Write your thoughts here..."
                  ></textarea>
                </div>
              </div>
              {error ? (
                <div className="flex items-center p-4">
                  <span className="text-sm text-red-500">{error}</span>
                </div>
              ) : null}

              <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 ">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex justify-center rounded-md text-black hover:bg-slate-400 bg-slate-200 px-3 py-2 text-sm font-semibold leading-6 hover:text-white shadow-sm"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={aboutPost ? handleUpdatePost : handleCreatePost}
                  className="flex justify-center rounded-md mx-2 bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {aboutPost ? "Update" : "Create"}
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

export default Modal;
