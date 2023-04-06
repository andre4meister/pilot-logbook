/* eslint-disable */

const sysUuAppWorkspaceInitDtoInType = shape({
  uuAppProfileAuthorities: uri().isRequired(),
  state: oneOf(["active", "underConstruction"]),
  name: uu5String(4000),
  maxFlightTime:time("%H:%M:%S"),
  minFlightTime:time("%H:%M:%S"),
  minEntryCreateTime:time("%H:%M:%S"),
  description:string()
});
