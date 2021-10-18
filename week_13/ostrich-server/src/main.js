import { Factory, KoaApplication } from "../libs/kidi";
import { kidiMysql, kidiMongodb } from "../libs/kidi/plugins";
import RootController from "./controllers/root/";
import ProjectController from "./controllers/project/";
import ReportController from "./controllers/report/";

(async function () {
  const app = Factory.create(KoaApplication);

  //setup mysql
  app.plugin(kidiMysql, {
    url: "mysql://root:123qwe@localhost:3306/ostrich",
    synchronize: true,
    logging: false,
  });

  //setup mongodb
  app.plugin(kidiMongodb, {
    // url: "mongodb://dataUser:data!123@localhost:27017",
    url: "mongodb://dataUser:data!123@localhost:27017/ostrich",
    db: "ostrich",
  });

  //注册控制器
  app.regist(RootController);
  app.regist(ProjectController);
  app.regist(ReportController);

  await app.listen(5000);
})();
