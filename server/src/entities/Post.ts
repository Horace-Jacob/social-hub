import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
  AfterLoad,
} from "typeorm";
import { Users } from "./Users";
import { Comment } from "./Comment";
import { Vote } from "./Vote";

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  about!: string;

  @Column({ type: "int", default: 0 })
  points!: number;

  @Column({ type: "int", default: 0 })
  commentCount: number;

  voteStatus: number | null;

  @AfterLoad()
  setVoteStatus() {
    this.voteStatus = 0;
  }

  @Column()
  creatorId!: number;

  @ManyToOne(() => Users, (user) => user.posts)
  creator: Users;

  @OneToMany(() => Comment, (comment) => comment.post)
  comment: Comment[];

  @OneToMany(() => Vote, (vote) => vote.post)
  vote: Vote[];

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
