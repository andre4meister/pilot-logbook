"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;
class AircraftMongo extends UuObjectDao {
  constructor(...args) {
    super(...args);
  }
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, registrationNumber: 1 }, { unique: true });
  }
  async create(uuObject) {
    return await super.insertOne(uuObject);
  }
  async get(awid, id) {
    return await super.findOne({ id, awid });
  }
  async update(uuObject) {
    let filter = { id: uuObject.id, awid: uuObject.awid };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }
  async delete(uuObject) {
    await super.deleteOne({ awid: uuObject.awid, id: uuObject.id });
  }
  async list(awid, pageInfo = {}) {
    const filter = { awid };
    return await super.find(filter, pageInfo);
  }

  async getByRegistrationNumber(awid, registrationNumber) {
    const filter = {
      awid,
      registrationNumber,
    };

    return await super.findOne(filter);
  }
}

module.exports = AircraftMongo;
