"use strict";
const LogbookMainUseCaseError = require("./logbook-main-use-case-error.js");

const Init = {
  UC_CODE: `${LogbookMainUseCaseError.ERROR_PREFIX}init/`,

  InvalidDtoIn: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  UuPilotLogbookDoesNotExist: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}uuPilotLogbookDoesNotExist`;
      this.message = "It seems like provided uuBt locationUri is invalid.";
    }
  },

  SchemaDaoCreateSchemaFailed: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Init.UC_CODE}schemaDaoCreateSchemaFailed`;
      this.message = "Create schema by Dao createSchema failed.";
    }
  },

  PilotLogbookDaoCreateFailed: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}sys/pilotLogbookDaoCreateFailed`;
      this.message = "The system failed to create pilot logbook.";
    }
  },

  UuPilotLogbookIsNotInCorrectState: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}uuPilotLogbookIsNotInCorrectState`;
      this.message = "uuPilotLogbook is not in correct state";
    }
  },

  SetProfileFailed: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}setProfileFailed`;
      this.message = "Set uuAppProfile failed.";
    }
  },
};
const Load = {
  UC_CODE: `${LogbookMainUseCaseError.ERROR_PREFIX}load/`,

  PilotLogbookDoesNotExist: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}pilotLogbookDoesNotExist`;
      this.message = "Uuobject pilotLogbook does not exist.";
    }
  },
};
module.exports = {
  Init,
  Load
};
