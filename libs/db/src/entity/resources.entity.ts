/*
 * @Description: 
 * @Author: tao.wei
 * @Date: 2021-09-22 14:36:23
 */
import { Entity, Tree, Column, TreeChildren, TreeParent, TreeLevelColumn, RelationId, ManyToMany } from "typeorm";
import { Base } from "./base.entity";
import { Roles } from "./roles.entity";

@Entity('resources')
@Tree("closure-table")
export class Resources extends Base {

  @Column('varchar', {
    name: 'title',
    length: 60,
    comment: '菜单标题'
  })
  public title: string;

  @Column('varchar', {
    name: 'type',
    length: 60,
    comment: '类型'
  })
  public type: string;

  @Column('varchar', {
    nullable: true,
    name: 'icon',
    length: 60,
    comment: '图标'
  })
  public icon: string;

  @Column('varchar', {
    name: 'path',
    length: 200,
    unique: true, // 将列标记为唯一
    comment: '路径'
  })
  public path: string;

  @Column('int', {
    nullable: true,
    name: 'count',
    default: 0,
    comment: '子级数量'
  })
  public count: number;

  @Column({
    type: 'boolean',
    name: 'status',
    comment: '是否显示 0-不显示 1-显示',
    default: false,
  })
  public status: boolean;

  @TreeChildren({ cascade: true })
  public children: Resources[];

  @TreeParent()
  public parent: Resources;

  @TreeLevelColumn()
  @Column('int', {
    name: 'level',
    default: 0,
    comment: '子级数量'
  })
  public level: number;

  @ManyToMany(() => Roles, (roles) => roles.resources)
  public roles: Roles[];
}