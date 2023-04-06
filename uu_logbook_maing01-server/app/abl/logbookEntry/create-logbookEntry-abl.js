const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;

const Warnings = require("../../api/warnings/logbook-entry-warnings");
const Errors = require("../../api/errors/logbook-entry-error");
const { Profiles, Schemas } = require("../constants");
const InstanceChecker = require("../../components/instance-checker");
const LogbookEntryHelper = require("../../components/logbook-entry");
const { getMillisecondsFromTimeString } = require("../../components/time-helpers");

class CreateLogbookEntryAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.LOGBOOK_ENTRY);
    this.placeDao = DaoFactory.getDao(Schemas.PLACE);
    this.aircraftDao = DaoFactory.getDao(Schemas.AIRCRAFT);
  }

  async create(awid, dtoIn, session, authorizationResult) {
    // hds 1, 1.1
    let validationResult = this.validator.validate("logbookEntryCreateDtoInType", dtoIn);

    // 1.2, 1.3
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.Create.UnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    // hds 2, 2.1
    if (new Date(dtoIn.dateTimeTo) < new Date(dtoIn.dateTimeFrom)) {
      throw new Errors.Create.DateTimeFromGreaterThanDateTimeTo(
        { uuAppErrorMap },
        {
          dateTimeFrom: dtoIn.dateTimeFrom,
          dateTimeTo: dtoIn.dateTimeTo,
        }
      );
    }

    // hds 2.2
    if (dtoIn.departureLocationCode === dtoIn.arrivalLocationCode) {
      throw new Errors.Create.SameLocationsCanNotBeProvided(
        { uuAppErrorMap },
        {
          departureLocationCode: dtoIn.departureLocationCode,
          arrivalLocationCode: dtoIn.arrivalLocationCode,
        }
      );
    }

    // hds 3
    if (dtoIn.pilotInCommand && !dtoIn.pilotIdList.includes(dtoIn.pilotInCommand)) {
      throw new Errors.Create.PilotInCommandError(
        { uuAppErrorMap },
        {
          errorIdPilotInCommand: dtoIn.pilotInCommand,
        }
      );
    }

    // hds 4, 5
    let pilotLogbook;

    const allowedStateRules = {
      [Profiles.AUTHORITY]: ["active", "underConstruction", "closed"],
      [Profiles.AUTHORITIES]: ["active", "underConstruction", "closed"],
      [Profiles.EXECUTIVES]: ["active", "underConstruction"],
    };

    pilotLogbook = await InstanceChecker.ensureInstanceAndState(
      awid,
      Errors.Create,
      uuAppErrorMap,
      authorizationResult,
      allowedStateRules
    );

    //hds 6
    // 6.1
    let currentTime = new Date();
    let difference = new Date(dtoIn.dateTimeFrom) - currentTime;

    if (difference < getMillisecondsFromTimeString(pilotLogbook.minEntryCreateTime)) {
      throw new Errors.Create.EntryCreateTimeIsNotEnough(
        { uuAppErrorMap },
        {
          minEntryCreateTime: pilotLogbook.minEntryCreateTime,
          currentTime,
          dateTimeFrom: dtoIn.dateTimeFrom,
        }
      );
    }

    // 6.2
    difference = new Date(dtoIn.dateTimeTo) - new Date(dtoIn.dateTimeFrom);
    if (difference > getMillisecondsFromTimeString(pilotLogbook.maxFlightTime)) {
      throw new Errors.Create.FlightTimeIsTooLarge(
        { uuAppErrorMap },
        {
          maxFlightTime: pilotLogbook.maxFlightTime,
          dateTimeFrom: dtoIn.dateTimeFrom,
          dateTimeTo: dtoIn.dateTimeTo,
          dateTimeDifference: difference,
        }
      );
    }

    // 6.3
    difference = new Date(dtoIn.dateTimeTo) - new Date(dtoIn.dateTimeFrom);
    if (difference < getMillisecondsFromTimeString(pilotLogbook.minFlightTime)) {
      throw new Errors.Create.FlightTimeIsTooTiny(
        { uuAppErrorMap },
        {
          maxFlightTime: pilotLogbook.maxFlightTime,
          dateTimeFrom: dtoIn.dateTimeFrom,
          dateTimeTo: dtoIn.dateTimeTo,
          dateTimeDifference: difference.toString(),
        }
      );
    }

    // hds 7, 7.1
    let departureStateCheck;
    let arrivalStateCheck;

    // 7.2, 7.2.1,
    departureStateCheck = await this.placeDao.getByAirportCode(awid, dtoIn.departureLocationCode);
    if (!departureStateCheck) {
      throw new Errors.Create.DepartureLocationDoesNotExist(
        { uuAppErrorMap },
        {
          departureLocationCode: dtoIn.departureLocationCode,
        }
      );
    }

    // 7.2.2
    if (departureStateCheck.state === "problem") {
      throw new Errors.Create.DepartureLocationInaccessible(
        { uuAppErrorMap },
        {
          departureLocationCode: dtoIn.departureLocationCode,
          departureLocationState: departureStateCheck.state,
          expectedState: "active",
        }
      );
    }

    // 7.3, 7.3.1,
    arrivalStateCheck = await this.placeDao.getByAirportCode(awid, dtoIn.arrivalLocationCode);
    if (!departureStateCheck) {
      throw new Errors.Create.ArrivalLocationDoesNotExist(
        { uuAppErrorMap },
        {
          arrivalLocationCode: dtoIn.arrivalLocationCode,
        }
      );
    }

    // 7.3.2
    if (arrivalStateCheck.state === "problem") {
      throw new Errors.Create.ArrivalLocationIsInaccessible(
        { uuAppErrorMap },
        {
          arrivalLocationCode: dtoIn.arrivalLocationCode,
          arrivalLocationState: arrivalStateCheck.state,
          expectedState: "active",
        }
      );
    }

    // hds 8, 8.1, 8.2, 8.2.1
    let aircraftObject;
    aircraftObject = await this.aircraftDao.getByRegistrationNumber(awid, dtoIn.registrationNumber);
    if (!aircraftObject) {
      throw new Errors.Create.AircraftDoesNotExist(
        { uuAppErrorMap },
        {
          registrationNumber: dtoIn.registrationNumber,
        }
      );
    }

    // 8.2.2
    if (aircraftObject.state === "underConstruction") {
      throw new Errors.Create.AircraftIsNotReachable(
        { uuAppErrorMap },
        {
          registrationNumber: dtoIn.registrationNumber,
          aircraftState: aircraftObject.state,
          expectedState: "active",
        }
      );
    }

    // hds 8.3, 8.4
    let aircraftDateTimeEntries = [];
    aircraftDateTimeEntries = await this.dao.listByAircraftIdListAndDateTime(
      awid,
      dtoIn.registrationNumber,
      dtoIn.dateTimeFrom,
      dtoIn.dateTimeTo
      //pageInfo
    );

    // 8.4.1
    if (aircraftDateTimeEntries.length > 0) {
      throw new Errors.Create.ListIsNotEmpty(
        { uuAppErrorMap },
        {
          aircraftDateTimeEntries: aircraftDateTimeEntries,
          dateTimeFrom: dtoIn.dateTimeFrom,
          dateTimeTo: dtoIn.dateTimeTo,
        }
      );
    }

    //hds 9, 9.1, 9.2, 9.3, 9.4
    const { existingPilots, nonExistingPilots } = await LogbookEntryHelper.checkPilotExistence(awid, dtoIn.pilotIdList);
    if (nonExistingPilots.length > 0) {
      throw new Errors.Create.PilotError(
        { uuAppErrorMap },
        {
          pilotIdList: dtoIn.pilotIdList,
          nonExistingPilotIdList: nonExistingPilots,
        }
      );
    }

    // 9.5, 9.6,
    let pilotsByDateTimeEntries = [];
    pilotsByDateTimeEntries = await this.dao.listByPilotIdListAndDateTime(
      awid,
      dtoIn.pilotIdList,
      dtoIn.dateTimeFrom,
      dtoIn.dateTimeTo
      // pageInfo
    );

    // 9.6.1
    if (pilotsByDateTimeEntries.length > 0) {
      throw new Errors.Create.ListIsNotEmpty(
        { uuAppErrorMap },
        {
          pilotsDateTimeEntries: pilotsByDateTimeEntries,
          dateTimeFrom: dtoIn.dateTimeFrom,
          dateTimeTo: dtoIn.dateTimeTo,
        }
      );
    }

    //hds 10
    const uuObject = {
      awid,
      dateTimeFrom: new Date(dtoIn.dateTimeFrom).toISOString(),
      dateTimeTo: new Date(dtoIn.dateTimeTo).toISOString(),
      departureLocationCode: dtoIn.departureLocationCode,
      arrivalLocationCode: dtoIn.arrivalLocationCode,
      registrationNumber: dtoIn.registrationNumber,
      pilotIdList: dtoIn.pilotIdList,
      state: "initial",
      pilotInCommand: dtoIn.pilotInCommand || dtoIn.pilotIdList[0],
      pilotInCommandTime: dtoIn.pilotInCommandTime || null,
      coPilotTime: dtoIn.coPilotTime || null,
      dualPilotTime: dtoIn.dualPilotTime || null,
      description: dtoIn.description,
    };

    const newLogbookEntry = await this.dao.create(uuObject);

    //hds 11
    return {
      ...newLogbookEntry,
      uuAppErrorMap,
    };
  }
}

module.exports = new CreateLogbookEntryAbl();
