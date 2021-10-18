import { Provide } from "../../libs/kidi";
import {
  injectRepository,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "../../libs/kidi/plugins/kidi-mysql";

@Provide("UvpvDto")
@Entity()
export default class UvpvDto {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column({
    name: "projectId",
    type: "int",
    nullable: false,
    comment: "项目Id",
  })
  projectId = "";

  @Column({
    name: "pageId",
    type: "varchar",
    nullable: true,
    comment: "页面Id",
  })
  pageId = "";

  @Column({
    name: "uv",
    type: "bigint",
    nullable: true,
    comment: "uv",
  })
  uv = "";

  @Column({
    name: "pv",
    type: "bigint",
    nullable: true,
    comment: "pv",
  })
  pv = "";

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
