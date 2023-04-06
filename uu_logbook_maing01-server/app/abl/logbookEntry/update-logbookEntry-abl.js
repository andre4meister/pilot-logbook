const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;

const { Profiles, Schemas } = require("../constants");
const Warnings = require("../../api/warnings/logbook-entry-warnings");
const Errors = require("../../api/errors/logbook-entry-error");
const InstanceChecker = require("../../components/instance-checker");
const LogbookEntryHelper = require("../../components/logbook-entry");
const { getMillisecondsFromTimeString } = require("../../components/time-helpers");

class UpdateLogbookEntryAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.LOGBOOK_ENTRY);
    this.placeDao = DaoFactory.getDao(Schemas.PLACE);
    this.aircraftDao = DaoFactory.getDao(Schemas.AIRCRAFT);
  }

  async update(awid, dtoIn, session, authorizationResult) {
    // hds 1, 1.1
    let validationResult = this.validator.validate("logbookEntryUpdateDtoInType", dtoIn);

    // 1.2, 1.2.1, 1.3, 1.3.1
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.Update.UnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // hds 2, 2.1
    const dateTimeToAndFromPresent = dtoIn.dateTimeTo && dtoIn.dateTimeFrom;

    if (dateTimeToAndFromPresent && new Date(dtoIn.dateTimeTo) < new Date(dtoIn.dateTimeFrom)) {
      throw new Errors.Update.DateTimeFromGreaterThanDateTimeTo(
        { uuAppErrorMap },
        {
          dateTimeFrom: dtoIn.dateTimeFrom,
          dateTimeTo: dtoIn.dateTimeTo,
        }
      );
    }

    // hds 3, 3.1
    const bothLocationsPresent = dtoIn.departureLocationCode && dtoIn.arrivalLocationCode;

    if (bothLocationsPresent && dtoIn.departureLocationCode === dtoIn.arrivalLocationCode) {
      throw new Errors.Update.SameLocationsCanNotBeProvided(
        { uuAppErrorMap },
        {
          departureLocationCode: dtoIn.departureLocationCode,
          arrivalLocationCode: dtoIn.arrivalLocationCode,
        }
      );
    }

    // hds 4, 4.1
    const pilotInCommandInPilotIdList =
      dtoIn.pilotIdList && dtoIn.pilotInCommand && dtoIn.pilotIdList.includes(dtoIn.pilotInCommand);

    if (dtoIn.pilotIdList && dtoIn.pilotInCommand && !pilotInCommandInPilotIdList) {
      throw new Errors.Update.PilotInCommandError(
        { uuAppErrorMap },
        {
          errorIdPilotInCommand: dtoIn.pilotInCommand,
        }
      );
    }

    // hds 5, 6, 6.1, 6.2
    let pilotLogbookObj;

    const allowedStateRules = {
      [Profiles.AUTHORITY]: ["active", "underConstruction", "closed"],
      [Profiles.AUTHORITIES]: ["active", "underConstruction", "closed"],
      [Profiles.EXECUTIVES]: ["active", "underConstruction"],
    };

    pilotLogbookObj = await InstanceChecker.ensureInstanceAndState(
      awid,
      Errors.Update,
      uuAppErrorMap,
      authorizationResult,
      allowedStateRules
    );

    // hds 7, 8, 8.1
    let logbookEntry = await this.dao.get(awid, dtoIn.id);
    if (!logbookEntry) {
      throw new Errors.Update.PilotLogbookDoesNotExists(
        { uuAppErrorMap },
        {
          logbookEntryId: dtoIn.id,
        }
      );
    }

    // hds 9
    if (dtoIn.dateTimeFrom && !dtoIn.dateTimeTo) {
      // 9.1
      if (dtoIn.dateTimeFrom > logbookEntry.dateTimeTo) {
        throw new Errors.Update.DateTimeFromGreaterThanDateTimeTo(
          { uuAppErrorMap },
          {
            dateTimeFrom: dtoIn.dateTimeFrom,
            dateTimeTo: logbookEntry.dateTimeTo,
          }
        );
      }

      // 9.2
      let difference = new Date(logbookEntry.dateTimeTo) - new Date(dtoIn.dateTimeFrom);
      if (difference > getMillisecondsFromTimeString(pilotLogbookObj.maxFlightTime)) {
        throw new Errors.Update.TooLargeFlightTimeDuration(
          { uuAppErrorMap },
          {
            maxFlightTime: pilotLogbookObj.maxFlightTime,
            dateTimeFrom: dtoIn.dateTimeFrom,
            dateTimeTo: logbookEntry.dateTimeTo,
            dateTimeDifference: new Date(logbookEntry.dateTimeTo) - new Date(dtoIn.dateTimeFrom),
          }
        );
      }

      // 9.3
      if (difference < getMillisecondsFromTimeString(pilotLogbookObj.minFlightTime)) {
        throw new Errors.Update.FlightTimeIsTooTiny(
          { uuAppErrorMap },
          {
            minFlightTime: pilotLogbookObj.minFlightTime,
            dateTimeFrom: dtoIn.dateTimeFrom,
            dateTimeTo: logbookEntry.dateTimeTo,
            dateTimeDifference: new Date(logbookEntry.dateTimeTo) - new Date(dtoIn.dateTimeFrom),
          }
        );
      }
    }

    // 9.4
    if (!dtoIn.registrationNumber) {
      // 9.4.1, 9.4.2
      let aircraftEntriesByNewDateFrom = [];
      aircraftEntriesByNewDateFrom = await this.dao.listByAircraftIdListAndDateTime(
        awid,
        logbookEntry.registrationNumber,
        dtoIn.dateTimeFrom,
        logbookEntry.dateTimeTo
      );

      // 9.4.2.1.
      if (aircraftEntriesByNewDateFrom.length > 0) {
        throw new Errors.Update.AircraftListIsNotEmpty(
          { uuAppErrorMap },
          {
            aircraftEntriesByNewDateFrom: aircraftEntriesByNewDateFrom,
            dateTimeFrom: dtoIn.dateTimeFrom,
            dateTimeTo: logbookEntry.dateTimeTo,
          }
        );
      }
    }

    // 9.5, 9.5.1, 9.5.2
    if (!dtoIn.pilotIdList) {
      let pilotEntriesByNewDateFrom = [];
      pilotEntriesByNewDateFrom = await this.dao.listByPilotIdListAndDateTime(
        awid,
        logbookEntry.pilotIdList,
        dtoIn.dateTimeFrom,
        logbookEntry.dateTimeTo
      );

      // 9.5.2.1.
      if (pilotEntriesByNewDateFrom.length > 0) {
        throw new Errors.Update.PilotsIdListIsNotEmpty(
          { uuAppErrorMap },
          {
            pilotEntriesByNewDateFrom: pilotEntriesByNewDateFrom,
            dateTimeFrom: dtoIn.dateTimeFrom,
            dateTimeTo: logbookEntry.dateTimeTo,
          }
        );
      }
    }

    // hds 10
    if (dtoIn.dateTimeTo && !dtoIn.dateTimeFrom) {
      // 10.1
      if (dtoIn.dateTimeTo < logbookEntry.dateTimeFrom) {
        throw new Errors.Update.DateTimeToLessThanDateTimeFrom(
          { uuAppErrorMap },
          {
            dateTimeFrom: dtoIn.dateTimeTo,
            dateTimeTo: logbookEntry.dateTimeFrom,
          }
        );
      }

      // 10.2
      let difference = new Date(dtoIn.dateTimeTo) - new Date(logbookEntry.dateTimeFrom);
      if (difference > getMillisecondsFromTimeString(pilotLogbookObj.maxFlightTime)) {
        throw new Errors.Update.TooLargeFlightTimeDuration(
          { uuAppErrorMap },
          {
            maxFlightTime: pilotLogbookObj.maxFlightTime,
            dateTimeFrom: dtoIn.dateTimeTo,
            dateTimeTo: logbookEntry.dateTimeFrom,
            dateTimeDifference: new Date(dtoIn.dateTimeTo) - new Date(logbookEntry.dateTimeFrom),
          }
        );
      }

      // 10.3
      if (difference < getMillisecondsFromTimeString(pilotLogbookObj.minFlightTime)) {
        throw new Errors.Update.FlightTimeIsTooTiny(
          { uuAppErrorMap },
          {
            minFlightTime: pilotLogbookObj.minFlightTime,
            dateTimeFrom: dtoIn.dateTimeTo,
            dateTimeTo: logbookEntry.dateTimeFrom,
            dateTimeDifference: new Date(dtoIn.dateTimeTo) - new Date(logbookEntry.dateTimeFrom),
          }
        );
      }
    }

    // 10.4
    if (!dtoIn.registrationNumber) {
      // 10.4.1, 10.4.2
      let aircraftEntriesByNewDateTo = [];
      aircraftEntriesByNewDateTo = await this.dao.listByAircraftIdListAndDateTime(
        awid,
        logbookEntry.registrationNumber,
        logbookEntry.dateTimeFrom,
        dtoIn.dateTimeTo
      );

      // 10.4.2.1.
      if (aircraftEntriesByNewDateTo.length > 0) {
        throw new Errors.Update.AircraftListIsNotEmpty(
          { uuAppErrorMap },
          {
            aircraftEntriesByNewDateTo: aircraftEntriesByNewDateTo,
            dateTimeFrom: logbookEntry.dateTimeFrom,
            dateTimeTo: dtoIn.dateTimeTo,
          }
        );
      }
    }

    // 10.5, 10.5.1, 10.5.2
    if (!dtoIn.pilotIdList) {
      let pilotEntriesByNewDateTo = [];
      pilotEntriesByNewDateTo = await this.dao.listByPilotIdListAndDateTime(
        awid,
        logbookEntry.pilotIdList,
        logbookEntry.dateTimeFrom,
        dtoIn.dateTimeTo
      );

      // 10.5.2.1.
      if (pilotEntriesByNewDateTo.length > 0) {
        throw new Errors.Update.PilotsIdListIsNotEmpty(
          { uuAppErrorMap },
          {
            pilotEntriesByNewDateTo: pilotEntriesByNewDateTo,
            dateTimeFrom: logbookEntry.dateTimeFrom,
            dateTimeTo: dtoIn.dateTimeTo,
          }
        );
      }
    }

    // hds 11
    if (dtoIn.dateTimeTo && dtoIn.dateTimeFrom) {
      // 11.1
      let difference = new Date(dtoIn.dateTimeTo) - new Date(dtoIn.dateTimeFrom);
      if (difference > getMillisecondsFromTimeString(pilotLogbookObj.maxFlightTime)) {
        throw new Errors.Update.TooLargeFlightTimeDuration(
          { uuAppErrorMap },
          {
            maxFlightTime: pilotLogbookObj.maxFlightTime,
            dateTimeFrom: dtoIn.dateTimeTo,
            dateTimeTo: dtoIn.dateTimeFrom,
            dateTimeDifference: new Date(dtoIn.dateTimeTo) - new Date(dtoIn.dateTimeFrom),
          }
        );
      }

      // 11.2
      if (difference < getMillisecondsFromTimeString(pilotLogbookObj.minFlightTime)) {
        throw new Errors.Update.FlightTimeIsTooTiny(
          { uuAppErrorMap },
          {
            minFlightTime: pilotLogbookObj.minFlightTime,
            dateTimeFrom: dtoIn.dateTimeTo,
            dateTimeTo: dtoIn.dateTimeFrom,
            dateTimeDifference: new Date(dtoIn.dateTimeTo) - new Date(dtoIn.dateTimeFrom),
          }
        );
      }

      // 11.3
      if (!dtoIn.registrationNumber) {
        // 11.3.1, 11.3.2
        let aircraftEntriesByNewDates = [];
        aircraftEntriesByNewDates = await this.dao.listByAircraftIdListAndDateTime(
          awid,
          logbookEntry.registrationNumber,
          dtoIn.dateTimeFrom,
          dtoIn.dateTimeTo
        );

        // 11.3.2.1.
        if (aircraftEntriesByNewDates.length > 0) {
          throw new Errors.Update.AircraftListIsNotEmpty(
            { uuAppErrorMap },
            {
              aircraftEntriesByNewDateTo: aircraftEntriesByNewDates,
              dateTimeFrom: dtoIn.dateTimeFrom,
              dateTimeTo: dtoIn.dateTimeTo,
            }
          );
        }
      }

      // 11.4, 11.4.1, 11.4.2
      if (!dtoIn.pilotIdList) {
        let pilotEntriesByNewDates = [];
        pilotEntriesByNewDates = await this.dao.listByPilotIdListAndDateTime(
          awid,
          logbookEntry.pilotIdList,
          dtoIn.dateTimeFrom,
          dtoIn.dateTimeTo
        );

        // 11.4.2.1.
        if (pilotEntriesByNewDates.length > 0) {
          throw new Errors.Update.PilotsIdListIsNotEmpty(
            { uuAppErrorMap },
            {
              pilotEntriesByNewDateTo: pilotEntriesByNewDates,
              dateTimeFrom: dtoIn.dateTimeFrom,
              dateTimeTo: dtoIn.dateTimeTo,
            }
          );
        }
      }
    }

    // hds 12
    if (dtoIn.departureLocationCode && !dtoIn.arrivalLocationCode) {
      // 12.1
      if (dtoIn.departureLocationCode === logbookEntry.arrivalLocationCode) {
        throw new Errors.Update.SameLocationsCanNotBeProvided(
          { uuAppErrorMap },
          {
            departureLocationCode: dtoIn.departureLocationCode,
            arrivalLocationCode: logbookEntry.arrivalLocationCode,
          }
        );
      }

      // 12.2
      let placeObject;

      // 12.3
      placeObject = await this.placeDao.getByAirportCode(awid, dtoIn.departureLocationCode);
      // 12.3.1
      if (!placeObject) {
        throw new Errors.Update.DepartureLocationDoesNotExist(
          { uuAppErrorMap },
          {
            departureLocationCode: dtoIn.departureLocationCode,
          }
        );
      }

      // 12.3.2
      if (placeObject.state === "problem") {
        throw new Errors.Update.DepartureLocationInaccessible(
          { uuAppErrorMap },
          {
            departureLocationCode: dtoIn.departureLocationCode,
            departureLocationState: placeObject.state,
            expectedState: "active",
          }
        );
      }
    }

    // hds 13
    if (dtoIn.arrivalLocationCode && !dtoIn.departureLocationCode) {
      // 13.1
      if (dtoIn.arrivalLocationCode === logbookEntry.departureLocationCode) {
        throw new Errors.Update.SameLocationsCanNotBeProvided(
          { uuAppErrorMap },
          {
            arrivalLocationCode: dtoIn.arrivalLocationCode,
            departureLocationCode: logbookEntry.departureLocationCode,
          }
        );
      }

      // 13.2
      let placeObject;

      // 13.3
      placeObject = await this.placeDao.getByAirportCode(awid, dtoIn.arrivalLocationCode);
      // 13.3.1
      if (!placeObject) {
        throw new Errors.Update.ArrivalLocationDoesNotExist(
          { uuAppErrorMap },
          {
            arrivalLocationDoesNotExist: dtoIn.arrivalLocationCode,
          }
        );
      }

      // 13.3.2
      if (placeObject.state === "problem") {
        throw new Errors.Update.ArrivalLocationIsInaccessible(
          { uuAppErrorMap },
          {
            arrivalLocationCode: dtoIn.arrivalLocationCode,
            arrivalLocationState: placeObject.state,
            expectedState: "active",
          }
        );
      }
    }

    // hds 14
    if (dtoIn.arrivalLocationCode && dtoIn.departureLocationCode) {
      // 14.1
      let departureStateCheck;
      let arrivalStateCheck;

      // 14.2
      departureStateCheck = await this.placeDao.getByAirportCode(awid, dtoIn.departureLocationCode);
      // 14.2.1
      if (!departureStateCheck) {
        throw new Errors.Update.DepartureLocationDoesNotExist(
          { uuAppErrorMap },
          {
            departureLocationDoesNotExist: dtoIn.departureLocationCode,
          }
        );
      }

      // 14.2.2
      if (departureStateCheck.state === "problem") {
        throw new Errors.Update.DepartureLocationInaccessible(
          { uuAppErrorMap },
          {
            departureLocationCode: dtoIn.departureLocationCode,
            departureLocationState: departureStateCheck.state,
            expectedState: "active",
          }
        );
      }

      // 14.3
      arrivalStateCheck = await this.placeDao.getByAirportCode(awid, dtoIn.arrivalLocationCode);
      // 14.3.1
      if (!arrivalStateCheck) {
        throw new Errors.Update.ArrivalLocationDoesNotExist(
          { uuAppErrorMap },
          {
            arrivalLocationDoesNotExist: dtoIn.arrivalLocationCode,
          }
        );
      }

      // 14.3.2
      if (arrivalStateCheck.state === "problem") {
        throw new Errors.Update.ArrivalLocationIsInaccessible(
          { uuAppErrorMap },
          {
            arrivalLocationCode: dtoIn.arrivalLocationCode,
            arrivalLocationState: arrivalStateCheck.state,
            expectedState: "active",
          }
        );
      }
    }

    // hds 15
    if (dtoIn.registrationNumber) {
      // 15.1
      let aircraftObject;

      // 15.2
      aircraftObject = await this.aircraftDao.getByRegistrationNumber(awid, dtoIn.registrationNumber);
      // 15.2.1
      if (!aircraftObject) {
        throw new Errors.Update.AircraftDoesNotExist(
          { uuAppErrorMap },
          {
            registrationNumber: dtoIn.registrationNumber,
          }
        );
      }

      // 15.2.2
      if (aircraftObject.state === "underConstruction") {
        throw new Errors.Update.AircraftIsNotReachable(
          { uuAppErrorMap },
          {
            registrationNumber: dtoIn.registrationNumber,
            aircraftState: aircraftObject.state,
            expectedState: "active",
          }
        );
      }

      // 15.3
      let aircraftDateTimeEntries = [];
      // 15.4
      switch ((dtoIn.dateTimeFrom, dtoIn.dateTimeTo)) {
        case dtoIn.dateTimeFrom && !dtoIn.dateTimeTo:
          //15.4.A.
          aircraftDateTimeEntries = await this.dao.listByAircraftIdListAndDateTime(
            awid,
            dtoIn.registrationNumber,
            dtoIn.dateTimeFrom,
            logbookEntry.dateTimeTo
          );
          // 15.4.A.1.
          if (aircraftDateTimeEntries.length > 0) {
            throw new Errors.Update.AircraftListIsNotEmpty(
              { uuAppErrorMap },
              {
                aircraftDateTimeEntries: aircraftDateTimeEntries,
                dateTimeFrom: dtoIn.dateTimeFrom,
                dateTimeTo: logbookEntry.dateTimeTo,
              }
            );
          }
          break;
        case dtoIn.dateTimeTo && !dtoIn.dateTimeFrom:
          // 15.4.B.
          aircraftDateTimeEntries = await this.dao.listByAircraftIdListAndDateTime(
            awid,
            dtoIn.registrationNumber,
            dtoIn.dateTimeTo,
            logbookEntry.dateTimeFrom
          );
          // 15.4.B.1.
          if (aircraftDateTimeEntries.length > 0) {
            throw new Errors.Update.AircraftListIsNotEmpty(
              { uuAppErrorMap },
              {
                aircraftDateTimeEntries: aircraftDateTimeEntries,
                dateTimeFrom: logbookEntry.dateTimeFrom,
                dateTimeTo: dtoIn.dateTimeTo,
              }
            );
          }
          break;
        case dtoIn.dateTimeTo && dtoIn.dateTimeFrom:
          // 15.4.C.
          aircraftDateTimeEntries = await this.dao.listByAircraftIdListAndDateTime(
            awid,
            dtoIn.registrationNumber,
            dtoIn.dateTimeTo,
            dtoIn.dateTimeFrom
          );
          // 15.4.C.1.
          if (aircraftDateTimeEntries.length > 0) {
            throw new Errors.Update.AircraftListIsNotEmpty(
              { uuAppErrorMap },
              {
                aircraftDateTimeEntries: aircraftDateTimeEntries,
                dateTimeFrom: dtoIn.dateTimeFrom,
                dateTimeTo: dtoIn.dateTimeTo,
              }
            );
          }
          break;
        default:
          // 15.4.D.
          aircraftDateTimeEntries = await this.dao.listByAircraftIdListAndDateTime(
            awid,
            dtoIn.registrationNumber,
            logbookEntry.dateTimeFrom,
            logbookEntry.dateTimeTo
          );
          // 15.4.D.1.
          if (aircraftDateTimeEntries.length > 0) {
            throw new Errors.Update.AircraftListIsNotEmpty(
              { uuAppErrorMap },
              {
                aircraftDateTimeEntries: aircraftDateTimeEntries,
                dateTimeFrom: logbookEntry.dateTimeFrom,
                dateTimeTo: logbookEntry.dateTimeTo,
              }
            );
          }
          break;
      }
    }

    // hds 16
    if (dtoIn.pilotIdList) {
      // 16.1, 16.2, 16.3, 16.4
      const { existingPilots, nonExistingPilots } = await LogbookEntryHelper.checkPilotExistence(
        awid,
        dtoIn.pilotIdList
      );
      if (nonExistingPilots.length > 0) {
        throw new Errors.Update.SomePilotsDoNotExist(
          { uuAppErrorMap },
          {
            pilotIdList: dtoIn.pilotIdList,
            nonExistingPilotIdList: nonExistingPilots,
          }
        );
      }

      // 16.5
      let pilotsByDateTimeEntries = [];

      // 16.6
      switch ((dtoIn.dateTimeFrom, dtoIn.dateTimeTo)) {
        case dtoIn.dateTimeFrom && !dtoIn.dateTimeTo:
          //16.6.A.
          pilotsByDateTimeEntries = await this.dao.listByPilotIdListAndDateTime(
            awid,
            dtoIn.pilotIdList,
            dtoIn.dateTimeFrom,
            logbookEntry.dateTimeTo
          );
          // 16.6.A.1.
          if (pilotsByDateTimeEntries.length > 0) {
            throw new Errors.Update.PilotsIdListIsNotEmpty(
              { uuAppErrorMap },
              {
                pilotsByDate: pilotsByDateTimeEntries,
                dateTimeFrom: dtoIn.dateTimeFrom,
                dateTimeTo: logbookEntry.dateTimeTo,
              }
            );
          }
          break;
        case dtoIn.dateTimeTo && !dtoIn.dateTimeFrom:
          // 16.6.B.
          pilotsByDateTimeEntries = await this.dao.listByPilotIdListAndDateTime(
            awid,
            dtoIn.pilotIdList,
            dtoIn.dateTimeTo,
            logbookEntry.dateTimeFrom
          );
          // 16.6.B.1.
          if (pilotsByDateTimeEntries.length > 0) {
            throw new Errors.Update.PilotsIdListIsNotEmpty(
              { uuAppErrorMap },
              {
                pilotsByDateTimeEntries: pilotsByDateTimeEntries,
                dateTimeFrom: logbookEntry.dateTimeFrom,
                dateTimeTo: dtoIn.dateTimeTo,
              }
            );
          }
          break;
        case dtoIn.dateTimeTo && dtoIn.dateTimeFrom:
          // 16.6.C.
          pilotsByDateTimeEntries = await this.dao.listByPilotIdListAndDateTime(
            awid,
            dtoIn.pilotIdList,
            dtoIn.dateTimeTo,
            dtoIn.dateTimeFrom
          );
          // 16.6.C.1.
          if (pilotsByDateTimeEntries.length > 0) {
            throw new Errors.Update.PilotsIdListIsNotEmpty(
              { uuAppErrorMap },
              {
                pilotsByDateTimeEntries: pilotsByDateTimeEntries,
                dateTimeFrom: dtoIn.dateTimeFrom,
                dateTimeTo: dtoIn.dateTimeTo,
              }
            );
          }
          break;
        default:
          // 16.6.D.
          pilotsByDateTimeEntries = await this.dao.listByPilotIdListAndDateTime(
            awid,
            dtoIn.pilotIdList,
            logbookEntry.dateTimeFrom,
            logbookEntry.dateTimeTo
          );
          // 16.6.D.1.
          if (pilotsByDateTimeEntries.length > 0) {
            throw new Errors.Update.PilotsIdListIsNotEmpty(
              { uuAppErrorMap },
              {
                pilotsByDateTimeEntries: pilotsByDateTimeEntries,
                dateTimeFrom: logbookEntry.dateTimeFrom,
                dateTimeTo: logbookEntry.dateTimeTo,
              }
            );
          }
          break;
      }
    }

    // 16.7
    if (!dtoIn.pilotInCommand) {
      const pilotIdList = dtoIn.pilotIdList || logbookEntry.pilotIdList;
      const isCommandPilotPresentInList = pilotIdList.includes(logbookEntry.pilotInCommand);

      // 16.7.1.
      if (!isCommandPilotPresentInList) {
        throw new Errors.Update.PilotInCommandError(
          { uuAppErrorMap },
          {
            errorIdPilotInCommand: logbookEntry.pilotInCommand,
            pilotIdList: dtoIn.pilotIdList,
          }
        );
      }
    }

    // hds 17
    dtoIn.awid = awid;
    if (dtoIn.dateTimeFrom) {
      dtoIn.dateTimeFrom = new Date(dtoIn.dateTimeFrom).toISOString();
    }

    if (dtoIn.dateTimeTo) {
      dtoIn.dateTimeTo = new Date(dtoIn.dateTimeTo).toISOString();
    }

    let newLogbookEntry;
    try {
      newLogbookEntry = await this.dao.update(dtoIn);
    } catch (e) {
      // 17.1
      throw new Errors.Update.LogbookEntryDaoUpdateFailed(
        { uuAppErrorMap },
        {
          cause: e,
        }
      );
    }

    // hds 18
    const dtoOut = {
      ...newLogbookEntry,
      uuAppErrorMap,
    };

    return dtoOut;
  }
}

module.exports = new UpdateLogbookEntryAbl();
