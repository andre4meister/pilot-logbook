const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;

const { Profiles, LogBookEntry, Schemas } = require("../constants");
const Warnings = require("../../api/warnings/logbook-entry-warnings");
const Errors = require("../../api/errors/logbook-entry-error");
const InstanceChecker = require("../../components/instance-checker");

const logbookEntryListDtoInDefault = {
  order: "asc",
  sortBy: "dateTimeFrom",
  pageInfo: {
    pageIndex: 0,
    pageSize: 50,
  },
  filterMap: {
    state: LogBookEntry.State.ACTIVE,
  },
};
class ListLogbookEntryAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.LOGBOOK_ENTRY);
  }

  async list(awid, dtoIn, session, authorizationResult) {
    // hds 1, 1.1
    let validationResult = this.validator.validate("logbookEntryListDtoInType", dtoIn);

    // 1.2, 1.3, 1.3.1, 1.4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.List.UnsupportedKeys.code,
      Errors.List.InvalidDtoIn
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
      Errors.List,
      uuAppErrorMap,
      authorizationResult,
      allowedStateRules
    );

    // hds 3
    let isInitialOrProblemState;
    let logbookEntries;

    const authorizedUserProfiles = authorizationResult.getAuthorizedProfiles();
    const isReader = authorizedUserProfiles.every((profile) => profile === Profiles.READERS);

    if (dtoIn.filterMap) {
      isInitialOrProblemState =
        dtoIn.filterMap.state === LogBookEntry.State.INITIAL || dtoIn.filterMap.state === LogBookEntry.State.PROBLEM;
    } else {
      dtoIn.filterMap = logbookEntryListDtoInDefault.filterMap;
      isInitialOrProblemState = false;
    }

    if (isReader && isInitialOrProblemState) {
      // 3.A.1.
      ValidationHelper.addWarning(
        uuAppErrorMap,
        Warnings.List.SubmittedForbiddenStateToView.code,
        Warnings.List.SubmittedForbiddenStateToView.message,
        {
          filterMapState: dtoIn.filterMap.state,
        }
      );
      logbookEntries = await this.dao.listByStateAndDateTime(...getListParams(dtoIn, awid, LogBookEntry.State.ACTIVE));
    } else if (isReader && !dtoIn.filterMap) {
      // 3.B
      logbookEntries = await this.dao.listByStateAndDateTime(...getListParams(dtoIn, awid, LogBookEntry.State.ACTIVE));
    } else if (!dtoIn.filterMap) {
      // 3.C
      logbookEntries = await this.dao.listByStateAndDateTime(...getListParams(dtoIn, awid, LogBookEntry.State.ACTIVE));
    } else {
      // hds 3.D
      logbookEntries = await this.dao.listByStateAndDateTime(...getListParams(dtoIn, awid, dtoIn.filterMap.state));
    }

    // hds 4
    const dtoOut = {
      ...logbookEntries,
      uuAppErrorMap,
    };

    return dtoOut;
  }
}

module.exports = new ListLogbookEntryAbl();

// helpers
function getListParams(dtoIn, awid, state) {
  return [
    awid,
    dtoIn.sortBy || logbookEntryListDtoInDefault.sortBy,
    dtoIn.order || logbookEntryListDtoInDefault.order,
    state || LogBookEntry.State.ACTIVE,
    dtoIn.filterMap.dateTimeFrom || logbookEntryListDtoInDefault.filterMap.dateTimeFrom,
    dtoIn.filterMap.dateTimeTo || logbookEntryListDtoInDefault.filterMap.dateTimeTo,
    dtoIn.pageInfo || logbookEntryListDtoInDefault.pageInfo,
  ];
}
