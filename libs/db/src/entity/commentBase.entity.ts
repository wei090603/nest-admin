import { Column, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Base } from "./base.entity";
import { User } from './user.entity';

export class CommentBase extends Base {
  @Column({
    type: 'varchar',
    name: 'content',
    length: 200,
    comment: '评论内容',
  })
  public content: string;

  @Column({
    type: 'int',
    name: 'hands',
    default: 0,
    comment: '点赞数量',
  })
  public hands: number;

  @Column({
    type: 'boolean',
    name: 'status',
    comment: '是否显示 0-不显示 1-显示',
    default: true,
  })
  public status: boolean;

  @ManyToOne(() => User)
  @JoinColumn({name: 'user_id'})
  public user: User;
}