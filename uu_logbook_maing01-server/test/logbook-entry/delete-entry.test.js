const { TestHelper } = require("uu_appg01_server-test");
const { COMMANDS, firstPlaceDtoIn, entryDtoIn, aircraftDtoIn, pilotDtoIn, secondPlaceDtoIn } = require("./constants");

let session;
let pilot;

const deleteDtoIn = {
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
  session = await TestHelper.login("Authority");

  await TestHelper.executePostCommand(COMMANDS.Aircraft.Create, aircraftDtoIn, session);
  await TestHelper.executePostCommand(COMMANDS.Place.Create, firstPlaceDtoIn, session);
  await TestHelper.executePostCommand(COMMANDS.Place.Create, secondPlaceDtoIn, session);
  pilot = await TestHelper.executePostCommand(COMMANDS.Pilot.Create, pilotDtoIn, session);
});

describe("entry/delete", () => {
  test("invalid dtoIn", async () => {
    expect.assertions(2);
    try {
      await TestHelper.executePostCommand(COMMANDS.Entry.Delete, { notName: "not" }, session);
    } catch (e) {
      expect(e.code).toEqual("uu-logbook-main/entry/delete/invalidDtoIn");
      expect(e.message).toEqual("DtoIn is not valid.");
    }
  });

  test("UnsupportedKeys", async () => {
    const dtoIn = entryDtoIn;
    dtoIn.pilotIdList = [pilot.id];
    const newEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);

    await TestHelper.executePostCommand(COMMANDS.Entry.Update, { id: newEntry.id, state: "problem" }, session);
    const deleteDtoIn = {
      id: newEntry.id,
      unsupported: "unsupported",
    };
    const deletedEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Delete, deleteDtoIn, session);

    const unsupportedKeysWarning = deletedEntry.uuAppErrorMap["uu-logbook-main/entry/delete/unsupportedKeys"];

    expect(unsupportedKeysWarning).toBeDefined();
    expect(deletedEntry.status).toEqual(200);
    expect(unsupportedKeysWarning.type).toBe("warning");
    expect(unsupportedKeysWarning.message).toBe("DtoIn contains unsupported keys.");
  });

  test("entry does not exist", async () => {
    try {
      await TestHelper.executePostCommand(COMMANDS.Entry.Delete, deleteDtoIn.entryDoesNotExist, session);
    } catch (e) {
      expect(e.code).toEqual("uu-logbook-main/entry/delete/logbookEntryDoesNotExist");
      expect(e.message).toEqual("UuObject logbookEntry does not exist.");
    }
  });

  test("userDoesNotAllowedToViewEntry", async () => {
    const dtoIn = entryDtoIn;
    dtoIn.pilotIdList = [pilot.id];
    const newEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);

    const deleteDtoIn = {
      id: newEntry.id,
    };

    try {
      await TestHelper.executePostCommand(COMMANDS.Entry.Delete, deleteDtoIn, session);
    } catch (e) {
      expect(e.code).toEqual("uu-logbook-main/entry/delete/userDoesNotAllowedToViewEntry");
      expect(e.message).toEqual("User does not allowed to view the entry.");
    }
  });

  test("HDS entry/delete", async () => {
    const dtoIn = entryDtoIn;
    dtoIn.pilotIdList = [pilot.id];
    const newEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);

    await TestHelper.executePostCommand(COMMANDS.Entry.Update, { id: newEntry.id, state: "problem" }, session);

    const deleteDtoIn = {
      id: newEntry.id,
    };
    const deletedEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Delete, deleteDtoIn, session);

    expect(deletedEntry.status).toEqual(200);
    expect(deletedEntry.data.uuAppErrorMap).toStrictEqual({});
  });
});
