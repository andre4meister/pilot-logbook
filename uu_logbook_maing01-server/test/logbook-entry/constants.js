const COMMANDS = {
  Entry: {
    Create: "logbookEntry/create",
    Get: "logbookEntry/get",
    List: "logbookEntry/list",
    Update: "logbookEntry/update",
    Delete: "logbookEntry/delete",
  },
  Aircraft: {
    Create: "aircraft/create",
    Get: "aircraft/get",
    List: "aircraft/list",
  },
  Place: {
    Create: "place/create",
    Get: "place/get",
    List: "place/list",
  },
  Pilot: {
    Create: "pilot/create",
    Get: "pilot/get",
    List: "pilot/list",
  },
};

const appConfiguration = {
  maxFlightTime: "24:00:00",
  minFlightTime: "2:00:00",
  minEntryCreateTime: "02:00:00",
  description: "UuAppPilotLogbook description",
};

const entryDtoIn = {
  dateTimeFrom: "2023-04-30T09:50:21.637Z",
  dateTimeTo: "2023-04-30T16:30:21.637Z",
  departureLocationCode: "KBP",
  arrivalLocationCode: "LWA",
  registrationNumber: "L-KERS",
  description: "test",
};

const aircraftDtoIn = {
  registrationNumber: "L-KERS",
  model: "A0-13FD",
  state: "active",
};

const firstPlaceDtoIn = {
  name: "Boryspil International Airport",
  airportCode: "KBP",
  GPSlocation: ["50° 20' 33.4068'' N"],
  countryCode: "UA",
  state: "active",
};

const secondPlaceDtoIn = {
  name: "Lviv International Airport",
  airportCode: "LWA",
  GPSlocation: ["50° 20' 33.4068'' N"],
  countryCode: "UA",
  state: "active",
};

const pilotDtoIn = {
  name: "Andrii",
  surname: "JonSon",
  gender: "male",
  experienceHours: 2000,
};
const secondPilotDtoIn = {
  name: "Vlad",
  surname: "JonSon",
  gender: "male",
  experienceHours: 2000,
};

module.exports = {
  entryDtoIn,
  aircraftDtoIn,
  firstPlaceDtoIn,
  secondPlaceDtoIn,
  pilotDtoIn,
  secondPilotDtoIn,
  COMMANDS,
  appConfiguration,
};
