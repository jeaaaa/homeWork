import { Provide } from "../../libs/kidi";
import {
  injectRepository,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "../../libs/kidi/plugins/kidi-mysql";

@Provide("ApiPerformanceDto")
@Entity()
export default class ApiPerformanceDto {
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
    name: "requestError",
    type: "varchar",
    length: 32,
    nullable: false,
    comment: "失败请求个数",
  })
  requestError = "";

  @Column({
    name: "slowResource",
    type: "varchar",
    length: 32,
    nullable: false,
    comment: "慢请求个数",
  })
  slowResource = "";

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
