"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class LogbookMainMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid) {
    return await super.findOne({ awid });
  }

  async update(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async delete(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.deleteOne(filter);
  }

  async list(awid, pageInfo) {
    return await super.find({ awid, pageInfo });
  }
}

module.exports = LogbookMainMongo;
