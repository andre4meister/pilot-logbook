const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;

const { Profiles, LogBookEntry, Schemas } = require("../constants");
const Warnings = require("../../api/warnings/logbook-entry-warnings");
const Errors = require("../../api/errors/logbook-entry-error");
const InstanceChecker = require("../../components/instance-checker");

class DeleteLogbookEntryAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.LOGBOOK_ENTRY);
  }

  async delete(awid, dtoIn, session, authorizationResult) {
    // hds 1, 1.1
    let validationResult = this.validator.validate("logbookEntryDeleteDtoInType", dtoIn);

    // 1.2, 1.3, 1.3.1
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.Delete.UnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    // hds 2
    const allowedStateRules = {
      [Profiles.AUTHORITY]: ["active", "underConstruction", "closed"],
    };

    // 2.1, 2.2
    await InstanceChecker.ensureInstanceAndState(
      awid,
      Errors.Delete,
      uuAppErrorMap,
      authorizationResult,
      allowedStateRules
    );

    // hds 3, 4
    let logbookEntry = await this.dao.get(awid, dtoIn.id);

    // 4.1
    if (!logbookEntry) {
      throw new Errors.Delete.LogbookEntryDoesNotExist(
        { uuAppErrorMap },
        {
          logbookEntryId: dtoIn.id,
        }
      );
    }

    // 4.2
    const isInWrongState = logbookEntry.state !== LogBookEntry.State.PROBLEM;
    if (isInWrongState) {
      throw new Errors.Delete.UserDoesNotAllowedToViewEntry(
        { uuAppErrorMap },
        {
          logbookEntryId: dtoIn.id,
          logbookEntryState: logbookEntry.state,
          expectedState: "problem",
        }
      );
    }

    // hds 5
    await this.dao.delete(logbookEntry);

    // hds 6
    const dtoOut = {
      uuAppErrorMap,
    };

    return dtoOut;
  }
}

module.exports = new DeleteLogbookEntryAbl();
