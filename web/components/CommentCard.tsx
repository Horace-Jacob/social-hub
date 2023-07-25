import moment from "moment";
import Image from "next/image";
import React from "react";

interface Props {
  username: string;
  profilePic: string;
  commentData: string;
  commentCreateTime: any;
}

const CommentCard: React.FC<Props> = ({
  username,
  profilePic,
  commentData,
  commentCreateTime,
}) => {
  return (
    <div className="flex justify-between p-3">
      <div className="flex justify-center ">
        <Image
          className="h-9 w-9 rounded-full cursor-pointer"
          src={profilePic}
          priority
          width={12}
          height={12}
          alt="Profile Pic"
        />
        <div className="flex flex-col ml-2 bg-slate-100 rounded-lg p-3">
          <div className="flex items-center">
            <span className="font-semibold text-sm hover:underline cursor-pointer">
              {username}
            </span>
            <span className="mx-2 text-[12px]">
              {Math.ceil(
                (Date.now() - new Date(commentCreateTime).getTime()) /
                  (1000 * 3600 * 24)
              ) < 2 ? (
                <span className="text-sm text-slate-500">
                  {moment(commentCreateTime)
                    .startOf(commentCreateTime)
                    .fromNow()}
                </span>
              ) : (
                <span className="text-sm text-slate-500">
                  {moment(commentCreateTime).format("ll")}
                </span>
              )}
            </span>
          </div>
          <span className="text-sm text-slate-700 mt-1">{commentData}</span>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
