import { Schedule, Cron } from "../../libs/kidi";

/**
 *:  *  *  *  *  *  *
 *:  |  |  |  |  |  |___: day of week (0 - 7) (0 or 7 is Sun)
 *:  |  |  |  |  |______: month (1 - 12)
 *:  |  |  |  |_________: day of month (1 - 31)
 *:  |  |  |____________: hour (0 - 23)
 *:  |  |_______________: minute (0 - 59)
 *:  |__________________: second (0 - 59, OPTIONAL)
 *:
 */
@Schedule()
export class DataCompute {
  //每5秒种执行一次
  @Cron("*/5 * * * * *")
  exec(engine) {
    console.log(">> DataCompute job executing! >>", new Date());
  }
}
