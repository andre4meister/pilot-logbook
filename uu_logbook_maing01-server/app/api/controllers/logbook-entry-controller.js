"use strict";
const CreateAbl = require("../../abl/logbookEntry/create-logbookEntry-abl");
const ListAbl = require("../../abl/logbookEntry/list-logbookEntry-abl");
const GetAbl = require("../../abl/logbookEntry/get-logbookEntry-abl");
const DeleteAbl = require("../../abl/logbookEntry/delete-logbookEntry-abl");
const UpdateAbl = require("../../abl/logbookEntry/update-logbookEntry-abl");

class LogbookEntryController {
  create(ucEnv) {
    return CreateAbl.create(
      ucEnv.getUri().getAwid(),
      ucEnv.parameters,
      ucEnv.getSession(),
      ucEnv.getAuthorizationResult()
    );
  }

  list(ucEnv) {
    return ListAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession(), ucEnv.getAuthorizationResult());
  }

  get(ucEnv) {
    return GetAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession(), ucEnv.getAuthorizationResult());
  }

  delete(ucEnv) {
    return DeleteAbl.delete(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.session, ucEnv.getAuthorizationResult());
  }

  update(ucEnv) {
    return UpdateAbl.update(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.session, ucEnv.getAuthorizationResult());
  }
}

module.exports = new LogbookEntryController();
