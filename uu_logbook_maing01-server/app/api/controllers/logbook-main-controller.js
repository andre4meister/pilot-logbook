"use strict";
const InitLogbookMainAbl = require("../../abl/loogbook-main/logbook-main-abl.js");
const LoadLogbookMainAbl = require("../../abl/loogbook-main/load-logbook-main-abl");
const GetLogbookMainAbl = require("../../abl/loogbook-main/get-logbook-main-abl");

class LogbookMainController {
  init(ucEnv) {
    return InitLogbookMainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  get(ucEnv) {
    return GetLogbookMainAbl.get(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  load(ucEnv) {
    return LoadLogbookMainAbl.load(ucEnv.getUri(), ucEnv.getSession());
  }

  loadBasicData(ucEnv) {
    return InitLogbookMainAbl.loadBasicData(ucEnv.getUri(), ucEnv.getSession());
  }
}

module.exports = new LogbookMainController();
