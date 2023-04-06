const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { Schemas } = require("../abl/constants");

class LogbookEntryHelper {
  constructor() {
    this.pilotDao = DaoFactory.getDao(Schemas.PILOT);
  }

  async checkPilotExistence(awid, pilotIdList = []) {
    const existingPilots = [];
    const nonExistingPilots = [];
    let pilotFound;
    const allPilots = await this.pilotDao.list(awid);

    pilotIdList.forEach((id) => {
      pilotFound = allPilots.itemList.find((it) => it.id.toString() === id.toString());
      if (pilotFound) {
        existingPilots.push(id.toString());
      } else {
        nonExistingPilots.push(id.toString());
      }
    });

    return { existingPilots: [...new Set(existingPilots)], nonExistingPilots: [...new Set(nonExistingPilots)] };
  }
}

module.exports = new LogbookEntryHelper();
