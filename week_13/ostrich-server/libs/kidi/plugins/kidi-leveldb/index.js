import LevelQuery from "level-queryengine";
import JsonQueryEngine from "jsonquery-engine";
import pairs from "pairs";
import levelup from "levelup";
import leveldown from "leveldown";

class kidiRedis {
  /*
    url: "mongodb://localhost:27017",
    db: "todo",
    */
  constructor({ option }) {
    this.pluginName = "leveldb";
    this.option = option;
    this.db = null;
  }

  async connect() {
    if (!this.db) {
      let db = LevelQuery(levelup(leveldown(this.option.url)));
      db.query.use(JsonQueryEngine());
      db.ensureIndex("*", "pairs", pairs.index);
      this.db = db;
    }

    return {
      async add(key, doc) {
        doc._id = key;
        await this.db.put(key, doc);
      },
      async update(query, data) {
        let obj = await this.findOne(query);
        let newObj = Object.assign(obj, data);
        this.db.del(obj._id, obj);
        console.log(`${data} has been saved`);
      },

      async remove(query) {
        let obj = await this.findOne(query);
        this.db.del(obj._id);
      },

      async find(query) {
        return new Promise((resolve, reject) => {
          this.db
            .query(query)
            .on("data", (data) => resolve)
            .on("stats", () => reject);
        });
      },

      async findOne(query) {
        let results = await this.find(query);
        return results[0];
      },
    };
  }
}

export { kidiRedis };
