export type Post = {
  success: boolean;
  results: PostData[];
  message: string;
};

export type PostData = {
  id: number;
  about: string;
  commentCount: number;
  creatorId: number;
  points: number;
  creator: {
    id: number;
    username: string;
    photo: string;
  };
  createdAt: any;
  value: number;
  isFollowing: boolean;
};

export type UserProfile = {
  success: boolean;
  results: UserData;
  message: string;
};

export type UserData = {
  id: number;
  username: string;
  email: string;
  password: string;
  photo: string;
  followingCount: number;
  followerCount: number;
  isFollowing: boolean;
};

export type normalReturn = {
  success: boolean;
  message: any;
  results: any;
};

export type UserFollowings = {
  success: boolean;
  message: any;
  results: UserFollowingsData[];
};

export type UserFollowingsData = {
  id: number;
  FromUser: number;
  ToUser: number;
  isDeleted: boolean;
  createdAt: any;
  updatedAt: any;
  creator: {
    id: number;
    username: string;
    photo: string;
    followerCount: number;
  };
};

export type TokenDecode = {
  id: number;
  iat: number;
  exp: number;
};

export type Comment = {
  success: boolean;
  results: CommentData[];
  message: string;
};

export type CommentData = {
  id: number;
  comment: string;
  userId: number;
  postId: number;
  isDeleted: boolean;
  createdAt: any;
  commentCount: number;
  creator: {
    id: number;
    username: string;
    photo: string;
  };
};

export type Search = {
  success: boolean;
  message: string;
  results: SearchReturn[];
};

export type SearchData = {
  People: SearchReturn[];
  Posts: SearchReturn[];
};

export type SearchReturn = {
  entity_type: string;
  entity_id: number;
  entity_text: string;
  entity_photo: string;
  rank: number;
  sort_date: any;
  commentcount: number;
  post_creator: string;
  creator_photo: string;
  creator_id: number;
  follower_count: number;
  entity_points: number;
  votestatus: number;
  isFollowing: boolean;
};
