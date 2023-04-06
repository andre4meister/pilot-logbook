"use strict";
const CreateAbl = require("../../abl/aircraft/create-aircraft-abl");
const ListAbl = require("../../abl/aircraft/list-aircraft-abl");
class AircraftController {
  create(ucEnv) {
    return CreateAbl.create(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.getSession(), ucEnv.getAuthorizationResult());
  }
  list(ucEnv) {
    return ListAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession(), ucEnv.getAuthorizationResult());
  }
  //
  // get(ucEnv) {
  //   return GetAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession(), ucEnv.getAuthorizationResult());
  // }
  //
  // delete(ucEnv) {
  //   return DeleteAbl.delete(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.session, ucEnv.getAuthorizationResult());
  // }
  //
  // update(ucEnv) {
  //   return UpdateAbl.update(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.session, ucEnv.getAuthorizationResult());
  // }
}

module.exports = new AircraftController();

