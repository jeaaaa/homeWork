import { Provide } from "../../libs/kidi";
import {
  injectRepository,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "../../libs/kidi/plugins/kidi-mysql";

@Provide("PagePerformanceDto")
@Entity()
export default class PagePerformanceDto {
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
    name: "network",
    type: "varchar",
    length: 32,
    nullable: false,
    comment: "平均网络耗时",
  })
  network = "";

  @Column({
    name: "slowResource",
    type: "varchar",
    length: 32,
    nullable: false,
    comment: "慢请求个数",
  })
  slowResource = "";

  @Column({
    name: "ttfbTime",
    type: "bigint",
    nullable: true,
    comment: "首字节下载时间",
  })
  province = "";

  @Column({
    name: "fcpTime",
    type: "bigint",
    nullable: true,
    comment: "首屏渲染时间",
  })
  fcpTime = "";

  @Column({
    name: "ttiTime",
    type: "int",
    nullable: true,
    comment: "页面可交互时间",
  })
  ttiTime = "";

  @Column({
    name: "totalTime",
    type: "int",
    nullable: true,
    comment: "加载总时间",
  })
  totalTime = "";

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
