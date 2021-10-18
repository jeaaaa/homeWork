import { Provide } from "../../libs/kidi";
import {
  injectRepository,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "../../libs/kidi/plugins/kidi-mysql";

@Provide("VisitDto")
@Entity()
export default class VisitDto {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column({
    name: "uid",
    type: "varchar",
    length: 32,
    nullable: false,
    comment: "用户Id",
  })
  uid = "";

  @Column({
    name: "did",
    type: "varchar",
    length: 32,
    nullable: false,
    comment: "设备Id",
  })
  uid = "";

  @Column({
    name: "ip",
    type: "varchar",
    length: 16,
    nullable: true,
    comment: "ip",
  })
  pageId = "";

  @Column({
    name: "country",
    type: "varchar",
    length: 32,
    nullable: true,
    comment: "国家",
  })
  country = "";

  @Column({
    name: "province",
    type: "varchar",
    length: 32,
    nullable: true,
    comment: "省",
  })
  province = "";

  @Column({
    name: "city",
    type: "varchar",
    length: 32,
    nullable: true,
    comment: "市",
  })
  city = "";

  @Column({
    name: "day",
    type: "varchar",
    length: 8,
    nullable: false,
    comment: "日期",
  })
  day = "";

  @CreateDateColumn({ name: "created_at", comment: "创建时间" })
  created_at = new Date();

  @UpdateDateColumn({ name: "updated_at", comment: "更新时间" })
  updated_at = new Date();
}
