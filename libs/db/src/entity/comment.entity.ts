import { Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Article } from './article.entity';
import { CommentBase } from "./commentBase.entity";

@Entity({name: 'comment'})
export class Comment extends CommentBase {

  @ManyToOne(() => Article, article => article.comment)
  public article: Article;

  @ManyToOne(() => Comment, comment => comment.children)
  @JoinColumn({name: 'parent_id'})
  public parent: Comment;

  @OneToMany(() => Comment, comment => comment.parent)
  public children: Comment[];

}