const { TestHelper } = require("uu_appg01_server-test");
const { COMMANDS, firstPlaceDtoIn, entryDtoIn, aircraftDtoIn, pilotDtoIn, secondPlaceDtoIn } = require("./constants");

let session;
let pilot;

const getDtoIn = {
  entryDoesNotExist: {
    id: "64287682ecb1322e1cd7736b",
  },
};
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
  await TestHelper.executePostCommand(COMMANDS.Place.Create, firstPlaceDtoIn, session);
  await TestHelper.executePostCommand(COMMANDS.Place.Create, secondPlaceDtoIn, session);
  pilot = await TestHelper.executePostCommand(COMMANDS.Pilot.Create, pilotDtoIn, session);
});

describe("entry/get", () => {
  test("invalid dtoIn", async () => {
    expect.assertions(2);
    try {
      await TestHelper.executeGetCommand(COMMANDS.Entry.Get, { notName: "not" }, session);
    } catch (e) {
      expect(e.code).toEqual("uu-logbook-main/entry/get/invalidDtoIn");
      expect(e.message).toEqual("DtoIn is not valid.");
    }
  });

  test("UnsupportedKeys", async () => {
    const dtoIn = entryDtoIn;
    dtoIn.pilotIdList = [pilot.id];
    const newEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);

    const getDtoIn = {
      id: newEntry.id,
      unsupported: "unsupported",
    };
    const getEntry = await TestHelper.executeGetCommand(COMMANDS.Entry.Get, getDtoIn, session);

    const unsupportedKeysWarning = getEntry.uuAppErrorMap["uu-logbook-main/entry/get/unsupportedKeys"];

    expect(unsupportedKeysWarning).toBeDefined();
    expect(unsupportedKeysWarning.type).toBe("warning");
    expect(unsupportedKeysWarning.message).toBe("DtoIn contains unsupported keys.");
  });

  test("entry does not exist", async () => {
    let getEntry;
    try {
      getEntry = await TestHelper.executeGetCommand(COMMANDS.Entry.Get, getDtoIn.entryDoesNotExist, session);
    } catch (e) {
      expect(e.code).toEqual("uu-logbook-main/entry/get/logbookEntryDoesNotExist");
      expect(e.message).toEqual("LogbookEntry does not exist.");
    }
  });

  test("userDoesNotAllowedToViewEntry", async () => {
    session = await TestHelper.login("Readers");

    const dtoIn = entryDtoIn;
    dtoIn.pilotIdList = [pilot.id];
    const newEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);

    const getDtoIn = {
      id: newEntry.id,
    };

    try {
      await TestHelper.executeGetCommand(COMMANDS.Entry.Get, getDtoIn, session);
    } catch (e) {
      expect(e.code).toEqual("uu-logbook-main/entry/get/userDoesNotAllowedToViewEntry");
      expect(e.message).toEqual("User does not allowed to view the entry.");
    }
  });

  test("HDS entry/get", async () => {
    const dtoIn = entryDtoIn;
    dtoIn.pilotIdList = [pilot.id];
    const newEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);

    const getDtoIn = {
      id: newEntry.id,
    };
    const getEntry = await TestHelper.executeGetCommand(COMMANDS.Entry.Get, getDtoIn, session);

    expect(getEntry.departureLocationCode).toEqual(dtoIn.departureLocationCode);
    expect(getEntry.arrivalLocationCode).toEqual(dtoIn.arrivalLocationCode);
    expect(getEntry.description).toEqual(dtoIn.description);
    expect(getEntry.dateTimeFrom).toEqual(dtoIn.dateTimeFrom);
    expect(getEntry.dateTimeTo).toEqual(dtoIn.dateTimeTo);
    expect(getEntry.registrationNumber).toEqual(dtoIn.registrationNumber);
  });
});
