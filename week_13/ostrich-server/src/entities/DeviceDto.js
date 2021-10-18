import { Provide } from "../../libs/kidi";
import {
  injectRepository,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "../../libs/kidi/plugins/kidi-mysql";

@Provide("DeviceDto")
@Entity()
export default class DeviceDto {
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
    name: "brand",
    type: "varchar",
    length: 128,
    nullable: false,
    comment: "品牌",
  })
  brand = "";

  @Column({
    name: "os",
    type: "varchar",
    length: 32,
    nullable: false,
    comment: "操作系统",
  })
  os = "";

  @Column({
    name: "osVersion",
    type: "varchar",
    length: 32,
    nullable: false,
    comment: "操作系统版本",
  })
  osVersion = "";

  @Column({
    name: "deviceType",
    type: "char",
    length: 1,
    nullable: true,
    comment: "设备类型",
  })
  deviceType = "";

  @Column({
    name: "browser",
    type: "varchar",
    length: 128,
    nullable: true,
    comment: "浏览器",
  })
  browser = "";

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
