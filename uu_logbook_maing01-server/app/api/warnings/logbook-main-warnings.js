const Errors = require("../errors/logbook-main-error");

const Warnings = {
  EnsureInstance: {
    UnsupportedKeys: {
      code: `${Errors.Init.UC_CODE}unsupportedKeys`,
    },
  },
  EnsureInstanceAndState: {
    UnsupportedKeys: {
      code: `${Errors.Init.UC_CODE}unsupportedKeys`,
    },
  },
  Init: {
    UnsupportedKeys: {
      code: `${Errors.Init.UC_CODE}unsupportedKeys`,
    },
  },
};

module.exports = Warnings;
