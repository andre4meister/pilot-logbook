const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;

const { Profiles, LogBookEntry, Schemas } = require("../constants");
const Warnings = require("../../api/warnings/logbook-entry-warnings");
const Errors = require("../../api/errors/logbook-entry-error");
const InstanceChecker = require("../../components/instance-checker");

class GetLogbookEntryAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.LOGBOOK_ENTRY);
  }

  async get(awid, dtoIn, session, authorizationResult) {
    // hds 1, 1.1
    let validationResult = this.validator.validate("logbookEntryGetDtoInType", dtoIn);

    // 1.2, 1.3, 1.3.1
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.Get.UnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // hds 2
    const allowedStateRules = {
      [Profiles.AUTHORITY]: ["active", "underConstruction", "closed"],
      [Profiles.AUTHORITIES]: ["active", "underConstruction", "closed"],
      [Profiles.EXECUTIVES]: ["active", "underConstruction"],
      [Profiles.READERS]: ["active"],
    };

    // 2.1, 2.2
    await InstanceChecker.ensureInstanceAndState(
      awid,
      Errors.Get,
      uuAppErrorMap,
      authorizationResult,
      allowedStateRules
    );

    // hds 3, 4
    let logbookEntry = await this.dao.get(awid, dtoIn.id);

    // 4.1
    if (!logbookEntry) {
      throw new Errors.Get.LogbookEntryDoesNotExist(
        { uuAppErrorMap },
        {
          logbookEntryId: dtoIn.id,
        }
      );
    }

    // 4.2
    const authorizedUserProfiles = authorizationResult.getAuthorizedProfiles();
    const isReader = authorizedUserProfiles.every((profile) => profile === Profiles.READERS);
    const incorrectState =
      logbookEntry.state === LogBookEntry.State.INITIAL || logbookEntry.state === LogBookEntry.State.PROBLEM;

    if (isReader && incorrectState) {
      throw new Errors.Get.UserDoesNotAllowedToViewEntry(
        { uuAppErrorMap },
        {
          logbookEntryId: dtoIn.id,
          logbookEntryState: logbookEntry.state,
          expectedState: "active",
        }
      );
    }

    // hds 5
    const dtoOut = {
      ...logbookEntry,
      uuAppErrorMap,
    };

    return dtoOut;
  }
}

module.exports = new GetLogbookEntryAbl();
