import path from "path";
import { EntitySchema, createConnection } from "typeorm";

export default class ModelBase {
  constructor() {
    this.models = {};
  }

  async connect(config) {
    this.config = config;
    if (config && config.database) {
      let dbconfig = config.database;
      if (dbconfig) {
        switch (dbconfig.type) {
          case "mysql":
          case "postgres":
          case "sqlite":
            this.db = await this.connectSqlite(dbconfig, config);
            // this.db.synchronize(true);
            console.log("🟠 database connected!");
            break;
        }
      }
    }
  }

  async connectSqlite(opts, config) {
    if (opts.database) {
      opts.database = path.join(config.ROOT, opts.database);
      console.log("🟠 db file path:", opts.database);
    }
    opts.entities = Object.values(this.models).map((item) => item.entity);
    const connection = await createConnection(opts);
    return connection;
  }

  synchronize() {
    if (this.db) {
      this.db.synchronize();
    }
  }

  create(name, options) {
    options.name = name;
    this.log(`create model [${name}]`, options);
    const m = new EntitySchema(options);
    this.models[name] = new Model(m, this.db);
    return this.models[name];
  }

  log(...args) {
    if (this.config && this.config.debug) {
      console.log("💡 ", ...args);
    }
  }
}

class Model {
  constructor(entity, connection) {
    this.entity = entity;
    this.connection = connection;
    this.getRepository = connection.getRepository;
    this.respository = connection.getRepository(entity);
  }
  async add(data) {
    if (!this.respository) {
      return new Error("database is not connected");
    }
    console.log("🟠 model add:", data);
    let record = this.respository.create(data);
    return this.respository.save(record);
  }
  async remove(instance) {
    if (!this.respository) {
      return new Error("database is not connected");
    }
    console.log("🟠 model remove:", instance);
    return this.respository.remove(instance);
  }
  async delete(where) {
    if (!this.respository) {
      return new Error("database is not connected");
    }
    console.log("🟠 model delete:", where);
    return this.respository.delete(where);
  }
  async merge(instance, data) {
    if (!this.respository) {
      return new Error("database is not connected");
    }
    console.log("🟠 model merge:", instance, data);
    return this.respository.merge(instance, data);
  }
  async update(where, data) {
    if (!this.respository) {
      return new Error("database is not connected");
    }
    console.log("🟠 model update:", where, data);
    return this.respository.update(where, data);
  }
  async count(where) {
    if (!this.respository) {
      return new Error("database is not connected");
    }
    console.log("🟠 model query:", where);
    return this.respository.count(where);
  }
  async find(where) {
    if (!this.respository) {
      return new Error("database is not connected");
    }
    console.log("🟠 model query:", where);
    return this.respository.find(where);
  }
  async findAndCount(where) {
    if (!this.respository) {
      return new Error("database is not connected");
    }
    console.log("🟠 model query:", where);
    return this.respository.findAndCount(where);
  }
  async findOne(where) {
    if (!this.respository) {
      return new Error("database is not connected");
    }
    console.log("🟠 model query:", where);
    return this.respository.findOne(where);
  }
  async executeSQL(sql) {
    const rawData = await this.connection.query(sql);
    return rawData;
  }
}
