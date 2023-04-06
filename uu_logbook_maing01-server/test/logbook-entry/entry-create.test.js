const { TestHelper } = require("uu_appg01_server-test");

const {
  COMMANDS,
  appConfiguration,
  firstPlaceDtoIn,
  entryDtoIn,
  aircraftDtoIn,
  pilotDtoIn,
  secondPilotDtoIn,
  secondPlaceDtoIn,
} = require("./constants");

let session;
let pilot;
let departurePlace;

beforeAll(async () => {
  await TestHelper.setup();
});

afterAll(() => {
  TestHelper.teardown();
});

beforeEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();

  let dtoIn = {
    uuAppProfileAuthorities: "urn:uu:GGPLUS4U",
    state: "active",
  };
  await TestHelper.initUuAppWorkspace(dtoIn);
  session = await TestHelper.login("Authorities");

  await TestHelper.executePostCommand(COMMANDS.Aircraft.Create, aircraftDtoIn, session);
  departurePlace = await TestHelper.executePostCommand(COMMANDS.Place.Create, firstPlaceDtoIn, session);
  await TestHelper.executePostCommand(COMMANDS.Place.Create, secondPlaceDtoIn, session);
  pilot = await TestHelper.executePostCommand(COMMANDS.Pilot.Create, pilotDtoIn, session);
});

describe("entry/create", () => {
  test("invalid dtoIn", async () => {
    expect.assertions(2);
    try {
      await TestHelper.executePostCommand(COMMANDS.Entry.Create, { notName: "not" }, session);
    } catch (e) {
      expect(e.code).toEqual("uu-logbook-main/entry/create/invalidDtoIn");
      expect(e.message).toEqual("DtoIn is not valid.");
    }
  });

  test("UnsupportedKeys", async () => {
    const dtoIn = entryDtoIn;
    dtoIn.pilotIdList = [pilot.id];

    dtoIn.unsupported = "unsupported";

    const newEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);

    const unsupportedKeysWarning = newEntry.uuAppErrorMap["uu-logbook-main/entry/create/unsupportedKeys"];

    expect(unsupportedKeysWarning).toBeDefined();
    expect(unsupportedKeysWarning.type).toBe("warning");
    expect(unsupportedKeysWarning.message).toBe("DtoIn contains unsupported keys.");
  });

  test("sameLocationsCanNotBeProvided", async () => {
    const dtoIn = {...entryDtoIn};
    dtoIn.pilotIdList = [pilot.id];
    dtoIn.departureLocationCode = departurePlace.airportCode;
    dtoIn.arrivalLocationCode = departurePlace.airportCode;

    try {
      await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual("uu-logbook-main/entry/create/sameLocationsCanNotBeProvided");
      expect(e.message).toEqual("Departure and arrival locations could not be similar.");
    }
  });

  test("dateTimeFromGreaterThanDateTimeTo", async () => {
    const dtoIn = {...entryDtoIn};
    dtoIn.pilotIdList = [pilot.id];
    dtoIn.dateTimeFrom = "2024-01-01T04:00:00.000Z";
    dtoIn.dateTimeTo = "2024-01-01T00:00:00.000Z";

    try {
      await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual("uu-logbook-main/entry/create/dateTimeFromGreaterThanDateTimeTo");
      expect(e.message).toEqual("DateTimeFrom could not be greater than dateTimeTo.");
    }
  });

  test("PilotInCommandError", async () => {
    const dtoIn = {...entryDtoIn};
    dtoIn.pilotIdList = [pilot.id];
    dtoIn.pilotInCommandId = "5f9f1b9c6c6c4b0001b5b1f2";

    try {
      await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual("uu-logbook-main/entry/create/pilotInCommandError");
      expect(e.message).toEqual("Pilot In-Command error..");
    }
  });

  test("flightTimeIsTooTiny", async () => {
    const dtoIn = {...entryDtoIn};
    dtoIn.pilotIdList = [pilot.id];
    dtoIn.dateTimeFrom = "2024-01-01T03:00:00.000Z";
    dtoIn.dateTimeTo = "2024-01-01T04:00:00.000Z";

    try {
      await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual("uu-logbook-main/entry/create/flightTimeIsTooTiny");
      expect(e.message).toEqual("Flight time is too tiny.");
    }
  });

  test("flightTimeIsTooLarge", async () => {
    const dtoIn = {...entryDtoIn};
    dtoIn.pilotIdList = [pilot.id];
    dtoIn.dateTimeFrom = "2024-01-01T03:00:00.000Z";
    dtoIn.dateTimeTo = "2024-01-03T04:00:00.000Z";

    try {
      await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual("uu-logbook-main/entry/create/flightTimeIsTooLarge");
      expect(e.message).toEqual("Large flight time duration.");
    }
  });

  test("entryCreateTimeIsNotEnough", async () => {
    const dtoIn = {...entryDtoIn};
    dtoIn.pilotIdList = [pilot.id];

    const threeHoursAgo = new Date(new Date().getTime() - (3 * 60 * 60 * 1000));
    const sixHoursAgo = new Date(new Date().getTime() - (6 * 60 * 60 * 1000));
    dtoIn.dateTimeFrom = sixHoursAgo;
    dtoIn.dateTimeTo = threeHoursAgo;

    try {
      await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual("uu-logbook-main/entry/create/entryCreateTimeIsNotEnough");
      expect(e.message).toEqual("Entry create time is not enough.");
    }
  });

  test("HDS entry/create", async () => {
    const dtoIn = entryDtoIn;
    dtoIn.pilotIdList = [pilot.id];

    let result = await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);
    expect(result.dateTimeFrom).toEqual(entryDtoIn.dateTimeFrom);
    expect(result.dateTimeTo).toEqual(entryDtoIn.dateTimeTo);
    expect(result.departureLocationCode).toEqual(entryDtoIn.departureLocationCode);
    expect(result.arrivalLocationCode).toEqual(entryDtoIn.arrivalLocationCode);
    expect(result.registrationNumber).toEqual(entryDtoIn.registrationNumber);
    expect(result.description).toEqual(entryDtoIn.description);
  });
});
