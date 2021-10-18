import fs from "fs";
import path from "path";
import {
  Column,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  createConnection,
} from "typeorm";

import context from "../../koa/core/context";

class kidiMysql {
  /*
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "admin",
      database: "test",
      entities: [Photo],
      synchronize: true,
      logging: false,
      */
  constructor(engine, option) {
    this.engine = engine;
    this.pluginName = "mysql";
    this.option = this.resolveUrl(option);
    this.connection = null;
  }

  resolveUrl(option) {
    let mats = /^mysql:\/\/([^:]+):([^:]+)@([^:]+):(\d+)\/(\w+)$/gi.exec(
      option.url
    );
    if (mats && mats.length === 6) {
      return Object.assign(option, {
        type: "mysql",
        host: mats[3],
        port: parseInt(mats[4]),
        username: mats[1],
        password: mats[2],
        database: mats[5],
      });
    } else {
      throw new Error(
        "url shema error, mysql://[username]:[password]@[host]:[port]/[database]"
      );
    }
  }

  async connect() {
    let tasks = [];
    travel(process.cwd() + "/src/entities", async (file) => {
      tasks.push(import(file));
    });
    Promise.all(tasks).then(async (dtos) => {
      this.option.entities = dtos.map((item) =>
        item.default ? item.default : item
      );
      this.connection = await createConnection(this.option);
    });
  }

  getRepository(entity) {
    let repository = this.connection.getRepository(entity);
    return {
      add(data) {
        return repository.save(data);
      },

      async update(query, data) {
        let obj = await repository.findOne(query);
        let newObj = Object.assign(obj, data);
        return repository.save(newObj);
      },

      async remove(query) {
        let obj = await repository.findOne(query);
        return repository.remove(obj);
      },

      find(query) {
        return repository.find(query);
      },

      findOne(query) {
        return repository.findOne(query);
      },

      count(query) {
        return repository.count(query);
      },

      findAndCount(query) {
        return repository.findAndCount(query);
      },

      execute(sql) {
        return repository.query(sql);
      },
    };
  }
}

function travel(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    var pathname = path.join(dir, file);
    if (fs.statSync(pathname).isDirectory()) {
      travel(pathname, callback);
    } else {
      callback(pathname);
    }
  });
}

export function injectRepository(dtoClass) {
  let { app } = context.engine;
  return app.mysql.getRepository(dtoClass);
}

export {
  Entity,
  Column,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";

export { kidiMysql };
