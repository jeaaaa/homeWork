import { MongoClient } from "mongodb";
import context from "../../koa/core/context";

class kidiMongodb {
  constructor(engine, option) {
    this.engine = engine;
    this.pluginName = "mongodb";
    this.option = option;
    this.client = null;
  }

  async connect() {
    const client = new MongoClient(this.option.url);
    await client.connect();
    this.client = client;
    return client;
  }

  getCollection(name) {
    const db = this.client.db(this.option.db);
    const collection = db.collection(name);
    return {
      async add(doc) {
        let result = await collection.insertOne(doc);
        console.log(`saved success`, result);
        return result;
      },

      async batchAdd(docs) {
        await collection.insertMany(docs);
        console.log(`saved success`);
        return true;
      },

      async update(query, data) {
        let obj = await repository.findOne(query);
        let newObj = Object.assign(obj, data);
        let result = await repository.save(newObj);
        console.log(`update success`);
        return result;
      },

      async remove(query) {
        let obj = await repository.findOne(query);
        await repository.remove(obj);
        console.log(`remove success`);
        return true;
      },

      async find(query) {
        let list = await collection.find(query).toArray();
        return list;
      },

      async findOne(query) {
        let obj = await repository.findOne(query);
        return obj;
      },

      async count(query) {
        let count = await repository.findOne(query);
        return count;
      },

      async findAndcCount(query) {
        let [list, count] = await repository.findAndCount(query);
        return [list, count];
      },

      async execute(sql) {
        const rawData = await repository.query(sql);
        return rawData;
      },
    };
  }
}

export function injectCollection(name) {
  let { app } = context.engine;
  return app.mongodb.getCollection(name);
}

export { kidiMongodb };
