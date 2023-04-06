/* eslint-disable */
const aircraftCreateDtoInType = shape({
  registrationNumber: string().isRequired(),
  model: string().isRequired(),
  state: string().isRequired(),
});

const aircraftListDtoInType = shape({
  pageInfo:shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});
