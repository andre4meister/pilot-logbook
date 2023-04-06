"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { AuthorizationService } = require("uu_appg01_server").Authorization;
const { UuAppWorkspace, UuSubAppInstance } = require("uu_appg01_server").Workspace;
const { UriBuilder } = require("uu_appg01_server").Uri;

const Errors = require("../../api/errors/logbook-main-error.js");
const { Schemas } = require("../constants");

class LoadLogbookMainAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.PILOT_LOGBOOK);
  }

  async load(uri, session, uuAppErrorMap = {}) {
    let awid = uri.getAwid();
    let dtoOut = {};

    // hds 1
    const asidData = await UuSubAppInstance.get();

    // hds 2
    const awidData = await UuAppWorkspace.get(awid);

    // hds 3
    const cmdUri = UriBuilder.parse(uri).setUseCase("sys/uuAppWorkspace/load").clearParameters();
    const authorizationResult = await AuthorizationService.authorize(session, cmdUri.toUri());
    const profileData = {
      uuIdentityProfileList: authorizationResult.getIdentityProfiles(),
      profileList: authorizationResult.getAuthorizedProfiles(),
    };

    // hds 4
    dtoOut.sysData = { asidData, awidData, profileData };

    // HDS 5
    if (awidData.sysState !== "created") {
      let pilotLogbook;
      try {
        pilotLogbook = await this.dao.get(awid);
      } catch (e) {
        throw new Errors.Load.PilotLogbookDoesNotExist({ uuAppErrorMap }, { awid }, e);
      }
      // HDS 6
      dtoOut.data = { ...pilotLogbook };
    }

    // HDS 7
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new LoadLogbookMainAbl();
