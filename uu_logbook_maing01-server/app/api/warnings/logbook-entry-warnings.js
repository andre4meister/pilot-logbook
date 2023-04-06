const Errors = require("../errors/logbook-entry-error");

const Warnings = {
  Create: {
    UnsupportedKeys: {
      code: `${Errors.Create.UC_CODE}unsupportedKeys`,
    },
    // CategoryDoesNotExist: {
    //   code: `${Errors.Create.UC_CODE}categoryDoesNotExist`,
    //   message: "One or more categories with given id do not exist.",
    // },
  },
  List: {
    UnsupportedKeys: {
      code: `${Errors.List.UC_CODE}unsupportedKeys`,
    },
    SubmittedForbiddenStateToView: {
      code: `${Errors.List.UC_CODE}submittedForbiddenStateToView`,
      message: "Submitted state is not allowed to view.",
    },
  },
  Update: {
    UnsupportedKeys: {
      code: `${Errors.Update.UC_CODE}unsupportedKeys`,
    },
    // CategoryDoesNotExist: {
    //   code: `${Errors.Update.UC_CODE}categoryDoesNotExist`,
    //   message: "One or more categories with given id do not exist.",
    // },
  },
  Get: {
    UnsupportedKeys: {
      code: `${Errors.Get.UC_CODE}unsupportedKeys`,
    },
  },

  Delete: {
    UnsupportedKeys: {
      code: `${Errors.Delete.UC_CODE}unsupportedKeys`,
    },
  },
};

module.exports = Warnings;
