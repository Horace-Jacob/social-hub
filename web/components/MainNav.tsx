"use client";

import React, { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import { HiBars3 } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserProfile } from "@/utils/types";
import Link from "next/link";
import { baseURL } from "@/utils/url";
import SearchModal from "./Modals/SearchModal";
import Logo from "@/public/elephant.png";

const navigation = [{ name: "Home", href: "/", current: true }];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

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

const MainNav = () => {
  const [profileData, setProfileData] = React.useState<UserProfile>();
  const router = useRouter();
  const [searchModalOpen, setSearchModalOpen] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const modalOpen = () => {
    setSearchModalOpen(true);
  };

  const modalClose = () => {
    setSearchModalOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      modalOpen();
    }
  };

  const UserSignOut = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null) {
      router.push("/signin");
    } else {
      const fetchUserProfile = async () => {
        const data = await GetUserProfile(token);
        setProfileData(data);
      };
      fetchUserProfile();
    }
  }, [router]);
  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto container">
              <div className="relative flex h-16 items-center justify-between p-6">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <RxCross2 className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <HiBars3 className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start max-sm:hidden">
                  <div className="flex flex-shrink-0 items-center">
                    <Image
                      priority
                      className="h-10 w-auto"
                      src={Logo}
                      alt="Your Company"
                    />
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-slate-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      value={searchQuery}
                      onKeyDown={handleKeyDown}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="block w-full text-slate-200 outline-none rounded-md py-2 pl-10 pr-8 bg-gray-700 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="Search..."
                    />
                  </div>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none ">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full bg-white"
                          src={
                            profileData?.results !== undefined
                              ? profileData.results.photo
                              : ""
                          }
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href={`/profile/${profileData?.results.id}`}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>

                        <Menu.Item>
                          {({ active }: any) => (
                            <span
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 hover:cursor-pointer"
                              )}
                              onClick={UserSignOut}
                            >
                              Sign out
                            </span>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      {searchModalOpen && (
        <SearchModal onClose={modalClose} searchQuery={searchQuery} />
      )}
    </>
  );
};

export default MainNav;
