const { TestHelper } = require("uu_appg01_server-test");
const {
  COMMANDS,
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

describe("entry/update", () => {
  test("invalid dtoIn", async () => {
    expect.assertions(2);
    try {
      await TestHelper.executePostCommand(COMMANDS.Entry.Update, { notName: "not" }, session);
    } catch (e) {
      expect(e.code).toEqual("uu-logbook-main/entry/update/invalidDtoIn");
      expect(e.message).toEqual("DtoIn is not valid.");
    }
  });

  test("UnsupportedKeys", async () => {
    const dtoIn = entryDtoIn;
    dtoIn.pilotIdList = [pilot.id];
    const newEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);

    const updateDtoIn = {
      id: newEntry.id,
      unsupported: "unsupported",
      description: "updated",
      departureLocationCode: "LWA",
      arrivalLocationCode: "KBP",
    };
    const updatedEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Update, updateDtoIn, session);

    const unsupportedKeysWarning = updatedEntry.uuAppErrorMap["uu-logbook-main/entry/update/unsupportedKeys"];

    expect(unsupportedKeysWarning).toBeDefined();
    expect(unsupportedKeysWarning.type).toBe("warning");
    expect(unsupportedKeysWarning.message).toBe("DtoIn contains unsupported keys.");
    expect(updatedEntry.departureLocationCode).toEqual(updateDtoIn.departureLocationCode);
    expect(updatedEntry.arrivalLocationCode).toEqual(updateDtoIn.arrivalLocationCode);
    expect(updatedEntry.description).toEqual(updateDtoIn.description);
  });

  test("sameLocationsCanNotBeProvided", async () => {
    const dtoIn = { ...entryDtoIn };
    dtoIn.pilotIdList = [pilot.id];
    const createdEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);

    const updateDtoIn = {
      departureLocationCode: departurePlace.airportCode,
      arrivalLocationCode: departurePlace.airportCode,
      id: createdEntry.id,
    };

    try {
      await TestHelper.executePostCommand(COMMANDS.Entry.Update, updateDtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual("uu-logbook-main/entry/update/sameLocationsCanNotBeProvided");
      expect(e.message).toEqual("Departure and arrival locations could not be similar.");
    }
  });

  test("dateTimeFromGreaterThanDateTimeTo", async () => {
    const dtoIn = { ...entryDtoIn };
    dtoIn.pilotIdList = [pilot.id];
    const createdEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);

    const updateDtoIn = {
      dateTimeFrom: "2024-01-01T04:00:00.000Z",
      dateTimeTo: "2024-01-01T00:00:00.000Z",
      id: createdEntry.id,
    };

    try {
      await TestHelper.executePostCommand(COMMANDS.Entry.Update, updateDtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual("uu-logbook-main/entry/update/dateTimeFromGreaterThanDateTimeTo");
      expect(e.message).toEqual("DateTimeFrom could not be greater than dateTimeTo.");
    }
  });

  test("PilotInCommandError", async () => {
    const dtoIn = { ...entryDtoIn };
    dtoIn.pilotIdList = [pilot.id];
    const createdEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);

    const updateDtoIn = {
      pilotInCommand: "5f9f1b9c6c6c4b0001b5b1f2",
      pilotIdList: [pilot.id],
      id: createdEntry.id,
    };

    try {
      await TestHelper.executePostCommand(COMMANDS.Entry.Update, updateDtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual("uu-logbook-main/entry/update/pilotInCommandError");
      expect(e.message).toEqual("Pilot In-Command error.");
    }
  });

  test("PilotInCommandError", async () => {
    const dtoIn = { ...entryDtoIn };
    dtoIn.pilotIdList = [pilot.id];
    const createdEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);

    const updateDtoIn = {
      pilotInCommand: "5f9f1b9c6c6c4b0001b5b1f2",
      id: createdEntry.id,
    };

    try {
      await TestHelper.executePostCommand(COMMANDS.Entry.Update, updateDtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual("uu-logbook-main/entry/update/pilotInCommandError");
      expect(e.message).toEqual("Pilot In-Command error..");
    }
  });

  test("flightTimeIsTooTiny", async () => {
    const dtoIn = { ...entryDtoIn };
    dtoIn.pilotIdList = [pilot.id];
    const createdEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);

    const updateDtoIn = {
      dateTimeFrom: "2024-01-01T03:00:00.000Z",
      dateTimeTo: "2024-01-01T04:00:00.000Z",
      id: createdEntry.id,
    };

    try {
      await TestHelper.executePostCommand(COMMANDS.Entry.Update, updateDtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual("uu-logbook-main/entry/update/flightTimeIsTooTiny");
      expect(e.message).toEqual("Flight time is too tiny.");
    }
  });

  test("flightTimeIsTooLarge", async () => {
    const dtoIn = { ...entryDtoIn };
    dtoIn.pilotIdList = [pilot.id];
    const createdEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);

    const updateDtoIn = {
      dateTimeFrom: "2024-01-01T03:00:00.000Z",
      dateTimeTo: "2024-01-03T04:00:00.000Z",
      id: createdEntry.id,
    };

    try {
      await TestHelper.executePostCommand(COMMANDS.Entry.Update, updateDtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual("uu-logbook-main/entry/update/tooLargeFlightTimeDuration");
      expect(e.message).toEqual("Large flight time duration.");
    }
  });

  test("entryCreateTimeIsNotEnough", async () => {
    const dtoIn = { ...entryDtoIn };
    dtoIn.pilotIdList = [pilot.id];

    const createdEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);

    const threeHoursAgo = new Date(new Date().getTime() - 3 * 60 * 60 * 1000);
    const sixHoursAgo = new Date(new Date().getTime() - 6 * 60 * 60 * 1000);
    const updateDtoIn = {
      dateTimeFrom: sixHoursAgo,
      dateTimeTo: threeHoursAgo,
      id: createdEntry.id,
    };

    try {
      await TestHelper.executePostCommand(COMMANDS.Entry.Update, updateDtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual("uu-logbook-main/entry/update/entryCreateTimeIsNotEnough");
      expect(e.message).toEqual("Entry create time is not enough.");
    }
  });

  test("HDS entry/update", async () => {
    const dtoIn = entryDtoIn;
    dtoIn.pilotIdList = [pilot.id];
    const newEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);

    const updateDtoIn = {
      id: newEntry.id,
      description: "updated",
      departureLocationCode: "LWA",
      arrivalLocationCode: "KBP",
    };
    const updatedEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Update, updateDtoIn, session);

    expect(updatedEntry.departureLocationCode).toEqual(updateDtoIn.departureLocationCode);
    expect(updatedEntry.arrivalLocationCode).toEqual(updateDtoIn.arrivalLocationCode);
    expect(updatedEntry.description).toEqual(updateDtoIn.description);
  });
});
