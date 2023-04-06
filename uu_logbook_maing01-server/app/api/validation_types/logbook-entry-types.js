/* eslint-disable */

const logbookEntryCreateDtoInType = shape({
  dateTimeFrom:datetime().isRequired(),
  dateTimeTo:datetime().isRequired(),
  departureLocationCode: string().isRequired(),
  arrivalLocationCode: string().isRequired(),
  registrationNumber: string().isRequired(),
  pilotIdList:array(id(), 1, 3).isRequired(),
  pilotInCommand:id(),
  pilotInCommandTime: time("%H:%M:%S"),
  coPilotTime: time("%H:%M:%S"),
  dualPilotTime: time("%H:%M:%S"),
  description: string(),
});

const logbookEntryListDtoInType = shape({
  order:oneOf(["asc", "desc"]),
  sortBy: oneOf(["dateTimeFrom", "dateTimeTo"]),
  filterMap:shape({
    state:oneOf(["initial", "active", "finished", "problem"]),
    dateTimeFrom: datetime(),
    dateTimeTo:datetime()
  }),
  pageInfo:shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});

const logbookEntryGetDtoInType = shape({
  id:id().isRequired()
})

const logbookEntryUpdateDtoInType = shape({
  id: id().isRequired(),
  state: oneOf(["initial", "active", "finished", "problem"]),
  dateTimeFrom:datetime(),
  dateTimeTo:datetime(),
  departureLocationCode: string(),
  arrivalLocationCode: string(),
  registrationNumber: string(),
  pilotIdList:array(id(), 1, 3),
  pilotInCommand:id(),
  pilotInCommandTime: time("%H:%M:%S"),
  coPilotTime: time("%H:%M:%S"),
  dualPilotTime: time("%H:%M:%S"),
  description: string(),
});

const logbookEntryDeleteDtoInType = shape({
  id: id().isRequired()
});
