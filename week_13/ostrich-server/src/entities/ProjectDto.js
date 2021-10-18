import { Provide } from "../../libs/kidi";
import {
  injectRepository,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "../../libs/kidi/plugins/kidi-mysql";

// ColumnOptions {
//   //列类型
//   type?: ColumnType;
//   //列名
//   name?: string;
//   //某些列类型带有长度参数，如string->varchar
//   length?: string|number;
//   //是否可以为空
//   nullable?: boolean;
//   //列是否只读，true意味着只有第一次插入表数据时可以初始化这个列值，不可更新它
//   readonly?: boolean;
//   //指明列是否总是被QueryBuilder和find操作选择，默认值为true
//   select?: boolean;
//   //列默认值
//   default?: any;
//   //指明列是否是主键列
//   //与@PrimaryColumn装饰器作用一样
//   primary?: boolean;
//   //列值在数据库中是否唯一
//   unique?: boolean;
//   //列注解，目前不支持
//   comment?: string;
//   //精度
//   precision?: number;
//   //标度，只有某些类支持
//   scale?: number;
//   //列字符集，目前不支持
//   charset?: string;
//   //列校对
//   collation?: string;
//   //对枚举类型，指定枚举值数组
//   enum?: any[]|Object;
//   //列是否为数组，只有postgres支持
//   isArray?: boolean;
//   //列是否为数组，只有postgres支持
//   array?: boolean;
//   //指定一个值转换器，用于读写数据库时对列值进行读写
//   transformer?: ValueTransformer;
// }

@Provide("ProjectDto")
@Entity()
export default class ProjectDto {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column({
    name: "name",
    type: "varchar",
    length: 128,
    nullable: false,
    comment: "名称",
  })
  name = "";

  @Column({
    name: "label",
    type: "varchar",
    length: 128,
    nullable: true,
    comment: "标签",
  })
  label = "";

  @CreateDateColumn({ name: "created_at", comment: "创建时间" })
  created_at = new Date();

  @UpdateDateColumn({ name: "updated_at", comment: "更新时间" })
  updated_at = new Date();
}
