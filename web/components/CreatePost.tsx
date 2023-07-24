"use client";

import React from "react";
import { MdOutlineCreate } from "react-icons/md";
import Modal from "./Modals/Modal";
import Image from "next/image";
import { UserProfile } from "@/utils/types";
import Link from "next/link";
import { baseURL } from "@/utils/url";

async function GetUserProfile(token: string) {
  const response = await fetch(`${baseURL}/user/myprofile`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data: UserProfile = await response.json();
  return data;
}

const CreatePost = () => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [profileData, setProfileData] = React.useState<UserProfile>();
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      const fetchUserProfile = async () => {
        const data = await GetUserProfile(token);
        setProfileData(data);
      };
      fetchUserProfile();
    }
  }, []);

  return (
    <>
      <div className="p-3 flex items-center w-full  rounded-lg bg-slate-100 mb-3">
        <Link href={`/profile/${profileData?.results.id}`}>
          <img
            className="h-12 w-12 rounded-full cursor-pointer"
            src={profileData?.results.photo}
            alt="Profile Pic"
          />
        </Link>
        <div
          className="w-full bg-slate-200 flex items-center m-1 rounded-lg mx-2 cursor-pointer"
          onClick={openModal}
        >
          <div className="m-2">
            <MdOutlineCreate size={22} />
          </div>
          <div className="py-3 text-base text-slate-600">
            What&apos;s on your mind?
          </div>
        </div>
      </div>
      {isModalOpen && <Modal onClose={closeModal} />}
    </>
  );
};

export default CreatePost;
