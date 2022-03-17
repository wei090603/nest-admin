import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
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

  @Column({
    type: 'int',
    name: 'grade',
    comment: '数级',
    default: 0,
  })
  public grade: number

  @ManyToOne(() => Category, category => category.children)
  @JoinColumn({name: 'parent_id'})
  public parent: Category;

  @OneToMany(() => Category, category => category.parent)
  public children: Category[];

  @OneToMany(() => Article, article => article.category)
  public article: Article[];

}