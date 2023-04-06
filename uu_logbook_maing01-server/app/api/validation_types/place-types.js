/* eslint-disable */
const placeCreateDtoInType = shape({
  name: string().isRequired(),
  airportCode:string().isRequired(),
  GPSlocation: array(),
  countryCode: string().isRequired(),
  state: string().isRequired(),
});
