const Constants = {
  Schemas: {
    PILOT_LOGBOOK: "pilotLogbook",
    LOGBOOK_ENTRY: "logbookEntry",
    AIRCRAFT: "aircraft",
    PLACE: "place",
    PILOT: "pilot",
  },

  PilotLogbook: {
    States: {
      INIT: "init",
      ACTIVE: "active",
      UNDER_CONSTRUCTION: "underConstruction",
      CLOSED: "closed",
    },
  },
  LogBookEntry: {
    State: {
      INITIAL: "initial",
      ACTIVE: "active",
      FINISHED: "finished",
      PROBLEM: "problem",
    },
  },

  Profiles: {
    AUTHORITY: "Authority",
    AUTHORITIES: "Authorities",
    EXECUTIVES: "Executives",
    READERS: "Readers",
  },
};

module.exports = Constants;
