import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { Users } from "./Users";
import { Post } from "./Post";

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  comment: string;

  @Column()
  userId: number;

  @Column()
  postId: number;

  @ManyToOne(() => Users, (user) => user.comment)
  user: Users;

  @ManyToOne(() => Post, (post) => post.comment)
  post: Post;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
