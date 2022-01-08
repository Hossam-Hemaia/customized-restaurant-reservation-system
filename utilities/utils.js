exports.toIsoDate = (date, str) => {
  if (str === "start") {
    let newDate = new Date(date);
    return newDate.toISOString();
  } else {
    let newDate = new Date(date);
    newDate.setHours(newDate.getHours() + 20);
    return newDate.toISOString();
  }
};

exports.fullDay = (date) => {
  let newDate = new Date(date);
  newDate.setHours(newDate.getHours() + 20);
  return newDate.toISOString();
};

exports.numberOfDays = (date1, date2) => {
  startDate = new Date(date1);
  endDate = new Date(date2);
  let timeDifference = endDate.getTime() - startDate.getTime();
  let daysNumber = timeDifference / (1000 * 3600 * 24);
  return daysNumber;
};

exports.shortDate = (date) => {
  const str = new Date(date).toString();
  const newDatArr = str.split(" ");
  const newDateStr =
    newDatArr[0] + " " + newDatArr[1] + " " + newDatArr[2] + " " + newDatArr[3];
  return newDateStr;
};

exports.fridayCounter = (startDate, endDate) => {
  const singleDay = 1000 * 60 * 60 * 24;
  let start = new Date(startDate);
  let end = new Date(endDate);
  let parsedStart = Date.parse(start);
  let parsedEnd = Date.parse(end);
  let friCount = 0;
  for (let d = parsedStart; d <= parsedEnd; d += singleDay) {
    let today = new Date(d).toString();
    if (today.split(" ")[0] === "Fri") {
      ++friCount;
    }
  }
  return friCount;
};
