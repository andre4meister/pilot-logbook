"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, UuAppWorkspace } = require("uu_appg01_server").Workspace;
const Errors = require("../../api/errors/logbook-main-error.js");
const Warnings = require("../../api/warnings/logbook-main-warnings");
const { Schemas, Profiles, PilotLogbook } = require("../constants");

const allowedStates = ["active", "underConstruction"];
const DEFAULT_Values = {
  maxFlightTime: "24:00:00",
  minFlightTime: "02:00:00",
  minEntryCreateTime: "02:00:00",
  description: "UuAppPilotLogbook description",
};

class LogbookMainAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.PILOT_LOGBOOK);
  }

  async init(uri, dtoIn, session) {
    const awid = uri.getAwid();
    // hds 1
    let validationResult = this.validator.validate("sysUuAppWorkspaceInitDtoInType", dtoIn);

    // 1.1, 1.2, 1.3, 1.4
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.Init.UnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );

    // hds 2
    const schemas = Object.values(Schemas);
    let schemaCreateResults = schemas.map(async (schema) => {
      try {
        return await DaoFactory.getDao(schema).createSchema();
      } catch (e) {
        // 2.1
        throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, { schema }, e);
      }
    });
    await Promise.all(schemaCreateResults);

    // hd 3
    let pilotLogbook = await this.dao.get(awid);
    if (!pilotLogbook) {
      // 3.1, 3.1.1
      let uuObject = {
        awid,
        name: dtoIn.name,
        state: dtoIn.state || PilotLogbook.States.UNDER_CONSTRUCTION,
        maxFlightTime: dtoIn.maxFlightTime || DEFAULT_Values.maxFlightTime,
        minFlightTime: dtoIn.minFlightTime || DEFAULT_Values.minFlightTime,
        minEntryCreateTime: dtoIn.minEntryCreateTime || DEFAULT_Values.minEntryCreateTime,
        description: dtoIn.description || DEFAULT_Values.description,
      };

      // 3.2
      try {
        pilotLogbook = await this.dao.create(uuObject);
      } catch (e) {
        throw new Errors.Init.PilotLogbookDaoCreateFailed({ uuAppErrorMap }, { cause: e });
      }
    }

    // hds 4, 4.1
    if (!pilotLogbook) {
      throw new Errors.Init.UuPilotLogbookDoesNotExist({ uuAppErrorMap }, { awid });
    }

    // 4.2
    if (!allowedStates.includes(pilotLogbook.state)) {
      throw new Errors.Init.UuPilotLogbookIsNotInCorrectState({ uuAppErrorMap }, { state: pilotLogbook.state });
    }

    // hds 5
    try {
      await Profile.set(awid, Profiles.AUTHORITY, dtoIn.uuAppProfileAuthorities);
    } catch (e) {
      throw new Errors.Init.SetProfileFailed(
        { uuAppErrorMap },
        { uuAppProfileAuthorities: dtoIn.uuAppProfileAuthorities },
        e
      );
    }

    // hds 6
    return { pilotLogbook, uuAppErrorMap };
  }

  async loadBasicData(uri, session, uuAppErrorMap = {}) {
    // HDS 1
    const dtoOut = await UuAppWorkspace.loadBasicData(uri, session, uuAppErrorMap);

    // TODO Implement according to application needs...
    // const awid = uri.getAwid();
    // const workspace = await UuAppWorkspace.get(awid);
    // if (workspace.sysState !== UuAppWorkspace.SYS_STATES.CREATED &&
    //    workspace.sysState !== UuAppWorkspace.SYS_STATES.ASSIGNED
    // ) {
    //   const appData = await this.dao.get(awid);
    //   dtoOut.data = { ...appData, relatedObjectsMap: {} };
    // }

    // HDS 2
    return dtoOut;
  }
}

module.exports = new LogbookMainAbl();
