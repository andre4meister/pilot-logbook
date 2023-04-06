function getMillisecondsFromTimeString(timeString) {
  const [hours, minutes, seconds] = timeString.split(":");
  return (hours * 60 * 60 + minutes * 60 + seconds) * 10;
}

function isFirstTimeBiggerThanSecond(greater, smaller) {
  const difference = getMillisecondsFromTimeString(greater) - getMillisecondsFromTimeString(smaller);
  return difference > 0;
}
module.exports = { getMillisecondsFromTimeString, isFirstTimeBiggerThanSecond };
