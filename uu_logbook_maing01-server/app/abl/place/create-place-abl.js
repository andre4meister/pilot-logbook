const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;

const Warnings = require("../../api/warnings/logbook-entry-warnings");
const Errors = require("../../api/errors/logbook-entry-error");
const { Profiles, Schemas } = require("../constants");
const InstanceChecker = require("../../components/instance-checker");

class CreatePlaceAbl {
  constructor() {
    this.validator = Validator.load();
    this.placeDao = DaoFactory.getDao(Schemas.PLACE);
  }

  async create(awid, dtoIn, session, authorizationResult) {
    // hds 1, 1.1
    let validationResult = this.validator.validate("placeCreateDtoInType", dtoIn);

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
      name: dtoIn.name,
      countryCode: dtoIn.countryCode,
      state: dtoIn.state,
      airportCode: dtoIn.airportCode,
      GPSlocation: dtoIn.GPSlocation,
    };

    let place;
    try {
      place = await this.placeDao.create(uuObject);
    } catch (e) {
      throw Errors.Create.PilotLogbookDaoCreateFailed;
    }

    //hds 5
    return {
      ...place,
      uuAppErrorMap,
    };
  }
}

module.exports = new CreatePlaceAbl();
