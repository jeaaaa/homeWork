import schedule from "node-schedule";

export default class Schedule {
  constructor(engine, context, schedules) {
    this.engine = engine;
    this.context = context;
    this.schedules = schedules;
    process.nextTick(() => {
      this.startSchedule();
    });
  }

  startSchedule() {
    // this.schedules.forEach((item) => {
    //   if (this.context.schedule[item.name]) {
    //     let jobs = context.schedule[item.name].jobs;
    //     Object.keys(jobs).forEach((cron) => {
    //       let instance = new item();
    //       schedule.scheduleJob(cron, () => {
    //         instance.exec(this.engine);
    //       });
    //     });
    //   }
    // });
  }
}
