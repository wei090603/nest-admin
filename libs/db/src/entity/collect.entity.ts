/*
 * @Description: 
 * @Author: tao.wei
 * @Date: 2021-10-10 11:21:57
 */

import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Article } from "./article.entity";
import { Base } from "./base.entity";
import { User } from "./user.entity";

@Entity({name: 'collect'})
export class Collect extends Base {
  @OneToOne(() => Article)
  @JoinColumn()
  public article: Article;

  @ManyToOne(() => User, user => user.collect)
  public user: User;
}