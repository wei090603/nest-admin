import { Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Article } from './article.entity';
import { CommentBase } from "./commentBase.entity";
import { CommentSub } from "./commentSub.entity";

@Entity({name: 'comment'})
export class Comment extends CommentBase {

  @ManyToOne(() => Article, article => article.comment)
  @JoinColumn({name: 'article_id'})
  public article: Article;

  @OneToMany(() => CommentSub, commentSub=> commentSub.parent)
  public children: CommentSub[];

}