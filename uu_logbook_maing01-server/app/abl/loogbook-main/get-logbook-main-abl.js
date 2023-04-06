"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const Errors = require("../../api/errors/logbook-main-error.js");
const { Schemas } = require("../constants");

class GetLogbookMainAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.PILOT_LOGBOOK);
  }

  async get(uri, session, uuAppErrorMap = {}) {
    let awid = uri.getAwid();

    const pilotLogbook = await this.dao.get(awid);

    const dtoOut = {
      ...pilotLogbook,
      uuAppErrorMap,
    };

    return dtoOut;
  }
}

module.exports = new GetLogbookMainAbl();
