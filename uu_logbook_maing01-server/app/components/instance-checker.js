const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { Validator } = require("uu_appg01_server").Validation;

const Errors = require("../api/errors/logbook-main-error");
const { Schemas } = require("../abl/constants");

class InstanceChecker {
  constructor() {
    this.dao = DaoFactory.getDao(Schemas.PILOT_LOGBOOK);
    this.validator = Validator.load();
  }

  async ensureInstance(awid, errors, uuAppErrorMap) {
    // HDS 1
    let pilotLogbook = await this.dao.get(awid);

    // HDS 1.1
    if (!pilotLogbook) {
      throw new Errors.Init.UuPilotLogbookDoesNotExist({ uuAppErrorMap }, { awid });
    }

    // HDS 2
    return pilotLogbook;
  }

  async ensureInstanceAndState(awid, errors, uuAppErrorMap, authorizationResult, allowedStateRules) {
    // HDS 1
    let pilotLogbook = await this.ensureInstance(awid, errors, uuAppErrorMap);

    // HDS 1.1
    if (!pilotLogbook) {
      throw new Errors.Init.UuPilotLogbookDoesNotExist({ uuAppErrorMap }, { awid });
    }

    // HDS 2
    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    const allowedStates = allowedStateRules[authorizedProfiles[0]];
    // HDS 2.1, 2.2, 2.3
    if (!allowedStates.includes(pilotLogbook.state)) {
      throw new Errors.Init.UuPilotLogbookIsNotInCorrectState(
        { uuAppErrorMap },
        {
          awid,
          state: pilotLogbook.state,
          expectedState: Array.from(allowedStates),
        }
      );
    }

    // HDS 3
    return pilotLogbook;
  }
}

module.exports = new InstanceChecker();
