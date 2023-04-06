const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;

const Warnings = require("../../api/warnings/logbook-entry-warnings");
const Errors = require("../../api/errors/logbook-entry-error");
const { Profiles, Schemas } = require("../constants");
const InstanceChecker = require("../../components/instance-checker");

class ListAircraftAbl {
  constructor() {
    this.validator = Validator.load();
    this.aircraftDao = DaoFactory.getDao(Schemas.AIRCRAFT);
  }

  async list(awid, dtoIn, session, authorizationResult) {
    // hds 1, 1.1
    let validationResult = this.validator.validate("aircraftListDtoInType", dtoIn);

    // 1.2, 1.3
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.Create.UnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    // hds 2, 3
    const allowedStateRules = {
      [Profiles.AUTHORITY]: ["active", "underConstruction", "closed"],
      [Profiles.AUTHORITIES]: ["active", "underConstruction", "closed"],
      [Profiles.EXECUTIVES]: ["active", "underConstruction"],
    };

    // 3.1, 3.2
    await InstanceChecker.ensureInstanceAndState(
      awid,
      Errors.List,
      uuAppErrorMap,
      authorizationResult,
      allowedStateRules
    );

    //hds 4
    let aircraftList;
    try {
      aircraftList = await this.aircraftDao.list(awid, dtoIn.pageInfo);
    } catch (e) {
      throw Errors.Create.PilotLogbookDaoCreateFailed;
    }

    //hds 5
    return {
      ...aircraftList,
      uuAppErrorMap,
    };
  }
}

module.exports = new ListAircraftAbl();
