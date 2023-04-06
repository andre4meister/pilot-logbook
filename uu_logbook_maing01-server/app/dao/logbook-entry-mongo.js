"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class LogbookEntryMongo extends UuObjectDao {
  constructor(...args) {
    super(...args);
  }

  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
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

  async list(awid, pageInfo) {
    const filter = { awid };
    return await super.find(filter, pageInfo);
  }

  async listByStateAndDateTime(awid, sortBy, order, state, dateTimeFrom, dateTimeTo, pageInfo) {
    const filter = {
      awid,
      state,
      ...(dateTimeFrom && { dateTimeFrom: { $gte: new Date(dateTimeFrom).toISOString() } }),
      ...(dateTimeTo && { dateTimeTo: { $lte: new Date(dateTimeTo).toISOString() } }),
    };
    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    return await super.find(filter, pageInfo, sort);
  }

  async listByAircraftIdListAndDateTime(awid, aircraftId, dateTimeFrom, dateTimeTo, pageInfo) {
    const filter = {
      awid,
      aircraftId,
      $or: [
        {
          dateTimeFrom: {
            $lt: dateTimeTo,
          },
          dateTimeTo: {
            $gt: dateTimeFrom,
          },
        },
        {
          dateTimeFrom: {
            $gte: dateTimeFrom,
          },
          dateTimeTo: {
            $lte: dateTimeTo,
          },
        },
        {
          dateTimeFrom: {
            $lte: dateTimeFrom,
          },
          dateTimeTo: {
            $gt: dateTimeFrom,
            $lt: dateTimeTo,
          },
        },
        {
          dateTimeFrom: {
            $lt: dateTimeFrom,
          },
          dateTimeTo: {
            $gt: dateTimeTo,
          },
        },
      ],
    };

    return await super.find(filter, pageInfo);
  }

  async listByPilotIdListAndDateTime(awid, pilotIdList, dateTimeFrom, dateTimeTo, pageInfo) {
    const filter = {
      awid: awid,
      pilotIdList: {
        $in: pilotIdList,
      },
      $or: [
        {
          dateTimeFrom: {
            $lt: dateTimeTo,
          },
          dateTimeTo: {
            $gt: dateTimeFrom,
          },
        },
        {
          dateTimeFrom: {
            $gte: dateTimeFrom,
          },
          dateTimeTo: {
            $lte: dateTimeTo,
          },
        },
        {
          dateTimeFrom: {
            $lte: dateTimeFrom,
          },
          dateTimeTo: {
            $gt: dateTimeFrom,
            $lt: dateTimeTo,
          },
        },
        {
          dateTimeFrom: {
            $lt: dateTimeFrom,
          },
          dateTimeTo: {
            $gt: dateTimeTo,
          },
        },
      ],
    };

    return await super.find(filter, pageInfo);
  }
}

module.exports = LogbookEntryMongo;
