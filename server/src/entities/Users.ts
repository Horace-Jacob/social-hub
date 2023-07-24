import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { Vote } from "./Vote";

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ type: "int", default: 0 })
  followingCount: number;

  @Column({ type: "int", default: 0 })
  followerCount: number;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[];

  @OneToMany(() => Vote, (vote) => vote.user)
  vote: Vote[];

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
