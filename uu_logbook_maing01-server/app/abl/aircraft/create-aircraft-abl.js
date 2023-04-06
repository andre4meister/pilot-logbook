const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;

const Warnings = require("../../api/warnings/logbook-entry-warnings");
const Errors = require("../../api/errors/logbook-entry-error");
const { Profiles, Schemas } = require("../constants");
const InstanceChecker = require("../../components/instance-checker");

class CreateAircraftAbl {
  constructor() {
    this.validator = Validator.load();
    this.aircraftDao = DaoFactory.getDao(Schemas.AIRCRAFT);
  }

  async create(awid, dtoIn, session, authorizationResult) {
    // hds 1, 1.1
    let validationResult = this.validator.validate("aircraftCreateDtoInType", dtoIn);

    // 1.2, 1.3
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.Create.UnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    // hds 2, 3
    let pilotLogbook;

    const allowedStateRules = {
      [Profiles.AUTHORITY]: ["active", "underConstruction", "closed"],
      [Profiles.AUTHORITIES]: ["active", "underConstruction", "closed"],
      [Profiles.EXECUTIVES]: ["active", "underConstruction"],
    };

    // 3.1, 3.2
    // await InstanceChecker.ensureInstanceAndState(
    //   awid,
    //   Errors.Create,
    //   uuAppErrorMap,
    //   authorizationResult,
    //   allowedStateRules
    // );

    //hds 4
    const uuObject = {
      awid,
      registrationNumber: dtoIn.registrationNumber,
      model: dtoIn.model,
      state: dtoIn.state,
    };

    let aircraft;
    try {
      aircraft = await this.aircraftDao.create(uuObject);
    } catch (e) {
      throw Errors.Create.PilotLogbookDaoCreateFailed;
    }

    //hds 5
    return {
      ...aircraft,
      uuAppErrorMap,
    };
  }
}

module.exports = new CreateAircraftAbl();
