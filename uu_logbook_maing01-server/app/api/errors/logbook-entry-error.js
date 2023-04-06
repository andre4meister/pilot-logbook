"use strict";
const LogbookMainUseCaseError = require("./logbook-main-use-case-error.js");

const Create = {
  UC_CODE: `${LogbookMainUseCaseError.ERROR_PREFIX}entry/create/`,

  InvalidDtoIn: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  UuPilotLogbookDoesNotExist: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}uuPilotLogbookDoesNotExist`;
      this.message = "It seems like provided uuBt locationUri is invalid.";
    }
  },
  ListIsNotEmpty: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listIsNotEmpty`;
      this.message = "It seems list is not empty";
    }
  },

  PilotLogbookDaoCreateFailed: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}sys/pilotLogbookDaoCreateFailed`;
      this.message = "The system failed to create pilot logbook.";
    }
  },

  DateTimeFromGreaterThanDateTimeTo: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}dateTimeFromGreaterThanDateTimeTo`;
      this.message = "DateTimeFrom could not be greater than dateTimeTo.";
    }
  },

  SameLocationsCanNotBeProvided: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}sameLocationsCanNotBeProvided`;
      this.message = "Departure and arrival locations could not be similar.";
    }
  },

  PilotLogbookDoesNotExists: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}pilotLogbookDoesNotExists`;
      this.message = "uuObject pilotLogbook does not exist.";
    }
  },

  PilotInCommandError: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}pilotInCommandError`;
      this.message = "Pilot In-Command error.";
    }
  },

  PilotLogbookNotInCorrectState: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}pilotLogbookNotInCorrectState`;
      this.message = "uuObject pilotLogbook is not in correct state.";
    }
  },

  EntryCreateTimeIsNotEnough: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}entryCreateTimeIsNotEnough`;
      this.message = "Entry create time is not enough.";
    }
  },

  FlightTimeIsTooLarge: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}flightTimeIsTooLarge`;
      this.message = "Large flight time duration.";
    }
  },

  FlightTimeIsTooTiny: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}flightTimeIsTooTiny`;
      this.message = "Flight time is too tiny.";
    }
  },

  DepartureLocationDoesNotExist: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}departureLocationDoesNotExist`;
      this.message = "Departure location does not exist.";
    }
  },

  DepartureLocationInaccessible: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}departureLocationInaccessible`;
      this.message = "Departure location is inaccessible.";
    }
  },

  ArrivalLocationDoesNotExist: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}arrivalLocationDoesNotExist`;
      this.message = "Arrival location does not exist.";
    }
  },

  ArrivalLocationIsInaccessible: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}arrivalLocationIsInaccessible`;
      this.message = "Arrival location is inaccessible.";
    }
  },

  AircraftDoesNotExist: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}aircraftDoesNotExist`;
      this.message = "Aircraft does not exist.";
    }
  },

  AircraftIsNotReachable: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}aircraftIsNotReachable`;
      this.message = "Aircraft is not reachable.";
    }
  },

  AircraftListIsNotEmpty: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}aircraftListIsNotEmpty`;
      this.message = "Aircraft list is not empty.";
    }
  },

  PilotError: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}pilotError`;
      this.message = "Some pilots do not exist.";
    }
  },

  PilotListIsNotEmpty: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}pilotListIsNotEmpty`;
      this.message = "Pilot list is not empty.";
    }
  },
};

const List = {
  UC_CODE: `${LogbookMainUseCaseError.ERROR_PREFIX}entry/list/`,

  InvalidDtoIn: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  PilotLogbookDoesNotExists: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}pilotLogbookDoesNotExists`;
      this.message = "uuObject pilotLogbook does not exist.";
    }
  },

  PilotLogbookNotInCorrectState: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}pilotLogbookNotInCorrectState`;
      this.message = "uuObject pilotLogbook is not in correct state.";
    }
  },
};

const Get = {
  UC_CODE: `${LogbookMainUseCaseError.ERROR_PREFIX}entry/get/`,

  InvalidDtoIn: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  PilotLogbookDoesNotExists: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}pilotLogbookDoesNotExists`;
      this.message = "uuObject pilotLogbook does not exist.";
    }
  },

  PilotLogbookNotInCorrectState: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}pilotLogbookNotInCorrectState`;
      this.message = "uuObject pilotLogbook is not in correct state.";
    }
  },

  LogbookEntryDoesNotExist: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}logbookEntryDoesNotExist`;
      this.message = "LogbookEntry does not exist.";
    }
  },

  UserDoesNotAllowedToViewEntry: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}userDoesNotAllowedToViewEntry`;
      this.message = "User does not allowed to view the entry.";
    }
  },
};

const Delete = {
  UC_CODE: `${LogbookMainUseCaseError.ERROR_PREFIX}entry/delete/`,

  InvalidDtoIn: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  UserDoesNotAllowedToViewEntry: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}userDoesNotAllowedToViewEntry`;
      this.message = "User does not allowed to view the entry.";
    }
  },
  PilotLogbookDoesNotExists: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}pilotLogbookDoesNotExists`;
      this.message = "uuObject pilotLogbook does not exist.";
    }
  },

  PilotLogbookNotInCorrectState: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}pilotLogbookNotInCorrectState`;
      this.message = "uuObject pilotLogbook is not in correct state.";
    }
  },

  LogbookEntryDoesNotExist: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}logbookEntryDoesNotExist`;
      this.message = "UuObject logbookEntry does not exist.";
    }
  },
  UnavailableStateForDelete: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}unavailableStateForDelete`;
      this.message = "logbookEntry is not in available state for delete.";
    }
  },
};

const Update = {
  UC_CODE: `${LogbookMainUseCaseError.ERROR_PREFIX}entry/update/`,

  InvalidDtoIn: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  UuPilotLogbookDoesNotExist: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}uuPilotLogbookDoesNotExist`;
      this.message = "It seems like provided uuBt locationUri is invalid.";
    }
  },

  SomePilotsDoNotExist: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}somePilotsDoNotExist`;
      this.message = "Some pilots do not exist.";
    }
  },

  LogbookEntryDaoUpdateFailed: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}logbookEntryDaoUpdateFailed`;
      this.message = "Update logbookEntry by logbookEntry DAO update failed.";
    }
  },

  PilotLogbookDaoCreateFailed: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}sys/pilotLogbookDaoCreateFailed`;
      this.message = "The system failed to create pilot logbook.";
    }
  },

  DateTimeFromGreaterThanDateTimeTo: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}dateTimeFromGreaterThanDateTimeTo`;
      this.message = "DateTimeFrom could not be greater than dateTimeTo.";
    }
  },

  SameLocationsCanNotBeProvided: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}sameLocationsCanNotBeProvided`;
      this.message = "Departure and arrival locations could not be similar.";
    }
  },

  PilotLogbookDoesNotExists: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}pilotLogbookDoesNotExists`;
      this.message = "uuObject pilotLogbook does not exist.";
    }
  },

  PilotInCommandError: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}pilotInCommandError`;
      this.message = "Pilot In-Command error.";
    }
  },

  PilotLogbookNotInCorrectState: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}pilotLogbookNotInCorrectState`;
      this.message = "uuObject pilotLogbook is not in correct state.";
    }
  },

  EntryCreateTimeIsNotEnough: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}entryCreateTimeIsNotEnough`;
      this.message = "Entry create time is not enough.";
    }
  },

  FlightTimeIsTooLarge: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}flightTimeIsTooLarge`;
      this.message = "Large flight time duration.";
    }
  },

  FlightTimeIsTooTiny: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}flightTimeIsTooTiny`;
      this.message = "Flight time is too tiny.";
    }
  },

  DepartureLocationDoesNotExist: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}departureLocationDoesNotExist`;
      this.message = "Departure location does not exist.";
    }
  },

  DepartureLocationInaccessible: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}departureLocationInaccessible`;
      this.message = "Departure location is inaccessible.";
    }
  },

  ArrivalLocationDoesNotExist: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}arrivalLocationDoesNotExist`;
      this.message = "Arrival location does not exist.";
    }
  },

  ArrivalLocationIsInaccessible: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}arrivalLocationIsInaccessible`;
      this.message = "Arrival location is inaccessible.";
    }
  },

  AircraftDoesNotExist: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}aircraftDoesNotExist`;
      this.message = "Aircraft does not exist.";
    }
  },

  AircraftIsNotReachable: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}aircraftIsNotReachable`;
      this.message = "Aircraft is not reachable.";
    }
  },

  AircraftListIsNotEmpty: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}aircraftListIsNotEmpty`;
      this.message = "Aircraft list is not empty.";
    }
  },

  PilotError: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}pilotError`;
      this.message = "Some pilots do not exists.";
    }
  },

  PilotListIsNotEmpty: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}pilotListIsNotEmpty`;
      this.message = "Pilot list is not empty.";
    }
  },
  TooLargeFlightTimeDuration: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}tooLargeFlightTimeDuration`;
      this.message = "Large flight time duration.";
    }
  },

  PilotsIdListIsNotEmpty: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}pilotsIdListIsNotEmpty`;
      this.message = "Pilots id list is not empty.";
    }
  },

  DateTimeToLessThanDateTimeFrom: class extends LogbookMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}dateTimeToLessThanDateTimeFrom`;
      this.message = "DateTimeTo could not be less than dateTimeFrom.";
    }
  },
};
module.exports = {
  Create,
  List,
  Get,
  Delete,
  Update,
};
