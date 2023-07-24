"use client";

import { useState } from "react";
import { Tab } from "@headlessui/react";
import React from "react";
import { Search, SearchData, TokenDecode, normalReturn } from "@/utils/types";
import moment from "moment";
import Link from "next/link";
import {
  fetchSearchQuery,
  follow,
  unfollowUser,
  votePost,
} from "@/app/api/route";
import {
  GetSSRPostData,
  GetNonSSRPostData,
  GetFollowing,
  GetSearchQueryData,
} from "@/utils/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import jwt_decode from "jwt-decode";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  query: string;
}

const SearchCom: React.FC<Props> = ({ query }) => {
  let [categories, setCategories] = useState<SearchData>({
    Posts: [],
    People: [],
  });
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [GetSearchQueryData, query],
    queryFn: () => fetchSearchQuery(query),
  });

  const [currentUserId, setCurrentUserId] = React.useState<number>(0);

  React.useEffect(() => {
    if (data && data.results) {
      const token = localStorage.getItem("token");
      if (token !== null) {
        const decodedToken: TokenDecode = jwt_decode(token);
        setCurrentUserId(decodedToken.id);
      }
      // Grouping the data by entity_type
      const groupedData: SearchData = data.results.reduce(
        (acc: SearchData, item: any) => {
          if (item.entity_type === "user") {
            acc.People.push(item);
          } else if (item.entity_type === "post") {
            acc.Posts.push(item);
          }
          return acc;
        },
        { People: [], Posts: [] }
      );
      setCategories(groupedData);
    }
  }, [data]);

  async function vote(value: number, postId: number) {
    const data = await votePost({ value, postId });
    if (data.success) {
      await queryClient.invalidateQueries([GetSSRPostData]);
      await queryClient.invalidateQueries([GetNonSSRPostData]);
      await queryClient.invalidateQueries([GetSearchQueryData]);
    }
  }

  async function followUser(touser: number) {
    const data = await follow({ ToUser: touser });
    if (data?.success) {
      await queryClient.invalidateQueries([GetSSRPostData]);
      await queryClient.invalidateQueries([GetNonSSRPostData]);
      await queryClient.invalidateQueries([GetFollowing]);
      await queryClient.invalidateQueries([GetSearchQueryData]);
    }
  }

  async function unfollow(touser: number) {
    const data: normalReturn = await unfollowUser({
      ToUser: touser,
    });
    if (data.success) {
      await queryClient.invalidateQueries([GetSSRPostData]);
      await queryClient.invalidateQueries([GetNonSSRPostData]);
      await queryClient.invalidateQueries([GetFollowing]);
      await queryClient.invalidateQueries([GetSearchQueryData]);
    }
  }

  return (
    <>
      {isLoading ? (
        <div className="p-4 mx-2 flex flex-col items-center min-h-[465px] justify-center">
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
          <span className="text-sm text-slate-400">Please wait...</span>
        </div>
      ) : (
        <div className="w-full px-2 py-5 sm:px-0">
          <Tab.Group>
            {categories !== undefined ? (
              <Tab.List className="w-full flex space-x-1 rounded-xl bg-slate-100 p-1">
                {Object.keys(categories).map((category) => (
                  <Tab
                    key={category}
                    className={({ selected }) =>
                      classNames(
                        "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-indigo-600",
                        "ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-600 focus:outline-none focus:ring-2",
                        selected
                          ? "bg-white shadow"
                          : "text-slate-500 hover:bg-slate-200 hover:text-indigo-600"
                      )
                    }
                  >
                    {category}
                  </Tab>
                ))}
              </Tab.List>
            ) : null}
            <Tab.Panels className="mt-2">
              {categories !== undefined
                ? Object.values(categories).map((posts, idx) => (
                    <Tab.Panel
                      key={idx}
                      className={classNames("rounded-xl bg-white p-1")}
                    >
                      <div>
                        {posts.map((post) => (
                          <div
                            key={post.entity_id}
                            className="relative rounded-md"
                          >
                            {post.post_creator === null ? (
                              <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg mb-3">
                                <div className="flex items-center">
                                  <Link href={`/profile/${post.entity_photo}`}>
                                    <img
                                      className="h-12 w-12 rounded-full cursor-pointer"
                                      src={post.entity_photo}
                                      alt="Profile Pic"
                                    />
                                  </Link>

                                  <div className="flex flex-col mx-2">
                                    <Link
                                      href={`/profile/${post.entity_photo}`}
                                    >
                                      <span className="font-semibold text-lg hover:underline cursor-pointer">
                                        {post.entity_text}
                                      </span>
                                    </Link>
                                    <span className="text-sm text-slate-500">
                                      {post.follower_count === 1
                                        ? "1 follower"
                                        : post.follower_count > 1
                                        ? post.follower_count + " followers"
                                        : "no follower"}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  {currentUserId !== 0 &&
                                  currentUserId ===
                                    post.entity_id ? null : post.isFollowing ? (
                                    <button
                                      type="button"
                                      onClick={() => unfollow(post.entity_id)}
                                      className="flex outline-none border-none justify-center text-slate-900 items-center rounded-md  px-1 py-1 text-sm font-semibold leading-6 hover:underline"
                                    >
                                      <span className="mx-1 text-xs">
                                        Unfollow
                                      </span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => followUser(post.entity_id)}
                                      type="button"
                                      className="flex outline-none border-none justify-center text-indigo-600 items-center rounded-md  px-1 py-1 text-sm font-semibold leading-6 hover:underline"
                                    >
                                      <span className="mx-1 text-xs">
                                        Follow
                                      </span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-center items-center flex-col mb-3">
                                <div className="w-full  rounded-lg bg-slate-100 ">
                                  <div className="flex justify-between p-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <Link
                                          href={`/profile/${post.creator_id}`}
                                        >
                                          <img
                                            className="h-12 w-12 rounded-full cursor-pointer"
                                            src={post.creator_photo}
                                            alt="Profile Pic"
                                          />
                                        </Link>

                                        <div className="flex flex-col mx-2">
                                          <Link
                                            href={`/profile/${post.creator_id}`}
                                          >
                                            <span className="font-semibold text-lg hover:underline cursor-pointer">
                                              {post.post_creator}
                                            </span>
                                          </Link>
                                          <span className="text-sm text-slate-500">
                                            {Math.ceil(
                                              (Date.now() -
                                                new Date(
                                                  post.sort_date
                                                ).getTime()) /
                                                (1000 * 3600 * 24)
                                            ) < 2 ? (
                                              <span className="text-sm text-slate-500">
                                                {moment(post.sort_date)
                                                  .startOf(post.sort_date)
                                                  .fromNow()}
                                              </span>
                                            ) : (
                                              <span className="text-sm text-slate-500">
                                                {moment(post.sort_date).format(
                                                  "ll"
                                                )}
                                              </span>
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="p-3 border-b border-solid border-slate-300 text-left text-base">
                                    {post.entity_text}
                                  </div>
                                  <div className="flex items-center justify-between p-3">
                                    <div className="flex items-center">
                                      <div
                                        className="cursor-pointer"
                                        onClick={() => vote(1, post.entity_id)}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 32 32"
                                          fill="none"
                                        >
                                          <g clipPath="url(#clip0_4660_27459)">
                                            <path
                                              d="M11.6244 14.8126L11.6245 15.3125L11.6251 23.1094L11.6257 30.7956L11.7248 31.0085L11.7249 31.0085C11.8069 31.1847 11.957 31.3401 12.1721 31.4447C12.1789 31.4454 12.1869 31.4462 12.196 31.4471C12.2546 31.4525 12.34 31.458 12.452 31.4633C12.6749 31.4739 12.9832 31.4827 13.3512 31.4896C14.0861 31.5033 15.0456 31.5094 16.0071 31.5079C16.9686 31.5065 17.9289 31.4976 18.6654 31.4815C19.0343 31.4735 19.3436 31.4638 19.5678 31.4526C19.6805 31.4469 19.7667 31.4411 19.8261 31.4355C19.8382 31.4344 19.8483 31.4333 19.8565 31.4324C20.0604 31.3391 20.1749 31.2216 20.2722 31.0126L20.3732 30.7956L20.3738 23.1094L20.3745 15.3125L20.3745 14.8126H20.8745H24.1196H27.1825L27.2311 14.7717L27.2311 14.7717C27.2999 14.7138 27.3263 14.6626 27.3354 14.6327C27.3405 14.6158 27.3418 14.6009 27.3394 14.5861C27.3187 14.557 27.288 14.5153 27.2466 14.4601C27.1613 14.3465 27.038 14.1859 26.8813 13.9838C26.5682 13.5801 26.1262 13.0174 25.5976 12.3484C24.5406 11.0107 23.1398 9.2514 21.7357 7.49618C20.3316 5.74095 18.9247 3.99056 17.8557 2.67066C17.3211 2.01055 16.8717 1.45903 16.5496 1.06868C16.3884 0.873237 16.2604 0.719852 16.1701 0.613966C16.1368 0.574908 16.1098 0.543701 16.0889 0.519928C16.0879 0.519666 16.087 0.519402 16.086 0.519137C16.0615 0.512476 16.0307 0.507536 15.9972 0.506211C15.9724 0.50523 15.9497 0.506369 15.9306 0.508769C15.9143 0.527649 15.8951 0.550015 15.8731 0.575998C15.785 0.67974 15.6591 0.831085 15.4998 1.02453C15.1817 1.41088 14.7353 1.959 14.203 2.61625C13.1385 3.93045 11.7329 5.67763 10.3271 7.43213C8.9214 9.18664 7.51612 10.9478 6.45234 12.2899C5.92033 12.9611 5.47436 13.5267 5.15662 13.9341C4.99758 14.1379 4.87172 14.3008 4.78361 14.417C4.73936 14.4753 4.70613 14.5198 4.68352 14.551C4.67601 14.5614 4.6707 14.5689 4.66714 14.574C4.66187 14.5846 4.65759 14.5935 4.65412 14.601C4.6558 14.6064 4.65774 14.6125 4.66 14.6193C4.66003 14.6193 4.66266 14.6262 4.66989 14.6398C4.67817 14.6554 4.68953 14.6742 4.70331 14.6941C4.71705 14.714 4.73124 14.7322 4.74424 14.7472C4.75772 14.7626 4.76613 14.7702 4.76784 14.7717L11.6244 14.8126ZM11.6244 14.8126H11.1245H7.87927H4.81641M11.6244 14.8126H4.81641M4.81641 14.8126L4.76787 14.7717L4.81641 14.8126ZM16.0517 0.478731C16.0442 0.471726 16.0429 0.469708 16.0495 0.476445C16.0499 0.476843 16.0506 0.47759 16.0517 0.478731ZM27.3624 14.6196C27.3624 14.6197 27.3612 14.6178 27.359 14.6143C27.3594 14.6147 27.3596 14.6151 27.3598 14.6155C27.3617 14.6183 27.3625 14.6196 27.3624 14.6196ZM12.1353 31.4397C12.1352 31.4396 12.1379 31.44 12.1428 31.4411L12.142 31.4409C12.1375 31.4402 12.1354 31.4398 12.1353 31.4397Z"
                                              fill={
                                                post.votestatus === 1
                                                  ? "#008080"
                                                  : "none"
                                              }
                                              stroke="#008080"
                                            />
                                          </g>
                                          <defs>
                                            <clipPath id="clip0_4660_27459">
                                              <rect
                                                width="32"
                                                height="32"
                                                fill="white"
                                              />
                                            </clipPath>
                                          </defs>
                                        </svg>
                                      </div>
                                      <div className="mx-2 min-w-[10px] text-center">
                                        <span className="text-xs text-slate-500">
                                          {post.entity_points}
                                        </span>
                                      </div>
                                      <div
                                        className="cursor-pointer"
                                        onClick={() => vote(-1, post.entity_id)}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 32 32"
                                          fill="none"
                                        >
                                          <g clipPath="url(#clip0_4660_27459)">
                                            <path
                                              d="M20.3756 17.1874L20.3755 16.6875L20.3749 8.89061L20.3743 1.20443L20.2752 0.991522L20.2751 0.991472C20.1931 0.81525 20.043 0.659859 19.8279 0.555317C19.8211 0.554586 19.8131 0.553789 19.804 0.55294C19.7454 0.547512 19.66 0.541986 19.548 0.536678C19.3251 0.526123 19.0168 0.517338 18.6488 0.510435C17.9139 0.496653 16.9544 0.49062 15.9929 0.492069C15.0314 0.493519 14.0711 0.502447 13.3346 0.518452C12.9657 0.526464 12.6564 0.536184 12.4322 0.547421C12.3195 0.55307 12.2333 0.558865 12.1739 0.564501C12.1618 0.565643 12.1517 0.566698 12.1435 0.567635C11.9396 0.660898 11.8251 0.778418 11.7278 0.987352L11.6268 1.20437L11.6262 8.89061L11.6255 16.6875L11.6255 17.1874H11.1255H7.88035L4.81749 17.1874L4.76891 17.2283L4.76889 17.2283C4.70013 17.2862 4.67366 17.3374 4.66461 17.3673C4.6595 17.3842 4.65817 17.3991 4.66059 17.4139C4.68129 17.443 4.71202 17.4847 4.75342 17.5399C4.83872 17.6535 4.96195 17.8141 5.11872 18.0162C5.43184 18.4199 5.87375 18.9826 6.40238 19.6516C7.45938 20.9893 8.86019 22.7486 10.2643 24.5038C11.6684 26.2591 13.0753 28.0094 14.1443 29.3293C14.6789 29.9895 15.1283 30.541 15.4504 30.9313C15.6116 31.1268 15.7396 31.2801 15.8299 31.386C15.8632 31.4251 15.8902 31.4563 15.9111 31.4801C15.9121 31.4803 15.913 31.4806 15.914 31.4809C15.9385 31.4875 15.9693 31.4925 16.0028 31.4938C16.0276 31.4948 16.0503 31.4936 16.0694 31.4912C16.0857 31.4724 16.1049 31.45 16.1269 31.424C16.215 31.3203 16.3409 31.1689 16.5002 30.9755C16.8183 30.5891 17.2647 30.041 17.797 29.3837C18.8615 28.0696 20.2671 26.3224 21.6729 24.5679C23.0786 22.8134 24.4839 21.0522 25.5477 19.7101C26.0797 19.0389 26.5256 18.4733 26.8434 18.0659C27.0024 17.8621 27.1283 17.6992 27.2164 17.583C27.2606 17.5247 27.2939 17.4802 27.3165 17.449C27.324 17.4386 27.3293 17.4311 27.3329 17.426C27.3381 17.4154 27.3424 17.4065 27.3459 17.399C27.3442 17.3936 27.3423 17.3875 27.34 17.3807C27.34 17.3807 27.3373 17.3738 27.3301 17.3602C27.3218 17.3446 27.3105 17.3258 27.2967 17.3059C27.283 17.286 27.2688 17.2678 27.2558 17.2528C27.2423 17.2374 27.2339 17.2298 27.2322 17.2283L20.3756 17.1874ZM20.3756 17.1874H20.8755H24.1207H27.1836M20.3756 17.1874H27.1836M27.1836 17.1874L27.2321 17.2283L27.1836 17.1874ZM15.9483 31.5213C15.9558 31.5283 15.9571 31.5303 15.9505 31.5236C15.9501 31.5232 15.9494 31.5224 15.9483 31.5213ZM4.63755 17.3804C4.63758 17.3803 4.63884 17.3822 4.64096 17.3857C4.64065 17.3853 4.64038 17.3849 4.64015 17.3845C4.63832 17.3817 4.63753 17.3804 4.63755 17.3804ZM19.8647 0.56028C19.8648 0.560373 19.8621 0.559973 19.8572 0.558931L19.858 0.559061C19.8625 0.559763 19.8646 0.5602 19.8647 0.56028Z"
                                              fill={
                                                post.votestatus === -1
                                                  ? "#FF862D"
                                                  : "none"
                                              }
                                              stroke="#FF862D"
                                            />
                                          </g>
                                          <defs>
                                            <clipPath id="clip0_4660_27459">
                                              <rect
                                                width="32"
                                                height="32"
                                                fill="white"
                                                transform="matrix(-1 0 0 -1 32 32)"
                                              />
                                            </clipPath>
                                          </defs>
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Tab.Panel>
                  ))
                : null}
            </Tab.Panels>
          </Tab.Group>
        </div>
      )}
    </>
  );
};

export default SearchCom;
