function handleValidate(event, lsi) {
  const {
    dateTimeFrom,
    dateTimeTo,
    departureLocationCode,
    arrivalLocationCode,
    registrationNumber,
    pilotIdList,
    pilotInCommand,
    pilotInCommandTime,
    coPilotTime,
    dualPilotTime,
    description,
  } = event.data.value;

  const flightTime = new Date(dateTimeTo) - new Date(dateTimeFrom);
  const pilotInCommandTimeInMs = pilotInCommandTime
    ? pilotInCommandTime.split(":")[0] * 3600000 + pilotInCommandTime.split(":")[1] * 60000
    : 0;
  const coPilotTimeInMs = coPilotTime
    ? coPilotTime.split(":")[0] * 3600000 + pilotInCommandTime.split(":")[1] * 60000
    : 0;
  const dualPilotTimeInMs = dualPilotTime
    ? dualPilotTime.split(":")[0] * 3600000 + pilotInCommandTime.split(":")[1] * 60000
    : 0;
  const descriptionLength = description && description.trim().length;

  if (descriptionLength === 0) {
    return {
      message: lsi.invalidDescription,
    };
  }

  if (flightTime < pilotInCommandTimeInMs) {
    return {
      message: lsi.tooBigPilotInCommandTime,
    };
  }
  if (flightTime < coPilotTimeInMs) {
    return {
      message: lsi.tooBigCoPilotTime,
    };
  }

  if (flightTime < dualPilotTimeInMs) {
    return {
      message: lsi.tooBigDualPilotTime,
    };
  }

  if (dateTimeFrom === dateTimeTo) {
    return {
      message: lsi.theSameDate,
    };
  }

  if (new Date(dateTimeFrom) >= new Date(dateTimeTo)) {
    return {
      message: lsi.dateTimeFromGreaterThanDateTimeTo,
    };
  }
  if (departureLocationCode && departureLocationCode === arrivalLocationCode) {
    return {
      message: lsi.theSameLocation,
    };
  }
  if (pilotInCommand && !pilotIdList.includes(pilotInCommand)) {
    return {
      message: lsi.pilotInCommandError,
    };
  }
}

export { handleValidate };
