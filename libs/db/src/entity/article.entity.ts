import { Entity, Column, ManyToOne, ManyToMany, OneToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { Base } from './base.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { User } from './user.entity';

@Entity('article')
export class Article extends Base {
  @Column({
    type: 'text',
    name: 'content',
    comment: '文章内容',
  })
  public content: string;

  @Column({
    type: 'int',
    name: 'reads',
    default: 0,
    comment: '阅读数量',
  })
  public reads: number;

  @Column({
    type: 'int',
    name: 'status',
    comment: '是否回复 1-打开回复 2-关闭回复 3-仅自己可见',
    default: 1,
  })
  public status: string;

  @Column({
    type: 'boolean',
    name: 'is_top',
    comment: '是否置顶 0-未置顶 1-已置顶',
    default: false,
  })
  public isTop: boolean;

  @Column({
    type: 'int',
    nullable: true,
    name: 'sort',
    comment: '排序',
  })
  public sort: number;

  @Column({
    type: 'int',
    name: 'likes',
    default: 0,
    comment: '点赞数量',
  })
  public likes: number;

  @Column({
    type: 'boolean',
    name: 'handed',
    default: false,
    comment: '当前用户是否点赞 0-否 1-是',
  })
  public handed: boolean;

  @Column({
    type: 'int',
    name: 'comments',
    default: 0,
    comment: '评论数量',
  })
  public comments: number;

  @ManyToOne(() => Category, category => category.article)
  @JoinColumn({name: 'category_id'})
  public category: Category;

  @ManyToMany(() => Tag, tag => tag.article)
	public tag: Tag[];

  // 点赞用户
  // @OneToMany(() => ArticleLike, (articleLike) => articleLike.article)
  // public like: ArticleLike[]

  // @OneToMany(() => Comment, comment => comment.article)
  // public comment: Comment[];

  @ManyToOne(() => User, user => user.article)
  @JoinColumn({name: 'user_id'})
  public author: User;
}