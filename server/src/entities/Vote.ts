import { Entity, Column, BaseEntity, PrimaryColumn, ManyToOne } from "typeorm";
import { Post } from "./Post";
import { Users } from "./Users";

@Entity()
export class Vote extends BaseEntity {
  @Column()
  value: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Users, (user) => user.vote)
  user: Users;

  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => Post, (post) => post.vote, {
    onDelete: "CASCADE",
  })
  post: Post;
}
