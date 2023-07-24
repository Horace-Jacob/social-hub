import { Comment, Post, Search, normalReturn } from "@/utils/types";
import { baseURL } from "@/utils/url";

export const dynamic = "force-dynamic";

let token: any;
if (typeof window !== "undefined") {
  token = localStorage.getItem("token");
}

export async function fetchPostData() {
  const response = await fetch(`${baseURL}/post/getssrdata`, {
    cache: "no-store",
  });
  const data: Post = await response.json();
  return data;
}

export async function fetchCommentsByPost(postId: number) {
  const response = await fetch(
    `${baseURL}/comment/getcommentbypost/${postId}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data: Comment = await response.json();
  return data;
}

export async function fetchSearchQuery(query: string) {
  const response = await fetch(
    `${baseURL}/search/searchall/${query}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data: Search = await response.json();
  return data;
}

export async function fetchOtherPostData() {
  const response = await fetch(`${baseURL}/post/getotherpostdata`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data: Post = await response.json();
  return data;
}

export async function follow(data = {}) {
  if (token !== null) {
    const response = await fetch(`${baseURL}/follow/create`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    const returnData: normalReturn = await response.json();
    return returnData;
  }
  return null;
}

export async function unfollowUser(data = {}) {
  const response = await fetch(`${baseURL}/follow/unfollow`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  const returnData: normalReturn = await response.json();
  return returnData;
}

export async function createComment(data = {}) {
  const response = await fetch(`${baseURL}/comment/create`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  const returnData: normalReturn = await response.json();
  return returnData;
}

export async function deletePost(postId: number) {
  const response = await fetch(`${baseURL}/post/delete/${postId}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
  });
  const returnData: normalReturn = await response.json();
  return returnData;
}

export async function votePost(data = {}) {
  const response = await fetch(`${baseURL}/post/vote`, {
    cache: "no-cache",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  const returnData: normalReturn = await response.json();
  return returnData;
}
