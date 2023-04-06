const { TestHelper } = require("uu_appg01_server-test");
const { COMMANDS, firstPlaceDtoIn, entryDtoIn, aircraftDtoIn, pilotDtoIn, secondPlaceDtoIn } = require("./constants");

let session;
let pilot;

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
  session = await TestHelper.login("Authorities", true, false);

  await TestHelper.executePostCommand(COMMANDS.Aircraft.Create, aircraftDtoIn, session);
  await TestHelper.executePostCommand(COMMANDS.Place.Create, firstPlaceDtoIn, session);
  await TestHelper.executePostCommand(COMMANDS.Place.Create, secondPlaceDtoIn, session);
  pilot = await TestHelper.executePostCommand(COMMANDS.Pilot.Create, pilotDtoIn, session);
});

describe("entry/list", () => {
  test("invalid dtoIn", async () => {
    expect.assertions(2);
    try {
      await TestHelper.executeGetCommand(COMMANDS.Entry.List, { order: "bad" }, session);
    } catch (e) {
      expect(e.code).toEqual("uu-logbook-main/entry/list/invalidDtoIn");
      expect(e.message).toEqual("DtoIn is not valid.");
    }
  });

  test("UnsupportedKeys", async () => {
    const dtoIn = entryDtoIn;
    dtoIn.pilotIdList = [pilot.id];

    await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);
    await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);
    await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);

    const listDtoIn = {
      filterMap: {
        state: "initial",
      },
      unsupported: "unsupported",
    };
    const listEntry = await TestHelper.executeGetCommand(COMMANDS.Entry.List, listDtoIn, session);

    const unsupportedKeysWarning = listEntry.uuAppErrorMap["uu-logbook-main/entry/list/unsupportedKeys"];

    expect(unsupportedKeysWarning).toBeDefined();
    expect(unsupportedKeysWarning.type).toBe("warning");
    expect(unsupportedKeysWarning.message).toBe("DtoIn contains unsupported keys.");
    expect(listEntry.itemList.length).toEqual(3);
    expect(listEntry.status).toEqual(200);
  });

  test("SubmittedForbiddenStateToView", async () => {
    const dtoIn = entryDtoIn;
    dtoIn.pilotIdList = [pilot.id];

    const newEntry = await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);
    await TestHelper.executePostCommand(COMMANDS.Entry.Update, { id: newEntry.id, state: "problem" }, session);

    session = await TestHelper.login("Readers");

    const listDtoIn = {
      filterMap: {
        state: "problem",
      },
    };

    const list = await TestHelper.executeGetCommand(COMMANDS.Entry.List, listDtoIn, session);
    expect(list.status).toBe(200);
    // expect(list.uuAppErrorMap["uu-logbook-main/entry/list/submittedForbiddenStateToView"]).toBeDefined();
    // expect(list.itemList.length).toBe(0);
  });

  test("Returns items with `active` state if filterMap is absent", async () => {
    const dtoIn = entryDtoIn;
    dtoIn.pilotIdList = [pilot.id];

    await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);

    const list = await TestHelper.executeGetCommand(COMMANDS.Entry.List, {}, session);
    expect(list.status).toBe(200);
    expect(list.itemList.length).toBe(0);
  });

  test("HDS entry/list", async () => {
    const dtoIn = entryDtoIn;
    dtoIn.pilotIdList = [pilot.id];

    await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);
    await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);
    await TestHelper.executePostCommand(COMMANDS.Entry.Create, dtoIn, session);

    const listDtoIn = {
      filterMap: {
        state: "initial",
      },
    };
    const listEntry = await TestHelper.executeGetCommand(COMMANDS.Entry.List, listDtoIn, session);

    expect(listEntry.status).toBe(200);
    expect(listEntry.pageInfo.pageSize).toBe(50);
    expect(listEntry.pageInfo.pageIndex).toBe(0);
  });
});
