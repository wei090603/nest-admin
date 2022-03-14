import { Entity, Column } from 'typeorm';
import { Base } from './base.entity';

@Entity({name: 'links'})
export class Links extends Base {
  @Column({
    type: 'varchar',
    unique: true,
    name: 'title',
    length: 50,
    comment: '标题',
  })
  public title: string;

  @Column({
    type: 'varchar',
    unique: true,
    name: 'link',
    length: 255,
    comment: '链接',
  })
  public link: string;

  @Column({
    type: 'int',
    name: 'sort',
    default: 255,
    comment: '排序',
  })
  public sort: number;
}