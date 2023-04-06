/* eslint-disable */
const pilotCreateDtoInType = shape({
  name: string().isRequired(),
  surname: string().isRequired(),
  gender:string().isRequired(),
  experienceHours: number().isRequired()
});
