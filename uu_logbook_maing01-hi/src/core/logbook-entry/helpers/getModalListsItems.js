function getPlaceItemList(placeDataList) {
  if (!placeDataList.data) {
    return [];
  }
  return placeDataList.data.map(({ data: place }) => {
    return { value: place.airportCode, children: place.airportCode };
  });
}

function getAircraftItemList(aircraftDataList) {
  if (!aircraftDataList.data) {
    return [];
  }
  return aircraftDataList.data.map(({ data: aircraft }) => {
    if (aircraft.state === "active") {
      return { value: aircraft.registrationNumber, children: aircraft.model };
    }
  });
}

function getPilotItemList(pilotDataList) {
  if (!pilotDataList.data) {
    return [];
  }
  return pilotDataList.data.map(({ data: pilot }) => {
    return { value: pilot.id, children: `${pilot.name} ${pilot.surname}` };
  });
}

export { getPlaceItemList, getAircraftItemList, getPilotItemList };
