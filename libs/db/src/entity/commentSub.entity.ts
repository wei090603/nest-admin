import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Comment } from "./comment.entity";
import { CommentBase } from "./commentBase.entity";
import { User } from "./user.entity";

@Entity({name: 'comment_sub'})
export class CommentSub extends CommentBase {

  @ManyToOne(() => User)
  @JoinColumn({name: 'reply_id'})
  public reply: User;

  @ManyToOne(() => Comment, comment => comment.children) // 将另一面指定为第二个参数
  @JoinColumn({name: 'parent_id'})
  public parent: Comment;

}