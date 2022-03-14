import { Entity, Column, TreeChildren, TreeParent, OneToMany, ManyToOne, Tree } from 'typeorm';
import { Article } from './article.entity';
import { Base } from './base.entity';

@Entity({name: 'category'})
export class Category extends Base {
  @Column({
    type: 'varchar',
    unique: true,
    name: 'title',
    length: 60,
    comment: '分类名称'
  })
  public title: string;

  // @Column({
  //   type: 'int',
  //   nullable: true,
  //   name: 'count',
  //   default: 0,
  //   comment: '子级数量'
  // })
  // public count: number;

  @OneToMany(() => Article, (article) => article.category)
  public article: Article[];

  // @TreeChildren({ cascade: true })
  // public children: Category[];

  // @TreeParent()
  // public parent: Category;
}